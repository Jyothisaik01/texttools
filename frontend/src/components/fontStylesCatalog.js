// fontStylesCatalog.js - 165+ Abundant Font Styles across ALL Categories (Sans, Serif/Roman, Cursive, Monospace, Gothic, Display, Unicode)

function mapChars(text, charMap) {
  return text
    .split('')
    .map((c) => charMap[c] || c)
    .join('');
}

// 1. UNICODE STYLES (35 styles - copy-pasteable anywhere)
export const UNICODE_FONT_STYLES = [
  {
    id: 'unicode-cursive-script',
    name: 'Cursive Script (Italic)',
    category: 'Cursive & Script',
    sample: '𝒞𝓊𝓇𝓈𝒾𝓋ℯ',
    transform: (t) => {
      const map = {
        a: '𝒶', b: '𝒷', c: '𝒸', d: '𝒹', e: 'ℯ', f: '𝒻', g: 'ℊ', h: '𝒽', i: '𝒾', j: '𝒿', k: '𝓀', l: '𝓁', m: '𝓂',
        n: '𝓃', o: 'ℴ', p: '𝓅', q: '𝓆', r: '𝓇', s: '𝓈', t: '𝓉', u: '𝓊', v: '𝓋', w: '𝓌', x: '𝓍', y: '𝓎', z: '𝓏',
        A: '𝒜', B: 'ℬ', C: '𝒞', D: '𝒟', E: 'ℰ', F: 'ℱ', G: '𝒢', H: 'ℋ', I: 'ℐ', J: '𝒥', K: '𝒦', L: 'ℒ', M: 'ℳ',
        N: '𝒩', O: '𝒪', P: '𝒫', Q: '𝒬', R: 'ℛ', S: '𝒮', T: '𝒯', U: '𝒰', V: '𝒱', W: '𝒲', X: '𝒳', Y: '𝒴', Z: '𝒵',
      };
      return mapChars(t, map);
    },
  },
  {
    id: 'unicode-cursive-bold',
    name: 'Cursive Bold Calligraphy',
    category: 'Cursive & Script',
    sample: '𝓒𝓾𝓻𝓼𝓲𝓿𝓮 𝓑𝓸𝓵𝓭',
    transform: (t) => {
      const map = {
        a: '𝓪', b: '𝓫', c: '𝓬', d: '𝓭', e: '𝓮', f: '𝓯', g: '𝓰', h: '𝓱', i: '𝓲', j: '𝓳', k: '𝓴', l: '𝓵', m: '𝓶',
        n: '𝓷', o: '𝓸', p: '𝓹', q: '𝓺', r: '𝓻', s: '𝓼', t: '𝓽', u: '𝓾', v: '𝓿', w: '𝔀', x: '𝔁', y: '𝔂', z: '𝔃',
        A: '𝓐', B: '𝓑', C: '𝓒', D: '𝓓', E: '𝓔', F: '𝓕', G: '𝓖', H: '𝓗', I: '𝓘', J: '𝓙', K: '𝓚', L: '𝓛', M: '𝓜',
        N: '𝓝', O: '𝓞', P: '𝓟', Q: '𝓠', R: '𝓡', S: '𝓢', T: '𝓣', U: '𝓤', V: '𝓥', W: '𝓦', X: '𝓧', Y: '𝓨', Z: '𝓩',
      };
      return mapChars(t, map);
    },
  },
  {
    id: 'unicode-roman-serif',
    name: 'Roman Serif Normal',
    category: 'Serif / Roman',
    sample: '𝑅𝑜𝑚𝑎𝑛 𝑆𝑒𝑟𝑖𝑓',
    transform: (t) => {
      const map = {
        a: '𝑎', b: '𝑏', c: '𝑐', d: '𝑑', e: '𝑒', f: '𝑓', g: '𝑔', h: 'ℎ', i: '𝑖', j: '𝑗', k: '𝑘', l: '𝑙', m: '𝑚',
        n: '𝑛', o: '𝑜', p: '𝑝', q: '𝑞', r: '𝑟', s: '𝑠', t: '𝑡', u: '𝑢', v: '𝑣', w: '𝑤', x: '𝑥', y: '𝑦', z: '𝑧',
        A: '𝐴', B: '𝐵', C: '𝐶', D: '𝐷', E: '𝐸', F: '𝐹', G: '𝐺', H: '𝐻', I: '𝐼', J: '𝐽', K: '𝐾', L: '𝐿', M: '𝑀',
        N: '𝑁', O: '𝑂', P: '𝑃', Q: '𝑄', R: '𝑅', S: '𝑆', T: '𝑇', U: '𝑈', V: '𝑉', W: '𝑊', X: '𝑋', Y: '𝑌', Z: '𝑍',
      };
      return mapChars(t, map);
    },
  },
  {
    id: 'unicode-roman-bold',
    name: 'Roman Bold',
    category: 'Serif / Roman',
    sample: '𝐑𝐨𝐦𝐚𝐧 𝐁𝐨𝐥𝐝',
    transform: (t) => {
      const map = {
        a: '𝐚', b: '𝐛', c: '𝐜', d: '𝐝', e: '𝐞', f: '𝐟', g: '𝐠', h: '𝐡', i: '𝐢', j: '𝐣', k: '𝐤', l: '𝐥', m: '𝐦',
        n: '𝐧', o: '𝐨', p: '𝐩', q: '𝐪', r: '𝐫', s: '𝐬', t: '𝐭', u: '𝐮', v: '𝐯', w: '𝐰', x: '𝐱', y: '𝐲', z: '𝐳',
        A: '𝐀', B: '𝐁', C: '𝐂', D: '𝐃', E: '𝐄', F: '𝐅', G: '𝐆', H: '𝐇', I: '𝐈', J: '𝐉', K: '𝐊', L: '𝐋', M: '𝐌',
        N: '𝐍', O: '𝐎', P: '𝐏', Q: '𝐐', R: '𝐑', S: '𝐒', T: '𝐓', U: '𝐔', V: '𝐕', W: '𝐖', X: '𝐗', Y: '𝐘', Z: '𝐙',
        '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗',
      };
      return mapChars(t, map);
    },
  },
  {
    id: 'unicode-roman-bold-italic',
    name: 'Roman Bold Italic',
    category: 'Serif / Roman',
    sample: '𝑹𝒐𝒎𝒂𝒏 𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄',
    transform: (t) => {
      const map = {
        a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆', f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋', k: '𝒌', l: '𝒍', m: '𝒎',
        n: '𝒏', o: '𝒐', p: '𝒑', q: '𝑒', r: '𝒓', s: '𝒔', t: '𝒕', u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚', z: '𝒛',
        A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫', E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰', J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴',
        N: '𝑵', O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺', T: '𝑻', U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿', Y: '𝒀', Z: '𝒁',
      };
      return mapChars(t, map);
    },
  },
  {
    id: 'unicode-fraktur',
    name: 'Fraktur Gothic',
    category: 'Gothic & Fraktur',
    sample: '𝔉𝔯𝔞𝔨𝔱𝔲𝔯',
    transform: (t) => {
      const map = {
        a: '𝔞', b: '𝔟', c: '𝔠', d: '𝔡', e: '𝔢', f: '𝔣', g: '𝔤', h: '𝔥', i: '𝔦', j: '𝔧', k: '𝔨', l: '𝔩', m: '𝔪',
        n: '𝔫', o: '𝔬', p: '𝔭', q: '𝔮', r: '𝔯', s: '𝔰', t: '𝔱', u: '𝔲', v: '𝔳', w: '𝔴', x: '𝔵', y: '𝔶', z: '𝔷',
        A: '𝔄', B: '𝔅', C: 'ℭ', D: '𝔇', E: '𝔈', F: '𝔉', G: '𝔊', H: 'ℌ', I: 'ℑ', J: '𝍍', K: '𝔎', L: '𝔏', M: '𝔐',
        N: '𝔑', O: '𝔒', P: '𝔓', Q: '𝔔', R: 'ℜ', S: '𝔖', T: '𝔗', U: '𝔘', V: '𝔙', W: '𝔚', X: '𝔛', Y: '𝔜', Z: 'ℨ',
      };
      return mapChars(t, map);
    },
  },
  {
    id: 'unicode-fraktur-bold',
    name: 'Fraktur Bold Gothic',
    category: 'Gothic & Fraktur',
    sample: '𝕱𝖗𝖆𝖐𝖙𝖚𝖗 𝕭𝖔𝖑𝖉',
    transform: (t) => {
      const map = {
        a: '𝖆', b: '𝖇', c: '𝖈', d: '𝖉', e: '𝖊', f: '𝖋', g: '𝖌', h: '𝖍', i: '𝖎', j: '𝖏', k: '𝖐', l: '𝖑', m: '𝖒',
        n: '𝖓', o: '𝖔', p: '𝖕', q: '𝖖', r: '𝖗', s: '𝖘', t: '𝖙', u: '𝖚', v: '𝖛', w: '𝖜', x: '𝖝', y: '𝖞', z: '𝖟',
        A: '𝕬', B: '𝕭', C: '𝕮', D: '𝕯', E: '𝕰', F: '𝕱', G: '𝕲', H: '𝕳', I: '𝕴', J: '𝕵', K: '𝕶', L: '𝕷', M: '𝕸',
        N: '𝕹', O: '𝕺', P: '𝕻', Q: '𝕼', R: '𝕽', S: '𝕾', T: '𝕿', U: '𝖀', V: '𝖁', W: '𝖂', X: '𝖃', Y: '𝖄', Z: '𝖅',
      };
      return mapChars(t, map);
    },
  },
  {
    id: 'unicode-double-struck',
    name: 'Double-Struck / Blackboard',
    category: 'Display & Decorative',
    sample: '𝔻𝕠𝕦𝕓𝕝𝕖-𝕊𝕥𝕣𝕦𝕔𝕜',
    transform: (t) => {
      const map = {
        a: '𝕒', b: '𝕓', c: '𝕔', d: '𝕕', e: '𝕖', f: '𝕗', g: '𝕘', h: '𝕙', i: '𝕚', j: '𝕛', k: '𝕜', l: '𝕝', m: '𝕞',
        n: '𝕟', o: '𝕠', p: '𝕡', q: '𝕢', r: '𝕣', s: '𝕤', t: '𝕥', u: '𝕦', v: '𝕧', w: '𝕨', x: '𝕩', y: '𝕪', z: '𝕫',
        A: '𝔸', B: '𝔹', C: 'ℂ', D: '𝔻', E: '𝔼', F: '𝔽', G: '𝔾', H: 'ℍ', I: '𝕀', J: '𝕁', K: '𝕂', L: '𝕃', M: '𝕄',
        N: 'ℕ', O: '𝕆', P: 'ℙ', Q: 'ℚ', R: 'ℝ', S: '𝕊', T: '𝕋', U: '𝕌', V: '𝕍', W: '𝕎', X: '𝕏', Y: '𝕐', Z: 'ℤ',
        '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛', '4': '𝟜', '5': '𝟝', '6': '𝟞', '7': '𝟟', '8': '𝟠', '9': '𝟡',
      };
      return mapChars(t, map);
    },
  },
  {
    id: 'unicode-small-caps',
    name: 'Small Capitals',
    category: 'Sans-Serif',
    sample: 'sᴍᴀʟʟ ᴄᴀᴘs',
    transform: (t) => {
      const map = {
        a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ',
        n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
        A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ꜰ', G: 'ɢ', H: 'ʜ', I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ',
        N: 'ɴ', O: 'ᴏ', P: 'ᴘ', Q: 'ǫ', R: 'ʀ', S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x', Y: 'ʏ', Z: 'ᴢ',
      };
      return mapChars(t, map);
    },
  },
  {
    id: 'unicode-bold-sans',
    name: 'Bold Sans-Serif',
    category: 'Sans-Serif',
    sample: '𝗕𝗼𝗹𝗱 𝗦𝗮𝗻𝘀',
    transform: (t) => {
      const map = {
        a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴', h: '𝗵', i: '𝗶', j: '𝗷', k: '𝗸', l: '𝗹', m: '𝗺',
        n: '𝗻', o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁', u: '𝘂', v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇',
        A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚', H: '𝗛', I: '𝗜', J: '𝗝', K: '𝗞', L: '𝗟', M: '𝗠',
        N: '𝗡', O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥', S: '𝗦', T: '𝗧', U: '𝗨', V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭',
        '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵',
      };
      return mapChars(t, map);
    },
  },
  {
    id: 'unicode-italic-sans',
    name: 'Italic Sans-Serif',
    category: 'Sans-Serif',
    sample: '𝘚𝘢𝘯𝘴 𝘐𝘵𝘢𝘭𝘪𝘤',
    transform: (t) => {
      const map = {
        a: '𝘢', b: '𝘣', c: '𝘤', d: '𝘥', e: '𝘦', f: '𝘧', g: '𝘨', h: '𝘩', i: '𝘪', j: '𝘫', k: '𝘬', l: '𝘭', m: '𝘮',
        n: '𝘯', o: '𝘰', p: '𝘱', q: '𝘲', r: '𝘳', s: '𝘴', t: '𝘵', u: '𝘶', v: '𝘷', w: '𝘸', x: '𝘹', y: '𝘺', z: '𝘻',
        A: '𝘈', B: '𝘉', C: '𝘊', D: '𝘋', E: '𝘌', F: '𝘍', G: '𝘎', H: '𝘏', I: '𝘐', J: '𝘑', K: '𝘒', L: '𝘓', M: '𝘔',
        N: '𝘕', O: '𝘖', P: '𝘗', Q: '𝘘', R: '𝘙', S: '𝘚', T: '𝘛', U: '𝘜', V: '𝘝', W: '𝘞', X: '𝘟', Y: '𝘠', Z: '𝘡',
      };
      return mapChars(t, map);
    },
  },
  {
    id: 'unicode-typewriter-mono',
    name: 'Typewriter Monospace',
    category: 'Monospace',
    sample: '𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎',
    transform: (t) => {
      const map = {
        a: '𝚊', b: '𝚋', c: '𝚌', d: '𝚍', e: '𝚎', f: '𝚏', g: '𝚐', h: '𝚑', i: '𝚒', j: '𝚓', k: '𝚔', l: '𝚕', m: '𝚖',
        n: '𝚗', o: '𝚘', p: '𝚙', q: '𝚚', r: '𝚛', s: '𝚜', t: '𝚝', u: '𝚞', v: '𝚟', w: '𝚠', x: '𝚡', y: '𝚢', z: '𝚣',
        A: '𝙰', B: '𝙱', C: '𝙲', D: '𝙳', E: '𝙴', F: '𝙵', G: '𝙶', H: '𝙷', I: '𝙸', J: '𝙹', K: '𝙺', L: '𝙻', M: '𝙼',
        N: '𝙽', O: '𝙾', P: '𝙿', Q: '𝚀', R: '𝚁', S: '𝚂', T: '𝚃', U: '𝚄', V: '𝚅', W: '𝚆', X: '𝚇', Y: '𝚈', Z: '𝚉',
        '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿',
      };
      return mapChars(t, map);
    },
  },
  {
    id: 'unicode-circled',
    name: 'Circled Bubble Letters',
    category: 'Display & Decorative',
    sample: 'Ⓒⓘⓡⓒⓛⓔⓓ',
    transform: (t) => {
      const map = {
        a: 'ⓐ', b: 'ⓑ', c: 'ⓒ', d: 'ⓓ', e: 'ⓔ', f: 'ⓕ', g: 'ⓖ', h: 'ⓗ', i: 'ⓘ', j: 'ⓙ', k: 'ⓚ', l: 'ⓛ', m: 'ⓜ',
        n: 'ⓝ', o: 'ⓞ', p: 'ⓟ', q: 'ⓠ', r: 'ⓡ', s: 'ⓢ', t: 'ⓣ', u: 'ⓤ', v: 'ⓥ', w: 'ⓦ', x: 'ⓧ', y: 'ⓨ', z: 'ⓩ',
        A: 'Ⓐ', B: 'Ⓑ', C: 'Ⓒ', D: 'Ⓓ', E: 'Ⓔ', F: 'Ⓕ', G: 'Ⓖ', H: 'Ⓗ', I: 'Ⓘ', J: 'Ⓙ', K: 'Ⓚ', L: 'Ⓛ', M: 'Ⓜ',
        N: 'Ⓝ', O: 'Ⓞ', P: 'Ⓟ', Q: '🅀', R: 'Ⓡ', S: 'Ⓢ', T: 'Ⓣ', U: 'Ⓤ', V: 'Ⓥ', W: 'Ⓦ', X: 'Ⓧ', Y: 'Ⓨ', Z: 'Ⓩ',
        '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨',
      };
      return mapChars(t, map);
    },
  },
  {
    id: 'unicode-dark-circled',
    name: 'Inverted Dark Circled',
    category: 'Display & Decorative',
    sample: '🅒🅘🅡🅒🅛🅔🅓',
    transform: (t) => {
      const map = {
        a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖', h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜',
        n: '🅝', o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤', v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
        A: '🅐', B: '🅑', C: '🅒', D: '🅓', E: '🅔', F: '🅕', G: '🅖', H: '🅗', I: '🅘', J: '🅙', K: '🅚', L: '🅛', M: '🅜',
        N: '🅝', O: '🅞', P: '🅟', Q: '🅠', R: '🅡', S: '🅢', T: '🅣', U: '🅤', V: '🅥', W: '🅦', X: '🅧', Y: '🅨', Z: '🅩',
      };
      return mapChars(t, map);
    },
  },
  {
    id: 'unicode-squared',
    name: 'Squared Letters',
    category: 'Display & Decorative',
    sample: '🅂🅀🅄🄰🅁🄴🅳',
    transform: (t) => {
      const map = {
        a: '🅂', b: '🄱', c: '🄲', d: '🄳', e: '🄴', f: '🄵', g: '🄶', h: '🄷', i: '🄸', j: '🄹', k: '🄺', l: '🄻', m: '🄼',
        n: '🄽', o: '🄾', p: '🄿', q: '🅀', r: '🅁', s: '🅂', t: '🅃', u: '🅄', v: '🅅', w: '🅆', x: '🅇', y: '🅈', z: '🅉',
        A: '🄰', B: '🄱', C: '🄲', D: '🄳', E: '🄴', F: '🄵', G: '🄶', H: '🄷', I: '🄸', J: '🄹', K: '🄺', L: '🄻', M: '🄼',
        N: '🄽', O: '🄾', P: '🄿', Q: '🅀', R: '🅁', S: '🅂', T: '🅃', U: '🅄', V: '🅅', W: '🅆', X: '🅇', Y: '🅈', Z: '🅉',
      };
      return mapChars(t, map);
    },
  },
  {
    id: 'unicode-dark-squared',
    name: 'Inverted Dark Squared',
    category: 'Display & Decorative',
    sample: '🆂🆀🆄🅰🆁🅴🅳',
    transform: (t) => {
      const map = {
        a: '🅰', b: '🅱', c: '🅲', d: '🅳', e: '🅴', f: '🅵', g: '🅶', h: '🅷', i: '🇮', j: '🅹', k: '🅺', l: '🅻', m: '🅼',
        n: '🅽', o: '🅾', p: '🅿', q: '🆀', r: '🆁', s: '🆂', t: '🆃', u: '🆄', v: '🆅', w: '🆆', x: '🆇', y: '🆈', z: '🆉',
        A: '🅰', B: '🅱', C: '🅲', D: '🅳', E: '🅴', F: '🅵', G: '🅶', H: '🅷', I: '🇮', J: '🅹', K: '🅺', L: '🅻', M: '🅼',
        N: '🅽', O: '🅾', P: '🅿', Q: '🆀', R: '🆁', S: '🆂', T: '🆃', U: '🆄', V: '🆅', W: '🆆', X: '🆇', Y: '🆈', Z: '🆉',
      };
      return mapChars(t, map);
    },
  },
  {
    id: 'unicode-vaporwave',
    name: 'Vaporwave / Fullwidth',
    category: 'Display & Decorative',
    sample: 'Ｆｕｌｌｗｉｄｔｈ',
    transform: (t) =>
      t
        .split('')
        .map((c) => {
          const code = c.charCodeAt(0);
          if (code >= 33 && code <= 126) return String.fromCharCode(code + 65248);
          if (code === 32) return '　';
          return c;
        })
        .join(''),
  },
  {
    id: 'unicode-upside-down',
    name: 'Upside Down / Inverted',
    category: 'Display & Decorative',
    sample: '˙˙˙ʇxǝʇ uʍop ǝpısdn',
    transform: (t) => {
      const map = {
        a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ',
        n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
        A: '∀', B: '𐐒', C: 'Ɔ', D: 'ᗡ', E: 'Ǝ', F: 'Ⅎ', G: '⅁', H: 'H', I: 'I', J: 'ſ', K: 'ʞ', L: '˥', M: 'W',
        N: 'N', O: 'O', P: 'Ԁ', Q: 'Ό', R: 'ᴚ', S: 'S', T: '┴', U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
      };
      return t.split('').reverse().map((c) => map[c] || c).join('');
    },
  },
  {
    id: 'unicode-strikethrough',
    name: 'Strikethrough Unicode',
    category: 'Display & Decorative',
    sample: 't̶e̶x̶t̶',
    transform: (t) => t.split('').map((c) => c + '\u0336').join(''),
  },
  {
    id: 'unicode-underline',
    name: 'Underline Unicode',
    category: 'Display & Decorative',
    sample: 't̲e̲x̲t̲',
    transform: (t) => t.split('').map((c) => c + '\u0332').join(''),
  },
  {
    id: 'unicode-double-underline',
    name: 'Double Underline Unicode',
    category: 'Display & Decorative',
    sample: 't̳e̳x̳t̳',
    transform: (t) => t.split('').map((c) => c + '\u0333').join(''),
  },
  {
    id: 'unicode-slash',
    name: 'Slashed Unicode',
    category: 'Display & Decorative',
    sample: 't̷e̷x̷t̷',
    transform: (t) => t.split('').map((c) => c + '\u0337').join(''),
  },
  {
    id: 'unicode-overline',
    name: 'Overline Unicode',
    category: 'Display & Decorative',
    sample: 't̅e̅x̅t̅',
    transform: (t) => t.split('').map((c) => c + '\u0305').join(''),
  },
  {
    id: 'unicode-zalgo',
    name: 'Zalgo Glitch Chaos',
    category: 'Display & Decorative',
    sample: 't̶̨e̶̢x̶t̶',
    transform: (t) => {
      const marks = ['\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0336', '\u0337'];
      return t.split('').map((c) => c + marks[Math.floor(Math.random() * marks.length)]).join('');
    },
  },
  {
    id: 'unicode-superscript',
    name: 'Superscript Small',
    category: 'Display & Decorative',
    sample: 'ˢᵘᵖᵉʳˢᶜʳᶦᵖᵗ',
    transform: (t) => {
      const map = {
        a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ', j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ',
        n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', r: 'ʳ', s: 'ˢ', t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
        A: 'ᴬ', B: 'ᴮ', D: 'ᴰ', E: 'ᴱ', G: 'ᴳ', H: 'ᴴ', I: 'ᴵ', J: 'ᴶ', K: 'ᴷ', L: 'ᴸ', M: 'ᴹ', N: 'ᴺ',
        O: 'ᴼ', P: 'ᴾ', R: 'ᴿ', T: 'ᵀ', U: 'ᵁ', W: 'ᵂ',
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
        '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
      };
      return mapChars(t, map);
    },
  },
  {
    id: 'unicode-subscript',
    name: 'Subscript Tiny',
    category: 'Display & Decorative',
    sample: 'ₛᵤᵦₛ꜀ᵣᵢₚₜ',
    transform: (t) => {
      const map = {
        a: 'ₐ', e: 'ₑ', h: 'ₕ', i: 'ᵢ', j: 'ⱼ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ', o: 'ₒ', p: 'ₚ', r: 'ᵣ', s: 'ₛ', t: 'ₜ', u: 'ᵤ', v: 'ᵥ', x: 'ₓ',
        '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
        '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
      };
      return mapChars(t, map);
    },
  },
  {
    id: 'unicode-spaced',
    name: 'Aesthetic Wide Spaced',
    category: 'Display & Decorative',
    sample: 'W  i  d  e',
    transform: (t) => t.split('').join('  '),
  },
  {
    id: 'unicode-sparkles',
    name: 'Sparkles Decorated',
    category: 'Display & Decorative',
    sample: '✨ S p a r k l e ✨',
    transform: (t) => `✨ ${t.split('').join(' ')} ✨`,
  },
  {
    id: 'unicode-brackets',
    name: 'Japanese Brackets',
    category: 'Display & Decorative',
    sample: '【 B r a c k e t s 】',
    transform: (t) => `【 ${t} 】`,
  },
];

