// 웹폰트 서브셋 만들기: npm run fonts:subset
// fonts-src의 TossFace에서 쓰는 이모지만 남겨 public/fonts에 woff2로 저장하고,
// 조각별 @font-face 규칙을 src/css/_tossface.scss로 만든다.
// 데코 종류나 이모지를 바꾼 뒤 다시 실행한다.
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as hb from "harfbuzzjs";
import fontverter from "fontverter";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = path.join(root, "src");
const FONT_SRC = path.join(root, "fonts-src");
const FONT_OUT = path.join(root, "public", "fonts");
const FACES_SCSS = path.join(SRC_DIR, "css", "_tossface.scss");

async function readSources(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const texts = await Promise.all(
    entries.map(async (e) => {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) return readSources(p);
      return /\.(jsx?|json)$/.test(e.name) ? readFile(p, "utf8") : "";
    })
  );
  return texts.join("\n");
}

const kb = (n) => `${(n / 1024).toFixed(0)}KB`;
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

/* ── sfnt 읽고 쓰기 ── */
function readTables(buf) {
  const tables = {};
  for (let i = 0; i < buf.readUInt16BE(4); i++) {
    const o = 12 + i * 16;
    const offset = buf.readUInt32BE(o + 8);
    tables[buf.toString("latin1", o, o + 4)] = buf.subarray(offset, offset + buf.readUInt32BE(o + 12));
  }
  return tables;
}

function checksum(buf) {
  const padded = Buffer.concat([buf, Buffer.alloc((4 - (buf.length % 4)) % 4)]);
  let sum = 0;
  for (let i = 0; i < padded.length; i += 4) sum = (sum + padded.readUInt32BE(i)) >>> 0;
  return sum;
}

function writeFont(tables) {
  const tags = Object.keys(tables).sort();
  const n = tags.length;
  const entrySelector = Math.floor(Math.log2(n));
  const searchRange = 2 ** entrySelector * 16;
  const header = Buffer.alloc(12 + n * 16);
  header.writeUInt32BE(0x00010000, 0);
  header.writeUInt16BE(n, 4);
  header.writeUInt16BE(searchRange, 6);
  header.writeUInt16BE(entrySelector, 8);
  header.writeUInt16BE(n * 16 - searchRange, 10);

  const head = Buffer.from(tables.head);
  head.writeUInt32BE(0, 8);
  const data = { ...tables, head };

  let offset = header.length;
  const chunks = [];
  tags.forEach((tag, i) => {
    const body = data[tag];
    const o = 12 + i * 16;
    header.write(tag, o, "latin1");
    header.writeUInt32BE(checksum(body), o + 4);
    header.writeUInt32BE(offset, o + 8);
    header.writeUInt32BE(body.length, o + 12);
    const pad = Buffer.alloc((4 - (body.length % 4)) % 4);
    chunks.push(body, pad);
    offset += body.length + pad.length;
  });
  const font = Buffer.concat([header, ...chunks]);
  const headOffset = header.readUInt32BE(12 + tags.indexOf("head") * 16 + 8);
  font.writeUInt32BE((0xb1b0afba - checksum(font)) >>> 0, headOffset + 8);
  return font;
}

/* ── TossFace ──
 * 비트맵(sbix) 이모지 폰트라 번들된 harfbuzz 서브셋으로는 그림이 빠진다.
 * 글리프 번호는 그대로 두고 조각마다 필요한 PNG만 남긴다.
 * cmap은 원본 그대로라, 조각마다 unicode-range를 정확히 걸어야 빈 글리프를 쓰지 않는다. */
function shapeGlyphIds(font, strings) {
  const ids = new Set([0]);
  for (const text of strings) {
    const buffer = new hb.Buffer();
    buffer.addText(text);
    buffer.guessSegmentProperties();
    hb.shape(font, buffer);
    for (const g of buffer.getGlyphInfos()) ids.add(g.codepoint);
    buffer.destroy?.();
  }
  return ids;
}

function keepSbixGlyphs(sbix, numGlyphs, keep) {
  const numStrikes = sbix.readUInt32BE(4);
  const headerLen = 8 + numStrikes * 4;
  const strikes = [];
  for (let s = 0; s < numStrikes; s++) {
    const start = sbix.readUInt32BE(8 + s * 4);
    const offsetsLen = (numGlyphs + 1) * 4;
    const out = Buffer.alloc(4 + offsetsLen);
    sbix.copy(out, 0, start, start + 4);
    const bodies = [];
    let cursor = 4 + offsetsLen;
    for (let g = 0; g < numGlyphs; g++) {
      out.writeUInt32BE(cursor, 4 + g * 4);
      const a = sbix.readUInt32BE(start + 4 + g * 4);
      const b = sbix.readUInt32BE(start + 8 + g * 4);
      if (keep.has(g) && b > a) {
        bodies.push(sbix.subarray(start + a, start + b));
        cursor += b - a;
      }
    }
    out.writeUInt32BE(cursor, 4 + numGlyphs * 4);
    strikes.push(Buffer.concat([out, ...bodies]));
  }
  const header = Buffer.alloc(headerLen);
  sbix.copy(header, 0, 0, 4);
  header.writeUInt32BE(numStrikes, 4);
  let offset = headerLen;
  strikes.forEach((strike, s) => {
    header.writeUInt32BE(offset, 8 + s * 4);
    offset += strike.length;
  });
  return Buffer.concat([header, ...strikes]);
}

