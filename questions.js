// questions.js
const questions = [

{
  id: 1,
  section: "Vocabulary",
  instruction: "Look at the illustration and choose the correct word.",
  image: "Q1.png",
  options: ["かわい", "かわいい", "かたい"],
  answer: 1,
  marks: 4
},
{
  id: 2,
  section: "Vocabulary",
  instruction: "Look at the illustration and choose the correct word.",
  image: "Q2.png",
  options: ["魚", "鳥", "エビ"],
  answer: 2,
  marks: 4
},
{
  id: 3,
  section: "Vocabulary",
  instruction: "Look at the illustration and choose the correct word.",
  image: "Q3.png",
  options: ["シャツ", "スーツ", "ジャケット"],
  answer: 1,
  marks: 4
},
{
  id: 4,
  section: "Vocabulary",
  instruction: "Read the sentence and choose the word that fits in ( ) the most.",
  subtitle: "Choose the correct one.",
  question: "毎日_________を読みます。",
  options: ["本", "来", "木"],
  answer: 0,
  marks: 4
},
{
  id: 5,
  section: "Grammar",
  instruction: "Read the sentence and choose the word that fits in ( ) the most.",
  question: "この機械の使い方を__________くれませんか？",
  options: ["教えて", "覚えて", "忘れて"],
  answer: 0,
  marks: 4
},
{
  id: 6,
  section: "Grammar",
  instruction: "Read the sentence and choose the word that fits in ( ) the most.",
  question: "A : 工場では、_________仕事をしていますか？<br>B : ぶひんをチェックしています。",
  options: ["そんな", "どんな", "こんな"],
  answer: 1,
  marks: 4
},
{
  id: 7,
  section: "Grammar",
  instruction: "Read the sentence and choose the word that fits in ( ) the most.",
  question: "割れたので、このグラスはごみ箱に（　　　）ください。",
  options: ["置いて", "捨てて", "つけて"],
  answer: 1,
  marks: 4
},
{
  id: 8,
  section: "Grammar",
  instruction: "How do you write the underlined kanji word in hiragana?",
  subtitle: "Choose the correct one.",
  question: "<span style='text-decoration:underline;'>先週</span>、日本に来たばかりです。",
  options: ["せんしゅう", "こんしゅう", "らいしゅう"],
  answer: 0,
  marks: 4
},
{
  id: 9,
  section: "Grammar",
  instruction: "How do you write the underlined kanji word in hiragana?",
  subtitle: "Choose the correct one.",
  question: "やっと試験に<span style='text-decoration:underline;'>合格</span>しました。",
  options: ["こうかく", "ごうがく", "ごうかく"],
  answer: 2,
  marks: 4
},
{
  id: 10,
  section: "Grammar",
  instruction: "How do you write the underlined kanji word in hiragana?",
  subtitle: "Choose the correct one.",
  question: "この町は<span style='text-decoration:underline;'>自然</span>がきれいな町です。",
  options: ["じせん", "しせん", "しぜん"],
  answer: 2,
  marks: 4
},
{
  id: 11,
  section: "Grammar",
  instruction: "How do you write the underlined kanji word in hiragana?",
  subtitle: "Choose the correct one.",
  question: "先生に日本語を<span style='text-decoration:underline;'>習います</span>。",
  options: ["ならいます", "おしえます", "れんしゅうします"],
  answer: 0,
  marks: 4
},
{
  id: 12,
  section: "Grammar",
  instruction: "Read the sentence and choose the word that fits in ( ) the most.",
  question: "こののみものは（　　　）そうです。",
  options: ["おいし", "おいしく", "おいしかった"],
  answer: 0,
  marks: 5
},
{
  id: 13,
  section: "Expression",
  instruction: "Read the dialog and choose the phrase that fits the most.",
  subtitle: "",
  type: "dialog",
  dialog: `
A :トイレはどこですか。<br>
B : 玄関の_____です。
`,
  options: [
    "あいだ",
    "うしろ",
    "よこ"
  ],
  answer: 2,
  marks: 5
},
{
  id: 14,
  section: "Expression",
  instruction: "Read the dialog and choose the phrase that fits the most.",
  subtitle: "",
  type: "dialog",
  dialog: `
A：日曜日に何をしましたか。<br>
B：仕事しました。とても………………。<br>
`,
  options: [
    "いそがしいです",
    "いそがしかったです",
    "ひまでした"
  ],
  answer: 1,
  marks: 5
},
{
  id: 15,
  section: "Expression",
  instruction: "Read the dialog and choose the phrase that fits the most.",
  subtitle: "",
  type: "dialog",
  dialog: `
A：すみません！この自転車を………………。<br>
　　本屋へ行きたいです。<br>
B：ええ、どうぞ。
`,
  options: [
    "買ってもいいですか",
    "借りてもいいですか",
    "貸してもいいですか"
  ],
  answer: 1,
  marks: 5
},
{
  id: 16,
  section: "Expression",
  instruction: "Read the dialog and choose the phrase that fits the most.",
  subtitle: "",
  type: "dialog",
  dialog: `
A：先週からずっと雨降っていますね。<br>
B：そうですね。せんたくが全然できてませんね！<br>
A：…………………………。
`,
  options: [
    "うれしいですね",
    "いやになりますね",
    "おげんきになりますね"
  ],
  answer: 1,
  marks: 5
},
{
  id: 17,
  section: "Expression",
  instruction: "Read the dialog and choose the phrase that fits the most.",
  subtitle: "",
  type: "dialog",
  dialog: `
A：あのう、すみません。タイ料理のお店知っていますか。<br>
B：はい、光公園にありますよ。<br>
A：何時に………………わかりますか。<br>
B：10時ごろだと思います。<br>
A：ありがとうございます。
`,
  options: [
    "終わるか",
    "開くか",
    "出来るか"
  ],
  answer: 1,
  marks: 5
},
{
  id: 18,
  section: "Expression",
  instruction: "Read the dialog and choose the phrase that fits the most.",
  subtitle: "",
  type: "dialog",
  dialog: `
A：ああー、暑いですね！<br>
B：そうですね。あ！のどがかわきました。<br>
A：ちょっと！びじゅつかんの中で………………！だめなんです。
`,
  options: [
    "流さないで",
    "食べないで",
    "飲まないで"
  ],
  answer: 2,
  marks: 5
},
{
  id: 19,
  section: "Expression",
  instruction: "Read the dialog and choose the phrase that fits the most.",
  subtitle: "",
  type: "dialog",
  dialog: `
A：アグスです、インドネシアから来ました。<br>
B：かっこいい名前ですね。………………。<br>
A：インドネシアでは、「8月に生まれた子」という意味があります。
`,
  options: [
    "何か意味ありますか",
    "何か書いてますか",
    "何と言いますか"
  ],
  answer: 0,
  marks: 5
},
{
  id: 20,
  section: "Expression",
  instruction: "Read the dialog and choose the phrase that fits the most.",
  subtitle: "",
  type: "dialog",
  dialog: `
A：しょうらい、会社をやめてから、何をしますか。<br>
B：自分の会社を作ろうと思っています。<br>
………………今、貯金しています。
`,
  options: [
    "このために",
    "そのために",
    "あのために"
  ],
  answer: 1,
  marks: 5
},
{
  id: 21,
  section: "Expression",
  instruction: "Read the dialog and choose the phrase that fits the most.",
  subtitle: "",
  type: "dialog",
  dialog: `
A：Bさん、辛い料理が好きですか。<br>
B：はい、好きです。………………カレーとか、キムチとか。<br>
A：私もキムチが好きです。
`,
  options: [
    "いろいろ",
    "たとえば",
    "ですから"
  ],
  answer: 1,
  marks: 5
},
{
  id: 22,
  section: "Expression",
  instruction: "Read the dialog and choose the phrase that fits the most.",
  subtitle: "",
  type: "dialog",
  dialog: `
A：日曜日に、映画を見ましょうか。<br>
B：すみません、日曜日は………………。
`,
  options: [
    "あまり",
    "すこし",
    "ちょっと"
  ],
  answer: 2,
  marks: 5
},
{
  id: 23,
  section: "Expression",
  instruction: "Read the dialog and choose the phrase that fits the most.",
  subtitle: "",
  type: "dialog",
  dialog: `
A：じゅうどうはどうですか。<br>
B：じゅうどうは難しいです。まだ………………。<br>
A：そうなんですか。<br>
B：でも、いつも練習しています。上手になりたいです。
`,
  options: [
    "食べたばかりです",
    "買ったばかりです",
    "始めたばかりです"
  ],
  answer: 2,
  marks: 5
},
{
  id: 24,
  section: "Expression",
  instruction: "Read the dialog and choose the phrase that fits the most.",
  subtitle: "",
  type: "dialog",
  dialog: `
A：新しい仕事はどうですか。<br>
B：大変ですよ。………………毎日頑張っています。
`,
  options: [
    "が",
    "けど",
    "でも"
  ],
  answer: 2,
  marks: 5
},
{
  id: 25,
  section: "Listening",
  question: "キムラさんはどこにいますか。",
  audio: "L1.mp3",
  options: [
    { image: "L11.png" },
    { image: "L12.png" },
    { image: "L13.png" }
  ],
  answer: 1,
  marks: 5
},
{
  id: 26,
  section: "Listening",
  question: "日本で女性の弱点はどこですか。",
  audio: "L2.mp3",
  options: [
    { image: "L21.png" },
    { image: "L22.png" },
    { image: "L23.png" }
  ],
  answer: 0,
  marks: 5
},
{
  id: 27,
  section: "Listening",
  question: "新年休暇後、女性はどんなことができるでしょうか。",
  audio: "L6.mp3",
  options: [
    { image: "L31.png" },
    { image: "L32.png" },
    { image: "L33.png" }
  ],
  answer: 1,
  marks: 5
},
{
  id: 28,
  section: "Listening",
  question: "ぼうしはいくらですか。",
  audio: "L4.mp3",
  options: [
   "1500円",
    "1900円",
    "2000円"
  ],
  answer: 1,
  marks: 5
},
{
  id: 29,
  section: "Listening",
  question: "女性はどんな食べ物を注文しますか？",
  audio: "L5.mp3",
  options: [
    { image: "L51.png" },
    { image: "L52.png" },
    { image: "L53.png" }
  ],
  answer: 2,
  marks: 5
},
{
  id: 30,
  section: "Listening",
  question: "病院に行く前にお客様が最初にすることは何ですか?",
  audio: "L6.mp3",
  options: [
    { image: "L61.png" },
    { image: "L62.png" },
    { image: "L63.png" }
  ],
  answer: 0,
  marks: 5
},
{
  type: "double",
  id: "31",
  section: "Listening",
  question: "Listen the audio and answer the following questions?",
  audio: "L6.mp3",
  parts: [

    {
      title: "(a) 宅配業者はどの階に荷物を配達しますか？",
      options: [
                "1階",
                "4階",
                "7階"
      ],
      answer: 1,
      marks: 6
    },

    {
      title: "(b) 何箱持って行きますか。",
      options:[
        "一つ",
        "二つ",
        "三つ"
      ],
      answer: 0,
      marks:5
    }

  ]
},
{
  type: "double",
  id: "32-33",
  section: "Listening",
  question: "次の会話を聞いて、質問に答えてください。",
  audio: "L8.mp3",
  parts: [
    {
      title: "(a) フリーマーケットはいつ始まりますか？",
      options: [
        "3月21日" ,
        "4月21日" ,
        "5月23日" 
      ],
      answer: 1,
      marks: 6
    },
    {
      title: "(b) 二人は何時にマーケットに行きますか。",
      options: [
        "2時ごろ",
        "4時ごろ",
        "10時ごろ"
      ],
      answer: 2,
      marks: 6
    }
  ]
},
{
  type: "double",
  id: "34-35",
  section: "Listening",
  question: "次の会話を聞いて、質問に答えてください。",
  audio: "L9.mp3",
  parts: [
    {
      title: "(a)  鶏肉は揚げる前に何をするのですか?",
      options: [
        "さとうを混ぜる",
        "塩をつける",
        "チョコレートを入れる"
             ],
      answer: 1,
      marks: 6
    },
    {
      title: "(b)鶏肉の正しい作り方はどれですか。",
      options: [
        { image: "L91b.png" },
        { image: "L92b.png" },
        { image: "L93b.png" }
      ],
      answer: 0,
      marks: 6
    }
  ]
},
{
  type: "double",
  id: "36-37",
  section: "Reading",
  question: "Read the Passage and Answer the Following Questions",
  passage: `私は先週、家族といっしょに旅行に行きました。
土曜日の夜、車で出かけました。
夜だったので、道はすこし暗かったですが、車はあまり多くありませんでした。

山の道を通ったとき、きれいな星がたくさん見えました。
とてもしずかで、空気もきれいでした。
家族と話しながら、楽しくドライブしました。

山道を通ってから、町につきました。
すると、空に大きな花火が見えました。
赤や青の花火がとてもきれいでした。
町に多くの人たちが外に出て、花火を見ていました。

家族といっしょに見た花火は、忘れられない思い出です。
とても楽しい旅行でした。`,
  parts: [
    {
      title: "(a) 旅行はどうやって行きますか。",
      options: [
        "自転車で",
        "車で",
        "歩いて"
      ],
      answer: 1,
      marks: 6
    },
    {
      title: "(b) 山の道を通った後何を見ましたか。",
      options: [
        "にぎやかな町",
        "しずかな町",
        "いなか"
      ],
      answer: 0,
      marks: 6
    }
  ]
},
{
  type: "double",
  id: "38-39",
  section: "Reading",
  question: "Read the Passage and Answer the Following Questions",
  passage: `私は昨日、3月21日に国へ帰りました。
ひさしぶりの国だったので、とてもうれしかったです。

空港に着くと、家族がむかえに来てくれました。
みんなの顔を見て、安心しました。

夜、家族といっしょに食事をしました。
母が料理を作ってくれて、とてもおいしかったです。
食事をしながら、旅行の話をしました。

家族といっしょにすごした時間は、とても楽しかったです。
昨日は、忘れられない一日です。`,
  parts: [
    {
      title: "(a) いつ国へ帰りましたか。",
      options: [
        "3月20日",
        "3月21日",
        "3月22日"
      ],
      answer: 1,
      marks: 7
    },
    {
      title: "(b) 昨日楽しかったことは何ですか。",
      options: [
        "話し合いしたこと",
        "旅行したこと",
        "寝れたこと"
      ],
      answer: 0,
      marks: 6
    }
  ]
},
{
  type: "double",
  id: "40-41",
  section: "Reading",
  question: "Read the Passage and Answer the Following Questions",
  passage: `今日は、町の人たちといっしょに海岸を掃除しました。
どうして海岸を掃除しますか。
海岸には、ガラスやプラスチックなどのごみがたくさんあって、あぶないからです。

朝九時から掃除を始めました。
みんなでごみを拾って、分別しました。
とてもつかれましたが、海岸がきれいになって、うれしかったです。

掃除がおわったあと、友だちといっしょに公園へ行きました。
そこで、ゲームをして遊びました。
とても楽しい一日でした。`,
  parts: [
    {
      title: "(a) どうして海岸を掃除しましたか。",
      options: [
        "あぶなくないから",
        "ゴミがないから",
        "ごみ合ってあぶないから"
      ],
      answer: 2,
      marks: 7
    },
    {
      title: "(b) 掃除がおわったあと、どこへ行きましたか。",
      options: [
        "海行きました",
        "うち帰りました",
        "公園でゲームした"
      ],
      answer: 2,
      marks: 7
    }
  ]
},
{
  type: "double",
  id: "42-43",
  section: "Reading",
  question: "Read the Passage and Answer the Following Questions",
  passage: `5月3日

私の仕事先はスーパーマーケットです。
日曜日は午後2時までですが、他の日は午後6時までです。

今は休み中です。
あと2日間です。
一週間ぐらいの休みです。

友だちと出かけたり、家で映画を見たりして、休みを楽しんでいます。`,
  parts: [
    {
      title: "(a) 日曜日は何時に仕事終わりますか。",
      options: [
        "2時",
        "4時",
        "6時"
      ],
      answer: 0,
      marks: 7
    },
    {
      title: "(b) 休みはいつまでですか。",
      options: [
        "5月2日",
        "5月3日",
        "5月5日"
      ],
      answer: 2,
      marks: 6
    }
  ]
},
{
  type: "double",
  id: "44-45",
  section: "Reading",
  question: "Read the Passage and Answer the Following Questions",
  passage: `私の国では、六月から八月まで夏です。
その中で一番暑いのは七月と八月です。

夏の時、とても暑い日がつづくと、すごく暑くて、頭が痛くなります。
だから、ぼうしをかぶって、水をたくさん飲みます。`,
  parts: [
    {
      title: "(a) 夏で一番暑いのはいつですか。",
      options: [
        "六月と七月",
        "七月と八月",
        "六月と八月"
      ],
      answer: 1,
      marks: 6
    },
    {
      title: "(b) 夏の時何が痛くなりますか。",
      options: [
        "お腹",
        "顔",
        "頭"
      ],
      answer: 2,
      marks: 6
    }
  ]
},
{
  type: "double",
  id: "46-47",
  section: "Reading",
  question: "Read the Passage and Answer the Following Questions",
  passage: `家族で日帰り旅行をするとき、私たちは家族の車で行くことが多いです。
時々、ツアーバスに乗って行くこともあります。

車は自由に運転できて、好きな時間に動けます。
バスの場合は時間が決まっていて、朝出発して夕方帰るという決まりがあります。

バスの料金も年齢によってそれぞれ違います。

小学生：1500円
中学生以上：3000円
65歳以上：2800円`,
  parts: [
    {
      title: "(a) ツアーバスはどんなバスですか。",
      options: [
        "自由に動けるバス",
        "朝出発して夜帰るバス",
        "自由に出発して夜帰るバス"
      ],
      answer: 1,
      marks: 6
    },
    {
      title: "(b) バスの料金はどんなことで違ってますか。",
      options: [
        "場所のことで",
        "学生のことで",
        "年齢のことで"
      ],
      answer: 2,
      marks: 6
    }
  ]
}
]
