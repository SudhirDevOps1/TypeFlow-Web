export const COMMON_WORDS = [
  "the","be","to","of","and","a","in","that","have","it","for","not","on","with","he","as","you","do","at","this",
  "but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there","their",
  "what","so","up","out","if","about","who","get","which","go","me","when","make","can","like","time","no","just",
  "him","know","take","people","into","year","your","good","some","could","them","see","other","than","then","now",
  "look","only","come","its","over","think","also","back","after","use","two","how","our","work","first","well","way",
  "even","new","want","because","any","these","give","day","most","us","great","between","need","large","often",
  "hand","high","place","hold","turn","without","follow","act","ask","men","change","went","light","kind","off",
  "need","house","picture","try","again","animal","point","mother","world","near","build","self","earth","father",
  "head","stand","own","page","should","country","found","answer","school","grow","study","still","learn","plant",
  "cover","food","sun","four","between","state","keep","eye","never","last","let","thought","city","tree","cross",
  "farm","hard","start","might","story","saw","far","sea","draw","left","late","run","don","while","press","close",
  "night","real","life","few","north","open","seem","together","next","white","children","begin","got","walk","example",
  "ease","paper","group","always","music","those","both","mark","book","letter","until","mile","river","car","feet",
  "care","second","enough","plain","girl","usual","young","ready","above","ever","red","list","though","feel","talk",
  "bird","soon","body","dog","family","direct","pose","leave","song","measure","door","product","black","short","numeral",
  "class","wind","question","happen","complete","ship","area","half","rock","order","fire","south","problem","piece",
  "told","knew","pass","since","top","whole","king","space","heard","best","hour","better","true","during","hundred"
];

export const MEDIUM_WORDS = [
  "achieve","acquire","address","advance","affairs","against","already","ancient","another","anxiety",
  "anybody","applied","arrange","arrived","aspects","attempt","attract","balance","barrier","battery",
  "because","becomes","benefit","between","browser","building","cabinet","captain","capture","careful",
  "certain","chapter","charged","citizen","claimed","climate","collect","college","command","comment",
  "company","compare","complex","concept","concern","conduct","connect","consent","contact","content",
  "control","correct","council","country","created","current","cutting","decided","declare","defense",
  "deliver","develop","digital","disease","display","dispute","distant","divided","doctors","dynamic",
  "effects","element","emerged","enables","engaged","enhance","entered","example","execute","expands",
  "expects","expense","experts","express","extreme","factors","failure","feature","federal","finance",
  "focused","foreign","forward","freedom","further","general","getting","graphic","greatly","growing",
  "history","honored","however","hundred","impacts","improve","include","initial","insight","instead",
  "install","involve","journey","justice","keeping","kingdom","knowing","largely","leading","learned",
  "limited","machine","managed","medical","message","minimum","missing","mission","network","nothing",
  "noticed","objects","obvious","offense","operate","opinion","options","outside","payment","perform",
  "perhaps","picture","popular","primary","privacy","process","product","program","protect","provide",
  "purpose","quality","quickly","reading","reality","receive","related","release","remains","require",
  "respond","results","returns","revenue","revised","running","section","service","setting","several",
  "silicon","similar","society","special","started","storage","studies","subject","suggest","support",
  "surface","thought","through","towards","trigger","typical","unified","updated","vaccine","various",
  "virtual","website","whether","without","working","writing","written","brought","through","company"
];

export const HARD_WORDS = [
  "acknowledgment","administration","authentication","championship","collaboration","communication",
  "concatenation","consideration","cryptography","cybersecurity","determination","documentation",
  "entrepreneurship","environmental","establishment","functionality","globalization","identification",
  "implementation","infrastructure","initialization","interconnected","investigation","jurisdiction",
  "manufacturing","modernization","multilayered","organization","prioritization","quantification",
  "representation","responsibilities","specification","transformation","uncomfortable","understanding",
  "virtualization","vulnerability","abbreviation","acceleration","accomplishment","accountability",
  "categorization","characteristics","circumstances","classification","complications","comprehensive",
  "configuration","consequences","constitutional","contamination","controversial","customization",
  "decentralized","decomposition","demonstration","dependencies","deterioration","differentiation",
  "disappointment","discrimination","disorganization","electromagnetic","entertainment","exaggeration",
  "experimentation","extraordinary","generalization","geopolitical","hospitalization","humanitarian",
  "hypothetical","incompatibility","independence","individualization","industrialization","inefficiency",
  "interpretation","interoperability","investigation","legitimization","liberalization","linearization",
  "macroeconomics","manifestation","materialization","memorization","microprocessor","misconception",
  "misrepresentation","multiplication","neutralization","normalization","objectification","optimization",
  "parameterization","parliamentary","participation","personalization","philosophical","photosynthesis",
  "privatization","probabilistic","professionalism","proportional","psychological","quantitative",
  "rationalization","recommendation","regularization","rehabilitation","reinforcement","representation",
  "responsibilities","revolutionize","semiconductor","socialization","specialization","standardization",
  "stratification","subcategorization","synchronization","systematization","technological","telecommunications"
];

