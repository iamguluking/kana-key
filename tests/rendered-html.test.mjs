import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { sentenceBank } from "../app/sentences.ts";

test("provides exactly 1000 unique practice sentences", () => {
  const visibleSentences = sentenceBank.map((sentence) =>
    sentence.tokens.map((token) => token.surface).join(""),
  );

  assert.equal(sentenceBank.length, 1000);
  assert.equal(new Set(visibleSentences).size, 1000);
  assert.ok(sentenceBank.every((sentence) => sentence.reading.length > 0));
});

test("ships the required physical-key input rules", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(page, /code: "BracketLeft", latin: "\[", base: "゛"/);
  assert.match(page, /code: "Equal", latin: "=", base: "゜"/);
  assert.match(page, /code: "BracketRight", latin: "\]", base: "む", shifted: "ー"/);
  assert.match(page, /code: "KeyZ", latin: "Z", base: "つ", shifted: "っ"/);
  assert.match(page, /code: "Quote", latin: "'", base: "け", shifted: "ろ"/);
  assert.match(page, /localStorage/);
});
