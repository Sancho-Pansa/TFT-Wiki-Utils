import jsonToLua from "../JsonToLua.js";

let a = {
  a: "5",
  b: [true, false],
  c: {
    cc: "%",
    cd: 54
  }
}

console.log(jsonToLua(a));