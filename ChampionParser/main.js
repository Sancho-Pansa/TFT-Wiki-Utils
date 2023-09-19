import fetch from "node-fetch";
import fs from "node:fs";
import hash from "fnv1a";
import { fetchTftData } from "../TFTDataFetcher.js";
import TftChampion from "./TftChampion.js";

function extractCDragonData(fullJson, tableIndex) {
    return fullJson.setData[tableIndex].champions;
}

/**
 *
 * @param {Object[]} rawArray Массив объектов из JSON
 */
function processTftChampions(rawArray) {
    function generateAbilityDescription(rawDescription, variables) {
        return "";
    }

    let championArray = rawArray
        .map((value) => new TftChampion(
            value.name,
            value.characterName.substring(5),
            value.cost,
            value.traits,
            value.ability.name,
            "",
            generateAbilityDescription(value.ability.desc, value.ability.variables),
            value.stats.hp,
            value.stats.mana,
            value.stats.initialMana,
            value.stats.damage,
            value.stats.attackSpeed,
            value.stats.range,
            value.stats.armor,
            value.stats.magicResist,
            value.traits.length == 0,
            false
        ))
        .sort((a, b) => a.name > b.name ? 1 : -1);

    return championArray;
}

function jsonToLua(championJson) {

}

async function writeLua(filepath, lua) {
    try {
        await fs.promises.writeFile(filepath, lua);
    } catch(err) {
        console.error(err);
    }
}

function main() {
    fetchTftData()
        .then(json => extractCDragonData(json, 0))
        .then(processTftChampions)
        .then(console.log)
        //.then(writeLua)
        .catch(console.error);
}

main();