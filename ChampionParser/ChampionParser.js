"use strict";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import fs from "node:fs";
import levenshtein from "js-levenshtein";
import { fetchTftData } from "../TFTDataFetcher.js";
import { TftChampion, ChampionStats } from "./TftChampion.js";
import "../JsonToLua.js";
import jsonToLua from "../JsonToLua.js";

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
  let championArray = jsonArray.map((value) => {
    let engname = value.characterName.replace(/TFT\d*_/g, "");
    let abilityName = value.ability.name;
    //let abilityIcon
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
      "Q.png",
      abilityDesc,
      championStats,
      value.traits.length === 0, // Если нет особенностей - это не чемпион
      false
    )})
    .sort((a, b) => a.name > b.name ? 1 : -1);

  return championArray;

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
      .replace(regexRules, "")
      .replace(regexTags, "")
      .replace(regexMetaScalings, replaceMetaScalings)
      .replace(regexGenerics, replaceGenerics)
      .replace(regexDecimals, "{{fd|$&}}")
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
        let star1 = roundVariable(guessedVariable.value[1], isPercent);
        let star2 = roundVariable(guessedVariable.value[2], isPercent);
        let star3 = roundVariable(guessedVariable.value[3], isPercent);
        if(star1 === star2 && star2 === star3) {
          resultText = star1;
        } else {
          resultText = `{{ap|${star1}|${star2}|${star3}}}`;
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
  let preparedObject = {};
  for(let champion of championArray) {
    let {name: name, ...rest} = champion
    preparedObject[champion.name] = rest;
  }
  let replacer = {
    abilityName: "abilityname",
    abilityIcon: "abilityicon",
    abilityDescription: "active",
    unitType: "nonchampion"
  }
  return jsonToLua(preparedObject, replacer);
}

async function writeLua(filepath, lua) {
  try {
    await fs.promises.writeFile(filepath, lua);
  } catch(err) {
    console.error(err);
  }
}

function main() {
  fetchTftData("pbe")
    .then(json => extrudeCDragonData(json, "TFTSet10"))
    .then(processTftChampions)
    .then(convertToLua)
    .then((luaText) => writeLua("Set10.lua", luaText))
    .catch(console.error);
}

main();