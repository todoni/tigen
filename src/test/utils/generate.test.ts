import { expect, test } from "vitest";
import { generate } from "../../generate";

test("Should success", async () => {
  expect(await generate());
});
