import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { sentenceBank } from "../app/sentences.ts";

test("provides exactly 10000 unique practice sentences", () => {
  const visibleSentences = sentenceBank.map((sentence) =>
    sentence.tokens.map((token) => token.surface).join(""),
  );

  assert.equal(sentenceBank.length, 10000);
  assert.equal(new Set(visibleSentences).size, 10000);
  assert.equal(visibleSentences.filter((sentence) => sentence.endsWith("ます。")).length, 5000);
  assert.equal(visibleSentences.filter((sentence) => sentence.endsWith("よ。")).length, 1250);
  assert.equal(visibleSentences.filter((sentence) => sentence.endsWith("ね。")).length, 1250);
  assert.equal(visibleSentences.filter((sentence) => sentence.endsWith("んだ。")).length, 1250);
  assert.ok(sentenceBank.every((sentence) => sentence.reading.length > 0));
});

test("ships the required physical-key input rules", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(page, /code: "BracketLeft", latin: "\[", base: "゛"/);
  assert.match(page, /code: "Equal", latin: "=", base: "゜"/);
  assert.match(page, /code: "BracketRight", latin: "\]", base: "む", shifted: "ー"/);
  assert.match(page, /code: "KeyZ", latin: "Z", base: "つ", shifted: "っ"/);
  assert.match(page, /code: "Quote", latin: "'", base: "け", shifted: "ろ"/);
  assert.match(page, /localStorage/);
  assert.match(page, /transitionLocked/);
  assert.doesNotMatch(page, /1000 SENTENCES/);
  assert.doesNotMatch(page, /读音按平假名输入，标点会自动跳过/);
  assert.doesNotMatch(css, /min-width:\s*940px/);
  assert.match(css, /max-height:\s*850px/);
  assert.doesNotMatch(css, /@keyframes\s+nudge|animation:\s*nudge/);
});
