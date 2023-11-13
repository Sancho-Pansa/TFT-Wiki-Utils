import fs from "node:fs";
import "./TFTTrait.js";
import { fetchTftData } from "../TFTDataFetcher.js";
import hash from "fnv1a";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

/**
 * Вычленяет из общего объекта данных из Community Dragon только тот, что соответствует запрошенному сезону.
 * @param {*} fullJson Полный JSON из CommunityDragon
 * @param {String} setMutator Кодовое обозначение сезона
 * @returns {Array} Массив групп
 * Кодовое обозначение сезонов (```X``` - номер сезона):
 * - Релизный сезон: TFTSet```X```
 * - Обновление середины сезона: TFTSet```X```_Stage2
 * - Ва-Банк: TFTTURBOSet```X``` / TFTTURBOSet```X```_Stage2
 * - Двойной удар: TFTSet```X```_PAIRS / TFTSet```X```_Stage2_PAIRS
 */
function extrudeCDragonData(json, setMutator) {
  /** @type {Array} */
  let setData = json.setData;
  let currentSet = setData.find((e) => e.mutator === setMutator);
  if(currentSet) {
    return currentSet.traits;
  }
  return [];
}

function processTraits(traits) {
  let traitList = traits.map((t) => {
    let engname = "Void";
    let icon = "Scrap TFT icon.svg";
    let levels = [];
    if(typeof t.apiName === "string") {
      engname = t.apiName.replace(/Set\d+?_/gm, "");
      let setNumber = t.apiName.match(/Set(\d+?)/)[1] ?? "";
      icon = `${engname} TFT${setNumber} icon.svg`;
    }
    let [rawSynergy, rawCombo, ...auxInfo] = t.desc.split("<br><br>");
    generateTraitSynergy(rawSynergy, t.effects);

  });
  return traitList;
}

/**
 * Принимает на вход первоначальную строку описания комбинации и объект с переменными,
 * после чего формирует описание эффекта в разметке MediaWiki и массив из двух элементов: числа
 * бойцов для активации комбинации и бонуса этого уровня комбинации.
 * @param {String} rawDescription Строка из данных CDragon
 * @param {{maxUnits: Number, minUnits: Number, style: Number, variables: any}[]} variables Объект с переменными эффекта комбинации
 * @returns {{synergyText: String, effects: [Number, String]}}
 */
function generateTraitData(rawDescription, variables) {
  const regexBreaks = new RegExp(/<br>/gm);
  const regexRules = new RegExp(/(?:<rules>.*<\/rules>|<tftitemrules>.*<\/tftitemrules>)/gm);
  const regexTemplateRow = new RegExp(/<expandRow>(.*?)<\/expandRow>/gm); // Одна шаблонная строка на описание
  const regexRepeatableRow = new RegExp(/<row>(.*?)<\/row>/gm); // Несколько строк с изменяющимся описанием эффекта
  const regexTags = new RegExp("(<.*?>)", "gm");
  const regexGenerics = new RegExp("@.*?@", "gm");
  const regexScales = new RegExp("%i:(.*?)%", "gm");

  let combo = [];

  let preflightText = rawDescription.replace(regexBreaks, "\n").replace(regexRules, "");
  if(preflightText.match(regexTemplateRow)) {
    preflightText.replace(regexTemplateRow, function(text, match) {

    });
  }

  /*    .replace(regexTags, "")
      .replace(regexGenerics, "")
      .replace(regexScales, (text, match) => {
        const scales = {
          scaleHealth: "здоровья",
          scaleAP: "силы умений",
          scaleAD: "силы атаки",
          scaleAS: "скорости атаки",
          scaleArmor: "брони",
          scaleMR: "сопротивления магии",
          scaleMana: "маны",
        };
        return `(${scales[match] ?? "неизвестный множитель"})`;
      });*/
}


/**
 * Принимает на вход первоначальную строку описания комбинации и объект с переменными,
 * после чего формирует описание эффекта в разметке MediaWiki и массив из двух элементов: числа
 * бойцов для активации комбинации и бонуса этого уровня комбинации.
 * @param {String} rawDescription Строка из данных CDragon
 * @param {{maxUnits: Number, minUnits: Number, style: Number, variables: any}[]} variables Объект с переменными эффекта комбинации
 * @returns {String}
 */
function generateTraitSynergy(rawDescription, effects) {
  const regexBreaks = new RegExp(/<br>/gm);
  const regexRules = new RegExp(/(?:<rules>.*<\/rules>|<tftitemrules>.*<\/tftitemrules>)/gm);
  const regexTags = new RegExp("(<.*?>)", "gm");
  const regexGenerics = new RegExp("@(.*?)@", "gm");
  const regexScales = new RegExp("%i:(.*?)%", "gm");
  rawDescription.replace(regexBreaks, "").replace(regexRules, "").replace(regexTags, "");
  rawDescription.replace(regexGenerics, (text, match) => {
    let result = "''Неопознанная переменная''";
    let effectSample = effects[0];
    if(effectSample) {
      for(let [key, value] of Object.entries(effectSample.variables)) {
        if(key === match || key === hash(match.toLowerCase())) {
          result = value;
          break;
        }
      }
    }
    return result;
  });
  console.log(rawDescription);
  return rawDescription;
}

async function printNewTraits(traitList) {
  try {
    return await fs.promises.writeFile("Traits-9-Wiki.json", JSON.stringify(traitList, null, 2));
  } catch(err) {
    console.error(err);
  }
}

function main() {
  let args = process.argv;
  let setMutator = args[2] ?? "TFTSet10";
  let patchVersion = args[3] ?? "latest";
  fetchTftData(patchVersion)
    .then((json) => extrudeCDragonData(json, setMutator))
    .then(processTraits);

  /*getJson()
    .then(convertJson)
    .then(processTraits)
    .then(printNewTraits);*/
}

main();

