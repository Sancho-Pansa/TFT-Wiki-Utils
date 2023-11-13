"use strict";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import fs from "node:fs";
import levenshtein from "js-levenshtein";
import { fetchTftData, fetchLoLData } from "../TFTDataFetcher.js";
import { TftChampion, ChampionStats } from "./TftChampion.js";
import "../JsonToLua.js";
import jsonToLua from "../JsonToLua.js";

let patchVersion;

/**
 * Вычленяет из общего объекта данных из Community Dragon только тот, что соответствует запрошенному сезону.
 * @param {*} fullJson Полный JSON из CommunityDragon
 * @param {String} setMutator Кодовое обозначение сезона
 * @returns {Array} Массив чемпионов
 * Кодовое обозначение сезонов (```X``` - номер сезона):
 * - Релизный сезон: TFTSet```X```
 * - Обновление середины сезона: TFTSet```X```_Stage2
 * - Ва-Банк: TFTTURBOSet```X``` / TFTTURBOSet```X```_Stage2
 * - Двойной удар: TFTSet```X```_PAIRS / TFTSet```X```_Stage2_PAIRS
 */
function extrudeCDragonData(fullJson, setMutator) {
  /** @type {Array} */
  let setData = fullJson.setData;
  let currentSet = setData.find((e) => e.mutator === setMutator);
  if(currentSet) {
    return currentSet.champions;
  }
  return [];
}

/**
 *
 * @param {Object[]} jsonArray Массив объектов из JSON
 */
function processTftChampions(jsonArray) {
  let championArray = jsonArray.map(async (value) => {
    let engname = value.characterName.replace(/TFT\d*_/g, "");
    let abilityName = value.ability.name;
    let abilityIcon = await getAbilityIcon(value.name, value.ability.icon);
    let abilityDesc = generateAbilityDescription(value.ability.desc, value.ability.variables, value.name);
    let championStats = new ChampionStats(
      value.stats.hp,
      value.stats.mana,
      value.stats.initialMana,
      value.stats.damage,
      roundVariable(value.stats.attackSpeed),
      value.stats.range,
      value.stats.armor,
      value.stats.magicResist
    );
    return new TftChampion(
      value.name,
      engname, // "TFT9_Champion" -> "Champion"
      value.cost,
      value.traits,
      abilityName,
      abilityIcon,
      abilityDesc,
      championStats,
      value.traits.length === 0, // Если нет особенностей - это не чемпион
      false
    )
  });
  return Promise.all(championArray);

  /**
   * Генерирует имя иконки умения чемпиона по информации из данных TFT.
   *
   * Вызывает информацию из `/plugins/rcp-be-lol-game-data/global/ru_ru/v1/champions_summary.json`, а через него -
   * подробную информацию о нём в LoL, в том числе имя умения (в английской локализации).
   * @async
   * @param {String} championName Имя чемпиона
   * @param {String} iconPath
   */
  async function getAbilityIcon(championName, iconPath) {
    let abilityIcon = "Q.png";

    if(!iconPath) {
      return abilityIcon;
    }

    let keyMatches = [...iconPath.matchAll(/_([QWERP])\d?[_\.]/gm)];
    let abilityKey = keyMatches[0]?.[1];
    if(!abilityKey) {
      return abilityIcon;
    }

    let championSummary = await fetchLoLData(patchVersion, "/plugins/rcp-be-lol-game-data/global/ru_ru/v1/champion-summary.json");
    let championId = championSummary.find((c) => c.name === championName)?.id;
    if(championId) {
      let championJson = await fetchLoLData(patchVersion, `/plugins/rcp-be-lol-game-data/global/en_gb/v1/champions/${championId}.json`);
      if(championJson) {
        let { name, passive, spells } = championJson;
        switch(abilityKey) {
          case "P":
            abilityIcon = `${name} ${passive.name}.png`;
            break;
          case "Q":
            abilityIcon = `${name} ${spells[0].name}.png`;
            break;
          case "W":
            abilityIcon = `${name} ${spells[1].name}.png`;
            break;
          case "E":
            abilityIcon = `${name} ${spells[2].name}.png`;
            break;
          case "R":
            abilityIcon = `${name} ${spells[3].name}.png`;
            break;
          default:
            abilityIcon = `Q.png`;
        }
      }
    }
    return abilityIcon;

  }

  /**
   * Принимает на вход описание умений с метасимволами из JSON Community Dragon и
   * создает на его основе текст в разметке MediaWiki.
   * @param {String} rawDescription Описание умения из JSON
   * @param {Array} variables Массив динамических параметров умений
   * @returns {String} Текст в разметке MediaWiki
   */
  function generateAbilityDescription(rawDescription, variables, name) {
    if(!rawDescription) {
      return "";
    }
    const regexBreaks = new RegExp("<br>", "gm");
    const regexRules = new RegExp(/(?:<rules>.*<\/rules>|<tftitemrules>.*<\/tftitemrules>)/gm);
    const regexTags = new RegExp("(<.*?>)", "gm");
    const regexMetaScalings = new RegExp(/@(\S*?)@ \((?:%i:\w*%)+\)/gm);
    const regexGenerics = new RegExp("@(.*?)@", "gm");
    const regexScales = new RegExp("%i:(.*?)%", "gm");
    const regexDecimals = new RegExp(/\d+\.\d+/g);
    const regexKeywords = getKeywordRegex();


    let abilityText = rawDescription
      .replace(regexBreaks, "\n")
      .replace(/\&nbsp;/g, " ")
      .replace(regexRules, "")
      .replace(regexTags, "")
      .replace(regexMetaScalings, replaceMetaScalings)
      .replace(regexGenerics, replaceGenerics)
      .replace(name, `'''${name}'''`)
      .replace(/\n+/g, "\n")
      .replace(/\n$/g, "");

    regexKeywords.forEach((regexPair) => {
      abilityText = abilityText.replace(regexPair[0], `{{tip|${regexPair[1]}|$&}}`);
    });
    return abilityText;

    /**
     * Читает содержимое файла keywords и возвращает его содержимое в виде регулярного выражения
     * @returns {Array[]}
     */
    function getKeywordRegex() {
      let keywords;
      try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        keywords = fs.readFileSync(`${__dirname}/keywords`, "utf8").split("\r\n");
      } catch(e) {
        console.error(e);
      }
      if(Array.isArray(keywords)) {
        return keywords.map((keyword) => {
          let pair = keyword.split(",");
          return [new RegExp(pair[1], "im"), pair[0]];
        })
      } else {
        return [];
      }
    }

    function replaceMetaScalings(fullText, matchedText) {
      let stat;
      fullText.replace(regexScales, (text, match) => {
        switch(match) {
          case "scaleAP":
            stat = "силы умений";
            break;
          case "scaleAD":
            stat = "силы атаки";
            break;
          case "scaleHealth":
            stat = "здоровья";
            break;
          case "scaleAS":
            stat = "скорости атаки";
            break;
          case "scaleArmor":
            stat = "брони";
            break;
          case "scaleMR":
            stat = "сопротивления магии";
            break;
          case "scaleMana":
            stat = "объёма маны";
            break;
        }
      });
      let resultText = replaceGenerics(fullText, matchedText);
      return `${resultText}${stat ? "% " + stat : ""}`;
    }

    function replaceGenerics(fullText, matchedText) {
      let resultText = matchedText;
      let isPercent = matchedText.search(/\*100/) > -1;
      let generic = matchedText
        .replace("*100", "") // Убрать возможное указание процента
        .replace(/^Modified/m, ""); // Убрать возможное упоминание "Modified"

      let levenshteinArray = variables.map((e) => {
        return levenshtein(generic, e.name)
      });
      let index = levenshteinArray.indexOf(Math.min(...levenshteinArray));
      if(index > -1) {
        let guessedVariable = variables[index];
        if(variables[index].value) {
          let star1 = roundVariable(guessedVariable.value[1], isPercent);
          let star2 = roundVariable(guessedVariable.value[2], isPercent);
          let star3 = roundVariable(guessedVariable.value[3], isPercent);

          if(star1 === star2 && star2 === star3) {
            resultText = star1;
          } else {
            resultText = `{{ap|${star1}|${star2}|${star3}}}`;
          }
        } else {
          resultText = "";
        }
      }
      return resultText;
    }
  }
}

