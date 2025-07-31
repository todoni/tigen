import figmaApiExporter from "figma-api-exporter";
import { writeFileSync } from "fs";
import { downloadSVGsData } from "./utils/downloadSVGsData";
import { extractSVGData } from "./utils/extractSVGData";
import { generateIconTypeFile } from "./utils/generateIconTypeFile";

const token = process.env.FIGMA_API_TOKEN;

export async function generate(figmaFileId: string, figmaCanvas: string) {
  if (!token) {
    throw new Error("figma api token not set");
  }

  const exporter = figmaApiExporter(token);
  const svgsData = await exporter.getSvgs({
    fileId: figmaFileId,
    canvas: figmaCanvas,
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
