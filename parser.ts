//const fs = require("fs");
//const path = require("path");
import fs from "fs/promises";
import path from "path";

export async function generateIconComponent() {
  const outputPath = path.resolve(process.cwd(), "Icon");
  const fileContent = `
import { SVGProps } from "react";
import svgPaths from "../output.json";
import { IconName } from "../icons";

interface Props extends SVGProps<SVGSVGElement> {
  icon: IconName;
  color?: string;
}

export function Icon({
  icon,
  color = "fill-neutral-9",
  className,
  ...props
}: Props) {
  const newClassName = className;
  const { width, height, pathData } = svgPaths[icon];

  return (
    <svg
      className={newClassName}
      width={width}
      height={height}
      fillRule="evenodd"
      clipRule="evenodd"
      {...props}
    >
      {pathData.map((path, index) => (
        <path key={index} d={path} />
      ))}
    </svg>
  );
}
  `;

  try {
    await fs.mkdir(outputPath, {
      recursive: true,
    });
    // 지정된 경로에 파일 작성
    await fs.writeFile(path.join(outputPath, "Icon.tsx"), fileContent, "utf-8");
    console.log(`✅ 파일이 생성되었습니다: ${outputPath}`);
  } catch (error) {
    console.error("❌ 파일 생성 중 오류 발생:", error);
  }
}

export async function generateIconTypeFile(jsonFilePath: string) {
  const jsonData = await fs.readFile(jsonFilePath, "utf8");
  const jsonObject = JSON.parse(jsonData);
  const keys = Object.keys(jsonObject);
  const iconObject = keys.map((key) => `"${key}": "${key}",`).join("\n");
  const fileContent = `export const ICON_NAME = {\n${iconObject}\n} as const;\nexport type IconName = (typeof ICON_NAME)[keyof typeof ICON_NAME];\n`;
  await fs.writeFile("icons.ts", fileContent, "utf-8");
}

export async function generateJSONfromSVGFiles(folderPath: string) {
  const svgDatas: {
    [key: string]: {
      width: string | number;
      height: string | number;
      pathData: string[];
    } | null;
  } = {};
  const files = await readSVGFilesAsync(folderPath);
  const results = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(folderPath, file.name);
      const fileName = path.basename(file.name, ".svg");
      const svgData = await extractSVGData(filePath);
      svgDatas[fileName] = svgData;
    })
  );
  await fs.writeFile("output.json", JSON.stringify(svgDatas, null, 2), "utf8");
}

async function readSVGFilesAsync(folderPath: string) {
  try {
    const files = await fs.readdir(folderPath, {
      withFileTypes: true,
    });
    return files;
  } catch (error) {
    console.error("Error reading directory.", error);
    return [];
  }
}

export async function extractSVGData(filePath: string) {
  // 파일 읽기
  try {
    const svgContent = await fs.readFile(filePath, "utf-8");
    if (!svgContent.startsWith("<svg")) {
      throw new Error("Invalid SVG file format");
    }

    // width와 height 추출 (정규식 사용)
    const widthMatch = svgContent.match(/width="([^"]+)"/);
    const heightMatch = svgContent.match(/height="([^"]+)"/);

    const width = widthMatch ? widthMatch[1] : 24;
    const height = heightMatch ? heightMatch[1] : 24;

    // 모든 <path> 태그에서 d 속성 추출
    //const pathMatches = [...svgContent.matchAll(/<path[^>]*d="([^"]+)"[^>]*>/g)];
    //const pathData = pathMatches.map(match => match[1]);
    const pathMatches = Array.from(
      svgContent.matchAll(/<path[^>]*d="([^"]+)"[^>]*>/g)
    );
    const pathData = pathMatches.map((match) => match[1]);

    return { width, height, pathData };
  } catch (error) {
    console.error("Error reading svg file.", error);
    return null;
  }
}

// 테스트 실행
/*const svgPath = path.join(__dirname, "icon.svg");
const result = extractSVGData(svgPath);
console.log(result);*/
