import { ValidationError, XMLValidator } from "fast-xml-parser";
import { readFileSync } from "fs";

export async function extractSVGDataFromFilePath(filePath: string) {
  const rawContent = readFileSync(filePath, "utf-8");
  const data = await extractSVGData(rawContent);
  return data;
}

export async function extractSVGData(rawContent: string) {
  try {
    const result: ValidationError | true = XMLValidator.validate(rawContent);
    if (result !== true && result.err) {
      throw new Error("Invalid file");
    }

    if (!rawContent.startsWith("<svg")) {
      throw new Error("Not SVG file format");
    }

    const widthMatch = rawContent.match(/width="([^"]+)"/);
    const heightMatch = rawContent.match(/height="([^"]+)"/);

    const width = widthMatch ? widthMatch[1] : "24";
    const height = heightMatch ? heightMatch[1] : "24";

    const pathMatches = Array.from(
      rawContent.matchAll(/<path[^>]*d="([^"]+)"[^>]*>/g)
    );
    const paths = pathMatches.map((match) => match[1]);

    return { width, height, paths };
  } catch (error) {
    console.error("Error reading svg file.", error);
    return null;
  }
}
