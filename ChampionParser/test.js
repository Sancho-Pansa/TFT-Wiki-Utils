import { describe } from "mocha";
import jsonToLua from "../JsonToLua.js";
import { assert } from "chai";

describe("Преобразователь объектов JS в таблицу Lua", function() {
  let obj = {
    a: 5,
    b: "c"
  };

  it("Должен превратить простой литерал объекта в таблицу Lua", function() {
    assert.strictEqual(jsonToLua(obj), `\t\t["a"] = 5,\n\t["b"] = "c"`);
  });

  it("Должен изменить название ключа в соответствии с переменной 'replacer'", function() {
    assert.strictEqual(jsonToLua(obj, {b: "beta"}), `\t\t["a"] = 5,\n\t["beta"] = "c"`);
  });

  it("Должен исключить переменную в соответствии с массивом 'exclude'", function() {
    assert.strictEqual(jsonToLua(obj, {}, ["a"]), `\t\t["b"] = "c"`);
  });
})