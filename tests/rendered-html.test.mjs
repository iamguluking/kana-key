import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the kana practice experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /かな Key/);
  assert.match(html, /1000 SENTENCES/);
  assert.match(html, /キーボードガイド/);
  assert.match(html, /<ruby/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("ships the required physical-key input rules", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const sentences = await readFile(new URL("../app/sentences.ts", import.meta.url), "utf8");

  assert.match(page, /code: "BracketLeft", latin: "\[", base: "゛"/);
  assert.match(page, /code: "Equal", latin: "=", base: "゜"/);
  assert.match(page, /code: "BracketRight", latin: "\]", base: "む", shifted: "ー"/);
  assert.match(page, /code: "KeyZ", latin: "Z", base: "つ", shifted: "っ"/);
  assert.match(page, /code: "Quote", latin: "'", base: "け", shifted: "ろ"/);
  assert.match(page, /localStorage/);
  assert.match(sentences, /for \(const subject of subjects\)/);
  assert.match(sentences, /for \(const time of times\)/);
  assert.match(sentences, /for \(const activity of activities\)/);
});
