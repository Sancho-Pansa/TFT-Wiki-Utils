import fs from "node:fs";

class Trait{
    constructor(name, engname, synergy, levels, prismaticLevel) {
        this.name = name;
        this.engname = engname;
        this.icon = engname + " TFT9 icon.png";
        this.synergy = synergy;
        this.levels = levels;
        this.prismaticLevel = prismaticLevel;
    }
}

async function getJson() {
    try {
        const result = await fs.promises.readFile("TraitParser/Traits-9.json", { encoding: "utf-8" });
        return result;
    } catch (err) {
        console.error(err);
    }
}

function convertJson(json) {
    const result = JSON.parse(json);
    return result;
}

function processTraits(traits) {
    let traitList = new Array();    
    for(let t of traits) {
        console.log(t.name);
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
            levels.push( { units: e.minUnits, bonus: "<N>" } );
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
    getJson()
        .then(convertJson)
        .then(processTraits)
        .then(printNewTraits);
}

main();

