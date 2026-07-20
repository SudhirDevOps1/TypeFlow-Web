export type LessonCategory =
  | "Home Row (1-20)"
  | "Top Row (21-40)"
  | "Bottom Row (41-60)"
  | "Numbers & Shift (61-80)"
  | "Mastery & Code (81-104)"
  | "Hindi & Bilingual (105-140)"
  | "Expert Gates (141-185)";

export type LevelDef = {
  id: number;
  category: LessonCategory;
  title: string;
  subtitle: string;
  keys: string;
  icon: string;
  color: string;
  description: string;
  text: string[];
};

function block(
  startId: number,
  category: LessonCategory,
  icon: string,
  color: string,
  defs: { title: string; subtitle: string; keys: string; description: string; text: string[] }[]
) {
  return defs.map((d, i) => ({
    id: startId + i,
    category,
    title: `Level ${startId + i}: ${d.title}`,
    subtitle: d.subtitle,
    keys: d.keys,
    icon,
    color,
    description: d.description,
    text: d.text,
  }));
}

function repeatLines(seed: string[]) {
  return [...seed];
}

function generateLevels(): LevelDef[] {
  const levels: LevelDef[] = [];

  // 1-20 Home Row
  levels.push(
    ...block(1, "Home Row (1-20)", "🏠", "#00f5c4", [
      { title: "Left Index (F & G)", subtitle: "Focus keys: fg", keys: "fg", description: "Build clean left-index rhythm.", text: repeatLines(["fff ggg fg fg fg", "gag fig gig gag fig", "flag golf gift fig gag", "a flag fell if a fig did", "good finger rhythm grows fast"]) },
      { title: "Right Index (H & J)", subtitle: "Focus keys: hj", keys: "hj", description: "Right-index anchor practice.", text: repeatLines(["hhh jjj hj hj hj", "had jag hag jah had", "jagged hajj haha haha", "a jolly judge had a hat", "high hand jumps help"]) },
      { title: "Middle Fingers (D & K)", subtitle: "Focus keys: dk", keys: "dk", description: "Middle finger control and reach.", text: repeatLines(["ddd kkk dk kd dk", "kid did disk skid kid", "a kid did a dark task", "desk kid skid dark", "keep dark keys clean"]) },
      { title: "Ring Fingers (S & L)", subtitle: "Focus keys: sl", keys: "sl", description: "Ring finger balance.", text: repeatLines(["sss lll sl ls sl", "lass sall sill sell", "small glass still lasts", "a sly lass sells glass", "slow skill lasts long"]) },
      { title: "Pinkies (A & ;)", subtitle: "Focus keys: a ;", keys: "a;", description: "Pinky strength on home anchors.", text: repeatLines(["aaa ;;; a; ;a a;", "a;a ;a; aaa ;;;", "a salad; a hall;", "a sad lass; a glad dad;", "aim at accurate anchors;"]) },
      { title: "Left Hand Flow", subtitle: "Keys: asdfg", keys: "asdfg", description: "Blend all left home-row fingers.", text: repeatLines(["asdfg asdfg asdfg", "dad adds gas as a fad", "a glad dad adds a flag", "safe glass adds shade", "good left hand flow grows"]) },
      { title: "Right Hand Flow", subtitle: "Keys: hjkl;", keys: "hjkl;", description: "Blend right home-row control.", text: repeatLines(["hjkl; hjkl; hjkl;", "hall shall dash all", "jkl; jkl; hall shall", "a hall shall hold all", "right hand stays relaxed"]) },
      { title: "Full Home Row Words I", subtitle: "Keys: asdfghjkl;", keys: "asdfghjkl;", description: "First real home-row word clusters.", text: repeatLines(["dad glad had fall hall", "glass shall dash all", "a sad lad had a flag", "glad halls had safe glass", "home row control is gold"]) },
      { title: "Full Home Row Words II", subtitle: "Keys: asdfghjkl;", keys: "asdfghjkl;", description: "Longer combinations without leaving home row.", text: repeatLines(["flash flask salad glass", "shall fall sad lads", "half a glass shall fall", "a glad lass had a flask", "stay light and steady"]) },
      { title: "Home Row Sentence I", subtitle: "Rhythm sentence", keys: "asdfghjkl;", description: "Link words into smooth phrases.", text: repeatLines(["a sad dad had a glad lass", "all glad lads shall fall", "a glass flask had salad", "dash shall fall as a gag", "steady rhythm beats rush"]) },
      { title: "Home Row Sentence II", subtitle: "Accuracy sentence", keys: "asdfghjkl;", description: "Keep error rate low on longer lines.", text: repeatLines(["a glad dad shall ask a lass", "half a glass had salad", "a small hall had a flag", "glad lads dash all day", "accuracy grows with calm"]) },
      { title: "Home Row Rhythm Builder", subtitle: "Pace drill", keys: "asdfghjkl;", description: "Consistent pace matters more than spikes.", text: repeatLines(["asdf jkl; asdf jkl;", "sall hall fall glass", "lads shall ask all", "fads had glad halls", "pace first speed later"]) },
      { title: "Home Row Accuracy Drill", subtitle: "95% target", keys: "asdfghjkl;", description: "Target 95 percent accuracy or better.", text: repeatLines(["a glass shall last", "a glad lass asks dad", "small halls had flags", "dash all sad lads", "accuracy is power"]) },
      { title: "Home Row Burst", subtitle: "Short fast bursts", keys: "asdfghjkl;", description: "Short bursts of controlled speed.", text: repeatLines(["fall hall glass dash", "glad dad sad lad", "flash flask shall fall", "half glass all day", "burst then breathe"]) },
      { title: "Home Row Flow Test", subtitle: "Flow over force", keys: "asdfghjkl;", description: "Relaxed shoulders, floating fingers.", text: repeatLines(["a glad dad had a flask", "shall all lads dash", "sad halls had glass", "a flag falls; a lass laughs", "flow over force always"]) },
      { title: "Home Row Speed Check", subtitle: "Speed gate", keys: "asdfghjkl;", description: "Push speed while staying clean.", text: repeatLines(["glass flask glad hall", "a lad had a flag", "small dash all glass", "sad shall ask dads", "speed needs precision"]) },
      { title: "Home Row Combo Drill", subtitle: "Linked combos", keys: "asdfghjkl;", description: "Link repeated patterns smoothly.", text: repeatLines(["asdfghjkl asdfghjkl", "hall glass dash fall", "glad lass had salad", "a flask falls fast", "repeat builds memory"]) },
      { title: "Home Row Sprint Prep", subtitle: "Exam prep", keys: "asdfghjkl;", description: "Preparation for benchmark exam.", text: repeatLines(["a glad hall had glass", "dash all sad lads", "a flask had salad", "shall fall as glass falls", "stay calm stay clean"]) },
      { title: "Home Row Benchmark", subtitle: "Unlock top row", keys: "asdfghjkl;", description: "Final benchmark before top row unlock.", text: repeatLines(["a sad lad had a glad dad", "all glass halls shall last", "a flask had salad all day", "glad lads dash fast as halls fall", "home row mastered"]) },
      { title: "Home Row Master Seal", subtitle: "Certification gate", keys: "asdfghjkl;", description: "Official seal of home-row confidence.", text: repeatLines(["home row skill feels natural now", "a glad dad had a calm laugh", "all halls shall stay safe", "fast and clean beats messy speed", "advance to top row"]) },
    ])
  );

  // 21-40 Top Row
  levels.push(
    ...block(21, "Top Row (21-40)", "⬆️", "#7c3aed", [
      { title: "Top Index Left", subtitle: "Keys: rt", keys: "rt", description: "Left index reaches R and T.", text: repeatLines(["rrr ttt rt tr rt", "tree treat trait", "try to start true", "great traits take time", "relax and return"]) },
      { title: "Top Index Right", subtitle: "Keys: yu", keys: "yu", description: "Right index reaches Y and U.", text: repeatLines(["yyy uuu yu uy yu", "you your youth", "use your yellow cup", "your output is useful", "steady reaches help"]) },
      { title: "Top Middles", subtitle: "Keys: ei", keys: "ei", description: "Middle finger precision.", text: repeatLines(["eee iii ei ie ei", "tie their piece", "time is elite", "the tire is fine", "middle finger control"]) },
      { title: "Top Rings", subtitle: "Keys: wo", keys: "wo", description: "Ring finger reach work.", text: repeatLines(["www ooo wo ow wo", "wow wood wool", "own slow power", "work on smooth wow", "ring finger reach"]) },
      { title: "Top Pinkies", subtitle: "Keys: qp", keys: "qp", description: "Outer finger extension drills.", text: repeatLines(["qqq ppp qp pq qp", "quip equip opaque", "quick people type", "proper pacing helps", "pinkies need patience"]) },
      { title: "Left Top Flow", subtitle: "Keys: qwert", keys: "qwert", description: "Left-side top row group flow.", text: repeatLines(["qwert qwert qwert", "water where were", "three trees were wet", "write the great answer", "smooth reach matters"]) },
      { title: "Right Top Flow", subtitle: "Keys: yuiop", keys: "yuiop", description: "Right-side top row fluency.", text: repeatLines(["yuiop yuiop yuiop", "you pour your soup", "output your opinion", "your route is unique", "right hand reaches ease"]) },
      { title: "Top + Home Words I", subtitle: "Basic words", keys: "qwertyuiop asdfghjkl;", description: "Combine top and home rows.", text: repeatLines(["the you are write quite", "power tower proper", "your type is quiet", "people often write poetry", "flow across rows"]) },
      { title: "Top + Home Words II", subtitle: "Common patterns", keys: "qwertyuiop asdfghjkl;", description: "Frequent English combinations.", text: repeatLines(["there where they were", "proper quote about your life", "the quiet writer wrote poetry", "output requires power", "common patterns win"]) },
      { title: "Top Sentence I", subtitle: "Full sentence", keys: "qwertyuiop asdfghjkl;", description: "Sentence rhythm using top row.", text: repeatLines(["the quiet tower wrote poetry every week", "your type improves with proper practice", "there were three white trees", "power grows through patience", "smoothness beats force"]) },
      { title: "Top Sentence II", subtitle: "Full sentence", keys: "qwertyuiop asdfghjkl;", description: "Longer sentence control.", text: repeatLines(["write proper quotes to improve your typing", "people write unique poetry over time", "the writer wrote their report", "you are where your effort is", "accuracy before speed"]) },
      { title: "ER TH OU Drill", subtitle: "Bigrams", keys: "er th ou", description: "High-frequency bigram speed.", text: repeatLines(["there their other through", "outer route thought", "power over pressure", "the route was there", "repeat until automatic"]) },
      { title: "THE YOU ARE Drill", subtitle: "Trigrams", keys: "the you are", description: "Top-row trigram automation.", text: repeatLines(["the you are the you are", "are you there yet", "the route you wrote", "the year you are ready", "small chunks become speed"]) },
      { title: "Quality & Water", subtitle: "Word drill", keys: "qwertyuiop", description: "Longer common words.", text: repeatLines(["quality water quiet writer", "quarter wrote twice", "the water is quite warm", "quality typing takes time", "long words need calm"]) },
      { title: "Proper & Yellow", subtitle: "Word drill", keys: "qwertyuiop", description: "More top-row word density.", text: repeatLines(["proper yellow output report", "purple people wrote poetry", "your report requires proof", "type properly every day", "repeat without tension"]) },
      { title: "Top Rhythm Builder", subtitle: "Pace drill", keys: "qwertyuiop", description: "Steady pace across reaches.", text: repeatLines(["qwer tyui op qwer tyui op", "the proper route requires power", "write your report over time", "quiet people type quickly", "pace over panic"]) },
      { title: "Top Accuracy Gate", subtitle: "95% target", keys: "qwertyuiop", description: "Accuracy gate before speed exam.", text: repeatLines(["the quiet writer wrote a proper quote", "power requires proper routine", "your output improves over time", "the route was quite pretty", "accuracy unlocks speed"]) },
      { title: "Top Speed Blast", subtitle: "Short speed", keys: "qwertyuiop", description: "Fast bursts over top-row patterns.", text: repeatLines(["the the the your your your", "proper route output", "power over panic", "white trees were there", "fast but clean"]) },
      { title: "Top Row Benchmark", subtitle: "Unlock bottom row", keys: "qwertyuiop", description: "Final top-row exam.", text: repeatLines(["the quiet tower wrote poetry every week", "write proper quotes to improve your typing", "your report requires quality output", "power grows through proper routine", "top row mastered"]) },
      { title: "Top Row Master Seal", subtitle: "Certification gate", keys: "qwertyuiop", description: "Official seal of top-row control.", text: repeatLines(["you wrote the proper report quite well", "their route through town was quiet", "quality over quantity every time", "type with patience and purpose", "advance to bottom row"]) },
    ])
  );

  // 41-60 Bottom Row
  levels.push(
    ...block(41, "Bottom Row (41-60)", "⬇️", "#f59e0b", [
      { title: "Left Bottom Index", subtitle: "Keys: vb", keys: "vb", description: "V and B control.", text: repeatLines(["vvv bbb vb bv vb", "vivid brave above", "be brave and move", "a brave vibe begins", "bottom index balance"]) },
      { title: "Right Bottom Index", subtitle: "Keys: nm", keys: "nm", description: "N and M precision.", text: repeatLines(["nnn mmm nm mn nm", "minimum moon name", "many moments matter", "a calm name remains", "right index reaches"]) },
      { title: "Bottom Middles", subtitle: "Keys: c ,", keys: "c,", description: "Middle finger bottom precision.", text: repeatLines(["ccc ,,, c, ,c", "calm, clean, clear", "come, call, care", "clean commas count", "small motions help"]) },
      { title: "Bottom Rings", subtitle: "Keys: x .", keys: "x.", description: "X and period control.", text: repeatLines(["xxx ... x. .x", "exit. extra. axis.", "next. relax. mix.", "small x reaches matter.", "end with a period."]) },
      { title: "Bottom Pinkies", subtitle: "Keys: z /", keys: "z/", description: "Z and slash reach control.", text: repeatLines(["zzz /// z/ /z", "zero/zone/zoom", "zip/zag/maze", "a zebra zips / fast", "pinkies finish strong"]) },
      { title: "Full Bottom Row", subtitle: "Keys: zxcvbnm", keys: "zxcvbnm", description: "Blend the whole bottom row.", text: repeatLines(["zxcvbnm zxcvbnm", "move zinc vibe calm bench", "maximum civic canvas", "the calm vibe became magic", "bottom row unlocked"]) },
      { title: "Three Row Words I", subtitle: "All alpha rows", keys: "all letters", description: "Start full alphabet words.", text: repeatLines(["quick move brave calm next", "vivid brown magic zone", "the calm fox moved", "new words need calm", "link all rows"]) },
      { title: "Three Row Words II", subtitle: "All alpha rows", keys: "all letters", description: "Smooth transitions across full board.", text: repeatLines(["combine vibrant maximum zinc calm", "the calm zen vibe became maximum comfort", "move the bench over", "next value becomes valid", "row integration matters"]) },
      { title: "Capital Left Shift", subtitle: "Shift use", keys: "Shift + A-Z", description: "Use right shift for left-hand caps.", text: repeatLines(["Apple Banana Cherry", "Driver Falcon Garden", "Great Fast Games", "Shift smartly with rhythm", "caps need control"]) },
      { title: "Capital Right Shift", subtitle: "Shift use", keys: "Shift + A-Z", description: "Use left shift for right-hand caps.", text: repeatLines(["Tokyo London Paris", "Kevin Lily Molly", "Neon Moon Magic", "Right hand capitals clean", "stay light on shift"]) },
      { title: "Proper Nouns", subtitle: "City names", keys: "Shift", description: "Real names and places.", text: repeatLines(["New York Tokyo Paris Rome", "Delhi Mumbai London Seoul", "Alice Rahul Meera Sofia", "Names demand accuracy", "look up not down"]) },
      { title: "Tech Stack Capitals", subtitle: "Developer words", keys: "Shift", description: "Common tech words with caps.", text: repeatLines(["React TypeScript JavaScript Python", "Node Vite Tailwind Rust", "Prisma Docker Linux GitHub", "Code words should feel natural", "developer flow starts here"]) },
      { title: "Capital Sentence I", subtitle: "Pangram style", keys: "Shift + letters", description: "Mixed-case sentence control.", text: repeatLines(["The Quick Brown Fox Jumps Over The Lazy Dog", "Bright Vixens Jump Over Warm Fogs", "Fast Typists Stay Calm", "Use both shift keys", "accuracy over rush"]) },
      { title: "Capital Sentence II", subtitle: "Mixed case", keys: "Shift + letters", description: "More mixed-case long forms.", text: repeatLines(["Every Expert Was Once A Beginner", "Practice Makes Permanent", "Good Habits Build Great Speed", "Breathe Relax Focus", "mixed case mastered"]) },
      { title: "Bottom Rhythm Builder", subtitle: "Pace drill", keys: "zxcvbnm", description: "Steady motion across bottom row.", text: repeatLines(["zxcv bnm zxcv bnm", "move zinc vibe calm", "next value becomes valid", "bench music moves", "rhythm creates memory"]) },
      { title: "Bottom Accuracy Gate", subtitle: "95% target", keys: "all letters", description: "Accuracy gate before speed exam.", text: repeatLines(["the calm zen vibe became maximum comfort", "combine vibrant maximum zinc calm", "every movement must be clean", "capital letters need timing", "accuracy unlocks mastery"]) },
      { title: "Bottom Speed Blast", subtitle: "Fast burst", keys: "all letters", description: "Fast bursts through lower letters.", text: repeatLines(["move move move calm calm calm", "zinc vibe bench next", "maximum value becomes valid", "short bursts only", "speed under control"]) },
      { title: "Full Alphabet Test", subtitle: "All rows", keys: "A-Z", description: "Classic full alphabet drill.", text: repeatLines(["the quick brown fox jumps over the lazy dog", "pack my box with five dozen liquor jugs", "bright vixens jump dozy fowl", "jackdaws love my big sphinx of quartz", "full alphabet flow"]) },
      { title: "Bottom Benchmark", subtitle: "Unlock symbols", keys: "A-Z", description: "Exam before numbers and punctuation.", text: repeatLines(["combine vibrant maximum zinc calm", "the calm zen vibe became maximum comfort", "React TypeScript JavaScript Python", "The Quick Brown Fox Jumps Over The Lazy Dog", "bottom row mastered"]) },
      { title: "Bottom Master Seal", subtitle: "Certification gate", keys: "A-Z", description: "Official seal of full alphabet control.", text: repeatLines(["your fingers now know the entire alphabet", "speed grows from clean repetition", "do not chase mistakes with force", "breathe and trust the board", "advance to numbers and symbols"]) },
    ])
  );

  // 61-80 numbers & symbols
  levels.push(
    ...block(61, "Numbers & Shift (61-80)", "🔢", "#ef4444", [
      { title: "123 Drill", subtitle: "Numbers", keys: "123", description: "Left number row control.", text: repeatLines(["1 2 3 1 2 3", "123 321 123", "the 3 cats ate 12 fish", "code 123 begins", "numbers need reach"]) },
      { title: "456 Drill", subtitle: "Numbers", keys: "456", description: "Center number row control.", text: repeatLines(["4 5 6 4 5 6", "456 654 456", "the 45 files need 6 edits", "version 4.5.6 released", "stay balanced"]) },
      { title: "7890 Drill", subtitle: "Numbers", keys: "7890", description: "Right number row control.", text: repeatLines(["7 8 9 0 7 8 9 0", "7890 0987", "call 1800 555 0199", "port 8080 is open", "reach with control"]) },
      { title: "Full Number Row", subtitle: "1 to 0", keys: "1234567890", description: "Complete number row flow.", text: repeatLines(["123 456 789 0", "2024 1999 1776 1066", "version 2.0 has 150 features", "room 404 on floor 7", "numbers everywhere"]) },
      { title: "Dates & Years", subtitle: "Real dates", keys: "numbers", description: "Use realistic date patterns.", text: repeatLines(["24 07 2026", "01 01 2030", "1998 2004 2024", "the event is on 17 09 2028", "dates must feel easy"]) },
      { title: "Phone & Codes", subtitle: "Numbers in context", keys: "numbers", description: "Phone numbers and codes.", text: repeatLines(["call 1800 555 1234 for support", "code 404 error on port 3000", "otp 857492 expires in 60 seconds", "pin 2406 opens the safe", "practical patterns matter"]) },
      { title: "Comma & Period", subtitle: "Basic punctuation", keys: ", .", description: "Sentence punctuation basics.", text: repeatLines(["Hello, world.", "Calm, clear, correct.", "Write, pause, continue.", "A sentence ends here.", "punctuation gives rhythm"]) },
      { title: "Semicolon & Colon", subtitle: "Punctuation", keys: "; :", description: "Formal punctuation practice.", text: repeatLines(["Wait; do not rush.", "Items: apples, bananas, oranges.", "Pause; breathe; continue.", "Goal: accuracy first.", "punctuation is professional"]) },
      { title: "Quotes & Apostrophes", subtitle: "Punctuation", keys: `' "`, description: "Quotes and contractions.", text: repeatLines([`He said, "Hello!"`, `It's time to type.`, `"Don't quit," she said.`, `We're getting better every day.`, `quotes require pinky control`]) },
      { title: "Question & Exclamation", subtitle: "Punctuation", keys: "?!", description: "Emotion and clarity marks.", text: repeatLines(["Really? Yes!", "How fast are you?", "Amazing! Keep going!", "What now? Practice!", "expression needs precision"]) },
      { title: "Hyphen & Dash", subtitle: "Punctuation", keys: "-_", description: "Compound words and separators.", text: repeatLines(["high-speed typing", "re-enter the value", "privacy-first design", "zero-tracking approach", "developer-friendly tools"]) },
      { title: "At Symbol & Hash", subtitle: "Symbols", keys: "@#", description: "Emails and tags.", text: repeatLines(["user@email.com", "#typing #practice #speed", "contact@typeflow.dev", "tag #100DaysOfCode", "symbols appear often"]) },
      { title: "Dollar & Percent", subtitle: "Symbols", keys: "$%", description: "Finance and ratios.", text: repeatLines(["price is $99.99", "save 20% today", "$150 budget approved", "100% effort matters", "money patterns are common"]) },
      { title: "Ampersand & Asterisk", subtitle: "Symbols", keys: "&*", description: "Programming and naming.", text: repeatLines(["R&D and A&B teams", "ptr * value", "A* search works", "salt & pepper", "symbols train pinkies"]) },
      { title: "Parentheses", subtitle: "Symbols", keys: "()", description: "Group expressions correctly.", text: repeatLines(["(sum + total) * count", "return (a + b)", "if (ready) begin", "(fast) and (clean)", "coding needs these often"]) },
      { title: "Brackets & Braces", subtitle: "Symbols", keys: "[]{}", description: "Arrays and objects.", text: repeatLines(["arr[0] = value", "{ key: value }", "const list = [1, 2, 3]", "items[{id}] fail safely", "developer syntax mastery"]) },
      { title: "Angle Brackets & Equals", subtitle: "Symbols", keys: "<>=", description: "HTML and conditions.", text: repeatLines(["<div class='app'>", "a <= b && c >= d", "x == y", "<button>Go</button>", "web typing in action"]) },
      { title: "Full Symbol Mix", subtitle: "Symbols", keys: "!@#$%^&*()_+-=[]{}<>?", description: "Mixed symbol density drill.", text: repeatLines(["if (a >= 100) { return price * 0.8; }", "user@email.com paid $99.99 on 24/07/2026", "<div id='app'>Hello!</div>", "const map = { key: [1, 2, 3] };", "symbols now feel normal"]) },
      { title: "Numbers & Symbols Benchmark", subtitle: "Exam", keys: "1-0 + punctuation", description: "Final benchmark before advanced mastery.", text: repeatLines(["version 2.0.1 released with 150 new features", "call 1800 555 1234 before 5:30 p.m.", `He said, "Type accurately first!"`, "if (total >= 100) { return price * 0.8; }", "numbers and symbols mastered"]) },
      { title: "Numbers & Symbols Seal", subtitle: "Certification gate", keys: "all symbols", description: "Official seal for punctuation and numeric fluency.", text: repeatLines(["practical typing includes numbers, symbols, and clean punctuation", "professional writing needs commas, quotes, and proper dates", "coding requires brackets, braces, and equality checks", "privacy-first apps still need great UX!", "advance to mastery and code labs"]) },
    ])
  );

  // 81-104 mastery & code
  levels.push(
    ...block(81, "Mastery & Code (81-104)", "🏆", "#06b6d4", [
      { title: "Common Bigrams I", subtitle: "th he in er", keys: "th he in er", description: "Most common English transitions.", text: repeatLines(["the there then their", "he held the thread", "inner energy matters", "better effort wins", "small transitions build speed"]) },
      { title: "Common Bigrams II", subtitle: "an re on at", keys: "an re on at", description: "Additional high-frequency transitions.", text: repeatLines(["an and another", "there are reasons", "on and at once", "great attention matters", "frequency matters"]) },
      { title: "Common Trigrams I", subtitle: "the ing and", keys: "the ing and", description: "Top trigrams in context.", text: repeatLines(["the thing and the truth", "typing and thinking", "the ending is near", "and then there was light", "trigrams become automatic"]) },
      { title: "Common Trigrams II", subtitle: "ion ent for", keys: "ion ent for", description: "Faster high-frequency endings.", text: repeatLines(["information and action", "different development", "for every effort", "attention and intention", "endings shape speed"]) },
      { title: "JavaScript Arrows", subtitle: "Code lab", keys: "code", description: "Arrow functions and returns.", text: repeatLines(["const add = (a, b) => a + b;", "const hello = () => console.log('Hi');", "const isReady = flag => !!flag;", "items.map(x => x * 2);", "code fluency matters"]) },
      { title: "Array Methods", subtitle: "Code lab", keys: "code", description: "map, filter, reduce patterns.", text: repeatLines(["const sum = arr.reduce((a, v) => a + v, 0);", "const list = arr.filter(x => x > 10);", "const next = arr.map(x => x * 2);", "users.find(u => u.id === 1);", "read syntax in chunks"]) },
      { title: "React Components", subtitle: "Code lab", keys: "code", description: "Component syntax typing.", text: repeatLines(["export default function App() { return <div />; }", "const [count, setCount] = useState(0);", "useEffect(() => {}, []);", "return <button onClick={go}>Go</button>;", "frontend fluency feels great"]) },
      { title: "Python Basics", subtitle: "Code lab", keys: "code", description: "Functions and lists.", text: repeatLines(["def process(items): return [x * 2 for x in items]", "for item in items: print(item)", "if value > 10: return True", "total = sum(values)", "python has its own rhythm"]) },
      { title: "HTML & CSS", subtitle: "Code lab", keys: "code", description: "Markup and styling syntax.", text: repeatLines(["<button class='btn-primary'>Save</button>", "display: grid; grid-template-columns: 1fr 1fr;", "align-items: center; justify-content: space-between;", "background: linear-gradient(90deg, #00f5c4, #7c3aed);", "markup should feel readable"]) },
      { title: "SQL Queries", subtitle: "Code lab", keys: "code", description: "Database query fluency.", text: repeatLines(["SELECT * FROM users WHERE active = true ORDER BY name;", "UPDATE tasks SET done = true WHERE id = 5;", "INSERT INTO logs (message) VALUES ('ok');", "DELETE FROM cache WHERE expired = true;", "sql syntax needs precision"]) },
      { title: "JSON Objects", subtitle: "Code lab", keys: "code", description: "Objects, arrays, and values.", text: repeatLines([`{ "status": 200, "message": "ok", "data": [] }`, `{ "name": "TypeFlow", "offline": true }`, `{ "levels": 185, "games": 10 }`, `{ "locale": "hi-IN", "enabled": true }`, `json is common everywhere`]) },
      { title: "Pangram Blast I", subtitle: "Speed drill", keys: "all", description: "Classic pangram speed drill.", text: repeatLines(["the quick brown fox jumps over the lazy dog", "pack my box with five dozen liquor jugs", "bright vixens jump dozy fowl quack", "how vexingly quick daft zebras jump", "full board speed"]) },
      { title: "Pangram Blast II", subtitle: "Speed drill", keys: "all", description: "Alternative pangram set.", text: repeatLines(["the five boxing wizards jump quickly", "jackdaws love my big sphinx of quartz", "sphinx of black quartz, judge my vow", "quick zephyrs blow, vexing daft Jim", "pangrams are powerful drills"]) },
      { title: "Quote Drill I", subtitle: "Famous quote", keys: "all", description: "Longer quote control.", text: repeatLines(["The only way to do great work is to love what you do.", "It does not matter how slowly you go as long as you do not stop.", "Whether you think you can or you think you cannot, you are right.", "Every expert was once a beginner.", "quotes build endurance"]) },
      { title: "Quote Drill II", subtitle: "Famous quote", keys: "all", description: "Mixed punctuation and rhythm.", text: repeatLines(["Success is not final, failure is not fatal: it is courage that counts.", "In the middle of every difficulty lies opportunity.", "Spread love everywhere you go.", "Strive not to be a success, but rather to be of value.", "great lines teach timing"]) },
      { title: "60 WPM Gate", subtitle: "Speed gate", keys: "all", description: "Hold a solid 60 WPM pace.", text: repeatLines(["Programming requires precision, patience, and practice.", "Type accurately at first; speed will follow naturally.", "Every expert was once a beginner who refused to quit.", "The keyboard is your instrument; make beautiful music with it.", "hold a stable rhythm"]) },
      { title: "80 WPM Gate", subtitle: "Speed gate", keys: "all", description: "Push into fast territory.", text: repeatLines(["Consistency matters more than one lucky burst of speed.", "Stay relaxed, breathe deeply, and trust your muscle memory.", "Typing becomes powerful when your hands move without tension.", "The strongest typists focus on flow, not force.", "speed without chaos"]) },
      { title: "100 WPM Gate", subtitle: "Elite gate", keys: "all", description: "Elite speed pressure drill.", text: repeatLines(["High speed demands tiny efficient movements and near-perfect timing.", "Your eyes stay on the screen while your fingers play the keyboard like an instrument.", "Clean technique scales farther than reckless speed chasing.", "Accuracy protects speed by preventing wasted corrections.", "elite pace needs calm"]) },
      { title: "Perfect Accuracy Gate", subtitle: "100% target", keys: "all", description: "Zero-error exam.", text: repeatLines(["One mistake can cost more time than ten careful keystrokes.", "Move smoothly and let each word arrive with intention.", "Perfect practice builds dependable performance.", "Focus, breathe, and finish strong.", "zero errors unlock mastery"]) },
      { title: "Master Graduation", subtitle: "Final exam", keys: "all", description: "Graduate from the core academy.", text: repeatLines(["Mastery takes dedication, patience, and daily repetition.", "You now control letters, symbols, numbers, capitals, and code.", "Stay humble, keep practicing, and keep improving.", "A calm mind types better than a rushed one.", "core academy complete"]) },
      { title: "Grandmaster Speed", subtitle: "Advanced exam", keys: "all", description: "Top one percent aspirational speed test.", text: repeatLines(["The future belongs to those who practice with discipline and focus.", "Elite typists are built from thousands of careful repetitions.", "The keyboard becomes invisible when skill becomes instinct.", "Technique creates freedom.", "grandmaster speed gate"]) },
      { title: "Grandmaster Accuracy", subtitle: "Advanced exam", keys: "all", description: "Precision under pressure.", text: repeatLines(["Fast hands mean nothing without accurate control.", "A flawless run begins with a calm first word.", "Precision is silent confidence.", "Trust your training and let your fingers work.", "grandmaster accuracy gate"]) },
      { title: "Grandmaster Code", subtitle: "Advanced exam", keys: "code", description: "Complex multi-syntax code sprint.", text: repeatLines(["router.get('/users', authenticate, async (req, res) => {});", "const hash = crypto.createHash('sha256').update(data);", "SELECT * FROM users WHERE active = true ORDER BY name;", "interface User { id: number; email: string; name: string; }", "code mastery unlocked"]) },
      { title: "Hall of Fame Gate", subtitle: "Transition gate", keys: "legendary", description: "Move into bilingual and expert expansions.", text: repeatLines(["You have completed the core academy and unlocked expansion content.", "Now train across bilingual text, expert drills, and endurance gates.", "Keep building range, rhythm, and resilience.", "TypeFlow is just getting started.", "advance to expansion tiers"]) },
    ])
  );

  // 105-140 Hindi & bilingual (36 levels)
  const hindiTexts = [
    ["नमस्ते दुनिया", "मेरा नाम टाइपफ्लो है", "धीरे शुरू करो, सही टाइप करो", "अभ्यास से गति बढ़ती है", "हिन्दी और English दोनों सीखो"],
    ["आज का लक्ष्य है सही टाइपिंग", "मेहनत से हर दिन सुधार होता है", "धैर्य रखो और आगे बढ़ो", "तेज़ नहीं, पहले सटीक बनो", "अच्छी आदतें बड़ी शक्ति देती हैं"],
    ["keyboard पर नज़र नहीं, screen पर नज़र रखो", "शरीर सीधा रखो और कंधे ढीले रखो", "हर उंगली का अपना क्षेत्र होता है", "गलतियों से सीखो, रुकना नहीं", "नियमित अभ्यास ही mastery देता है"],
  ];
  for (let i = 0; i < 36; i++) {
    const pack = hindiTexts[i % hindiTexts.length];
    const id = 105 + i;
    levels.push({
      id,
      category: "Hindi & Bilingual (105-140)",
      title: `Level ${id}: ${i < 12 ? "Hindi Basics" : i < 24 ? "Bilingual Flow" : "Hindi Speed Gate"}`,
      subtitle: i < 12 ? "देवनागरी शुरुआती अभ्यास" : i < 24 ? "Hindi + English मिश्रित पंक्तियाँ" : "उन्नत हिन्दी गति",
      keys: i < 12 ? "हिन्दी" : "हिन्दी + English",
      icon: "🇮🇳",
      color: "#f97316",
      description: i < 12 ? "हिन्दी टाइपिंग के लिए सरल वाक्य।" : i < 24 ? "Mixed script fluency and rhythm building." : "Advanced Hindi/Bilingual endurance and flow.",
      text: pack,
    });
  }

  // 141-185 Expert gates (45 levels)
  const expertThemes = [
    "Burst Speed", "Consistency Gate", "Long Quote", "Code Endurance", "Numbers Endurance",
    "Punctuation Pressure", "Blind Accuracy", "One-Minute Gate", "Two-Minute Gate", "Weak Key Repair"
  ];
  for (let i = 0; i < 45; i++) {
    const theme = expertThemes[i % expertThemes.length];
    const id = 141 + i;
    levels.push({
      id,
      category: "Expert Gates (141-185)",
      title: `Level ${id}: ${theme}`,
      subtitle: `Expert drill ${i + 1} / 45`,
      keys: theme.toLowerCase(),
      icon: "🚀",
      color: i % 2 === 0 ? "#22c55e" : "#8b5cf6",
      description: `Expert-level drill focused on ${theme.toLowerCase()} with longer endurance and accuracy pressure.`,
      text: [
        "Consistency matters more than one lucky burst; hold your rhythm and keep your breathing calm.",
        "Professional typists build speed through precise repetition, clean posture, and intelligent correction habits.",
        "TypeFlow helps you train letters, numbers, punctuation, code, bilingual text, and focused recovery drills.",
        "Your goal is not just fast fingers, but reliable speed that survives long sessions without collapsing.",
        "Stay smooth, stay light, and let technique lead the pace.",
      ],
    });
  }

  return levels;
}

export const ALL_LEVELS: LevelDef[] = generateLevels();
export const TOTAL_LEVELS = ALL_LEVELS.length;

export const CATEGORIES: LessonCategory[] = [
  "Home Row (1-20)",
  "Top Row (21-40)",
  "Bottom Row (41-60)",
  "Numbers & Shift (61-80)",
  "Mastery & Code (81-104)",
  "Hindi & Bilingual (105-140)",
  "Expert Gates (141-185)",
];