function roundVariable(abilityVar, isPercent) {
  let roundedValue = Math.round(abilityVar * 100);
  return isPercent ? roundedValue : (roundedValue / 100);
}

/**
 *
 * @param {TftChampion[]} championArray
 */
function convertToLua(championArray) {
  championArray.sort((a, b) => a.name > b.name ? 1 : -1);
  let preparedObject = {};
  let counter = 0;
  for(let champion of championArray) {
    let { name: name, ...rest } = champion
    if(preparedObject[champion.name]) {
      preparedObject[`${champion.name}:${counter++}`] = rest;
    } else {
      preparedObject[champion.name] = rest;
    }
  }
  let replacer = {
    abilityName: "abilityname",
    abilityIcon: "abilityicon",
    abilityDescription: "active",
    unitType: "nonchampion",
    health: "hp",
    startMana: "startmana",
    armor: "arm"
  };
  let exclude = ["engname"];
  return jsonToLua(preparedObject, replacer, exclude, true);
}

async function writeLua(filepath, lua) {
  try {
    await fs.promises.writeFile(filepath, lua);
  } catch(err) {
    console.error(err);
  }
}

function main() {
  let args = process.argv;
  let setMutator = args[2] ?? "TFTSet10";
  patchVersion = args[3] ?? "latest";
  fetchTftData(patchVersion)
    .then(json => extrudeCDragonData(json, setMutator))
    .then(processTftChampions)
    .then(convertToLua)
    .then((luaText) => {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      writeLua(`${__dirname}/../out/${setMutator}.lua`, luaText);
    })
    .catch(console.error);
}

main();