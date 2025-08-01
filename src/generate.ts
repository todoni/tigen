import chalk from "chalk";
import dotenv from "dotenv";
import figmaApiExporter from "figma-api-exporter";
import { writeFileSync } from "fs";
import ora from "ora";
import { downloadSVGsData } from "./utils/downloadSVGsData";
import { extractSVGData } from "./utils/extractSVGData";
import { generateIconTypeFile } from "./utils/generateIconTypeFile";

dotenv.config();

const { FIGMA_API_TOKEN, FIGMA_FILE_ID, FIGMA_PAGE_NAME } = process.env;

export async function generate() {
  const log = console.log;
  console.log(FIGMA_API_TOKEN, FIGMA_FILE_ID, FIGMA_PAGE_NAME);
  if (!FIGMA_API_TOKEN || !FIGMA_FILE_ID || !FIGMA_PAGE_NAME) {
    log(chalk.red("❌ Missing required environment variables."));
    throw new Error("Env not set.");
  }

  try {
    // 1. Fetch from Figma
    const fetchSpinner = ora(
      chalk.cyan("Fetching icons from Figma...")
    ).start();
    const exporter = figmaApiExporter(FIGMA_API_TOKEN);
    const svgsData = await exporter.getSvgs({
      fileId: FIGMA_FILE_ID,
      canvas: FIGMA_PAGE_NAME,
    });
    fetchSpinner.succeed(chalk.green("Icons fetched from Figma"));

    // 2. Download SVG data
    const downloadSpinner = ora(chalk.cyan("Downloading SVGs...")).start();
    const downloadedSVGsData = await downloadSVGsData(svgsData.svgs);
    downloadSpinner.succeed(chalk.green("SVGs downloaded"));

    // 3. Extract SVG metadata
    const extractSpinner = ora(chalk.cyan("Extracting SVG data...")).start();
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
    extractSpinner.succeed(chalk.green("SVG data extracted"));

    // 4. Write svgPaths.ts
    const writeSpinner = ora(chalk.cyan("Generating svgPaths.ts...")).start();
    writeFileSync(
      "svgPaths.ts",
      `export const svgPaths = ${JSON.stringify(result, null, 2)};`
    );
    writeSpinner.succeed(chalk.green("svgPaths.ts created"));

    // 5. Generate types
    const typesSpinner = ora(chalk.cyan("Generating types.ts...")).start();
    generateIconTypeFile(result);
    typesSpinner.succeed(chalk.green("types.ts created"));

    log(chalk.bold.greenBright("\n🎉 Icon generation complete!\n"));
  } catch (err) {
    console.error(err);
    console.error(chalk.redBright("🚨 Error occurred during generation"));
    process.exit(1);
  }
}