function postWithoutNames(post) {
  const out = Buffer.from(post.subarray(0, 32));
  out.writeUInt32BE(0x00030000, 0);
  return out;
}

function unicodeRange(codepoints) {
  const sorted = [...new Set(codepoints)].sort((a, b) => a - b);
  const parts = [];
  for (let i = 0; i < sorted.length; i++) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j++;
    const hex = (n) => n.toString(16).toUpperCase();
    parts.push(i === j ? `U+${hex(sorted[i])}` : `U+${hex(sorted[i])}-${hex(sorted[j])}`);
    i = j;
  }
  return parts.join(", ");
}

// 화면 문구에는 없지만 의견 글에 자주 쓰는 이모지. 화면에 나올 때만 해당 조각을 받는다
const TYPED_EMOJI = {
  faces: [...range(0x1f600, 0x1f64f), ...range(0x1f910, 0x1f92f), ...range(0x1f970, 0x1f97f), 0x263a, 0x2639],
  hearts: [
    0x2764, 0x2763, ...range(0x1f493, 0x1f49f), 0x1f5a4, 0x1f90d, 0x1f90e, 0x1f9e1, 0x1f4aa,
    ...range(0x1f446, 0x1f450), 0x1f590, 0x1f595, 0x1f596, 0x1f90c, 0x1f90f, ...range(0x1f918, 0x1f91f),
    0x1f932, ...range(0x270a, 0x270d), 0x261d,
  ],
  misc: [
    0x2728, 0x2b50, 0x1f31f, 0x1f389, 0x1f38a, 0x1f381, 0x1f4af, 0x1f4cd, 0x1f4cc, 0x1f4a1, 0x1f680,
    0x2705, 0x274c, 0x2757, 0x2753, 0x1f340, 0x1f4a4, 0x1f4a6, 0x1f4a8, 0x1f3b5, 0x1f4e2, 0x1f6a8,
    0x2600, 0x2601, 0x26a1, 0x2744, 0x1f308, 0x1f319, 0x1f31e, 0x1f4f7, 0x1f60e,
  ],
};

const CHUNK_SIZE = 16;

async function buildTossFace(code) {
  const source = await readFile(path.join(FONT_SRC, "tossface.ttf"));
  const face = new hb.Face(new hb.Blob(source));
  const font = new hb.Font(face);
  const supported = new Set(face.collectUnicodes());
  const tables = readTables(source);
  const numGlyphs = tables.maxp.readUInt16BE(4);
  // eslint-disable-next-line no-unused-vars -- 서명 테이블은 버린다
  const { DSIG, ...base } = tables;
  const post = postWithoutNames(tables.post);

  const uiEmoji = [...new Set(code.match(/\p{RGI_Emoji}|\p{Extended_Pictographic}/gv) ?? [])];
  const uiCodepoints = new Set(uiEmoji.flatMap((e) => [...e].map((c) => c.codePointAt(0))));
  const chunks = [{ name: "ui", strings: uiEmoji, codepoints: [...uiCodepoints] }];
  // 16개씩 나눠, 글에 이모지 몇 개만 있어도 그 이모지가 든 작은 조각만 받게 한다
  for (const [name, list] of Object.entries(TYPED_EMOJI)) {
    const cps = list.filter((cp) => supported.has(cp) && !uiCodepoints.has(cp));
    for (let i = 0; i < cps.length; i += CHUNK_SIZE) {
      const part = cps.slice(i, i + CHUNK_SIZE);
      chunks.push({
        name: `${name}-${i / CHUNK_SIZE + 1}`,
        strings: part.map((cp) => String.fromCodePoint(cp)),
        codepoints: part,
      });
    }
  }

  const rules = [];
  for (const chunk of chunks) {
    const keep = shapeGlyphIds(font, chunk.strings);
    const sfnt = writeFont({ ...base, sbix: keepSbixGlyphs(tables.sbix, numGlyphs, keep), post });
    const woff2 = await fontverter.convert(sfnt, "woff2");
    const file = `tossface-${chunk.name}.woff2`;
    await writeFile(path.join(FONT_OUT, file), woff2);
    rules.push(
      [
        "@font-face {",
        '  font-family: "TossFace";',
        `  src: url("/fonts/${file}") format("woff2");`,
        "  font-display: swap;",
        `  unicode-range: ${unicodeRange(chunk.codepoints)};`,
        "}",
      ].join("\n")
    );
    console.log(`TossFace ${chunk.name}: ${chunk.strings.length} emoji, ${kb(woff2.length)}`);
  }
  font.destroy?.();
  face.destroy?.();

  await writeFile(
    FACES_SCSS,
    `// npm run fonts:subset 으로 만든 파일. 직접 고치지 않는다\n${rules.join("\n\n")}\n`
  );
}

const code = await readSources(SRC_DIR);
await buildTossFace(code);
