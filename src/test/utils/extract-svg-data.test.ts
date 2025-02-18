import path from "path";
import { expect, test } from "vitest";
import { extractSVGData } from "../../utils/utils";

test("Any invalid cases should return null", async () => {
  expect(
    await extractSVGData(path.resolve(__dirname, "../fixture/svgs/not-exist"))
  ).toEqual(null);

  expect(
    await extractSVGData(path.resolve(__dirname, "../fixture/svgs/empty"))
  ).toEqual(null);

  expect(
    await extractSVGData(path.resolve(__dirname, "../fixture/svgs/empty.svg"))
  ).toEqual(null);

  expect(
    await extractSVGData(
      path.resolve(__dirname, "../fixture/svgs/none-svg.svg")
    )
  ).toEqual(null);

  expect(
    await extractSVGData(path.resolve(__dirname, "../fixture/svgs/invalid.svg"))
  ).toEqual(null);
});
