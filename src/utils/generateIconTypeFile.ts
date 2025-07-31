import { writeFileSync } from "fs";

export async function generateIconTypeFile(svgPaths: object) {
  const jsonObject = svgPaths;
  const keys = Object.keys(jsonObject);
  const iconObject = keys.map((key) => `"${key}": "${key}",`).join("\n");
  const fileContent = `export const ICON_NAME = {\n${iconObject}\n} as const;\nexport type IconName = (typeof ICON_NAME)[keyof typeof ICON_NAME];\n`;
  writeFileSync("icons.ts", fileContent, "utf-8");
}
