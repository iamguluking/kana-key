import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createPracticeDeck, sentenceBank } from "../app/sentences.ts";

test("provides exactly 10000 unique practice sentences", () => {
  const visibleSentences = sentenceBank.map((sentence) =>
    sentence.tokens.map((token) => token.surface).join(""),
  );

  assert.equal(sentenceBank.length, 10000);
  assert.equal(new Set(visibleSentences).size, 10000);
  assert.equal(sentenceBank.filter((sentence) => sentence.register === "polite").length, 5000);
  assert.equal(sentenceBank.filter((sentence) => sentence.register === "casual").length, 5000);
  assert.ok(
    sentenceBank
      .filter((sentence) => sentence.register === "polite")
      .every((sentence) => sentence.tokens.map((token) => token.surface).join("").endsWith("ます。")),
  );
  assert.equal(new Set(sentenceBank.map((sentence) => sentence.family)).size, 50);
  assert.equal(new Set(sentenceBank.map((sentence) => sentence.category)).size, 10);
  assert.ok(
    [...new Set(sentenceBank.map((sentence) => sentence.family))].every(
      (family) => sentenceBank.filter((sentence) => sentence.family === family).length === 200,
    ),
  );
  assert.equal(visibleSentences.filter((sentence) => sentence.endsWith("よ。")).length, 1000);
  assert.equal(visibleSentences.filter((sentence) => sentence.endsWith("ね。")).length, 1000);
  assert.equal(visibleSentences.filter((sentence) => sentence.endsWith("んだ。")).length, 1000);
  assert.equal(visibleSentences.filter((sentence) => sentence.endsWith("かな。")).length, 1000);
  assert.ok(sentenceBank.every((sentence) => sentence.reading.length > 0));
  assert.ok(sentenceBank.every((sentence) => /^[ぁ-ゔー]+$/.test(sentence.reading)));
  assert.ok(
    sentenceBank.every((sentence) =>
      sentence.tokens.every(
        (token) => !/[一-龯々]/.test(token.surface) || token.ruby,
      ),
    ),
  );
});

test("draws every sentence once and rotates sentence families", () => {
  let seed = 20260902;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
  const deck = createPracticeDeck(random);

  assert.equal(deck.length, 10000);
  assert.equal(new Set(deck).size, 10000);
  for (let offset = 0; offset < deck.length; offset += 50) {
    assert.equal(
      new Set(
        deck.slice(offset, offset + 50).map((index) => sentenceBank[index].family),
      ).size,
      50,
    );
  }
  assert.ok(
    deck.slice(1).every(
      (index, position) =>
        sentenceBank[index].family !== sentenceBank[deck[position]].family,
    ),
  );
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
  assert.match(page, /createPracticeDeck/);
  assert.doesNotMatch(page, /1000 SENTENCES/);
  assert.doesNotMatch(page, /读音按平假名输入，标点会自动跳过/);
  assert.doesNotMatch(css, /min-width:\s*940px/);
  assert.match(css, /max-height:\s*850px/);
  assert.doesNotMatch(css, /@keyframes\s+nudge|animation:\s*nudge/);
});
