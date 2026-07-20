import type { KeyboardLayout, KeyboardModel, KeyboardTheme } from "../store/gameStore";

export type KeyDef = { label: string; code: string; w?: number; sub?: string };

// Row structure shared; only the alpha keys change between layouts.
const NUM_ROW: KeyDef[] = [
  { label: "`", code: "backquote" },
  { label: "1", code: "digit1" }, { label: "2", code: "digit2" }, { label: "3", code: "digit3" },
  { label: "4", code: "digit4" }, { label: "5", code: "digit5" }, { label: "6", code: "digit6" },
  { label: "7", code: "digit7" }, { label: "8", code: "digit8" }, { label: "9", code: "digit9" },
  { label: "0", code: "digit0" }, { label: "-", code: "minus" }, { label: "=", code: "equal" },
  { label: "⌫", code: "backspace", w: 2 },
];

const BOTTOM_ROW_TAIL: KeyDef[] = [
  { label: ",", code: "comma" }, { label: ".", code: "period" }, { label: "/", code: "slash" },
  { label: "⇧", code: "shiftright", w: 2.4 },
];

const SPACE_ROW: KeyDef[] = [
  { label: "ctrl", code: "controlleft", w: 1.6 },
  { label: "⊞", code: "metaleft", w: 1.2 },
  { label: "alt", code: "altleft", w: 1.2 },
  { label: "", code: "space", w: 7 },
  { label: "alt", code: "altright", w: 1.2 },
  { label: "fn", code: "fn", w: 1.2 },
  { label: "ctrl", code: "controlright", w: 1.6 },
];

const LAYOUTS: Record<KeyboardLayout, string[][]> = {
  qwerty: [
    ["q","w","e","r","t","y","u","i","o","p","[","]","\\"],
    ["a","s","d","f","g","h","j","k","l",";","'"],
    ["z","x","c","v","b","n","m"],
  ],
  dvorak: [
    ["'",",",".","p","y","f","g","c","r","l","/","=","\\"],
    ["a","o","e","u","i","d","h","t","n","s","-"],
    [";","q","j","k","x","b","m"],
  ],
  colemak: [
    ["q","w","f","p","g","j","l","u","y",";","[","]","\\"],
    ["a","r","s","t","d","h","n","e","i","o","'"],
    ["z","x","c","v","b","k","m"],
  ],
  azerty: [
    ["a","z","e","r","t","y","u","i","o","p","^","$"],
    ["q","s","d","f","g","h","j","k","l","m","ù"],
    ["w","x","c","v","b","n",","],
  ],
};

const CODE_MAP: Record<string, string> = {
  q:"keyq",w:"keyw",e:"keye",r:"keyr",t:"keyt",y:"keyy",u:"keyu",i:"keyi",o:"keyo",p:"keyp",
  a:"keya",s:"keys",d:"keyd",f:"keyf",g:"keyg",h:"keyh",j:"keyj",k:"keyk",l:"keyl",
  z:"keyz",x:"keyx",c:"keyc",v:"keyv",b:"keyb",n:"keyn",m:"keym",
};

function toKeyDefs(chars: string[]): KeyDef[] {
  return chars.map((ch) => ({
    label: ch,
    code: CODE_MAP[ch.toLowerCase()] || ch.toLowerCase(),
  }));
}

export function getKeyboardRows(layout: KeyboardLayout): KeyDef[][] {
  const alpha = LAYOUTS[layout];
  return [
    NUM_ROW,
    [{ label: "tab", code: "tab", w: 1.5 }, ...toKeyDefs(alpha[0])],
    [{ label: "caps", code: "capslock", w: 1.8 }, ...toKeyDefs(alpha[1]), { label: "↵", code: "enter", w: 2 }],
    [{ label: "⇧", code: "shiftleft", w: 2.4 }, ...toKeyDefs(alpha[2]), ...BOTTOM_ROW_TAIL],
    SPACE_ROW,
  ];
}

