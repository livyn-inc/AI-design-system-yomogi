#!/usr/bin/env node

/**
 * Yomogi Package Exporter
 *
 * 1コマンドで Yomogi Package を `package/` 配下に書き出す。
 * 外部生成ツール（Claude Design / Cursor / v0 など）や別リポジトリへの受け渡し素材として使う。
 *
 * 出力構成:
 *   package/
 *   ├── BRAND.md              # brand.mdc から方針セクションを抽出
 *   ├── tokens.css            # pages/_assets/tokens.css のコピー
 *   ├── components.html       # 28コンポーネントの簡易カタログ
 *   ├── reference.html        # 主要コンポーネントを並べたサンプル画面
 *   ├── PROMPT.md             # 外部生成ツール向けブリーフ
 *   ├── README.md             # パッケージの使い方
 *   └── _meta.json            # 生成メタ・コンポーネント棚卸結果
 *
 * Usage:
 *   node scripts/export-package.js [--out=path]
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_OUT = path.join(ROOT, 'package');

// ---------------------------------------------------------------------------
// 0. ユーティリティ
// ---------------------------------------------------------------------------

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function readIfExists(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

function writeFile(p, content) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, content);
}

function listDirs(p) {
  if (!fs.existsSync(p)) return [];
  return fs.readdirSync(p).filter((n) => {
    const s = fs.statSync(path.join(p, n));
    return s.isDirectory();
  });
}

// ---------------------------------------------------------------------------
// 1. BRAND.md 生成（brand.mdc から方針セクションを抽出）
// ---------------------------------------------------------------------------

function generateBrandMd() {
  const brandPath = path.join(ROOT, '.cursor/rules/ads/brand.mdc');
  const brand = readIfExists(brandPath);
  if (!brand) {
    return [
      '# BRAND',
      '',
      '`brand.mdc` が見つかりませんでした。Yomogi本体の `.cursor/rules/ads/brand.mdc` を整備してから再実行してください。',
      '',
    ].join('\n');
  }

  // frontmatter（先頭の --- ブロック）を除去
  const stripped = brand.replace(/^---[\s\S]*?---\n/, '');

  return [
    '# BRAND',
    '',
    '> このファイルは Yomogi 本体の `.cursor/rules/ads/brand.mdc` から自動生成されました。',
    '> 編集は本体側で行い、`npm run export-package` で再書き出ししてください。',
    '',
    '---',
    '',
    stripped.trim(),
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// 2. tokens.css コピー
// ---------------------------------------------------------------------------

function generateTokensCss() {
  const candidates = [
    path.join(ROOT, 'pages/_assets/tokens.css'),
    path.join(ROOT, 'build/css/tokens.css'),
  ];
  for (const p of candidates) {
    const content = readIfExists(p);
    if (content) {
      return {
        content: [
          '/*',
          ' * tokens.css — Yomogi Design Tokens',
          ` * source: ${path.relative(ROOT, p)}`,
          ` * generated: ${new Date().toISOString()}`,
          ' */',
          '',
          content,
        ].join('\n'),
        source: path.relative(ROOT, p),
      };
    }
  }
  return {
    content: '/* tokens.css がまだ生成されていません。`npm run build-all` を先に実行してください。 */\n',
    source: null,
  };
}

// ---------------------------------------------------------------------------
// 3. コンポーネントカタログ
// ---------------------------------------------------------------------------

/**
 * 各コンポーネントの実装ファイルから、関数名・JSDoc を抜き出す。
 */
