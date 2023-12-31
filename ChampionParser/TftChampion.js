/**
 * Класс чемпиона TFT
 */
class TftChampion {
    /**
     * Конструктор чемпиона TFT
     * @param {String} name Имя
     * @param {String} engname Английское имя
     * @param {Number} tier Ранг
     * @param {String[]} traits Особенности
     * @param {String} abilityName Название умения
     * @param {String} abilityIcon Иллюстрация умения
     * @param {String} abilityDescription Описание умения
     * @param {ChampionStats} stats Характеристики чемпиона
     * @param {String} unitType Тип бойца
     * @param {Boolean} variant Является ли вариацией одного и того же бойца
     */
    constructor(
        name,
        engname,
        tier,
        traits,
        abilityName,
        abilityIcon,
        abilityDescription,
        stats,
        unitType,
        variant
    ) {
        this.name = name;
        this.engname = engname;
        this.tier = tier;
        this.traits = traits;
        this.abilityName = abilityName;
        this.abilityIcon = abilityIcon;
        this.abilityDescription = abilityDescription;
        this.stats = stats;
        this.unitType = unitType;
        this.variant = variant;
    }
}

class ChampionStats {
    /**
    * @param {Number} health Здоровье
    * @param {Number} mana Запас маны
    * @param {Number} startMana Начальный объем маны
    * @param {Number} ad Сила атаки
    * @param {Number} as Скорость атаки
    * @param {Number} range Дальность атаки
    * @param {Number} armor Броня
    * @param {Number} mr Магическое сопротивление
    */
    constructor(health, mana, startMana, ad, as, range, armor, mr) {
        this.health = health;
        this.mana = mana;
        this.startMana = startMana;
        this.ad = ad;
        this.as = as;
        this.range = range;
        this.armor = armor;
        this.mr = mr;
    }
}

export {TftChampion, ChampionStats};