"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sentenceBank } from "./sentences";

type KeyDefinition = {
  code: string;
  latin: string;
  base?: string;
  shifted?: string;
  width?: "medium" | "wide";
};

const keyboardRows: KeyDefinition[][] = [
  [
    { code: "Backquote", latin: "`", base: "\\", shifted: "~" },
    { code: "Digit1", latin: "1", base: "ぬ" },
    { code: "Digit2", latin: "2", base: "ふ" },
    { code: "Digit3", latin: "3", base: "あ", shifted: "ぁ" },
    { code: "Digit4", latin: "4", base: "う", shifted: "ぅ" },
    { code: "Digit5", latin: "5", base: "え", shifted: "ぇ" },
    { code: "Digit6", latin: "6", base: "お", shifted: "ぉ" },
    { code: "Digit7", latin: "7", base: "や", shifted: "ゃ" },
    { code: "Digit8", latin: "8", base: "ゆ", shifted: "ゅ" },
    { code: "Digit9", latin: "9", base: "よ", shifted: "ょ" },
    { code: "Digit0", latin: "0", base: "わ", shifted: "を" },
    { code: "Minus", latin: "-", base: "ほ" },
    { code: "Equal", latin: "=", base: "゜", shifted: "「" },
    { code: "Backspace", latin: "delete", width: "medium" },
  ],
  [
    { code: "Tab", latin: "tab", width: "medium" },
    { code: "KeyQ", latin: "Q", base: "た" },
    { code: "KeyW", latin: "W", base: "て" },
    { code: "KeyE", latin: "E", base: "い", shifted: "ぃ" },
    { code: "KeyR", latin: "R", base: "す" },
    { code: "KeyT", latin: "T", base: "か" },
    { code: "KeyY", latin: "Y", base: "ん" },
    { code: "KeyU", latin: "U", base: "な" },
    { code: "KeyI", latin: "I", base: "に" },
    { code: "KeyO", latin: "O", base: "ら" },
    { code: "KeyP", latin: "P", base: "せ" },
    { code: "BracketLeft", latin: "[", base: "゛", shifted: "」" },
    { code: "BracketRight", latin: "]", base: "む", shifted: "ー" },
    { code: "Backslash", latin: "\\", base: "へ" },
  ],
  [
    { code: "CapsLock", latin: "caps lock", width: "wide" },
    { code: "KeyA", latin: "A", base: "ち" },
    { code: "KeyS", latin: "S", base: "と" },
    { code: "KeyD", latin: "D", base: "し" },
    { code: "KeyF", latin: "F", base: "は" },
    { code: "KeyG", latin: "G", base: "き" },
    { code: "KeyH", latin: "H", base: "く" },
    { code: "KeyJ", latin: "J", base: "ま" },
    { code: "KeyK", latin: "K", base: "の" },
    { code: "KeyL", latin: "L", base: "り" },
    { code: "Semicolon", latin: ";", base: "れ" },
    { code: "Quote", latin: "'", base: "け", shifted: "ろ" },
    { code: "Enter", latin: "return", width: "wide" },
  ],
  [
    { code: "ShiftLeft", latin: "shift", width: "wide" },
    { code: "KeyZ", latin: "Z", base: "つ", shifted: "っ" },
    { code: "KeyX", latin: "X", base: "さ" },
    { code: "KeyC", latin: "C", base: "そ" },
    { code: "KeyV", latin: "V", base: "ひ" },
    { code: "KeyB", latin: "B", base: "こ" },
    { code: "KeyN", latin: "N", base: "み" },
    { code: "KeyM", latin: "M", base: "も" },
    { code: "Comma", latin: ",", base: "ね", shifted: "、" },
    { code: "Period", latin: ".", base: "る", shifted: "。" },
    { code: "Slash", latin: "/", base: "め", shifted: "・" },
    { code: "ShiftRight", latin: "shift", width: "wide" },
  ],
];

const directInputs = new Map<string, { code: string; shift: boolean }>();
for (const row of keyboardRows) {
  for (const key of row) {
    if (key.base && !["\\"].includes(key.base)) {
      directInputs.set(key.base, { code: key.code, shift: false });
    }
    if (key.shifted && !["~", "「", "」", "、", "。", "・"].includes(key.shifted)) {
      directInputs.set(key.shifted, { code: key.code, shift: true });
    }
  }
}

const voicedParts: Record<string, { base: string; mark: "゛" | "゜" }> = {
  が: { base: "か", mark: "゛" }, ぎ: { base: "き", mark: "゛" }, ぐ: { base: "く", mark: "゛" }, げ: { base: "け", mark: "゛" }, ご: { base: "こ", mark: "゛" },
  ざ: { base: "さ", mark: "゛" }, じ: { base: "し", mark: "゛" }, ず: { base: "す", mark: "゛" }, ぜ: { base: "せ", mark: "゛" }, ぞ: { base: "そ", mark: "゛" },
  だ: { base: "た", mark: "゛" }, ぢ: { base: "ち", mark: "゛" }, づ: { base: "つ", mark: "゛" }, で: { base: "て", mark: "゛" }, ど: { base: "と", mark: "゛" },
  ば: { base: "は", mark: "゛" }, び: { base: "ひ", mark: "゛" }, ぶ: { base: "ふ", mark: "゛" }, べ: { base: "へ", mark: "゛" }, ぼ: { base: "ほ", mark: "゛" },
  ぱ: { base: "は", mark: "゜" }, ぴ: { base: "ひ", mark: "゜" }, ぷ: { base: "ふ", mark: "゜" }, ぺ: { base: "へ", mark: "゜" }, ぽ: { base: "ほ", mark: "゜" },
  ゔ: { base: "う", mark: "゛" },
};

