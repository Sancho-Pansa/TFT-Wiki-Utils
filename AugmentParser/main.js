import fetch from "node-fetch";
import fs from "node:fs";

async function main() {
    const response = await fetch("https://raw.communitydragon.org/latest/cdragon/tft/ru_ru.json");
    const tftData = await response.json();
    const items = tftData.items;
    const augments = new Array();
    for(let x of items) {
        if(x.apiName.search("_Augment_") != -1)
            augments.push(x);
    }
    augments.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
    });
    try {
        return await fs.promises.writeFile("AugmentParser/Augments-9-Set.json", JSON.stringify(augments, null, 2));
    } catch(err) {
        console.error(err);
    }

}

main();