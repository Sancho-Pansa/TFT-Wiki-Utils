export default class Trait {
  constructor(name, engname, synergy, levels, prismaticLevel) {
    this.name = name;
    this.engname = engname;
    this.icon = engname + " TFT9 icon.png";
    this.synergy = synergy;
    this.levels = levels;
    this.prismaticLevel = prismaticLevel;
  }
}