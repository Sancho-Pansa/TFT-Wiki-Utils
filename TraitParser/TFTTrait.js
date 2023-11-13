/**
 * Данный класс описывает особенность чемпиона TFT
 */
export default class Trait {
  /**
   * 
   * @param {String} name Имя группы
   * @param {String} engname Английское имя группы
   * @param {String} synergy Основное описание эффекта комбинации
   * @param {[Number, String][]} levels Двумерный массив с гетерогенным массивом; первое значение - число бойцов комбинации, второе - описание эффекта
   * @param {Boolean} prismaticLevel Имеет ли призматический уровень
   */
  constructor(name, engname, synergy, levels, prismaticLevel) {
    this.name = name;
    this.engname = engname;
    this.gs = gs;
    this.gp = gp;
    this.icon = icon;
    this.synergy = synergy;
    this.prismaticLevel = prismaticLevel;
    this.levels = levels;
  }
}