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
];

const times: SentenceToken[] = [
  ruby("今日", "きょう"),
  ruby("明日", "あした"),
  ruby("毎朝", "まいあさ"),
  ruby("午後", "ごご"),
  ruby("週末", "しゅうまつ"),
];

const activities: SentenceToken[][] = [
  [ruby("学校", "がっこう"), plain("で"), ruby("日本語", "にほんご"), plain("を"), ruby("勉強", "べんきょう"), plain("します")],
  [ruby("図書館", "としょかん"), plain("で"), ruby("本", "ほん"), plain("を"), ruby("読", "よ"), plain("みます")],
  [ruby("公園", "こうえん"), plain("を"), ruby("散歩", "さんぽ"), plain("します")],
  [ruby("家", "いえ"), plain("で"), ruby("音楽", "おんがく"), plain("を"), ruby("聞", "き"), plain("きます")],
  [ruby("台所", "だいどころ"), plain("で"), ruby("朝御飯", "あさごはん"), plain("を"), ruby("作", "つく"), plain("ります")],
  [plain("カフェ", "かふぇ"), plain("で"), plain("コーヒー", "こーひー"), plain("を"), ruby("飲", "の"), plain("みます")],
  [plain("スーパー", "すーぱー"), plain("で"), ruby("野菜", "やさい"), plain("を"), ruby("買", "か"), plain("います")],
  [ruby("駅", "えき"), plain("で"), ruby("電車", "でんしゃ"), plain("を"), ruby("待", "ま"), plain("ちます")],
  [ruby("部屋", "へや"), plain("で"), ruby("手紙", "てがみ"), plain("を"), ruby("書", "か"), plain("きます")],
  [ruby("庭", "にわ"), plain("で"), ruby("花", "はな"), plain("に"), ruby("水", "みず"), plain("をやります")],
  [ruby("海", "うみ"), plain("で"), ruby("写真", "しゃしん"), plain("を"), ruby("撮", "と"), plain("ります")],
  [ruby("店", "みせ"), plain("で"), plain("ケーキ", "けーき"), plain("を"), ruby("選", "えら"), plain("びます")],
  [ruby("教室", "きょうしつ"), plain("で"), ruby("先生", "せんせい"), plain("の"), ruby("話", "はなし"), plain("を"), ruby("聞", "き"), plain("きます")],
  [ruby("食堂", "しょくどう"), plain("で"), plain("ラーメン", "らーめん"), plain("を"), ruby("食", "た"), plain("べます")],
  [plain("ベンチ", "べんち"), plain("で"), plain("ジュース", "じゅーす"), plain("を"), ruby("飲", "の"), plain("みます")],
  [ruby("会社", "かいしゃ"), plain("で"), plain("メール", "めーる"), plain("を"), ruby("書", "か"), plain("きます")],
  [ruby("台所", "だいどころ"), plain("で"), plain("スープ", "すーぷ"), plain("を"), ruby("温", "あたた"), plain("めます")],
  [ruby("玄関", "げんかん"), plain("で"), ruby("靴", "くつ"), plain("を"), ruby("履", "は"), plain("きます")],
  [ruby("窓", "まど"), plain("から"), ruby("空", "そら"), plain("を"), ruby("見", "み"), plain("ます")],
  [ruby("寝", "ね"), plain("る"), ruby("前", "まえ"), plain("に"), ruby("日記", "にっき"), plain("を"), ruby("書", "か"), plain("きます")],
];

export const sentenceBank: PracticeSentence[] = [];

for (const subject of subjects) {
  for (const time of times) {
    for (const activity of activities) {
      const tokens = [
        ...subject,
        plain("は"),
        time,
        ...activity,
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
