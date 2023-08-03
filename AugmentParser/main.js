import fetch from "node-fetch";
import fs from "node:fs";

class Augment {
    constructor(
        name,
        apiName,
        engname,
        associatedTraits,
        desc,
        effects
    ) {
        this.name = name;
        this.apiName = apiName;
        this.engname = engname;
        this.associatedTraits = associatedTraits;
        this.desc = desc;
        this.effects = effects;
    }
}

async function main() {
    const response = await fetch("https://raw.communitydragon.org/latest/cdragon/tft/ru_ru.json");
    const tftData = await response.json();
    const items = tftData.items;
    const augments = new Array();
    for(let x of items) {
        if(x.apiName.search("TFT9_Augment_") != -1 && x.icon.search("/Missing") == -1 ) {
            let augment = new Augment(x.name, x.apiName, "X", x.associatedTraits, x.desc, x.effects);
            augments.push(augment);
        }
            
    }
    augments.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
    });
    try {
        return await fs.promises.writeFile("AugmentParser/Augments-9-Set_formatted.json", JSON.stringify(augments, null, 2));
    } catch(err) {
        console.error(err);
    }

}

main();