export type SentenceToken = {
  surface: string;
  reading: string;
  ruby?: boolean;
};

export type PracticeSentence = {
  id: number;
  tokens: SentenceToken[];
  reading: string;
};

const ruby = (surface: string, reading: string): SentenceToken => ({
  surface,
  reading,
  ruby: true,
});

const plain = (surface: string, reading = surface): SentenceToken => ({
  surface,
  reading,
});

const subjects: SentenceToken[][] = [
  [ruby("私", "わたし")],
  [ruby("兄", "あに")],
  [ruby("姉", "あね")],
  [ruby("母", "はは")],
  [ruby("父", "ちち")],
  [ruby("友達", "ともだち")],
  [ruby("先生", "せんせい")],
  [ruby("学生", "がくせい")],
  [ruby("山田", "やまだ"), plain("さん")],
  [ruby("田中", "たなか"), plain("さん")],
  [ruby("弟", "おとうと")],
  [ruby("妹", "いもうと")],
  [ruby("祖父", "そふ")],
  [ruby("祖母", "そぼ")],
  [ruby("先輩", "せんぱい")],
  [ruby("後輩", "こうはい")],
  [ruby("同級生", "どうきゅうせい")],
  [ruby("木村", "きむら"), plain("さん")],
  [ruby("鈴木", "すずき"), plain("さん")],
  [ruby("佐藤", "さとう"), plain("さん")],
];

const times: SentenceToken[][] = [
  [ruby("今日", "きょう")],
  [ruby("明日", "あした")],
  [ruby("毎朝", "まいあさ")],
  [ruby("午後", "ごご")],
  [ruby("週末", "しゅうまつ")],
  [plain("これから")],
  [ruby("今夜", "こんや")],
  [ruby("毎晩", "まいばん")],
  [ruby("来週", "らいしゅう")],
  [ruby("休", "やす"), plain("みの"), ruby("日", "ひ")],
];

type Activity = {
  polite: SentenceToken[];
  casual: SentenceToken[];
};

const activity = (
  base: SentenceToken[],
  politeEnding: SentenceToken[],
  casualEnding: SentenceToken[],
): Activity => ({
  polite: [...base, ...politeEnding],
  casual: [...base, ...casualEnding],
});

