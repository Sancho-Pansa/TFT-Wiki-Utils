import fetch from "node-fetch";
import fs from "node:fs";
import hash from "fnv1a";

const TFT_JSON = "https://raw.communitydragon.org/latest/cdragon/tft/ru_ru.json";
const SET_JSON_RU = "AugmentParser/tft-augments-ru_ru.json";
const SET_JSON_EN = "AugmentParser/tft-augments-en_gb.json";

async function getTftData() {
    const response = await fetch(TFT_JSON);
    return await response.json();
}

function extractTftChampions(fullJson, tableIndex) {
    return fullJson.setData[tableIndex].champions;
}

async function writeLua(filepath, lua) {
    try {
        await fs.promises.writeFile(filepath, lua);
    } catch(err) {
        console.error(err);
    }
}

export function main() {
    getTftData()
        .then(json => {console.dir(extractTftChampions(json, 0));})
        //.then(writeLua)
        .catch(console.error);
}

main();