import fetch from "node-fetch";
import fs from "node:fs";
import hash from "fnv1a";

class Augment {
    constructor(
        name,
        apiName,
        engname,
        tier,
        associatedTraits,
        desc,
        effects
    ) {
        this.name = name;
        this.apiName = apiName;
        this.engname = engname;
        this.tier = tier;
        this.associatedTraits = associatedTraits;
        this.desc = desc;
        this.effects = effects;
    }
}

const TFT_JSON = "https://raw.communitydragon.org/latest/cdragon/tft/ru_ru.json";
const SET_JSON_RU = "AugmentParser/tft-augments-ru_ru.json";
const SET_JSON_EN = "AugmentParser/tft-augments-en_gb.json";

async function getTftData() {
    const response = await fetch(TFT_JSON);
    return await response.json();
}

async function getLocalData(path) {    
    try {
        let json = await fs.promises.readFile(path, { encoding: "utf8" });
        return JSON.parse(json);
    } catch(err) {        
        console.error(err);
    }
}

function extractAugmentsJson(onlineData, setRuData, setEnData) {
    const items = onlineData.items;
    const setRuAugmentsList = setRuData.data;
    const setEnAugmentsList = setEnData.data;
    const augments = new Array();
    for(let x in setRuAugmentsList) {
        let augmentOnlineData;
        for(let element of items) {
            if(element.apiName == x) {
                augmentOnlineData = element;
                break;
            }
        }

        let augmentDesc = augmentOnlineData?.desc;
        let augmentEffects = augmentOnlineData?.effects;
        let augment = new Augment(
            setRuAugmentsList[x].name, 
            setRuAugmentsList[x].id, 
            setEnAugmentsList[x].name,
            "silver",
            setRuAugmentsList[x].associatedTraits, 
            augmentDesc, 
            augmentEffects
        );
        augments.push(augment);
    }
    return augments;
}

/**
 * Принимает на вход текст описания аугментации и объект связанных с ней эффектов.
 * 
 * По возможности заменяет переменные, заключенные в пару символов "@" на соответствующие 
 * в объекте эффекта значения.
 * @param {String} text 
 * @param {Object} effects 
 * @returns {String}
 */
function decodeDescription(text, effects) {
    let regexRemoveFooters = new RegExp("<br><br>.+", "gm");
    let regexRemoveGenericVars = new RegExp("@TFTUnitProperty.+?@", "gm");
    text = text
        .replace(regexRemoveFooters, "")
        .replace(regexRemoveGenericVars, "");
    let regexTftVariable = new RegExp("@(.+?)@", "gm");
    let regexTftVariableHundredfold = new RegExp("(.+?)\\*100", "gm");
    text = text.replace(regexTftVariable, function(match, group) {        
        if(group.search(regexTftVariableHundredfold) == -1) {
            return replaceTextWithValue(group, effects);
        } else {
            let percentlessText = group.replace(regexTftVariableHundredfold, "$1");
            let effectText = replaceTextWithValue(percentlessText, effects);
            let effectValue = parseFloat(effectText);
            if(Number.isNaN(effectValue)) {
                return effectText;
            } else {
                return Math.round(effectValue * 100);
            }
        }
    });
    console.log(text);
    return text;
}

/**
 * Принимает на вход имя переменной из текста описания и объект эффектов этой аугментации.
 * 
 * Если в объекте находится имя переменной или её FNV1a-хэшированный вариант, возвращает соответствующее ей значение.
 * 
 * В противном случае текст возвращается без изменений.
 * @param {String} textToReplace Заменяемый текст
 * @param {Object} effects Объект, хранящий пары "хэш (или имя переменной)": "значение"
 * @returns {String}
 */
function replaceTextWithValue(textToReplace, effects) {
    let fnvHash = hash(textToReplace.toLowerCase()).toString(16);
    for(let x in effects) {
        if(x.substring(1, x.length - 1) == fnvHash || x == textToReplace) {
            return effects[x].toString();
        }
    }
    return textToReplace;
}  

async function writeInFile(data) {
    try {
        //await fs.promises.writeFile("AugmentParser/Augments-9-Set_formatted.json", JSON.stringify(data, null, 2));        
    } catch(err) {
        console.error(err);
    }
}

function main() {
    const onlinePromise = getTftData();
    const ruJsonPromise = getLocalData(SET_JSON_RU);
    const enJsonPromise = getLocalData(SET_JSON_EN);

    Promise.all([
        onlinePromise,
        ruJsonPromise,
        enJsonPromise
    ]).then(jsons => {
        let onlineJson = jsons[0];
        let ruJson = jsons[1];
        let enJson = jsons[2];
        console.log(extractAugmentsJson(onlineJson, ruJson, enJson));
    }).catch(console.error);
}

main();