export const LAYOUT_INFO: Record<KeyboardLayout, { name: string; desc: string; flag: string }> = {
  qwerty:  { name: "QWERTY",  flag: "🌐", desc: "The worldwide standard. Most keyboards use this." },
  dvorak:  { name: "Dvorak",  flag: "⚡", desc: "Vowels on the left, optimized for less finger travel." },
  colemak: { name: "Colemak", flag: "🧬", desc: "Modern ergonomic layout, easy to learn from QWERTY." },
  azerty:  { name: "AZERTY",  flag: "🇫🇷", desc: "The French/European standard layout." },
};

// Theme → hue used for the ripple glow wave
export const KEYBOARD_THEMES: Record<KeyboardTheme, { name: string; hues: number[]; case: string; keyBg: string; keyBorder: string; text: string }> = {
  aurora: { name: "Aurora",  hues: [168, 190, 265], case: "#0f2a30", keyBg: "linear-gradient(180deg,#123d42,#0b2b30)", keyBorder: "#1c4f56", text: "#8affd9" },
  sunset: { name: "Sunset",  hues: [12, 35, 320],   case: "#2a1220", keyBg: "linear-gradient(180deg,#3d1a2e,#2a1220)", keyBorder: "#5a2340", text: "#ffb3d1" },
  cyber:  { name: "Cyber",   hues: [285, 320, 200], case: "#1a1030", keyBg: "linear-gradient(180deg,#241540,#160c28)", keyBorder: "#3a2260", text: "#c4a8ff" },
  mono:   { name: "Mono",    hues: [220, 210, 200], case: "#151821", keyBg: "linear-gradient(180deg,#20242f,#161922)", keyBorder: "#2c3140", text: "#b8c0d0" },
  candy:  { name: "Candy",   hues: [330, 45, 190],  case: "#2a1830", keyBg: "linear-gradient(180deg,#3a2145,#281530)", keyBorder: "#5a3568", text: "#ffc2e8" },
};

export const KEYBOARD_MODELS: Record<KeyboardModel, { name: string; icon: string; desc: string }> = {
  wave:       { name: "Glow Wave",   icon: "🌈", desc: "dgrnboi-style ripple glow from the pressed key." },
  purpleCase: { name: "Purple Case", icon: "🟣", desc: "Classic CSS keyboard case inspired by your provided purple sample." },
  rgbMech:    { name: "RGB Mech",    icon: "🎮", desc: "Gaming mechanical look with under-glow and deep key travel." },
  glassMac:   { name: "Glass Mac",   icon: "💎", desc: "Clean Apple-like translucent keycaps and soft shadows." },
  neumorph:   { name: "Soft Touch",  icon: "☁️", desc: "Neuromorphic soft-pressed keycaps for low-distraction practice." },
  isometric:  { name: "Iso 3D",      icon: "🧊", desc: "Tilted isometric deck inspired by 3D mechanical keyboard demos." },
};

const SPECIAL_CHAR_TO_CODE: Record<string, string> = {
  " ": "space",
  "\n": "enter",
  "\t": "tab",
  "`": "backquote",
  "~": "backquote",
  "1": "digit1",
  "!": "digit1",
  "2": "digit2",
  "@": "digit2",
  "3": "digit3",
  "#": "digit3",
  "4": "digit4",
  "$": "digit4",
  "5": "digit5",
  "%": "digit5",
  "6": "digit6",
  "^": "digit6",
  "7": "digit7",
  "&": "digit7",
  "8": "digit8",
  "*": "digit8",
  "9": "digit9",
  "(": "digit9",
  "0": "digit0",
  ")": "digit0",
  "-": "minus",
  "_": "minus",
  "=": "equal",
  "+": "equal",
  "[": "[",
  "{": "[",
  "]": "]",
  "}": "]",
  "\\": "\\",
  "|": "\\",
  ";": ";",
  ":": ";",
  "'": "'",
  '"': "'",
  ",": "comma",
  "<": "comma",
  ".": "period",
  ">": "period",
  "/": "slash",
  "?": "slash",
};

export function getCodeForChar(layout: KeyboardLayout, ch: string): string | undefined {
  if (!ch) return undefined;
  const lower = ch.toLowerCase();
  const rows = getKeyboardRows(layout);
  for (const key of rows.flat()) {
    if (key.label.toLowerCase() === lower) return key.code;
  }
  return SPECIAL_CHAR_TO_CODE[ch] || SPECIAL_CHAR_TO_CODE[lower] || CODE_MAP[lower];
}
