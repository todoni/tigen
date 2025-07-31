import { expect, test } from "vitest";
import { generate } from "../../generate";

test("Should success", async () => {
  expect(await generate("7EJDh35E9i8sQXZCdgtWtV", "Icons"));
});