export const CODE_SNIPPETS = [
  `const hello = () => console.log("Hello World!");`,
  `function add(a, b) { return a + b; }`,
  `const arr = [1, 2, 3].map(x => x * 2);`,
  `if (user.isLoggedIn) { redirect("/dashboard"); }`,
  `const fetch = async (url) => await axios.get(url);`,
  `class Animal { constructor(name) { this.name = name; } }`,
  `const sum = arr.reduce((acc, val) => acc + val, 0);`,
  `import React, { useState, useEffect } from "react";`,
  `const [count, setCount] = useState(0);`,
  `useEffect(() => { document.title = count; }, [count]);`,
  `const sorted = [...arr].sort((a,b) => a - b);`,
  `export default function App() { return <div />; }`,
  `const obj = { name: "Alice", age: 25, role: "dev" };`,
  `type Props = { title: string; count: number; };`,
  `interface User { id: number; email: string; name: string; }`,
  `const filtered = users.filter(u => u.age > 18);`,
  `try { await db.connect(); } catch(e) { console.error(e); }`,
  `const hash = crypto.createHash("sha256").update(data);`,
  `router.get("/users", authenticate, async (req, res) => {});`,
  `SELECT * FROM users WHERE active = true ORDER BY name;`,
];

export const QUOTES = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "In the middle of every difficulty lies opportunity. - Albert Einstein",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Churchill",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Strive not to be a success, but rather to be of value. - Albert Einstein",
  "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
  "Do not go where the path may lead, go instead where there is no path and leave a trail.",
  "You miss one hundred percent of the shots you do not take. - Wayne Gretzky",
  "Whether you think you can or you think you cannot, you are right. - Henry Ford",
  "The best time to plant a tree was twenty years ago. The second best time is now.",
  "An unexamined life is not worth living. - Socrates",
  "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
  "When you reach the end of your rope, tie a knot in it and hang on. - Franklin D. Roosevelt",
  "Always remember that you are absolutely unique. Just like everyone else. - Margaret Mead",
];