const activities: Activity[] = [
  activity([ruby("学校", "がっこう"), plain("で"), ruby("日本語", "にほんご"), plain("を"), ruby("勉強", "べんきょう")], [plain("します")], [plain("する")]),
  activity([ruby("図書館", "としょかん"), plain("で"), ruby("本", "ほん"), plain("を"), ruby("読", "よ")], [plain("みます")], [plain("む")]),
  activity([ruby("公園", "こうえん"), plain("を"), ruby("散歩", "さんぽ")], [plain("します")], [plain("する")]),
  activity([ruby("家", "いえ"), plain("で"), ruby("音楽", "おんがく"), plain("を"), ruby("聞", "き")], [plain("きます")], [plain("く")]),
  activity([ruby("台所", "だいどころ"), plain("で"), ruby("朝御飯", "あさごはん"), plain("を"), ruby("作", "つく")], [plain("ります")], [plain("る")]),
  activity([plain("カフェ", "かふぇ"), plain("で"), plain("コーヒー", "こーひー"), plain("を"), ruby("飲", "の")], [plain("みます")], [plain("む")]),
  activity([plain("スーパー", "すーぱー"), plain("で"), ruby("野菜", "やさい"), plain("を"), ruby("買", "か")], [plain("います")], [plain("う")]),
  activity([ruby("駅", "えき"), plain("で"), ruby("電車", "でんしゃ"), plain("を"), ruby("待", "ま")], [plain("ちます")], [plain("つ")]),
  activity([ruby("部屋", "へや"), plain("で"), ruby("手紙", "てがみ"), plain("を"), ruby("書", "か")], [plain("きます")], [plain("く")]),
  activity([ruby("庭", "にわ"), plain("で"), ruby("花", "はな"), plain("に"), ruby("水", "みず"), plain("をや")], [plain("ります")], [plain("る")]),
  activity([ruby("海", "うみ"), plain("で"), ruby("写真", "しゃしん"), plain("を"), ruby("撮", "と")], [plain("ります")], [plain("る")]),
  activity([ruby("店", "みせ"), plain("で"), plain("ケーキ", "けーき"), plain("を"), ruby("選", "えら")], [plain("びます")], [plain("ぶ")]),
  activity([ruby("教室", "きょうしつ"), plain("で"), ruby("先生", "せんせい"), plain("の"), ruby("話", "はなし"), plain("を"), ruby("聞", "き")], [plain("きます")], [plain("く")]),
  activity([ruby("食堂", "しょくどう"), plain("で"), plain("ラーメン", "らーめん"), plain("を"), ruby("食", "た")], [plain("べます")], [plain("べる")]),
  activity([plain("ベンチ", "べんち"), plain("で"), plain("ジュース", "じゅーす"), plain("を"), ruby("飲", "の")], [plain("みます")], [plain("む")]),
  activity([ruby("会社", "かいしゃ"), plain("で"), plain("メール", "めーる"), plain("を"), ruby("書", "か")], [plain("きます")], [plain("く")]),
  activity([ruby("台所", "だいどころ"), plain("で"), plain("スープ", "すーぷ"), plain("を"), ruby("温", "あたた")], [plain("めます")], [plain("める")]),
  activity([ruby("玄関", "げんかん"), plain("で"), ruby("靴", "くつ"), plain("を"), ruby("履", "は")], [plain("きます")], [plain("く")]),
  activity([ruby("窓", "まど"), plain("から"), ruby("空", "そら"), plain("を"), ruby("見", "み")], [plain("ます")], [plain("る")]),
  activity([ruby("寝", "ね"), plain("る"), ruby("前", "まえ"), plain("に"), ruby("日記", "にっき"), plain("を"), ruby("書", "か")], [plain("きます")], [plain("く")]),
  activity([ruby("病院", "びょういん"), plain("で"), ruby("薬", "くすり"), plain("を"), ruby("受", "う"), plain("け"), ruby("取", "と")], [plain("ります")], [plain("る")]),
  activity([ruby("郵便局", "ゆうびんきょく"), plain("で"), ruby("荷物", "にもつ"), plain("を"), ruby("送", "おく")], [plain("ります")], [plain("る")]),
  activity([ruby("本屋", "ほんや"), plain("で"), ruby("雑誌", "ざっし"), plain("を"), ruby("買", "か")], [plain("います")], [plain("う")]),
  activity([plain("レストラン", "れすとらん"), plain("で"), plain("パスタ", "ぱすた"), plain("を"), ruby("食", "た")], [plain("べます")], [plain("べる")]),
  activity([ruby("駅前", "えきまえ"), plain("で"), plain("バス", "ばす"), plain("を"), ruby("待", "ま")], [plain("ちます")], [plain("つ")]),
];

const casualTones: SentenceToken[][] = [
  [],
  [plain("よ")],
  [plain("ね")],
  [plain("んだ")],
];

export const sentenceBank: PracticeSentence[] = [];

for (const [subjectIndex, subject] of subjects.entries()) {
  for (const [timeIndex, time] of times.entries()) {
    for (const style of ["polite", "casual"] as const) {
      for (const [activityIndex, currentActivity] of activities.entries()) {
        const activityTokens =
          style === "polite"
            ? currentActivity.polite
            : [
                ...currentActivity.casual,
                ...casualTones[
                  (subjectIndex + timeIndex + activityIndex) % casualTones.length
                ],
              ];
        const tokens = [
          ...subject,
          plain("は"),
          ...time,
          ...activityTokens,
          plain("。", ""),
        ];

        sentenceBank.push({
          id: sentenceBank.length + 1,
          tokens,
          reading: tokens.map((token) => token.reading).join(""),
        });
      }
    }
  }
}