const keyName: Record<string, string> = {
  Backquote: "`", Digit1: "1", Digit2: "2", Digit3: "3", Digit4: "4", Digit5: "5", Digit6: "6", Digit7: "7", Digit8: "8", Digit9: "9", Digit0: "0",
  Minus: "-", Equal: "=", KeyQ: "Q", KeyW: "W", KeyE: "E", KeyR: "R", KeyT: "T", KeyY: "Y", KeyU: "U", KeyI: "I", KeyO: "O", KeyP: "P",
  BracketLeft: "[", BracketRight: "]", Backslash: "\\", KeyA: "A", KeyS: "S", KeyD: "D", KeyF: "F", KeyG: "G", KeyH: "H", KeyJ: "J", KeyK: "K", KeyL: "L",
  Semicolon: ";", Quote: "'", KeyZ: "Z", KeyX: "X", KeyC: "C", KeyV: "V", KeyB: "B", KeyN: "N", KeyM: "M", Comma: ",", Period: ".", Slash: "/",
};

function outputForKey(code: string, shift: boolean) {
  const key = keyboardRows.flat().find((item) => item.code === code);
  if (!key) return undefined;
  return shift && key.shifted ? key.shifted : key.base;
}

function randomIndex(previous: number, excluded: readonly number[] = []) {
  if (sentenceBank.length < 2) return 0;
  const blocked = new Set([previous, ...excluded]);
  let next: number;
  do {
    next = Math.floor(Math.random() * sentenceBank.length);
  } while (blocked.has(next) && blocked.size < sentenceBank.length);
  return next;
}

