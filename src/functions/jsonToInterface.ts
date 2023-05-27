export const jsonToInterface = (
  jsonString: string,
  interfaceName?: string | null
): string => {
  console.log({ jsonString });
  try {
    const obj = JSON.parse(jsonString);
    let principalString = `interface ${interfaceName || "InterfaceObject"} {\n`;
    const objectStrings: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value !== "object") {
        principalString += makeSimpleAttr(value, key);
      } else {
        if (Array.isArray(value)) {
          principalString += makeArrayAttr(key, value, objectStrings);
        } else {
          principalString += makeObjectAttr(key, objectStrings, value);
        }
      }
    }

    principalString += "}\n\n";

    return objectStrings.join("\n\n") + "" + principalString;
  } catch (error) {
    return "";
  }
};

const makeSimpleAttr = (value: unknown, key: string): string => {
  return `  ${anyCaseToCamelCase(key)}: ${typeof value};\n`;
};

const makeArrayAttr = (
  key: string,
  value: unknown[],
  objectStrings: string[]
): string => {
  let keyFormatted = anyCaseToPascaleCase(key[0].toUpperCase() + key.slice(1));
  if (key[key.length - 1].toLowerCase() === "s") {
    keyFormatted = keyFormatted.slice(0, -1);
  }

  if (typeof value[0] === "object") {
    objectStrings.push(jsonToInterface(JSON.stringify(value[0]), keyFormatted));
    return `  ${anyCaseToCamelCase(key.toLowerCase())}: ${keyFormatted}[];\n`;
  }

  if (typeof value[0] === "string") {
    objectStrings.push(makeEnumString(keyFormatted, value));
    return `  ${anyCaseToCamelCase(key.toLowerCase())}: ${keyFormatted}[];\n`;
  }
  objectStrings.push(
    `interface ${keyFormatted} {\n  ${key.toLowerCase()}: ${typeof value[0]};\n}`
  );
  return `  ${anyCaseToCamelCase(key.toLowerCase())}: ${typeof value[0]}[];\n`;
};

const makeObjectAttr = (
  key: string,
  objectStrings: string[],
  value: unknown
): string => {
  let keyFormatted = key[0].toUpperCase() + key.slice(1);
  if (key[key.length - 1].toLowerCase() === "s") {
    keyFormatted = keyFormatted.slice(0, -1);
  }
  objectStrings.push(jsonToInterface(JSON.stringify(value), keyFormatted));
  return `  ${key.toLowerCase()}: ${keyFormatted};\n`;
};

const makeEnumString = (key: string, value: unknown[]): string => {
  let enumString = `enum ${key[0].toUpperCase() + key.slice(1)} {\n`;
  for (const val of value) {
    enumString += `  ${removeIncompatibleCharsFromKey(
      val as string
    )} = "${val}",\n`;
  }
  enumString += "}\n\n";
  return enumString;
};

const anyCaseToPascaleCase = (str: string): string => {
  return str
    .split(/[^a-zA-Z0-9]/)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");
};

const anyCaseToCamelCase = (str: string): string => {
  return str
    .split(/[^a-zA-Z0-9]/)
    .map((word, index) =>
      index === 0 ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join("");
};

const removeIncompatibleCharsFromKey = (key: string): string => {
  return key.replace(/[^a-zA-Z0-9]/g, "");
};
