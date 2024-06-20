export const replaceColor = (svgString: string, newColor: string, type: "fill" | "stroke" = "fill") => {
  const regex = new RegExp(`${type}="[^"]+"`, "g");

  let replacement = `${type}="var(${newColor})"`;
  if (newColor.startsWith("#")) {
    replacement = `${type}="${newColor}"`;
  }

  return svgString.replace(regex, replacement);
};
