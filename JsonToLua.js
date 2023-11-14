/**
 * Преобразует объект JavaScript в таблицу Lua
 * @param {Object} json Объект JS для преобразования
 * @param {Object={}} replacer Объект, в котором даются возможные замены первоначальных имен ключей в объекте JS
 * @param {String[]} exclude Массив ключей объекта, которые нужно пропустить при преобразовании
 * @param {Boolean} flat Если true, то все вложенные объекты будут сведены на верхний уровень таблицы Lua
 * @param {String} defaultIndent Символ отступа по умолчанию
 * @returns {String} таблица Lua в виде текстовой строки
 */
export default function jsonToLua(json, replacer = {}, exclude = [], flat, defaultIndent = "\t") {
  let indentation = 0;
  let nestingLevel = 0;

  if(typeof json === "object") {
    if(Array.isArray(json)) {
      return defaultIndent + convertArray(json);
    } else {
      return defaultIndent + convertObject(json);
    }
  }

  return "";

  function convertObject(obj) {
    nestingLevel++;
    if(!flat || nestingLevel < 3) {
      indentation++;
    }
    let str = [];
    for(let [key, value] of Object.entries(obj)) {
      if(exclude.includes(key)) {
        continue;
      }
      str.push(convertPair(key, value));
    };
    // Логическая оптимизация
    if(!flat || nestingLevel < 3) {
      indentation--;
    }
    nestingLevel--;
    return str.join(",\n");
  }

  function convertPair(key, value) {
    let k = replacer[key] ?? key
    if(typeof value === "object") {
      if(Array.isArray(value)) {
        return `${defaultIndent.repeat(indentation)}["${k}"] = {${convertArray(value)}}`;
      } else if(value === null) {
        return `${defaultIndent.repeat(indentation)}["${k}"] = ${convertPrimitive(value)}`;
      } else {
        if(flat && nestingLevel > 1) {
          return `${convertObject(value)}`;
        } else {
          return `${defaultIndent.repeat(indentation)}["${k}"] = {\n${convertObject(value)}\n${defaultIndent.repeat(indentation)}}`;
        }
      }
    } else {
      return `${defaultIndent.repeat(indentation)}["${k}"] = ${convertPrimitive(value)}`;
    }
  }

  function convertArray(array) {
    let luaArray = [];
    for(let c of array) {
      if(typeof c === "object") {
        if(Array.isArray(c)) {
          luaArray.push(convertArray(c));
        } else {
          luaArray.push(convertObject(c));
        }
      } else {
        luaArray.push(convertPrimitive(c));
      }
    }
    return luaArray.join(", ");
  }

  function convertPrimitive(prim) {
    if(typeof prim === "number" || typeof prim === "boolean") {
      return prim.toString();
    } else if(typeof prim === "string") {
      prim = prim.replace(/\n/g, "<br />");
      return `"${prim}"`;
    } else {
      return "nil";
    }
  }
}