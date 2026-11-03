// 웹폰트 서브셋 만들기: npm run fonts:subset
// fonts-src의 원본 폰트에서 실제로 쓰는 글자만 남겨 public/fonts에 woff2로 저장한다.
// 데코 종류, 이모지, 일본어 문구를 바꾼 뒤 다시 실행한다.
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as hb from "harfbuzzjs";
import fontverter from "fontverter";
import subsetFont from "subset-font";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = path.join(root, "src");
const FONT_SRC = path.join(root, "fonts-src");
const FONT_OUT = path.join(root, "public", "fonts");

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

/* ── sfnt 읽고 쓰기 ── */
function readTables(buf) {
  const count = buf.readUInt16BE(4);
  const tables = {};
  for (let i = 0; i < count; i++) {
    const o = 12 + i * 16;
    const tag = buf.toString("latin1", o, o + 4);
    const offset = buf.readUInt32BE(o + 8);
    const length = buf.readUInt32BE(o + 12);
    tables[tag] = buf.subarray(offset, offset + length);
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

  // head.checkSumAdjustment는 0으로 두고 마지막에 채움
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

/* ── TossFace: 비트맵(sbix) 이모지라 직접 줄임 ──
 * 번들된 harfbuzz 서브셋은 sbix를 지원하지 않아 그림이 빠진다.
 * 그래서 글리프 번호는 그대로 두고, 쓰는 이모지의 PNG만 남기고 나머지는 비운다. */
function glyphIdsFor(fontBuffer, strings) {
  const face = new hb.Face(new hb.Blob(fontBuffer));
  const font = new hb.Font(face);
  const ids = new Set([0]);
  for (const text of strings) {
    const buffer = new hb.Buffer();
    buffer.addText(text);
    buffer.guessSegmentProperties();
    hb.shape(font, buffer);
    for (const g of buffer.getGlyphInfos()) ids.add(g.codepoint);
    buffer.destroy?.();
  }
  font.destroy?.();
  face.destroy?.();
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
    sbix.copy(out, 0, start, start + 4); // ppem, ppi
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
  sbix.copy(header, 0, 0, 4); // version, flags
  header.writeUInt32BE(numStrikes, 4);
  let offset = headerLen;
  strikes.forEach((strike, s) => {
    header.writeUInt32BE(offset, 8 + s * 4);
    offset += strike.length;
  });
  return Buffer.concat([header, ...strikes]);
}

// post 버전 3: 글리프 이름 목록(75KB) 제거
function postWithoutNames(post) {
  const out = Buffer.from(post.subarray(0, 32));
  out.writeUInt32BE(0x00030000, 0);
  return out;
}

async function buildTossFace(code) {
  const source = await readFile(path.join(FONT_SRC, "tossface.ttf"));
  const emoji = [...new Set(code.match(/\p{RGI_Emoji}|\p{Extended_Pictographic}/gv) ?? [])];
  const keep = glyphIdsFor(source, emoji);

  const tables = readTables(source);
  const numGlyphs = tables.maxp.readUInt16BE(4);
  const { DSIG: _dsig, ...rest } = tables;
  const sfnt = writeFont({
    ...rest,
    sbix: keepSbixGlyphs(tables.sbix, numGlyphs, keep),
    post: postWithoutNames(tables.post),
  });
  const woff2 = await fontverter.convert(sfnt, "woff2");
  await writeFile(path.join(FONT_OUT, "tossface.woff2"), woff2);
  console.log(`TossFace: ${emoji.length} emoji, ${keep.size} glyphs, ${kb(source.length)} -> ${kb(woff2.length)}`);
}

/* ── Noto Sans JP: 가나·문장부호 전체 + 번역 문구에 나오는 한자만 ── */
const range = (from, to) =>
  Array.from({ length: to - from + 1 }, (_, i) => String.fromCodePoint(from + i)).join("");

async function buildNotoSansJP(code) {
  const source = await readFile(path.join(FONT_SRC, "NotoSansJP-Bold.ttf"));
  const kanji = code.match(/[一-鿿]/gu) ?? [];
  const text = [...new Set(range(0x3000, 0x30ff) + range(0xff00, 0xffef) + kanji.join(""))].join("");
  const woff2 = await subsetFont(source, text, { targetFormat: "woff2" });
  await writeFile(path.join(FONT_OUT, "NotoSansJP-Bold.woff2"), woff2);
  console.log(`Noto Sans JP: ${[...text].length} chars, ${kb(source.length)} -> ${kb(woff2.length)}`);
}

const code = await readSources(SRC_DIR);
await buildTossFace(code);
await buildNotoSansJP(code);