export const LESSONS: {
  id: number;
  title: string;
  subtitle: string;
  keys: string;
  icon: string;
  color: string;
  text: string[];
  description: string;
}[] = [
  {
    id: 1, title: "Home Row", subtitle: "The Foundation",
    icon: "🏠", color: "#00f5c4",
    keys: "asdfghjkl;",
    description: "Master the home row — your fingers rest here. This is where 70% of typing happens.",
    text: [
      "aaa sss ddd fff ggg hhh jjj kkk lll",
      "asdf jkl; asdf jkl; asdf jkl;",
      "fall hall sall dad fad had sad glad",
      "flash flask salad glass shall falls",
      "a sad lad had a flag; a glad lass shall fall",
      "asdfghjkl asdfghjkl all halls fall shall",
    ]
  },
  {
    id: 2, title: "Top Row", subtitle: "QWERTY Zone",
    icon: "⬆️", color: "#7c3aed",
    keys: "qwertyuiop",
    description: "Learn the top row keys. Combined with home row you can type most words.",
    text: [
      "qqq www eee rrr ttt yyy uuu iii ooo ppp",
      "qwer tyui op qwer tyui op",
      "tower power quiet write poetry",
      "your type write quote proper every",
      "the quiet tower wrote poetry every week",
      "write proper quotes to improve your typing",
    ]
  },
  {
    id: 3, title: "Bottom Row", subtitle: "Z to M",
    icon: "⬇️", color: "#f59e0b",
    keys: "zxcvbnm,.",
    description: "Complete your keyboard knowledge with the bottom row.",
    text: [
      "zzz xxx ccc vvv bbb nnn mmm",
      "zxcv bnm, zxcv bnm,",
      "move zinc vibe calm bench",
      "combine vibrant maximum zinc calm",
      "the calm zen vibe became maximum comfort",
      "combine zinc vibrant calm maximum bench",
    ]
  },
  {
    id: 4, title: "Numbers Row", subtitle: "1 through 0",
    icon: "🔢", color: "#ef4444",
    keys: "1234567890",
    description: "Numbers at the top — essential for data entry and coding.",
    text: [
      "1 2 3 4 5 6 7 8 9 0",
      "123 456 789 0 123 456",
      "the 3 cats ate 12 fish in 2024",
      "code 404 error on port 3000",
      "call 1800 555 1234 for support",
      "version 2.0 has 150 new features in 2024",
    ]
  },
  {
    id: 5, title: "Capital Letters", subtitle: "Shift Key Mastery",
    icon: "🔠", color: "#00f5c4",
    keys: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    description: "Learn to use Shift smoothly for capitals without looking.",
    text: [
      "Apple Banana Cherry Dragon Eagle",
      "The Quick Brown Fox Jumps Over",
      "Hello World My Name Is TypeFlow",
      "New York London Tokyo Paris Rome",
      "React TypeScript JavaScript Python",
      "The President Visited New York City Today",
    ]
  },
  {
    id: 6, title: "Punctuation", subtitle: "Pro Finishing Touch",
    icon: "✏️", color: "#7c3aed",
    keys: ".,;:!?'\"-",
    description: "Proper punctuation separates amateurs from professionals.",
    text: [
      "Hello, world! How are you?",
      "Wait; don't go yet. Please stay.",
      "It's a great day: sunny, warm, perfect.",
      `He said, "Hello!" and she replied, "Hi!"`,
      "Items: apples, bananas, oranges, and grapes.",
      "Really? Yes! I'm sure. Let's go, now!",
    ]
  },
  {
    id: 7, title: "Common Bigrams", subtitle: "Speed Patterns",
    icon: "⚡", color: "#f59e0b",
    keys: "th he in er an re on at",
    description: "Train on the most common 2-letter combinations to build muscle memory.",
    text: [
      "the there then these them they",
      "here her him his have has he",
      "in into it is its if ill inn",
      "and any an are all as at also",
      "other another either mother gather",
      "the other things are better than before",
    ]
  },
  {
    id: 8, title: "Special Characters", subtitle: "Coder's Keys",
    icon: "💻", color: "#00f5c4",
    keys: "!@#$%^&*()_+-=[]{}|;':\",./<>?",
    description: "Master special characters — essential for programming and professional work.",
    text: [
      "user@email.com https://example.com",
      "const x = 10; let y = x * 2 + 5;",
      "if (a > b) { return a - b; }",
      "// TODO: fix this #bug @priority-high",
      "price = $99.99 * (1 - 0.20%);",
      `{ "key": "value", "arr": [1, 2, 3] }`,
    ]
  },
  {
    id: 9, title: "Speed Builder", subtitle: "300+ WPM Path",
    icon: "🚀", color: "#7c3aed",
    keys: "all",
    description: "Advanced speed drills using full sentences. Push your limits!",
    text: [
      "the quick brown fox jumps over the lazy dog",
      "pack my box with five dozen liquor jugs",
      "how vexingly quick daft zebras jump",
      "the five boxing wizards jump quickly",
      "bright vixens jump dozing fowl quack",
      "jackdaws love my big sphinx of quartz",
    ]
  },
  {
    id: 10, title: "Master Test", subtitle: "Final Exam",
    icon: "🏆", color: "#f59e0b",
    keys: "all",
    description: "The ultimate test combining everything you have learned. Prove your mastery!",
    text: [
      "Programming requires precision, patience, and practice.",
      "Type accurately at first; speed will follow naturally.",
      "Every expert was once a beginner who refused to quit.",
      "JavaScript, Python, and Rust are popular languages in 2024.",
      "The keyboard is your instrument; make beautiful music with it.",
      "Mastery takes 10,000 hours — start your journey today!",
    ]
  },
];

export function getRandomWords(count: number, difficulty: "easy" | "medium" | "hard" = "easy"): string {
  const pool = difficulty === "easy" ? COMMON_WORDS : difficulty === "medium" ? MEDIUM_WORDS : HARD_WORDS;
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return words.join(" ");
}

export function getDailyChallenge(): string {
  const idx = Math.floor(Date.now() / 86400000) % QUOTES.length;
  return QUOTES[idx];
}
