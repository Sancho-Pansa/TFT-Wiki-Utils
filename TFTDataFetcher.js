// https://raw.communitydragon.org/latest/cdragon/tft/ru_ru.json
const CDRAGON_URL = "https://raw.communitydragon.org/";
const TFT_PATH = "/cdragon/tft/ru_ru.json";

/**
 * Возвращает JSON с информацией о TFT
 * @param {String} [tftPatch=latest] Номер обновления TFT в формате X.X (e.g. 13.18) или "latest"
 * @returns {Promise<any>}
 */
async function fetchTftData(tftPatch = "latest") {
    const response = await fetch(CDRAGON_URL + tftPatch + TFT_PATH);
    return await response.json();
}

async function fetchLoLData(lolPatch = "latest", fullPath) {
    const response = await fetch(CDRAGON_URL + lolPatch + fullPath);
    return await response.json();
}

export {fetchTftData, fetchLoLData};