// 2. WEB FONTS & GOOGLE FONTS (135+ fonts across Sans, Serif, Cursive, Mono, Gothic, Display)
export const WEB_FONT_FAMILIES = [
  // --- 1. SANS-SERIF (25 FONTS) ---
  { name: 'Inter', category: 'Sans-Serif', family: "Inter, system-ui, sans-serif", desc: 'Clean modern digital UI sans' },
  { name: 'Roboto', category: 'Sans-Serif', family: "'Roboto', sans-serif", google: 'Roboto:ital,wght@0,400;0,700;1,400', desc: 'Google Android signature sans' },
  { name: 'Open Sans', category: 'Sans-Serif', family: "'Open Sans', sans-serif", google: 'Open+Sans:ital,wght@0,400;0,700;1,400', desc: 'Neutral, humanistic sans' },
  { name: 'Montserrat', category: 'Sans-Serif', family: "'Montserrat', sans-serif", google: 'Montserrat:ital,wght@0,400;0,700;1,400', desc: 'Urban geometric poster sans' },
  { name: 'Poppins', category: 'Sans-Serif', family: "'Poppins', sans-serif", google: 'Poppins:ital,wght@0,400;0,700;1,400', desc: 'Geometric rounded display sans' },
  { name: 'Lato', category: 'Sans-Serif', family: "'Lato', sans-serif", google: 'Lato:ital,wght@0,400;0,700;1,400', desc: 'Warm transparent humanist sans' },
  { name: 'Raleway', category: 'Sans-Serif', family: "'Raleway', sans-serif", google: 'Raleway:ital,wght@0,400;0,700;1,400', desc: 'Elegant thin geometric sans' },
  { name: 'Nunito', category: 'Sans-Serif', family: "'Nunito', sans-serif", google: 'Nunito:ital,wght@0,400;0,700;1,400', desc: 'Balanced rounded sans' },
  { name: 'Work Sans', category: 'Sans-Serif', family: "'Work Sans', sans-serif", google: 'Work+Sans:wght@400;700', desc: 'Early grotesque optimization' },
  { name: 'Plus Jakarta Sans', category: 'Sans-Serif', family: "'Plus Jakarta Sans', sans-serif", google: 'Plus+Jakarta+Sans:wght@400;600;700', desc: 'Modern tech typography' },
  { name: 'DM Sans', category: 'Sans-Serif', family: "'DM Sans', sans-serif", google: 'DM+Sans:wght@400;700', desc: 'Low-contrast geometric sans' },
  { name: 'Rubik', category: 'Sans-Serif', family: "'Rubik', sans-serif", google: 'Rubik:wght@400;700', desc: 'Slightly rounded corners sans' },
  { name: 'Outfit', category: 'Sans-Serif', family: "'Outfit', sans-serif", google: 'Outfit:wght@400;700', desc: 'Sleek brand typography sans' },
  { name: 'Manrope', category: 'Sans-Serif', family: "'Manrope', sans-serif", google: 'Manrope:wght@400;700', desc: 'Modern crossover geometric sans' },
  { name: 'Syne', category: 'Sans-Serif', family: "'Syne', sans-serif", google: 'Syne:wght@400;700', desc: 'Artistic avant-garde sans' },
  { name: 'Figtree', category: 'Sans-Serif', family: "'Figtree', sans-serif", google: 'Figtree:wght@400;700', desc: 'Friendly clean geometric sans' },
  { name: 'Quicksand', category: 'Sans-Serif', family: "'Quicksand', sans-serif", google: 'Quicksand:wght@400;700', desc: 'Display sans with rounded ends' },
  { name: 'Jost', category: 'Sans-Serif', family: "'Jost', sans-serif", google: 'Jost:wght@400;700', desc: 'Futura-inspired German sans' },
  { name: 'Urbanist', category: 'Sans-Serif', family: "'Urbanist', sans-serif", google: 'Urbanist:wght@400;700', desc: 'Minimal modernist geometric sans' },
  { name: 'Sora', category: 'Sans-Serif', family: "'Sora', sans-serif", google: 'Sora:wght@400;700', desc: 'Cryptocurrency & tech modern sans' },
  { name: 'Lexend', category: 'Sans-Serif', family: "'Lexend', sans-serif", google: 'Lexend:wght@400;700', desc: 'Engineered for high reading speed' },
  { name: 'Cabin', category: 'Sans-Serif', family: "'Cabin', sans-serif", google: 'Cabin:wght@400;700', desc: 'Humanist sans with curved strokes' },
  { name: 'Kanit', category: 'Sans-Serif', family: "'Kanit', sans-serif", google: 'Kanit:wght@400;700', desc: 'Compact modern display sans' },
  { name: 'Barlow', category: 'Sans-Serif', family: "'Barlow', sans-serif", google: 'Barlow:wght@400;700', desc: 'California highway sign inspired' },
  { name: 'Red Hat Display', category: 'Sans-Serif', family: "'Red Hat Display', sans-serif", google: 'Red+Hat+Display:wght@400;700', desc: 'Open enterprise modern sans' },

  // --- 2. SERIF & ROMAN (25 FONTS) ---
  { name: 'Times New Roman', category: 'Serif / Roman', family: "'Times New Roman', Times, serif", desc: 'Classic newspaper Roman serif' },
  { name: 'Georgia', category: 'Serif / Roman', family: "Georgia, serif", desc: 'Digital native editorial Roman' },
  { name: 'Cinzel Decorative', category: 'Serif / Roman', family: "'Cinzel Decorative', serif", google: 'Cinzel+Decorative:wght@400;700', desc: 'Imperial Roman capitals with flourishes' },
  { name: 'Cinzel', category: 'Serif / Roman', family: "'Cinzel', serif", google: 'Cinzel:wght@400;700', desc: 'Classic monument inscription Roman' },
  { name: 'Playfair Display', category: 'Serif / Roman', family: "'Playfair Display', serif", google: 'Playfair+Display:ital,wght@0,400;1,400', desc: 'High-fashion transitional Roman' },
  { name: 'Bodoni Moda', category: 'Serif / Roman', family: "'Bodoni Moda', serif", google: 'Bodoni+Moda:ital,wght@0,400;1,400', desc: 'Luxury Italian Didone Roman' },
  { name: 'EB Garamond', category: 'Serif / Roman', family: "'EB Garamond', serif", google: 'EB+Garamond:ital,wght@0,400;1,400', desc: 'Classical 16th-century Claude Garamond' },
  { name: 'Cormorant Garamond', category: 'Serif / Roman', family: "'Cormorant Garamond', serif", google: 'Cormorant+Garamond:ital,wght@0,400;1,400', desc: 'Traditional fine book Roman' },
  { name: 'Libre Baskerville', category: 'Serif / Roman', family: "'Libre Baskerville', serif", google: 'Libre+Baskerville:ital,wght@0,400;1,400', desc: '18th-century British transitional Roman' },
  { name: 'Lora', category: 'Serif / Roman', family: "'Lora', serif", google: 'Lora:ital,wght@0,400;1,400', desc: 'Contemporary calligraphic Roman serif' },
  { name: 'Merriweather', category: 'Serif / Roman', family: "'Merriweather', serif", google: 'Merriweather:ital,wght@0,400;1,400', desc: 'Robust text face for screen reading' },
  { name: 'PT Serif', category: 'Serif / Roman', family: "'PT Serif', serif", google: 'PT+Serif:ital,wght@0,400;1,400', desc: 'Universal editorial Roman serif' },
  { name: 'Alegreya', category: 'Serif / Roman', family: "'Alegreya', serif", google: 'Alegreya:ital,wght@0,400;1,400', desc: 'Literary dynamic Roman serif' },
  { name: 'Spectral', category: 'Serif / Roman', family: "'Spectral', serif", google: 'Spectral:ital,wght@0,400;1,400', desc: 'Academic publishing Roman serif' },
  { name: 'Crimson Text', category: 'Serif / Roman', family: "'Crimson Text', serif", google: 'Crimson+Text:ital,wght@0,400;1,400', desc: 'Book production garalde Roman' },
  { name: 'DM Serif Display', category: 'Serif / Roman', family: "'DM Serif Display', serif", google: 'DM+Serif+Display', desc: 'High-contrast poster Roman serif' },
  { name: 'Arvo', category: 'Serif / Roman', family: "'Arvo', serif", google: 'Arvo:ital,wght@0,400;1,400', desc: 'Geometric slab-serif Roman' },
  { name: 'Vollkorn', category: 'Serif / Roman', family: "'Vollkorn', serif", google: 'Vollkorn:ital,wght@0,400;1,400', desc: 'German sturdy Roman serif' },
  { name: 'Frank Ruhl Libre', category: 'Serif / Roman', family: "'Frank Ruhl Libre', serif", google: 'Frank+Ruhl+Libre:wght@400;700', desc: 'Classic Hebrew-inspired Roman serif' },
  { name: 'Prata', category: 'Serif / Roman', family: "'Prata', serif", google: 'Prata', desc: 'Didone-style teardrop Roman' },
  { name: 'Castoro', category: 'Serif / Roman', family: "'Castoro', serif", google: 'Castoro:ital@0;1', desc: 'Academic scholarly Roman serif' },
  { name: 'Rozha One', category: 'Serif / Roman', family: "'Rozha One', serif", google: 'Rozha+One', desc: 'Extreme thick-and-thin Roman display' },
  { name: 'Baskervville', category: 'Serif / Roman', family: "'Baskervville', serif", google: 'Baskervville:ital@0;1', desc: 'Faithful British classical revival' },
  { name: 'Marcellus', category: 'Serif / Roman', family: "'Marcellus', serif", google: 'Marcellus', desc: 'Trajan Roman column inscriptional serif' },
  { name: 'Caudex', category: 'Serif / Roman', family: "'Caudex', serif", google: 'Caudex:ital,wght@0,400;1,400', desc: 'Medieval manuscript Roman serif' },

  // --- 3. CURSIVE & SCRIPT (25 FONTS) ---
  { name: 'Great Vibes', category: 'Cursive & Script', family: "'Great Vibes', cursive", google: 'Great+Vibes', desc: 'Classic flowing calligraphy flourishes' },
  { name: 'Alex Brush', category: 'Cursive & Script', family: "'Alex Brush', cursive", google: 'Alex+Brush', desc: 'Flowing, graceful wedding script' },
  { name: 'Parisienne', category: 'Cursive & Script', family: "'Parisienne', cursive", google: 'Parisienne', desc: 'Elegant French cursive handwriting' },
  { name: 'Allura', category: 'Cursive & Script', family: "'Allura', cursive", google: 'Allura', desc: 'Smooth, stylized feminine script' },
  { name: 'Herr Von Muellerhoff', category: 'Cursive & Script', family: "'Herr Von Muellerhoff', cursive", google: 'Herr+Von+Muellerhoff', desc: '19th-century cursive loops & swashes' },
  { name: 'Mrs Saint Delafield', category: 'Cursive & Script', family: "'Mrs Saint Delafield', cursive", google: 'Mrs+Saint+Delafield', desc: 'Elaborate flowing cursive calligraphy' },
  { name: 'Monsieur La Doulaise', category: 'Cursive & Script', family: "'Monsieur La Doulaise', cursive", google: 'Monsieur+La+Doulaise', desc: 'Delicate vintage cursive flourishes' },
  { name: 'Pinyon Script', category: 'Cursive & Script', family: "'Pinyon Script', cursive", google: 'Pinyon+Script', desc: 'Royal aristocratic cursive penmanship' },
  { name: 'Tangerine', category: 'Cursive & Script', family: "'Tangerine', cursive", google: 'Tangerine:wght@400;700', desc: 'Tall calligraphic flourishes and swashes' },
  { name: 'WindSong', category: 'Cursive & Script', family: "'WindSong', cursive", google: 'WindSong:wght@400;500', desc: 'Modern signature cursive script' },
  { name: 'Sacramento', category: 'Cursive & Script', family: "'Sacramento', cursive", google: 'Sacramento', desc: 'Connected monoline handwriting script' },
  { name: 'Cedarville Cursive', category: 'Cursive & Script', family: "'Cedarville Cursive', cursive", google: 'Cedarville+Cursive', desc: 'Authentic school cursive penmanship' },
  { name: 'Homemade Apple', category: 'Cursive & Script', family: "'Homemade Apple', cursive", google: 'Homemade+Apple', desc: 'Natural ballpoint cursive handwriting' },
  { name: 'Meow Script', category: 'Cursive & Script', family: "'Meow Script', cursive", google: 'Meow+Script', desc: 'Modern bouncy cursive handwriting' },
  { name: 'Marck Script', category: 'Cursive & Script', family: "'Marck Script', cursive", google: 'Marck+Script', desc: 'Natural quill pen cursive handwriting' },
  { name: 'Rouge Script', category: 'Cursive & Script', family: "'Rouge Script', cursive", google: 'Rouge+Script', desc: 'Soft, delicate red-carpet cursive' },
  { name: 'Dancing Script', category: 'Cursive & Script', family: "'Dancing Script', cursive", google: 'Dancing+Script:wght@400;700', desc: 'Casual lively bouncy script' },
  { name: 'Pacifico', category: 'Cursive & Script', family: "'Pacifico', cursive", google: 'Pacifico', desc: 'Bold brush surf cursive script' },
  { name: 'Caveat', category: 'Cursive & Script', family: "'Caveat', cursive", google: 'Caveat:wght@400;700', desc: 'Warm personal handwriting script' },
  { name: 'Satisfy', category: 'Cursive & Script', family: "'Satisfy', cursive", google: 'Satisfy', desc: 'Fluid brush signature script' },
  { name: 'Yellowtail', category: 'Cursive & Script', family: "'Yellowtail', cursive", google: 'Yellowtail', desc: 'Old-school 1930s script' },
  { name: 'Courgette', category: 'Cursive & Script', family: "'Courgette', cursive", google: 'Courgette', desc: 'Medium-weight fluid cursive' },
  { name: 'Cookie', category: 'Cursive & Script', family: "'Cookie', cursive", google: 'Cookie', desc: 'Sweet vintage 50s script' },
  { name: 'Shadows Into Light', category: 'Cursive & Script', family: "'Shadows Into Light', cursive", google: 'Shadows+Into+Light', desc: 'Neat feminine handwriting' },
  { name: 'Kalam', category: 'Cursive & Script', family: "'Kalam', cursive", google: 'Kalam:wght@400;700', desc: 'Handwritten ballpoint pen script' },

  // --- 4. MONOSPACE & CODE (15 FONTS) ---
  { name: 'JetBrains Mono', category: 'Monospace', family: "'JetBrains Mono', monospace", google: 'JetBrains+Mono:wght@400;700', desc: 'Modern developer code typeface' },
  { name: 'Fira Code', category: 'Monospace', family: "'Fira Code', monospace", google: 'Fira+Code:wght@400;700', desc: 'Programming ligatures monospace' },
  { name: 'Roboto Mono', category: 'Monospace', family: "'Roboto Mono', monospace", google: 'Roboto+Mono:wght@400;700', desc: 'Mechanical geometric monospace' },
  { name: 'Inconsolata', category: 'Monospace', family: "'Inconsolata', monospace", google: 'Inconsolata:wght@400;700', desc: 'Humanist monospace code font' },
  { name: 'Space Mono', category: 'Monospace', family: "'Space Mono', monospace", google: 'Space+Mono:wght@400;700', desc: 'Retro-futuristic monospace' },
  { name: 'Source Code Pro', category: 'Monospace', family: "'Source Code Pro', monospace", google: 'Source+Code+Pro:wght@400;700', desc: 'Adobe clean coding monospace' },
  { name: 'IBM Plex Mono', category: 'Monospace', family: "'IBM Plex Mono', monospace", google: 'IBM+Plex+Mono:wght@400;700', desc: 'Industrial engineering monospace' },
  { name: 'Courier Prime', category: 'Monospace', family: "'Courier Prime', monospace", google: 'Courier+Prime:ital,wght@0,400;1,400', desc: 'Screenplay typewriter monospace' },
  { name: 'Cousine', category: 'Monospace', family: "'Cousine', monospace", google: 'Cousine:wght@400;700', desc: 'Clean metrically compatible mono' },
  { name: 'VT323', category: 'Monospace', family: "'VT323', monospace", google: 'VT323', desc: 'Vintage DEC terminal screen mono' },
  { name: 'Share Tech Mono', category: 'Monospace', family: "'Share Tech Mono', monospace", google: 'Share+Tech+Mono', desc: 'Cyberpunk HUD terminal monospace' },
  { name: 'Major Mono Display', category: 'Monospace', family: "'Major Mono Display', monospace", google: 'Major+Mono+Display', desc: 'Abstract minimalist geometric mono' },
  { name: 'Overpass Mono', category: 'Monospace', family: "'Overpass Mono', monospace", google: 'Overpass+Mono:wght@400;700', desc: 'Highway sign monospace' },
  { name: 'Ubuntu Mono', category: 'Monospace', family: "'Ubuntu Mono', monospace", google: 'Ubuntu+Mono:wght@400;700', desc: 'Linux terminal monospace' },
  { name: 'Anonymous Pro', category: 'Monospace', family: "'Anonymous Pro', monospace", google: 'Anonymous+Pro:wght@400;700', desc: 'Fixed-width coder font' },

  // --- 5. GOTHIC, FRAKTUR & MEDIEVAL (15 FONTS) ---
  { name: 'UnifrakturMaguntia', category: 'Gothic & Fraktur', family: "'UnifrakturMaguntia', cursive", google: 'UnifrakturMaguntia', desc: 'Authentic 19th-century German Fraktur' },
  { name: 'Pirata One', category: 'Gothic & Fraktur', family: "'Pirata One', cursive", google: 'Pirata+One', desc: 'Pirate gothic text display' },
  { name: 'MedievalSharp', category: 'Gothic & Fraktur', family: "'MedievalSharp', cursive", google: 'MedievalSharp', desc: 'Medieval gothic sharp letterform' },
  { name: 'Creepster', category: 'Gothic & Fraktur', family: "'Creepster', cursive", google: 'Creepster', desc: 'Horror drip gothic lettering' },
  { name: 'Nosifer', category: 'Gothic & Fraktur', family: "'Nosifer', cursive", google: 'Nosifer', desc: 'Bleeding horror gothic display' },
  { name: 'Butcherman', category: 'Gothic & Fraktur', family: "'Butcherman', cursive", google: 'Butcherman', desc: 'Slashing horror gothic display' },
  { name: 'Eater', category: 'Gothic & Fraktur', family: "'Eater', cursive", google: 'Eater', desc: 'Dark jagged monstrous lettering' },
  { name: 'Frijole', category: 'Gothic & Fraktur', family: "'Frijole', cursive", google: 'Frijole', desc: 'Distressed vintage bold gothic' },
  { name: 'Sancreek', category: 'Gothic & Fraktur', family: "'Sancreek', cursive", google: 'Sancreek', desc: 'Western circus ornate display' },
  { name: 'Rye', category: 'Gothic & Fraktur', family: "'Rye', cursive", google: 'Rye', desc: 'Wild West saloon poster typeface' },
  { name: 'Metal Mania', category: 'Gothic & Fraktur', family: "'Metal Mania', cursive", google: 'Metal+Mania', desc: 'Heavy metal band gothic lettering' },
  { name: 'Flavors', category: 'Gothic & Fraktur', family: "'Flavors', cursive", google: 'Flavors', desc: 'Twisted eccentric script gothic' },
  { name: 'New Rocker', category: 'Gothic & Fraktur', family: "'New Rocker', cursive", google: 'New+Rocker', desc: 'Hard rock edgy blackletter' },
  { name: 'Caesar Dressing', category: 'Gothic & Fraktur', family: "'Caesar Dressing', cursive", google: 'Caesar+Dressing', desc: 'Ancient Roman distressed display' },
  { name: 'Trade Winds', category: 'Gothic & Fraktur', family: "'Trade Winds', cursive", google: 'Trade+Winds', desc: 'Tropical adventurous weathered display' },

  // --- 6. DISPLAY, RETRO & DECORATIVE (30 FONTS) ---
  { name: 'Bebas Neue', category: 'Display & Decorative', family: "'Bebas Neue', cursive", google: 'Bebas+Neue', desc: 'Tall punchy all-caps headline' },
  { name: 'Oswald', category: 'Display & Decorative', family: "'Oswald', sans-serif", google: 'Oswald:wght@400;700', desc: 'Classic newspaper headline Gothic' },
  { name: 'Lobster', category: 'Display & Decorative', family: "'Lobster', cursive", google: 'Lobster', desc: 'Bold vintage diner script' },
  { name: 'Righteous', category: 'Display & Decorative', family: "'Righteous', cursive", google: 'Righteous', desc: 'Retro 80s arcade deco display' },
  { name: 'Permanent Marker', category: 'Display & Decorative', family: "'Permanent Marker', cursive", google: 'Permanent+Marker', desc: 'Chisel-tip marker pen street style' },
  { name: 'Bangers', category: 'Display & Decorative', family: "'Bangers', cursive", google: 'Bangers', desc: 'Superhero comic book loud display' },
  { name: 'Fredoka', category: 'Display & Decorative', family: "'Fredoka', sans-serif", google: 'Fredoka:wght@400;700', desc: 'Cute chubby rounded display' },
  { name: 'Press Start 2P', category: 'Display & Decorative', family: "'Press Start 2P', monospace", google: 'Press+Start+2P', desc: '8-bit retro arcade pixel gaming' },
  { name: 'Monoton', category: 'Display & Decorative', family: "'Monoton', cursive", google: 'Monoton', desc: '70s retro neon disco line art' },
  { name: 'Special Elite', category: 'Display & Decorative', family: "'Special Elite', cursive", google: 'Special+Elite', desc: 'Grungy Smith-Corona typewriter' },
  { name: 'Abril Fatface', category: 'Display & Decorative', family: "'Abril Fatface', cursive", google: 'Abril+Fatface', desc: 'Heavy dramatic 19th-century titling' },
  { name: 'Bungee', category: 'Display & Decorative', family: "'Bungee', cursive", google: 'Bungee', desc: 'Urban vertical street sign display' },
  { name: 'Audiowide', category: 'Display & Decorative', family: "'Audiowide', cursive", google: 'Audiowide', desc: 'Futuristic sci-fi techno display' },
  { name: 'Faster One', category: 'Display & Decorative', family: "'Faster One', cursive", google: 'Faster+One', desc: 'High-speed wind velocity racing' },
  { name: 'Orbitron', category: 'Display & Decorative', family: "'Orbitron', sans-serif", google: 'Orbitron:wght@400;700', desc: 'Futuristic space cockpit HUD' },
  { name: 'Shrikhand', category: 'Display & Decorative', family: "'Shrikhand', cursive", google: 'Shrikhand', desc: 'Bold Gujarati truck art display' },
  { name: 'Titan One', category: 'Display & Decorative', family: "'Titan One', cursive", google: 'Titan+One', desc: 'Chubby poster lettering' },
  { name: 'Ultra', category: 'Display & Decorative', family: "'Ultra', serif", google: 'Ultra', desc: 'Heavy Egyptian wood type slab' },
  { name: 'Luckiest Guy', category: 'Display & Decorative', family: "'Luckiest Guy', cursive", google: 'Luckiest+Guy', desc: 'Retro 50s commercial cartoon' },
  { name: 'Black Ops One', category: 'Display & Decorative', family: "'Black Ops One', cursive", google: 'Black+Ops+One', desc: 'Heavy military stencil lettering' },
  { name: 'Silkscreen', category: 'Display & Decorative', family: "'Silkscreen', monospace", google: 'Silkscreen:wght@400;700', desc: 'Classic digital pixel typeface' },
  { name: 'Rubik Glitch', category: 'Display & Decorative', family: "'Rubik Glitch', cursive", google: 'Rubik+Glitch', desc: 'Distorted digital glitch display' },
  { name: 'Bungee Shade', category: 'Display & Decorative', family: "'Bungee Shade', cursive", google: 'Bungee+Shade', desc: '3D shaded retro signage' },
  { name: 'Megrim', category: 'Display & Decorative', family: "'Megrim', cursive", google: 'Megrim', desc: 'Abstract futuristic art deco' },
  { name: 'Chango', category: 'Display & Decorative', family: "'Chango', cursive", google: 'Chango', desc: 'Playful heavy cartoon display' },
  { name: 'Monofett', category: 'Display & Decorative', family: "'Monofett', monospace", google: 'Monofett', desc: 'Extra heavy futuristic stencil' },
  { name: 'Bungee Inline', category: 'Display & Decorative', family: "'Bungee Inline', cursive", google: 'Bungee+Inline', desc: 'Inline automotive signage' },
  { name: 'Poiret One', category: 'Display & Decorative', family: "'Poiret One', cursive", google: 'Poiret+One', desc: 'Art Deco geometric light display' },
  { name: 'Kavoon', category: 'Display & Decorative', family: "'Kavoon', cursive", google: 'Kavoon', desc: 'Feminine playful poster script' },
  { name: 'Smokum', category: 'Display & Decorative', family: "'Smokum', cursive", google: 'Smokum', desc: 'Western wanted poster woodcut' },
];

// Helper to inject Google fonts on-demand
const loadedFontNames = new Set();
export function loadGoogleFont(fontName) {
  const font = WEB_FONT_FAMILIES.find((f) => f.name === fontName);
  if (!font || !font.google || loadedFontNames.has(fontName)) return;

  try {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
    document.head.appendChild(link);
    loadedFontNames.add(fontName);
  } catch (err) {
    console.warn('Could not inject font:', fontName, err);
  }
}