function inspectComponents() {
  const componentsDir = path.join(ROOT, 'components');
  const dirs = listDirs(componentsDir);
  const items = [];

  for (const dir of dirs) {
    const dirPath = path.join(componentsDir, dir);
    const jsFiles = fs
      .readdirSync(dirPath)
      .filter((n) => n.endsWith('.js'));
    if (jsFiles.length === 0) continue;

    // 通常 1ディレクトリ 1コンポーネント想定
    const jsFile = jsFiles[0];
    const jsPath = path.join(dirPath, jsFile);
    const src = fs.readFileSync(jsPath, 'utf8');

    // JSDoc + function 行を抽出
    // 1) JSDoc ブロック
    const jsdocMatch = src.match(/\/\*\*([\s\S]*?)\*\/\s*function\s+(\w+)/);
    let jsdocText = '';
    let functionName = null;
    if (jsdocMatch) {
      jsdocText = jsdocMatch[1]
        .split('\n')
        .map((l) => l.replace(/^\s*\*\s?/, '').trim())
        .filter((l) => l !== '')
        .join('\n');
      functionName = jsdocMatch[2];
    } else {
      const fnOnly = src.match(/function\s+(\w+)\s*\(/);
      functionName = fnOnly ? fnOnly[1] : null;
    }

    // 2) 引数のデフォルト（ざっくり）— `function Foo({ a = 'x', b = 1 } = {}) { ... }`
    const argMatch = src.match(/function\s+\w+\s*\(\s*\{([\s\S]*?)\}\s*=\s*\{\}\s*\)/);
    const defaults = argMatch ? argMatch[1].trim() : '';

    // 3) 対応 .mdc の有無
    const mdcCandidates = [
      path.join(ROOT, '.cursor/rules/ads/components', `${dir}.mdc`),
      // 表記ゆれ対応（kebab → そのまま、複合→単純）
    ];
    const hasMdc = mdcCandidates.some((p) => fs.existsSync(p));

    items.push({
      dir,
      jsFile,
      functionName: functionName || dir,
      jsdoc: jsdocText,
      defaults,
      hasMdc,
      mdcPath: hasMdc ? path.relative(ROOT, mdcCandidates[0]) : null,
    });
  }
  return items;
}

function generateComponentsHtml(items) {
  const sections = items
    .map((item) => {
      const sig = item.defaults ? `\n${item.defaults}\n` : '';
      const mdcBadge = item.hasMdc
        ? '<span class="badge badge-ok">.mdc あり</span>'
        : '<span class="badge badge-warn">.mdc 未整備</span>';
      const jsdocBlock = item.jsdoc
        ? `<pre class="jsdoc">${escapeHtml(item.jsdoc)}</pre>`
        : '<p class="muted">JSDoc なし</p>';
      const sigBlock = sig
        ? `<pre class="signature"><code>${escapeHtml(`function ${item.functionName}({${sig}} = {}) { ... }`)}</code></pre>`
        : '';

      return `
<section class="component">
  <header>
    <h2>${escapeHtml(item.functionName)} ${mdcBadge}</h2>
    <p class="muted">components/${escapeHtml(item.dir)}/${escapeHtml(item.jsFile)}</p>
  </header>
  ${jsdocBlock}
  ${sigBlock}
</section>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yomogi Components Catalog</title>
  <link rel="stylesheet" href="./tokens.css">
  <style>
    body {
      font-family: system-ui, -apple-system, "Segoe UI", "Hiragino Sans", "Yu Gothic UI", sans-serif;
      line-height: 1.6;
      max-width: var(--layout-max-width-xl, 960px);
      margin: 0 auto;
      padding: var(--spacing-padding-32, 32px);
      color: var(--color-semantic-text-high-light, #181a1b);
      background: var(--color-semantic-neutral-50-light, #fafcfd);
    }
    h1 {
      margin-top: 0;
      font-size: var(--font-size-32, 32px);
    }
    h2 {
      font-size: var(--font-size-20, 20px);
      margin: 0;
    }
    .component {
      padding: var(--spacing-padding-24, 24px) 0;
      border-top: 1px solid var(--color-semantic-divider-extra-high-light, #cdcdd0);
    }
    .component:first-of-type { border-top: none; }
    .muted { color: var(--color-semantic-text-low-light, #7a7d81); font-size: var(--font-size-14, 14px); }
    pre.jsdoc, pre.signature {
      background: var(--color-semantic-neutral-100-light, #f5f7f8);
      padding: var(--spacing-padding-16, 16px);
      border-radius: var(--radius-sm, 6px);
      overflow-x: auto;
      font-size: var(--font-size-12, 12px);
    }
    .badge {
      display: inline-block;
      font-size: var(--font-size-12, 12px);
      padding: 2px 8px;
      border-radius: var(--radius-full, 9999px);
      vertical-align: middle;
      margin-left: var(--spacing-padding-8, 8px);
    }
    .badge-ok   { background: var(--color-semantic-success-100-light, #dff8ed); color: var(--color-semantic-success-700-light, #056d4f); }
    .badge-warn { background: var(--color-semantic-warning-100-light, #fef7b3); color: var(--color-semantic-warning-700-light, #864e0f); }
  </style>
</head>
<body>
  <h1>Yomogi Components Catalog</h1>
  <p class="muted">自動生成: ${new Date().toISOString()} ／ コンポーネント数 ${items.length}</p>
  ${sections}
</body>
</html>
`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---------------------------------------------------------------------------
// 4. reference.html（主要コンポーネントのサンプル画面）
// ---------------------------------------------------------------------------

function generateReferenceHtml() {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yomogi Reference Page</title>
  <link rel="stylesheet" href="./tokens.css">
  <style>
    body {
      font-family: system-ui, -apple-system, "Segoe UI", "Hiragino Sans", "Yu Gothic UI", sans-serif;
      line-height: 1.6;
      margin: 0;
      color: var(--color-semantic-text-high-light, #181a1b);
      background: var(--color-semantic-neutral-50-light, #fafcfd);
    }
    .page {
      max-width: var(--layout-max-width-lg, 768px);
      margin: 0 auto;
      padding: var(--spacing-padding-32, 32px);
    }
    .section { margin-bottom: var(--spacing-padding-48, 48px); }
    .section h2 {
      margin: 0 0 var(--spacing-padding-12, 12px);
      font-size: var(--font-size-20, 20px);
    }
    .card {
      background: var(--color-semantic-neutral-50-light, #fafcfd);
      border: 1px solid var(--color-semantic-divider-extra-high-light, #cdcdd0);
      border-radius: var(--radius-md, 12px);
      padding: var(--spacing-padding-24, 24px);
    }
    .row { display: flex; gap: var(--spacing-padding-12, 12px); flex-wrap: wrap; }
    .btn {
      padding: var(--spacing-padding-8, 8px) var(--spacing-padding-16, 16px);
      border-radius: var(--radius-sm, 6px);
      border: 1px solid transparent;
      font-size: var(--font-size-14, 14px);
      cursor: pointer;
    }
    .btn--solid    { background: var(--color-semantic-primary-600-light, #7f3bf3); color: var(--color-semantic-absolute-white-light, #ffffff); }
    .btn--outline  { background: transparent; border-color: var(--color-semantic-primary-600-light, #7f3bf3); color: var(--color-semantic-primary-700-light, #6d2cd8); }
    .btn--ghost    { background: transparent; color: var(--color-semantic-primary-700-light, #6d2cd8); }
    .input {
      width: 100%;
      padding: var(--spacing-padding-8, 8px) var(--spacing-padding-12, 12px);
      border: 1px solid var(--color-semantic-divider-extra-high-light, #cdcdd0);
      border-radius: var(--radius-sm, 6px);
      font-size: var(--font-size-14, 14px);
      box-sizing: border-box;
    }
    .tag {
      display: inline-block;
      padding: 2px 10px;
      border-radius: var(--radius-full, 9999px);
      font-size: var(--font-size-12, 12px);
      background: var(--color-semantic-info-100-light, #e2f0ff);
      color: var(--color-semantic-info-700-light, #1b57dc);
    }
    .label { display: block; margin-bottom: var(--spacing-padding-8, 8px); font-size: var(--font-size-14, 14px); }
  </style>
</head>
<body>
  <div class="page">
    <header class="section">
      <h1>Yomogi Reference Page</h1>
      <p>このページは、外部生成ツール（Claude Design / Cursor / v0 等）に「Yomogiのトーン」を伝えるための参照画面です。実装は最小限。トークンを参照して見た目を整えています。</p>
    </header>

    <section class="section">
      <h2>Buttons</h2>
      <div class="row">
        <button class="btn btn--solid">主要アクション</button>
        <button class="btn btn--outline">控えめ</button>
        <button class="btn btn--ghost">補助</button>
      </div>
    </section>

    <section class="section">
      <h2>Card + Form</h2>
      <div class="card">
        <h3 style="margin-top:0;">サンプル入力</h3>
        <label class="label" for="email">メールアドレス</label>
        <input class="input" type="email" id="email" placeholder="example@email.com">
        <p style="margin-top: var(--spacing-padding-16, 16px);"><span class="tag">info</span> ラベル付き入力の例</p>
        <div class="row" style="margin-top: var(--spacing-padding-24, 24px);">
          <button class="btn btn--solid">送信</button>
          <button class="btn btn--ghost">キャンセル</button>
        </div>
      </div>
    </section>

    <section class="section">
      <h2>Tags</h2>
      <div class="row">
        <span class="tag">info</span>
        <span class="tag" style="background: var(--color-semantic-success-100-light, #dff8ed); color: var(--color-semantic-success-700-light, #056d4f);">success</span>
        <span class="tag" style="background: var(--color-semantic-warning-100-light, #fef7b3); color: var(--color-semantic-warning-700-light, #864e0f);">warning</span>
        <span class="tag" style="background: var(--color-semantic-negative-100-light, #ffe4e4); color: var(--color-semantic-negative-800-light, #ac0a1f);">negative</span>
      </div>
    </section>
  </div>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// 5. PROMPT.md（外部生成ツール向けブリーフ）
// ---------------------------------------------------------------------------

function generatePromptMd(items) {
  const componentList = items
    .map((it) => `- ${it.functionName}（components/${it.dir}/）${it.hasMdc ? '' : ' — _.mdc 未整備_'}`)
    .join('\n');

  return [
    '# PROMPT — 外部生成ツール向けブリーフ',
    '',
    'このファイルは、Claude Design / Cursor / v0 / Figma Make などの外部生成ツールに、Yomogi のトーンとルールを伝えるためのブリーフです。',
    '',
    '## 渡し方の例',
    '',
    '### Claude Design / Cursor / v0 共通',
    '',
    '次のセットを「プロジェクトのデザインシステム」として渡してください。',
    '',
    '- `BRAND.md`（このパッケージ内）— 方向性とトーン',
    '- `tokens.css`（このパッケージ内）— 実装可能な値の正本',
    '- `components.html`（このパッケージ内）— 利用可能なコンポーネントとprops',
    '- `reference.html`（このパッケージ内）— 見た目のサンプル',
    '',
    '### 指示テンプレート',
    '',
    '```',
    '次のデザインシステム素材に従って [作りたい画面] を作ってください。',
    '',
    '- 方向性とトーンは BRAND.md を参照',
    '- 色・余白・フォント・角丸・影は tokens.css の var(--xxx) を参照',
    '- UI部品は components.html のものを優先利用',
    '- 全体トーンは reference.html を参照',
    '',
    'やってはいけないこと:',
    '- px / hex / rgba を直接書かない（必ず var(--xxx)）',
    '- tokens.css にないトークン名を推測で書かない',
    '- BRAND.md の「避けること」を破らない',
    '```',
    '',
    '## 利用可能なコンポーネント',
    '',
    componentList,
    '',
    '## 守ってほしい設計品質ルール',
    '',
    '- すべてのスタイルは `tokens.css` の `var(--xxx)` で表現する',
    '- px / hex / rgba を直接書かない',
    '- 1画面に primary/solid のボタンは1つまで',
    '- ライト/ダーク両モードに対応する（`--color-semantic-XXX-light/dark`）',
    '- 画像には alt、ボタンには aria-label を付与',
    '- BRAND.md の Do を守り、Don\'t を避ける',
    '',
    '## 参考: Yomogi本体の評価観点',
    '',
    '生成物を Yomogi 側で評価するときは次の2層で見ます。生成段階でこれらを意識してください。',
    '',
    '- **測定可能な項目**: トークン使用率 / 直書き有無 / コンポーネント利用 / a11y属性 / ボタンヒエラルキー',
    '- **AIレビュー観点**: 美的表現（AE）/ 文脈評価（CX）/ 情報密度（ID）/ 発見可能性（DP）',
    '',
    '---',
    '',
    `_自動生成: ${new Date().toISOString()}_`,
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// 6. README（パッケージの使い方）
// ---------------------------------------------------------------------------

function generatePackageReadme(meta) {
  return [
    '# Yomogi Package',
    '',
    'このパッケージは、Yomogi 本体から書き出された「最小コアの判断と資産」のセットです。外部生成ツール（Claude Design / Cursor / v0 など）や別プロジェクトに渡して、トーンを揃えたUIを作るために使います。',
    '',
    '## 含まれるもの',
    '',
    '| ファイル | 内容 |',
    '|---|---|',
    '| `BRAND.md` | 方向性・トーン・Do/Don\'t（DCoS結論の書き戻し） |',
    '| `tokens.css` | デザイントークンの正本（var(--xxx)） |',
    '| `components.html` | 利用可能なコンポーネントの簡易カタログ |',
    '| `reference.html` | 主要UIを並べたサンプル画面 |',
    '| `PROMPT.md` | 外部生成ツールに渡すブリーフ |',
    '| `_meta.json` | 生成メタ・コンポーネント棚卸結果 |',
    '',
    '## 使い方',
    '',
    '### A. 外部生成ツール（Claude Design / Cursor / v0 等）に渡す',
    '',
    '`PROMPT.md` の「渡し方の例」を参照。`BRAND.md` / `tokens.css` / `components.html` / `reference.html` をプロジェクトに添付し、生成指示には PROMPT.md のテンプレートを使ってください。',
    '',
    '### B. 別リポジトリで実装の参考にする',
    '',
    '- `tokens.css` をそのまま読み込んで `var(--xxx)` を使う',
    '- `components.html` を見て、どの部品がどう使えるかを把握する',
    '- `reference.html` を開いて、Yomogi の見た目のトーンを確認する',
    '',
    '## 再生成',
    '',
    'Yomogi本体側で次を実行すると、本パッケージは再書き出しされます。',
    '',
    '```bash',
    'npm run export-package',
    '```',
    '',
    `_生成日時: ${meta.generatedAt}_`,
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// 7. _meta.json（生成メタ + コンポーネント棚卸）
// ---------------------------------------------------------------------------

function generateMeta(items, tokensSource) {
  const missingMdc = items.filter((it) => !it.hasMdc).map((it) => it.dir);
  return {
    generatedAt: new Date().toISOString(),
    sourceRepository: 'ai-design-system-yomogi',
    tokensSource,
    componentCount: items.length,
    components: items.map((it) => ({
      name: it.functionName,
      dir: it.dir,
      hasMdcDoc: it.hasMdc,
      mdcDocPath: it.mdcPath,
    })),
    componentMdcMissing: missingMdc,
    componentMdcMissingCount: missingMdc.length,
  };
}

// ---------------------------------------------------------------------------
// 8. main
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  let out = DEFAULT_OUT;
  for (const a of argv) {
    if (a.startsWith('--out=')) out = path.resolve(a.slice('--out='.length));
  }
  return { out };
}

function main() {
  const { out } = parseArgs(process.argv.slice(2));

  console.log('🚀 Yomogi Package Exporter');
  console.log(`📁 Output: ${out}`);

  ensureDir(out);

  // tokens
  const tokens = generateTokensCss();
  writeFile(path.join(out, 'tokens.css'), tokens.content);
  console.log(`  ✅ tokens.css ${tokens.source ? `(from ${tokens.source})` : '(empty placeholder)'}`);

  // components inspection
  const items = inspectComponents();
  console.log(`  📦 components: ${items.length} found`);

  // BRAND.md
  writeFile(path.join(out, 'BRAND.md'), generateBrandMd());
  console.log('  ✅ BRAND.md');

  // components.html
  writeFile(path.join(out, 'components.html'), generateComponentsHtml(items));
  console.log('  ✅ components.html');

  // reference.html
  writeFile(path.join(out, 'reference.html'), generateReferenceHtml());
  console.log('  ✅ reference.html');

  // PROMPT.md
  writeFile(path.join(out, 'PROMPT.md'), generatePromptMd(items));
  console.log('  ✅ PROMPT.md');

  // _meta.json
  const meta = generateMeta(items, tokens.source);
  writeFile(path.join(out, '_meta.json'), JSON.stringify(meta, null, 2) + '\n');
  console.log(`  ✅ _meta.json (mdc未整備: ${meta.componentMdcMissingCount}件)`);

  // README.md (package's own)
  writeFile(path.join(out, 'README.md'), generatePackageReadme(meta));
  console.log('  ✅ README.md');

  console.log('\n🎉 Package export completed.');
  if (meta.componentMdcMissingCount > 0) {
    console.log(`\nℹ️  .mdc 未整備: ${meta.componentMdcMissing.join(', ')}`);
    console.log('   → コンポーネント整理フェーズで補完候補です（_meta.json 参照）。');
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  inspectComponents,
  generateBrandMd,
  generateTokensCss,
  generateComponentsHtml,
  generateReferenceHtml,
  generatePromptMd,
  generateMeta,
  generatePackageReadme,
};
