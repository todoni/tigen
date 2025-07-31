import figmaApiExporter from "figma-api-exporter";
import { writeFileSync } from "fs";
import { downloadSVGsData } from "./utils/downloadSVGsData";
import { extractSVGData } from "./utils/extractSVGData";
import { generateIconTypeFile } from "./utils/generateIconTypeFile";

const { FIGMA_API_TOKEN } = process.env;
const { FIGMA_FILE_ID } = process.env;
const { FIGMA_PAGE_NAME } = process.env;

export async function generate() {
  if (!FIGMA_API_TOKEN || !FIGMA_FILE_ID || !FIGMA_PAGE_NAME) {
    throw new Error("Env not set.");
  }

  const exporter = figmaApiExporter(FIGMA_API_TOKEN);
  const svgsData = await exporter.getSvgs({
    fileId: FIGMA_FILE_ID,
    canvas: FIGMA_PAGE_NAME,
  });
  const downloadedSVGsData = await downloadSVGsData(svgsData.svgs);
  const result: Record<string, any> = {};

  await Promise.all(
    downloadedSVGsData.map(async (svg) => {
      const data = await extractSVGData(svg.data);
      const sizePrefix =
        data?.width === data?.height
          ? data?.width
          : `${data?.width}_${data?.height}`;
      const iconName = `ico_${sizePrefix}_${svg.name.replace(/-/g, "_")}`;
      result[iconName] = data;
    })
  );
  writeFileSync(
    "svgPaths.ts",
    `export const svgPaths = ${JSON.stringify(result, null, 2)};`
  );
  generateIconTypeFile(result);
}
