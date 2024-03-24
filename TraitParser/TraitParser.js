import fs from "node:fs";
import { fetchTftData } from "../TFTDataFetcher.js";
import hash from "fnv1a";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import Trait from "./TFTTrait.js";
import jsonToLua from "../JsonToLua.js";

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

/**
 *
 * @param {Array} traits
 * @returns {Trait[]}
 */
function processTraits(traits) {
  let traitList = traits.map((t) => {
    let engname = "Void";
    let icon = "Scrap TFT icon.svg";
    if(typeof t.apiName === "string") {
      engname = t.apiName.replace(/TFT\d+_/gm, "");
      let setNumber = t.apiName.match(/TFT(\d+)/)[1] ?? "";
      icon = `${engname} TFT${setNumber} icon.svg`;
    }
    let [rawSynergy, rawCombo, ...auxInfo] = t.desc.split("<br><br>");
    let synergyText = generateTraitSynergy(rawSynergy, t.effects);
    let combo = generateComboTemplate(rawCombo, t.effects);
    let isPrismatic = t.effects.length > 3;
    return new Trait(t.name, engname, "", "", icon, synergyText, combo, isPrismatic);
  });
  return traitList;
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
  const regexGenerics = new RegExp(/@(.*?)(?:\*100)?@/gm);
  const regexScales = new RegExp("%i:(.*?)%", "gm");

  let formattedDescription = rawDescription
    .replace(regexBreaks, "")
    .replace(regexRules, "").replace(regexTags, "")
    .replace(regexGenerics, (text, match) => {
      let result = "''N/A''";
      let effectSample = effects[0];
      if(effectSample) {
        for(let [key, value] of Object.entries(effectSample.variables)) {
          if(key === match || key === hash(match.toLowerCase())) {
            result = roundVariable(value);
            break;
          }
        }
      }
      return result;
    });
  return formattedDescription;
}

function generateComboTemplate(rawCombo, effects) {
  let combo = [];
  for(let effect of effects) {
    combo.push([effect.minUnits, "N/A"]);
  }
  return combo;
}

function roundVariable(abilityVar, isPercent) {
  let roundedValue = Math.round(abilityVar * 100);
  return isPercent ? roundedValue : (roundedValue / 100);
}

/**
 *
 * @param {Trait[]} traitArray
 */
function convertToLua(traitArray) {
  traitArray.sort((a, b) => a.name > b.name ? 1 : -1);
  let preparedObject = {};
  for(let trait of traitArray) {
    let { name: name, ...rest } = trait;
    preparedObject[trait.name] = rest;
  }
  return jsonToLua(preparedObject);
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
  let patchVersion = args[3] ?? "latest";
  fetchTftData(patchVersion)
    .then((json) => extrudeCDragonData(json, setMutator))
    .then(processTraits)
    .then(convertToLua)
    .then((luaText) => {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      return writeLua(`${__dirname}/../out/${setMutator}-Traits.lua`, luaText);
    })
    .catch(console.error);
}

main();