export default function Home() {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [position, setPosition] = useState(0);
  const [pendingBase, setPendingBase] = useState<string | null>(null);
  const [shiftHeld, setShiftHeld] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [showHighlight, setShowHighlight] = useState(true);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [pressedCode, setPressedCode] = useState<string | null>(null);
  const [status, setStatus] = useState<"ready" | "error" | "complete">("ready");
  const completionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionLocked = useRef(false);
  const recentSentences = useRef<number[]>([]);

  const sentence = sentenceBank[sentenceIndex];
  const characters = useMemo(() => Array.from(sentence.reading), [sentence]);
  const target = characters[position];
  const targetParts = target ? voicedParts[target] : undefined;

  const expected = useMemo(() => {
    const kana = pendingBase && targetParts ? targetParts.mark : targetParts?.base ?? target;
    const input = kana ? directInputs.get(kana) : undefined;
    return input ? { ...input, kana } : undefined;
  }, [pendingBase, target, targetParts]);

  const finishCharacter = useCallback(() => {
    setPendingBase(null);
    if (position + 1 < characters.length) {
      setPosition((value) => value + 1);
      return;
    }

    if (transitionLocked.current) return;
    transitionLocked.current = true;
    setPosition(characters.length);
    setStatus("complete");
    completionTimer.current = setTimeout(() => {
      setSentenceIndex((previous) => {
        const next = randomIndex(previous, recentSentences.current);
        recentSentences.current = [previous, ...recentSentences.current].slice(0, 24);
        return next;
      });
      setPosition(0);
      setPendingBase(null);
      setStatus("ready");
      transitionLocked.current = false;
    }, 620);
  }, [characters.length, position]);

  const showError = useCallback((code: string) => {
    setStatus("error");
    setErrorCode(code);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => {
      setStatus("ready");
      setErrorCode(null);
    }, 260);
  }, []);

  useEffect(() => {
    setSentenceIndex((previous) => {
      const next = randomIndex(previous);
      recentSentences.current = [previous];
      return next;
    });
    const storedKeyboard = window.localStorage.getItem("kana-keyboard-visible");
    const storedHighlight = window.localStorage.getItem("kana-highlight-visible");
    if (storedKeyboard !== null) setShowKeyboard(storedKeyboard === "true");
    if (storedHighlight !== null) setShowHighlight(storedHighlight === "true");
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
        setShiftHeld(true);
        setPressedCode(event.code);
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat || status === "complete") return;
      const output = outputForKey(event.code, event.shiftKey);
      if (!output) return;

      event.preventDefault();
      setPressedCode(event.code);

      if (pendingBase && targetParts) {
        if (output === targetParts.mark) finishCharacter();
        else showError(event.code);
        return;
      }

      if (targetParts) {
        if (output === targetParts.base) {
          setPendingBase(targetParts.base);
          setStatus("ready");
        } else {
          showError(event.code);
        }
        return;
      }

      if (output === target) finishCharacter();
      else showError(event.code);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "ShiftLeft" || event.code === "ShiftRight") setShiftHeld(false);
      setPressedCode((current) => current === event.code ? null : current);
    };

    const onBlur = () => {
      setShiftHeld(false);
      setPressedCode(null);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [finishCharacter, pendingBase, showError, status, target, targetParts]);

  useEffect(() => () => {
    if (completionTimer.current) clearTimeout(completionTimer.current);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
  }, []);

  const toggleKeyboard = () => {
    setShowKeyboard((value) => {
      window.localStorage.setItem("kana-keyboard-visible", String(!value));
      return !value;
    });
  };

  const toggleHighlight = () => {
    setShowHighlight((value) => {
      window.localStorage.setItem("kana-highlight-visible", String(!value));
      return !value;
    });
  };

  const expectedLabel = expected ? `${expected.shift ? "⇧ + " : ""}${keyName[expected.code]}` : "—";
  const progress = characters.length ? Math.round((position / characters.length) * 100) : 0;

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#practice" aria-label="かな Key 首页">
          <span className="brand-mark">か</span>
          <span>かな Key</span>
        </a>
        <div className="header-meta">
          <span className="mode-pill">ランダム練習</span>
        </div>
      </header>

      <section id="practice" className={`trainer trainer-${status}`} aria-labelledby="practice-title" aria-live="polite">
        <div className="trainer-topline">
          <span className="eyebrow">かな入力 · RANDOM {String(sentence.id).padStart(5, "0")}</span>
          <span className="progress-label">{progress}%</span>
        </div>
        <div className="progress-track" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>

        <h1 id="practice-title">
          {sentence.tokens.map((token, index) => token.ruby ? (
            <ruby key={`${token.surface}-${index}`}>{token.surface}<rt>{token.reading}</rt></ruby>
          ) : <span key={`${token.surface}-${index}`}>{token.surface}</span>)}
        </h1>

        <p className="reading" aria-label={`输入进度：已完成 ${position} 个，共 ${characters.length} 个`}>
          {characters.map((character, index) => (
            <span
              key={`${character}-${index}`}
              className={index < position ? "done" : index === position ? "cursor" : "remaining"}
            >
              {character}
            </span>
          ))}
        </p>

        <div className="feedback-line">
          {status === "complete" ? (
            <span className="complete-message">できました！</span>
          ) : status === "error" ? (
            <span className="error-message">違うキーです。もう一度。</span>
          ) : pendingBase && targetParts ? (
            <span><b>{pendingBase}</b> に <b>{targetParts.mark}</b> を追加</span>
          ) : null}
        </div>

        {showHighlight && expected && status !== "complete" && (
          <div className="next-hint">
            <span>次のキー</span>
            <kbd>{expectedLabel}</kbd>
            <strong>{expected.kana}</strong>
          </div>
        )}
      </section>

      <section className="controls" aria-label="显示选项">
        <div>
          <h2>キーボードガイド</h2>
          <p>使用美式 Mac 键盘的物理键位</p>
        </div>
        <label className="toggle-label">
          <span>显示键盘</span>
          <input type="checkbox" checked={showKeyboard} onChange={toggleKeyboard} />
          <span className="toggle" aria-hidden="true" />
        </label>
        <label className="toggle-label">
          <span>高亮下一键</span>
          <input type="checkbox" checked={showHighlight} onChange={toggleHighlight} />
          <span className="toggle" aria-hidden="true" />
        </label>
      </section>

      {showKeyboard && (
        <section className="keyboard" aria-label="美式 Mac かな键位图">
          <div className="keyboard-status">
            <span><i className="status-dot" />US キーボード</span>
            <span className={shiftHeld ? "shift-on" : ""}>SHIFT：{shiftHeld ? "ON" : "OFF"}</span>
          </div>
          {keyboardRows.map((row, rowIndex) => (
            <div className="key-row" key={rowIndex}>
              {row.map((key) => {
                const kana = shiftHeld && key.shifted ? key.shifted : key.base;
                const isExpected = showHighlight && expected && (
                  expected.code === key.code || (expected.shift && (key.code === "ShiftLeft" || key.code === "ShiftRight"))
                );
                const classNames = [
                  "key",
                  key.width ? `key-${key.width}` : "",
                  isExpected ? "key-active" : "",
                  pressedCode === key.code ? "key-pressed" : "",
                  errorCode === key.code ? "key-error" : "",
                ].filter(Boolean).join(" ");

                return (
                  <div className={classNames} key={key.code} data-code={key.code}>
                    <span>{key.latin}</span>
                    {kana && <b>{kana}</b>}
                  </div>
                );
              })}
            </div>
          ))}
          <div className="keyboard-legend">
            <span><i className="legend-swatch highlight" />下一键</span>
            <span><i className="legend-swatch pressed" />已按下</span>
            <span>按住 Shift：小假名与特殊字符</span>
          </div>
        </section>
      )}

      <footer>
        <span>句子中的片假名请按平假名读音输入</span>
        <span>只需输入长音符「ー」，其他标点会自动略过</span>
      </footer>
    </main>
  );
}
