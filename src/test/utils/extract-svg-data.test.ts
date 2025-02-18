import path from "path";
import { expect, test } from "vitest";
import { extractSVGData } from "../../utils/utils";

test("extract svg data from file", async () => {
  expect(
    await extractSVGData(path.resolve(__dirname, "../fixture/svgs/empty"))
  ).toEqual(null);
});
