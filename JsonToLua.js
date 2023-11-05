export default function jsonToLua(json, replacer = {}, defaultIndent = "\t") {
  let indentation = 0;

  if(typeof json === "object") {
    if(Array.isArray(json)) {
      return defaultIndent + convertArray(json);
    } else {
      return defaultIndent + convertObject(json);
    }
  }

  function convertObject(obj) {
    indentation++;
    let str = [];
    for(let [key, value] of Object.entries(obj)) {
      str.push(convertPair(key, value));
    };
    indentation--;
    return str.join(", \n");

    function convertPair(key, value) {
      let k = replacer[key] ?? key
      if(typeof value === "object") {
        if(Array.isArray(value)) {
          return `${defaultIndent.repeat(indentation)}["${k}"] = {${convertArray(value)}}`;
        } else if(value === null) {
          return `${defaultIndent.repeat(indentation)}["${k}"] = ${convertPrimitive(value)}`;
        } else {
          return `${defaultIndent.repeat(indentation)}["${k}"] = {\n${convertObject(value)}\n${defaultIndent.repeat(indentation)}}`;
        }
      } else {
        return `${defaultIndent.repeat(indentation)}["${k}"] = ${convertPrimitive(value)}`;
      }
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