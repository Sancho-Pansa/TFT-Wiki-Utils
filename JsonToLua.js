export default function jsonToLua(json, defaultIndent = "\t") {
  if(typeof json === "object") {
    if(Array.isArray(json)) {
      return defaultIndent + convertArray(json);
    } else {
      return defaultIndent + convertObject(json);
    }
  }

  function convertObject(obj) {
    let str = [];
    for(let [key, value] of Object.entries(obj)) {
      str.push(convertPair(key, value));
    };
    return str.join(", \n");

    function convertPair(key, value) {
      if(typeof value === "object") {
        if(Array.isArray(value)) {
          return `["${key}"] = [${convertArray(value)}]`;
        } else {
          return `["${key}"] = {\n${convertObject(value)}}`;
        }
      } else {
        return `["${key}"] = ${convertPrimitive(value)}`;
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
      return `"${prim}"`;
    } else {
      return "nil";
    }
  }
}