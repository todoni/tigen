import fs from "fs/promises";

export async function extractSVGData(filePath: string) {
  try {
    const rawContent = await fs.readFile(filePath, "utf-8");

    if (!rawContent.startsWith("<svg")) {
      throw new Error("Invalid SVG file format");
    }

    const widthMatch = rawContent.match(/width="([^"]+)"/);
    const heightMatch = rawContent.match(/height="([^"]+)"/);

    const width = widthMatch ? widthMatch[1] : 24;
    const height = heightMatch ? heightMatch[1] : 24;

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
