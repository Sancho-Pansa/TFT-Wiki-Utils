import fs from "node:fs";
import "./TFTTrait.js";
import {fetchTftData} from "../TFTDataFetcher.js";
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

function convertJson(json) {
  const result = JSON.parse(json);
  return result;
}

function processTraits(traits) {
  let traitList = [];
  for(let t of traits) {
    let engname = t.apiName.slice(5);
    let prismaticLevel = false;

    const regexBreaks = new RegExp("<br>", "gm");
    const regexRules = new RegExp("<rules>.*</rules>", "gm");
    const regexTags = new RegExp("(<.*?>)", "gm");
    const regexGenerics = new RegExp("@.*?@", "gm");
    const regexScales = new RegExp("%i:(.*?)%", "gm");
    const scales = {
      scaleHealth: "зависит от здоровья",
      scaleAP: "зависит от здоровья",
      scaleAD: "зависит от здоровья",
      scaleAS: "зависит от здоровья",
      scaleArmor: "зависит от здоровья",
      scaleMR: "зависит от здоровья",
      scaleMana: "зависит от здоровья",
    }

    let synergyText = t.desc;
    synergyText = synergyText
      .replace(regexBreaks, "\n")
      .replace(regexRules, "\n")
      .replace(regexTags, "")
      .replace(regexGenerics, "<N>")
      .replace(regexScales, (text, match) => {
        return `(${scales[match] ?? "неизвестный множитель"})`;
      });

    console.log(synergyText);
    let effects = t.effects;
    let levels = new Array();
    for(let e of effects) {
      levels.push({ units: e.minUnits, bonus: "<N>" });
      if(e.style == 5) prismaticLevel = true;
    }

    traitList.push(new Trait(
      t.name,
      engname,
      synergyText,
      levels,
      prismaticLevel
    ));
    traitList.sort((a, b) => {
      return a.name > b.name ? 1 : -1;
    })
  }
  return traitList;
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
    .then((json) => {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      fs.promises.writeFile(`${__dirname}/../out/Traits-10.json`, JSON.stringify(json, null, 2));
    });

  /*getJson()
    .then(convertJson)
    .then(processTraits)
    .then(printNewTraits);*/
}

main();

