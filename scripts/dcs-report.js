#!/usr/bin/env node

/**
 * DCS (Design Critic System) — 測定可能項目のレポート生成
 *
 * 対象ページ（HTML）に対して、AGENTS.md / design-checklist.mdc の「測定可能な項目」を
 * 機械的に集計し、Markdown または JSON 形式でレポートを出力する。
 *
 * AIレビュー観点（AE / CX / ID / DP / コントラスト感性評価 等）は自動測定対象外として
 * レポート上で明示し、両者を分離する。
 *
 * Usage:
 *   node scripts/dcs-report.js <file-or-dir> [--format=markdown|json] [--deep]
 *
 * Examples:
 *   node scripts/dcs-report.js pages/generated/example.html
 *   node scripts/dcs-report.js pages/generated --format=json
 *   node scripts/dcs-report.js pages/generated/example.html --deep
 *
 * `--deep` を指定するとPlaywright（システムChrome優先 / 付属Chromiumフォールバック）で
 * 対象HTMLを実レンダリングし、WCAGコントラストと強調度6要素（CP×SP×MP×AP×KP×FWP）を
 * 計測する。スクリーンショットは `tmp/` 配下に保存。
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// 1. Token 取得（build/css/tokens.css または pages/_assets/tokens.css）
// ---------------------------------------------------------------------------

function loadDefinedTokens() {
  const candidates = [
    path.join(__dirname, '../pages/_assets/tokens.css'),
    path.join(__dirname, '../build/css/tokens.css'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      const css = fs.readFileSync(p, 'utf8');
      const set = new Set();
      const re = /--([\w-]+):/g;
      let m;
      while ((m = re.exec(css)) !== null) set.add(`--${m[1]}`);
      return { tokensSource: p, tokens: set };
    }
  }
  return { tokensSource: null, tokens: new Set() };
}

// ---------------------------------------------------------------------------
// 2. 単一HTMLの測定
// ---------------------------------------------------------------------------

// 行頭インデックス配列を構築（index→line番号変換用）。
// 大きなファイルでも O(N) で構築・O(log N) でルックアップできる。
function buildLineStarts(content) {
  const starts = [0];
  for (let i = 0; i < content.length; i++) {
    if (content.charCodeAt(i) === 10 /* \n */) starts.push(i + 1);
  }
  return starts;
}

function indexToLine(lineStarts, index) {
  let lo = 0;
  let hi = lineStarts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >>> 1;
    if (lineStarts[mid] <= index) lo = mid;
    else hi = mid - 1;
  }
  return lo + 1; // 1-indexed
}

// 全マッチを { value, line } として返す。regex は g フラグを内部で強制。
function findAllWithLine(content, regex, lineStarts) {
  const flags = regex.flags.includes('g') ? regex.flags : regex.flags + 'g';
  const re = new RegExp(regex.source, flags);
  const results = [];
  let m;
  while ((m = re.exec(content)) !== null) {
    results.push({ value: m[0], line: indexToLine(lineStarts, m.index) });
    if (m[0].length === 0) re.lastIndex++;
  }
  return results;
}

// 余白階層チェック: `--spacing-padding-N` の使用分布を集計し、
// L1〜L4 規定値（layout.mdc）／コンポーネント内余白／リセット用途／規定外 に分類する。
//   L1: 12（見出し直下）
//   L2: 24 / 32（関連要素間）
//   L3: 48（要素グループ間）
//   L4: 72（セクション間）
//   internal: 2, 4, 6, 8, 16（ボタン内側 / アイコンとテキストの gap 等、コンポーネント内向け）
//   reset: 0（margin / padding のリセット用途）
function checkSpacingHierarchy(content, lineStarts) {
  const HIERARCHY = {
    12: 'L1',
    24: 'L2',
    32: 'L2',
    48: 'L3',
    72: 'L4',
  };
  const INTERNAL = new Set([2, 4, 6, 8, 16]);
  const re = /var\(\s*--spacing-padding-(\d+)\s*\)/g;
  const usage = new Map();
  let m;
  while ((m = re.exec(content)) !== null) {
    const value = Number(m[1]);
    if (!usage.has(value)) usage.set(value, { count: 0, lines: [] });
    const entry = usage.get(value);
    entry.count++;
    if (entry.lines.length < 3) entry.lines.push(indexToLine(lineStarts, m.index));
  }
  const distribution = Array.from(usage, ([value, info]) => {
    const hierarchy = HIERARCHY[value] || null;
    const kind =
      value === 0
        ? 'reset'
        : hierarchy
          ? 'hierarchy'
          : INTERNAL.has(value)
            ? 'internal'
            : 'outOfRange';
    return { value, count: info.count, lines: info.lines, hierarchy, kind };
  }).sort((a, b) => a.value - b.value);
  const hierarchyCount = distribution.filter((d) => d.kind === 'hierarchy').length;
  const outOfRangeCount = distribution.filter((d) => d.kind === 'outOfRange').length;
  return { distribution, hierarchyValueCount: hierarchyCount, outOfRangeCount };
}

// 見出し階層チェック: 出現順に h1〜h6 を拾い、複数 h1 / 階層スキップを検出する。
function checkHeadingHierarchy(content, lineStarts) {
  const re = /<h([1-6])\b/gi;
  const headings = [];
  let m;
  while ((m = re.exec(content)) !== null) {
    headings.push({
      level: Number(m[1]),
      line: indexToLine(lineStarts, m.index),
    });
  }
  const h1Count = headings.filter((h) => h.level === 1).length;
  const skips = [];
  let prev = 0;
  for (const h of headings) {
    if (prev > 0 && h.level > prev + 1) {
      skips.push({ from: prev, to: h.level, line: h.line });
    }
    prev = h.level;
  }
  return {
    sequence: headings.map((h) => ({ level: h.level, line: h.line })),
    h1Count,
    hasH1: h1Count > 0,
    skips,
  };
}

// 単一ファイル（HTMLまたはCSS）の測定。fileType はパスの拡張子で判定する。
function measureFile(filePath, definedTokens) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lineStarts = buildLineStarts(content);
  const ext = path.extname(filePath).toLowerCase();
  const fileType = ext === '.css' ? 'css' : 'html';
  const m = { fileType };

  // --- 直書き検出（共通） ---
  const pxAll = findAllWithLine(content, /:\s*-?\d+(?:\.\d+)?px\b/g, lineStarts);
  const hexAll = findAllWithLine(content, /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b/g, lineStarts);
  const rgbaAll = findAllWithLine(content, /rgba?\([^)]+\)/g, lineStarts);
  m.hardcodes = {
    px: { count: pxAll.length, samples: pxAll.slice(0, 5) },
    hex: { count: hexAll.length, samples: hexAll.slice(0, 5) },
    rgba: { count: rgbaAll.length, samples: rgbaAll.slice(0, 5) },
  };

  // --- トークン使用（共通） ---
  const varAll = findAllWithLine(content, /var\(\s*--[\w-]+\s*\)/g, lineStarts);
  const usedTokens = new Set();
  const undefinedMap = new Map(); // name -> first line
  for (const v of varAll) {
    const name = v.value.match(/--[\w-]+/)[0];
    usedTokens.add(name);
    if (definedTokens.size > 0 && !definedTokens.has(name) && !undefinedMap.has(name)) {
      undefinedMap.set(name, v.line);
    }
  }
  m.tokens = {
    usageCount: varAll.length,
    uniqueUsed: usedTokens.size,
    undefinedTokens: Array.from(undefinedMap, ([name, line]) => ({ name, line })),
  };

  // --- 余白階層（共通） ---
  m.spacingHierarchy = checkSpacingHierarchy(content, lineStarts);

  // CSS の場合はここまで（HTML専用項目は対象外）
  if (fileType === 'css') return m;

  // --- コンポーネント利用 ---
  const dsClassMatches = content.match(/class="[^"]*\bds-[\w-]+/g) || [];
  const componentCallMatches = content.match(
    /\b(Button|IconButton|Input|Select|Checkbox|Radio|Switch|TextArea|Card|PageTemplate|Drawer|Modal|Tabs|Breadcrumb|Navigation|Pagination|Table|List|Avatar|Tag|FileTree|Alert|Toast|Tooltip|Popover|Dropdown)\s*\(/g
  ) || [];
  m.components = {
    dsClassUsages: dsClassMatches.length,
    componentFunctionCalls: componentCallMatches.length,
  };

  // --- ボタンヒエラルキー ---
  const primarySolidPattern = /Button\([^)]*variant:\s*['"]solid['"][^)]*color:\s*['"]primary['"][^)]*\)|Button\([^)]*color:\s*['"]primary['"][^)]*variant:\s*['"]solid['"][^)]*\)/g;
  const primarySolidMatches = content.match(primarySolidPattern) || [];
  m.buttonHierarchy = {
    primarySolidCount: primarySolidMatches.length,
    rule: '1画面1つまで（最重要アクションのみ）',
  };

  // --- アクセシビリティ + 見出し階層 ---
  // rawButtonTagCount は **手書きの `<button>` タグ** のみを数える。
  // Yomogi 推奨の `Button(...)` コンポーネント経由は components.componentFunctionCalls に含まれる。
  // 手書きボタンは少ないほど望ましい（0個が理想）。
  const imgs = content.match(/<img\b[^>]*>/g) || [];
  const imgsWithoutAlt = imgs.filter((tag) => !/\balt=/.test(tag));
  const rawButtons = content.match(/<button\b[^>]*>/g) || [];
  const rawButtonsWithAria = rawButtons.filter((tag) => /aria-label=/.test(tag));
  const heading = checkHeadingHierarchy(content, lineStarts);
  m.accessibility = {
    imgTotal: imgs.length,
    imgWithoutAlt: imgsWithoutAlt.length,
    rawButtonTagCount: rawButtons.length,
    rawButtonWithAriaLabel: rawButtonsWithAria.length,
    hasRoleMain: /role=["']main["']/.test(content),
    hasH1: heading.hasH1,
    hasLangJa: /lang=["']ja["']/.test(content),
    headingSequence: heading.sequence,
    h1Count: heading.h1Count,
    headingSkips: heading.skips,
  };

  // --- 構造・アセット ---
  m.structure = {
    hasDoctype: /<!DOCTYPE html>/i.test(content),
    hasCharset: /charset=["']UTF-8["']/i.test(content),
    hasViewport: /name=["']viewport["']/.test(content),
    hasTitle: /<title>[^<]+<\/title>/.test(content),
    loadsBundleCss: /bundle\.css/.test(content),
    loadsComponentsJs: /components\.js/.test(content),
  };

  // --- 生成場所 ---
  const norm = path.resolve(filePath).replace(/\\/g, '/');
  m.location = {
    isUnderPagesGenerated: /\/pages\/generated\//.test(norm),
    expected: 'pages/generated/',
  };

  return m;
}

// 後方互換: 旧 API 名を維持。
const measureHtml = measureFile;

// ---------------------------------------------------------------------------
// 3. レポート整形（Markdown）
// ---------------------------------------------------------------------------

function formatMarkdown(filePath, m, meta, deep) {
  const lines = [];
  const rel = path.relative(process.cwd(), filePath);
  const isHtml = m.fileType === 'html';
  lines.push(`# DCS Report: ${rel}`);
  lines.push('');
  lines.push(`ファイル種別: \`${m.fileType.toUpperCase()}\``);
  lines.push(`生成日時: ${new Date().toISOString()}`);
  if (meta.tokensSource) {
    lines.push(`参照トークン: \`${path.relative(process.cwd(), meta.tokensSource)}\``);
  } else {
    lines.push('参照トークン: (見つからず — \`npm run build-all\` を先に実行してください)');
  }
  lines.push('');

  // ---- 測定可能な項目 ----
  lines.push('## 1. 測定可能な項目（自動チェック）');
  lines.push('');

  // 直書き
  const hc = m.hardcodes;
  const hardcodeTotal = hc.px.count + hc.hex.count + hc.rgba.count;
  const formatSamples = (arr) =>
    arr.map((s) => `L${s.line}: \`${s.value.trim()}\``).join(', ');
  lines.push('### 1.1 直書き検出');
  lines.push('');
  lines.push(`- 合計: **${hardcodeTotal}件**${hardcodeTotal === 0 ? ' ✅' : ' ⚠️'}`);
  lines.push(`  - px直書き: ${hc.px.count}件${hc.px.samples.length ? `（例: ${formatSamples(hc.px.samples)}）` : ''}`);
  lines.push(`  - hex直書き: ${hc.hex.count}件${hc.hex.samples.length ? `（例: ${formatSamples(hc.hex.samples)}）` : ''}`);
  lines.push(`  - rgba直書き: ${hc.rgba.count}件${hc.rgba.samples.length ? `（例: ${formatSamples(hc.rgba.samples)}）` : ''}`);
  lines.push('');

  // トークン使用
  lines.push('### 1.2 トークン使用');
  lines.push('');
  lines.push(`- \`var(--xxx)\` 使用箇所: **${m.tokens.usageCount}件**`);
  lines.push(`- ユニークトークン数: ${m.tokens.uniqueUsed}`);
  if (m.tokens.undefinedTokens.length > 0) {
    lines.push(`- 未定義トークン: ${m.tokens.undefinedTokens.length}件 ❌`);
    for (const t of m.tokens.undefinedTokens) lines.push(`  - L${t.line}: \`${t.name}\``);
  } else {
    lines.push('- 未定義トークン: 0件 ✅');
  }
  lines.push('');

  if (isHtml) {
    // コンポーネント利用
    lines.push('### 1.3 コンポーネント利用');
    lines.push('');
    lines.push(`- \`ds-*\` クラス出現: ${m.components.dsClassUsages}箇所`);
    lines.push(`- コンポーネント関数呼び出し（\`Button(...)\` 等）: ${m.components.componentFunctionCalls}件`);
    lines.push('');

    // ボタンヒエラルキー
    const bh = m.buttonHierarchy;
    const bhStatus = bh.primarySolidCount === 0 ? '⚠️ 主要アクションが見当たらない' : bh.primarySolidCount === 1 ? '✅ 適切' : '❌ 1画面に複数';
    lines.push('### 1.4 ボタンヒエラルキー');
    lines.push('');
    lines.push(`- primary/solid ボタン数: **${bh.primarySolidCount}** ${bhStatus}`);
    lines.push(`- 規則: ${bh.rule}`);
    lines.push('');

    // アクセシビリティ + 見出し階層
    const a = m.accessibility;
    lines.push('### 1.5 アクセシビリティ（静的）');
    lines.push('');
    lines.push(`- img 総数: ${a.imgTotal} / alt欠如: ${a.imgWithoutAlt}${a.imgWithoutAlt === 0 ? ' ✅' : ' ❌'}`);
    const rawBtnNote = a.rawButtonTagCount === 0
      ? '✅ 手書き0個（Yomogi の `Button(...)` 経由が推奨）'
      : `⚠️ 手書き${a.rawButtonTagCount}個 / うち aria-label 付き: ${a.rawButtonWithAriaLabel}個（手書きは少ないほど良い）`;
    lines.push(`- \`<button>\` タグ（手書きHTML）: ${rawBtnNote}`);
    lines.push(`- \`role="main"\`: ${a.hasRoleMain ? '✅' : '⚠️ 未設定'}`);
    lines.push(`- \`lang="ja"\`: ${a.hasLangJa ? '✅' : '⚠️ 未設定'}`);
    // 見出し階層
    const seqLabel = a.headingSequence.length > 0
      ? a.headingSequence.map((h) => `h${h.level}`).join(' → ')
      : '(なし)';
    const h1Status = a.h1Count === 0 ? '⚠️ 未設定' : a.h1Count === 1 ? '✅ 適切' : `❌ ${a.h1Count}個（h1は1画面1つ）`;
    lines.push(`- 見出し: \`${seqLabel}\``);
    lines.push(`  - \`<h1>\` 数: ${a.h1Count} ${h1Status}`);
    if (a.headingSkips.length === 0) {
      lines.push('  - 階層スキップ: 0件 ✅');
    } else {
      lines.push(`  - 階層スキップ: ${a.headingSkips.length}件 ❌`);
      for (const s of a.headingSkips) {
        lines.push(`    - L${s.line}: h${s.from} → h${s.to}（h${s.from + 1} を飛ばしている）`);
      }
    }
    lines.push('');

    // 構造・アセット
    const s = m.structure;
    lines.push('### 1.6 構造・アセット');
    lines.push('');
    lines.push(`- DOCTYPE: ${s.hasDoctype ? '✅' : '❌'}`);
    lines.push(`- charset UTF-8: ${s.hasCharset ? '✅' : '❌'}`);
    lines.push(`- viewport: ${s.hasViewport ? '✅' : '❌'}`);
    lines.push(`- title: ${s.hasTitle ? '✅' : '❌'}`);
    lines.push(`- bundle.css 読み込み: ${s.loadsBundleCss ? '✅' : '❌'}`);
    lines.push(`- components.js 読み込み: ${s.loadsComponentsJs ? '✅' : '⚠️ 未読み込み'}`);
    lines.push('');

    // 生成場所
    const loc = m.location;
    lines.push('### 1.7 生成場所');
    lines.push('');
    lines.push(`- ${loc.isUnderPagesGenerated ? '✅' : '❌'} \`${loc.expected}\` 配下か`);
    lines.push('');
  }

  // 余白階層（共通）
  const sh = m.spacingHierarchy;
  lines.push('### 1.8 余白階層（`--spacing-padding-*` 分布）');
  lines.push('');
  if (sh.distribution.length === 0) {
    lines.push('- `--spacing-padding-*` の使用なし');
  } else {
    lines.push('- 使用された値（昇順）:');
    for (const d of sh.distribution) {
      const tag =
        d.kind === 'hierarchy'
          ? `${d.hierarchy} 規定 ✅`
          : d.kind === 'internal'
            ? 'ℹ️ コンポーネント内余白'
            : d.kind === 'reset'
              ? 'ℹ️ リセット用途'
              : '⚠️ L1〜L4 規定外';
      const sample = d.lines.length > 0 ? `（L${d.lines.join(', L')}）` : '';
      lines.push(`  - \`--spacing-padding-${d.value}\`: ${d.count}回 — ${tag} ${sample}`);
    }
    lines.push('');
    lines.push('- L1=12（見出し直下）/ L2=24・32（関連要素間）/ L3=48（要素グループ間）/ L4=72（セクション間）');
    lines.push('- コンポーネント内余白: 2, 4, 6, 8, 16（ボタン内側 / アイコン-テキスト gap 等）');
    lines.push('- 0 は margin / padding のリセット用途として扱い、余白階層の警告には含めません');
  }
  lines.push('');

  // 深堀り計測（--deep 指定時のみ、HTMLでのみ意味を持つ）
  if (isHtml && deep) {
    if (deep.error) {
      lines.push('### 1.9 深堀り計測（--deep）');
      lines.push('');
      lines.push(`- ❌ 実行失敗: ${deep.error}`);
      lines.push('');
    } else {
      lines.push(formatDeepMarkdown(deep, '1.9'));
    }
  }

  // ---- AIレビュー観点 ----
  lines.push('## 2. AIレビュー観点（自動測定対象外）');
  lines.push('');
  lines.push('次の項目は本スクリプトでは測定しません。AIまたは人によるレビューで観点として説明・判断してください。スコアは断定せず、根拠を併記します。');
  lines.push('');
  lines.push('- **AE（Aesthetic Expression / 美的表現）**: ブランド適合・色彩調和・統一性・主脇役バランス');
  lines.push('- **CX（Context Evaluation / コンテキスト評価）**: プロダクト・ページ・設計意図への適合');
  lines.push('- **ID（Information Density / 情報密度）**: 占有面積と表示領域のバランス');
  lines.push('- **DP（Discoverability Point / 発見可能性）**: UI要素の見つけやすさ');
  if (deep && !deep.error) {
    lines.push('- **コントラスト計算（WCAG）**: `--deep` で実値を測定済み（上記 1.9 を参照）');
  } else {
    lines.push('- **コントラスト計算（WCAG）**: 静的版では未測定。`--deep` モードで実値を測定可能');
  }
  lines.push('- **要素間の視覚的関係性**: 接触感・流れ・方向性');
  lines.push('- **密度バランス**: 詰まり感／開放感の適正度');
  lines.push('- **洗練度**: モダン感・プロフェッショナル度');
  lines.push('');

  // ---- 総評（優先度階層） ----
  // 各フラグを { level, label } の形で集めてから、優先度ごとにグループ化して出力する。
  // level: 'error' / 'warning' / 'good' / 'info'
  lines.push('## 3. 総評（測定可能な項目のサマリ）');
  lines.push('');
  const flags = [];
  const flag = (cond, goodLabel, badLabel, badLevel = 'error') =>
    flags.push(
      cond
        ? { level: 'good', label: goodLabel }
        : { level: badLevel, label: badLabel }
    );

  flag(hardcodeTotal === 0, '直書き0件', `直書き${hardcodeTotal}件`);
  flag(
    m.tokens.undefinedTokens.length === 0,
    '未定義トークンなし',
    `未定義トークン${m.tokens.undefinedTokens.length}件`
  );

  if (isHtml) {
    const bh2 = m.buttonHierarchy;
    const a2 = m.accessibility;
    const loc2 = m.location;
    flag(
      bh2.primarySolidCount === 1,
      'ボタンヒエラルキー適切',
      `primary/solid ${bh2.primarySolidCount}個`,
      'warning'
    );
    flag(a2.imgWithoutAlt === 0, 'alt欠如なし', `alt欠如${a2.imgWithoutAlt}件`);
    flag(a2.h1Count === 1, 'h1 1個', `h1 ${a2.h1Count}個`, 'warning');
    flag(
      a2.headingSkips.length === 0,
      '見出し階層スキップなし',
      `見出し階層スキップ${a2.headingSkips.length}件`
    );
    flag(
      a2.rawButtonTagCount === 0,
      '手書き `<button>` 0個',
      `手書き \`<button>\` ${a2.rawButtonTagCount}個（Yomogi の Button(...) 経由が推奨）`,
      'warning'
    );
    flag(
      loc2.isUnderPagesGenerated,
      '生成場所OK',
      'pages/generated/ 配下にない'
    );
  }

  // 余白階層フラグ
  const outOfRange = sh.distribution.filter((d) => d.kind === 'outOfRange');
  if (sh.distribution.length === 0) {
    flags.push({ level: 'info', label: '余白階層: `--spacing-padding-*` 未使用' });
  } else if (outOfRange.length === 0) {
    flags.push({
      level: 'good',
      label: '余白階層: L1〜L4 規定値 + コンポーネント内余白 + リセット用途のみ',
    });
  } else {
    flags.push({
      level: 'warning',
      label: `余白階層: 規定外の値 ${outOfRange.length}種類（${outOfRange
        .map((d) => d.value)
        .join(', ')}）`,
    });
  }

  if (isHtml && deep && !deep.error) {
    flag(
      deep.contrastIssues.length === 0,
      'コントラスト不足なし',
      `コントラスト不足${deep.contrastIssues.length}件`
    );
    const hi = deep.highThreshold || 30;
    const ex = deep.extremeThreshold || 50;
    const hiCount = deep.highEmphasizedCount || 0;
    const exCount = deep.extremeEmphasizedCount || 0;
    if (exCount > 0) {
      flags.push({
        level: 'error',
        label: `極端強調（${ex}以上）${exCount}件`,
      });
    } else if (hiCount >= 2) {
      flags.push({
        level: 'warning',
        label: `強主役（${hi}以上）${hiCount}件（1件が原則）`,
      });
    } else if (hiCount === 1) {
      flags.push({ level: 'good', label: '強主役1件（階層成立）' });
    } else {
      flags.push({
        level: 'info',
        label: `強主役（${hi}以上）0件 — 主役不在の可能性`,
      });
    }
  }

  // 優先度ごとにグループ化して出力
  const groups = [
    { level: 'error', heading: '### 🔴 要修正', mark: '❌' },
    { level: 'warning', heading: '### 🟡 改善推奨', mark: '⚠️' },
    { level: 'good', heading: '### 🟢 良好', mark: '✅' },
    { level: 'info', heading: '### ℹ️ 情報', mark: 'ℹ️' },
  ];
  let printed = 0;
  for (const g of groups) {
    const items = flags.filter((f) => f.level === g.level);
    if (items.length === 0) continue;
    lines.push(g.heading);
    lines.push('');
    for (const f of items) lines.push(`- ${g.mark} ${f.label}`);
    lines.push('');
    printed++;
  }
  if (printed === 0) {
    lines.push('（測定可能な項目なし）');
    lines.push('');
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// 3.5. --deep モード（Playwright + getComputedStyle で実レンダリング計測）
// ---------------------------------------------------------------------------

// 'rgb(255, 255, 255)' / 'rgba(255, 255, 255, 0.9)' → [r, g, b]
function parseRgbString(s) {
  if (!s) return null;
  const m = s.match(/-?\d+(?:\.\d+)?/g);
  if (!m || m.length < 3) return null;
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}

// rgba(...) 文字列からアルファ値を取り出す。なければ 1.0、transparent は 0.0。
function getColorAlpha(s) {
  if (!s) return 1.0;
  if (s === 'transparent') return 0.0;
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return 1.0;
  const parts = m[1].split(',').map((p) => p.trim());
  return parts.length === 4 ? Number(parts[3]) : 1.0;
}

// box-shadow 文字列から最初の影の blur radius と alpha を抽出する。
// 'rgba(0,0,0,0.1) 0px 4px 12px' / 'rgb(...) 0 2px 4px' / 'none' 等に対応。
function parseBoxShadow(s) {
  if (!s || s === 'none') return { blur: 0, alpha: 0 };
  // カンマで分割（ただし rgba() 内のカンマは無視）
  const first = s.split(/,\s*(?![^()]*\))/)[0];
  let alpha = 1.0;
  const rgbaMatch = first.match(/rgba?\(([^)]+)\)/);
  if (rgbaMatch) {
    const parts = rgbaMatch[1].split(',').map((p) => p.trim());
    if (parts.length === 4) alpha = Number(parts[3]);
  }
  // 'inset' は弱めの装飾として扱う
  const isInset = /\binset\b/.test(first);
  const pxValues = (first.match(/-?\d+(?:\.\d+)?px/g) || []).map((v) =>
    parseFloat(v)
  );
  // 順序: offsetX offsetY blur [spread]。blur は3つ目。
  const blur = pxValues.length >= 3 ? pxValues[2] : 0;
  return { blur, alpha: isInset ? alpha * 0.5 : alpha };
}

function clamp(x, lo, hi) {
  return Math.max(lo, Math.min(hi, x));
}

function computeContrastRatio(fgStr, bgStr, wcag) {
  const fg = parseRgbString(fgStr);
  const bg = parseRgbString(bgStr);
  if (!fg || !bg) return null;
  return wcag.rgb(fg, bg);
}

// 強調度6要素を計算する。基準値はすべて 1.0。
//   CP  = WCAGコントラスト比 / 4.5 （4.5:1=合格を1.0としたスケール）
//   SP  = fontSize / 14
//   FWP = fontWeight / 400
//   MP  = 要素内部の余白（padding平均） / 14
//   AP  = 要素外部の視覚的余白による孤立感（後述）
//   KP  = アニメーションあり 1.5 / なし 1.0
//
// AP（Area Point）の再定義（2026-05-11）:
//   AP は要素「外部」の視覚的余白による強調度（孤立感）。
//   要素を取り囲む視覚境界が強いと padding は「内側の呼吸」として吸収され、
//   視覚境界が弱い（プレーンなテキスト等）と padding 自体が外側の余白として効く。
//
//   視覚境界の強さ = 1 - (1-bg) × (1-border) × (1-shadow)
//     bg     = 自身背景 vs ページ背景のWCAGコントラスト連続値（ratio 1.0→0.0, 3.0→1.0）× 自身bgのalpha
//     border = 4辺平均の太さ（0px→0.0, 3px→1.0）× borderのalpha最大値
//     shadow = box-shadow の blur × alpha / 30 （クランプ）
//
//   visualPadding = paddingSum × (1 - 視覚境界の強さ)
//   visualSpace   = (marginSum + visualPadding) / 4
//   AP            = min(1 + visualSpace / 14, 3.0)
//
// 強調度の正規化: 視覚境界の強さで AP の効きを調整する。
function computeEmphasis(el, wcag, pageBackgroundColor) {
  const ratio = computeContrastRatio(el.color, el.backgroundColor, wcag);
  const cp = ratio != null ? ratio / 4.5 : 1.0;
  const sp = el.fontSize > 0 ? el.fontSize / 14 : 1.0;
  const fwp = el.fontWeight > 0 ? el.fontWeight / 400 : 1.0;
  const paddingSum =
    el.paddingTop + el.paddingRight + el.paddingBottom + el.paddingLeft;
  const mp = paddingSum > 0 ? paddingSum / 4 / 14 : 1.0;
  const kp = el.hasAnimation ? 1.5 : 1.0;

  // --- AP: 視覚境界の強さの3要素合成 ---

  // (1) 背景コントラスト（own bg vs page bg）
  const ownAlpha = getColorAlpha(el.ownBackgroundColor);
  const hasBgImage = el.backgroundImage && el.backgroundImage !== 'none';
  let bgStrength = 0;
  if (hasBgImage) {
    // Tier1では画像/グラデーションを完全には評価できない。暫定: 中程度の境界扱い
    // Tier2（ピクセルサンプリング）導入時にこの分岐を差し替える。
    bgStrength = 0.5;
  } else if (ownAlpha > 0) {
    const r = computeContrastRatio(
      el.ownBackgroundColor,
      pageBackgroundColor || 'rgb(255, 255, 255)',
      wcag
    );
    if (r != null) {
      bgStrength = clamp((r - 1.0) / (3.0 - 1.0), 0, 1) * ownAlpha;
    }
  }

  // (2) border 強さ（4辺平均の厚さ × alpha最大）
  const avgBorderWidth =
    (el.borderTopWidth +
      el.borderRightWidth +
      el.borderBottomWidth +
      el.borderLeftWidth) /
    4;
  const borderAlpha = Math.max(
    getColorAlpha(el.borderTopColor),
    getColorAlpha(el.borderRightColor),
    getColorAlpha(el.borderBottomColor),
    getColorAlpha(el.borderLeftColor)
  );
  const borderStrength = clamp(avgBorderWidth / 3, 0, 1) * borderAlpha;

  // (3) shadow 強さ（blur × alpha / 30 でクランプ）
  const sh = parseBoxShadow(el.boxShadow);
  const shadowStrength = clamp((sh.blur * sh.alpha) / 30, 0, 1);

  // 合成（確率的に「いずれかが視覚境界として働く」）
  const visualBoundary =
    1 - (1 - bgStrength) * (1 - borderStrength) * (1 - shadowStrength);

  // visualPadding = padding を視覚境界が吸収しなかった分
  const marginSum =
    (el.marginTop || 0) +
    (el.marginRight || 0) +
    (el.marginBottom || 0) +
    (el.marginLeft || 0);
  const visualPadding = paddingSum * (1 - visualBoundary);
  const visualSpace = (marginSum + visualPadding) / 4;
  const ap = Math.min(1 + visualSpace / 14, 3.0);

  return {
    cp,
    sp,
    mp,
    ap,
    kp,
    fwp,
    total: cp * sp * mp * ap * kp * fwp,
    contrastRatio: ratio,
    // デバッグ用の中間値
    visualBoundary,
    bgStrength,
    borderStrength,
    shadowStrength,
    hasBgImageUnresolved: hasBgImage,
  };
}

const DEEP_LAUNCH_ARGS = [
  '--disable-background-networking',
  '--disable-dev-shm-usage',
  '--disable-extensions',
  '--disable-gpu',
  '--disable-sync',
  '--no-default-browser-check',
  '--no-first-run',
];

function firstErrorLine(err) {
  return String(err && err.message ? err.message : err).split('\n')[0];
}

function systemChromeCandidates() {
  const candidates = [
    {
      runtime: 'system-chrome-path',
      label: 'Chrome(アプリパス)',
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    },
    {
      runtime: 'system-chromium-path',
      label: 'Chromium(アプリパス)',
      executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium',
    },
  ];
  return candidates.filter((candidate) =>
    fs.existsSync(candidate.executablePath)
  );
}

async function tryLaunchBrowser(label, launch, errors) {
  try {
    return await launch();
  } catch (err) {
    errors.push(`${label}: ${firstErrorLine(err)}`);
    return null;
  }
}

function deepRuntimeLabel(runtime) {
  if (runtime.startsWith('system-chrome')) return 'システムChrome';
  if (runtime.startsWith('system-chromium')) return 'システムChromium';
  return 'Playwright付属Chromium';
}

// Playwrightを起動。システムChrome優先、付属Chromiumをフォールバック。
async function launchBrowser(chromium) {
  const errors = [];
  const baseOptions = {
    headless: true,
    args: DEEP_LAUNCH_ARGS,
  };

  const channelBrowser = await tryLaunchBrowser(
    'Chrome(channel)',
    () => chromium.launch({ ...baseOptions, channel: 'chrome' }),
    errors
  );
  if (channelBrowser) {
    return { browser: channelBrowser, runtime: 'system-chrome-channel' };
  }

  for (const candidate of systemChromeCandidates()) {
    const browser = await tryLaunchBrowser(
      candidate.label,
      () =>
        chromium.launch({
          ...baseOptions,
          executablePath: candidate.executablePath,
        }),
      errors
    );
    if (browser) {
      return { browser, runtime: candidate.runtime };
    }
  }

  const bundledBrowser = await tryLaunchBrowser(
    'Playwright Chromium',
    () => chromium.launch(baseOptions),
    errors
  );
  if (bundledBrowser) {
    return { browser: bundledBrowser, runtime: 'playwright-chromium' };
  }

  const e = new Error(
    '--deep モードを実行するには、システムにGoogle Chrome、または Playwright付属の Chromium が必要です。\n' +
      '  対処: Chromeが落ちる場合はログイン中のChromeを終了して再実行するか、`npm run dcs-deep:install` で付属Chromiumを取得してください。\n' +
      `  試行結果:\n  - ${errors.join('\n  - ')}`
  );
  e.code = 'NO_BROWSER';
  throw e;
}

async function runDeepMeasure(filePath) {
  let chromium;
  let wcag;
  try {
    ({ chromium } = require('@playwright/test'));
    wcag = require('wcag-contrast');
  } catch (err) {
    const e = new Error(
      '--deep モードには @playwright/test と wcag-contrast が必要です。\n' +
        '  npm install --save-dev @playwright/test wcag-contrast\n' +
        `  内部エラー: ${err.message}`
    );
    e.code = 'NO_DEPS';
    throw e;
  }

  const { browser, runtime } = await launchBrowser(chromium);
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const absPath = path.resolve(filePath);
    await page.goto(`file://${absPath}`, { waitUntil: 'load', timeout: 15000 });

    // ブラウザ内で全要素のcomputed styleを一括取得。
    // 透明背景（rgba(0,0,0,0)）は祖先を遡って実背景を解決する。
    // ページ背景は body→html→白フォールバックで決定し、AP の境界判定に使う。
    const { elements, pageBackgroundColor } = await page.evaluate(() => {
      const SKIP = new Set([
        'SCRIPT',
        'STYLE',
        'META',
        'LINK',
        'NOSCRIPT',
        'TITLE',
        'HEAD',
      ]);

      function isTransparentColor(c) {
        if (!c) return true;
        if (c === 'transparent') return true;
        return c === 'rgba(0, 0, 0, 0)';
      }

      function resolvePageBg() {
        const bodyBg = getComputedStyle(document.body).backgroundColor;
        if (!isTransparentColor(bodyBg)) return bodyBg;
        const htmlBg = getComputedStyle(
          document.documentElement
        ).backgroundColor;
        if (!isTransparentColor(htmlBg)) return htmlBg;
        return 'rgb(255, 255, 255)';
      }

      function resolveBgColor(el) {
        let cur = el;
        while (cur && cur !== document.documentElement) {
          const bg = getComputedStyle(cur).backgroundColor;
          if (!isTransparentColor(bg)) return bg;
          cur = cur.parentElement;
        }
        return 'rgb(255, 255, 255)';
      }

      function getSelector(el) {
        const tag = el.tagName.toLowerCase();
        if (el.id) return `${tag}#${el.id}`;
        if (typeof el.className === 'string' && el.className.trim()) {
          const cls = el.className.trim().split(/\s+/).slice(0, 2).join('.');
          return `${tag}.${cls}`;
        }
        return tag;
      }

      // 直接テキストを持ち、ブロック子要素がない要素 = 強調度評価の対象。
      function isLeafTextElement(el) {
        const text = (el.textContent || '').trim();
        if (!text) return false;
        const blockChildren = Array.from(el.children).filter((c) => {
          const d = getComputedStyle(c).display;
          return (
            d && d !== 'inline' && d !== 'inline-block' && d !== 'contents'
          );
        });
        return blockChildren.length === 0;
      }

      const pageBg = resolvePageBg();
      const all = Array.from(document.querySelectorAll('body *'));
      const elementsOut = all
        .filter((el) => !SKIP.has(el.tagName) && el.offsetParent !== null)
        .map((el) => {
          const cs = getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          const text = (el.textContent || '').trim().replace(/\s+/g, ' ');
          return {
            tag: el.tagName,
            selector: getSelector(el),
            text: text.slice(0, 60),
            isLeafText: isLeafTextElement(el),
            color: cs.color,
            // resolveBgColor: コントラスト判定用の実効背景（祖先遡り）
            backgroundColor: resolveBgColor(el),
            // ownBackgroundColor: 自身のbg（透明含む）。AP の境界判定に使う
            ownBackgroundColor: cs.backgroundColor,
            backgroundImage: cs.backgroundImage,
            opacity: parseFloat(cs.opacity) || 1,
            mixBlendMode: cs.mixBlendMode,
            fontSize: parseFloat(cs.fontSize) || 0,
            fontWeight: parseInt(cs.fontWeight, 10) || 400,
            paddingTop: parseFloat(cs.paddingTop) || 0,
            paddingRight: parseFloat(cs.paddingRight) || 0,
            paddingBottom: parseFloat(cs.paddingBottom) || 0,
            paddingLeft: parseFloat(cs.paddingLeft) || 0,
            marginTop: parseFloat(cs.marginTop) || 0,
            marginRight: parseFloat(cs.marginRight) || 0,
            marginBottom: parseFloat(cs.marginBottom) || 0,
            marginLeft: parseFloat(cs.marginLeft) || 0,
            borderTopWidth: parseFloat(cs.borderTopWidth) || 0,
            borderRightWidth: parseFloat(cs.borderRightWidth) || 0,
            borderBottomWidth: parseFloat(cs.borderBottomWidth) || 0,
            borderLeftWidth: parseFloat(cs.borderLeftWidth) || 0,
            borderTopColor: cs.borderTopColor,
            borderRightColor: cs.borderRightColor,
            borderBottomColor: cs.borderBottomColor,
            borderLeftColor: cs.borderLeftColor,
            boxShadow: cs.boxShadow,
            width: rect.width,
            height: rect.height,
            hasAnimation:
              typeof el.getAnimations === 'function'
                ? el.getAnimations().length > 0
                : false,
          };
        });
      return { elements: elementsOut, pageBackgroundColor: pageBg };
    });

    const tmpDir = path.join(__dirname, '../tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const screenshotPath = path.join(
      tmpDir,
      `dcs-deep-${path.basename(filePath, '.html')}.png`
    );
    await page.screenshot({ path: screenshotPath, fullPage: true });

    // 強調度評価対象は leafText の要素のみ（構造ラッパーを除外）。
    const evaluated = elements
      .filter((el) => el.isLeafText && el.fontSize > 0)
      .map((el) => ({
        ...el,
        emphasis: computeEmphasis(el, wcag, pageBackgroundColor),
      }));

    // 大きいテキスト（18pt以上 ≒ 24px、または14pt太字 ≒ 18.66px+700）はWCAG「大きな文字」基準（3:1）。
    function thresholdFor(el) {
      const isLargeBold = el.fontSize >= 18.66 && el.fontWeight >= 700;
      const isLarge = el.fontSize >= 24;
      return isLarge || isLargeBold ? 3.0 : 4.5;
    }

    const contrastIssues = evaluated
      .filter((el) => el.emphasis.contrastRatio != null)
      .filter((el) => el.emphasis.contrastRatio < thresholdFor(el))
      .sort((a, b) => a.emphasis.contrastRatio - b.emphasis.contrastRatio)
      .map((el) => ({
        selector: el.selector,
        text: el.text,
        contrastRatio: el.emphasis.contrastRatio,
        threshold: thresholdFor(el),
        color: el.color,
        backgroundColor: el.backgroundColor,
      }));

    const emphasisRanking = evaluated
      .slice()
      .sort((a, b) => b.emphasis.total - a.emphasis.total)
      .slice(0, 8)
      .map((el) => ({
        selector: el.selector,
        text: el.text,
        ...el.emphasis,
        fontSize: el.fontSize,
        fontWeight: el.fontWeight,
      }));

    // 強調度の警告ロジック（2026-05-11 AP再定義に合わせて再設計）。
    //
    // 旧: 「総合10超えが N件」で警告（しかし新APでも h1 単体で30超は普通に出る）。
    // 新: 「主役は強くてよい。**強い主役が複数いる**ことが問題」という観点に切替。
    //
    //   HIGH_THRESHOLD = 30: 強い強調。1件は正常（h1=ページ主役）。**2件以上で警告**
    //   EXTREME_THRESHOLD = 50: 極端な強調。**1件でも警告**
    //
    // 新APの典型レンジ（実測ベース）:
    //   - プレーンテキスト本文: 1〜3
    //   - 二次見出し / ボタン: 4〜8
    //   - 強調主役（h1 等）: 15〜35
    //   - 極端な強調: 50+
    const HIGH_THRESHOLD = 30;
    const EXTREME_THRESHOLD = 50;
    const highEmphasized = evaluated.filter(
      (el) => el.emphasis.total >= HIGH_THRESHOLD
    );
    const extremeEmphasized = evaluated.filter(
      (el) => el.emphasis.total >= EXTREME_THRESHOLD
    );
    // 警告条件: 強主役が2件以上 OR 極端強調が1件以上
    const emphasisWarn =
      highEmphasized.length >= 2 || extremeEmphasized.length >= 1;

    return {
      runtime,
      screenshotPath,
      pageBackgroundColor,
      evaluatedCount: evaluated.length,
      contrastIssues,
      emphasisRanking,
      highEmphasizedCount: highEmphasized.length,
      extremeEmphasizedCount: extremeEmphasized.length,
      highThreshold: HIGH_THRESHOLD,
      extremeThreshold: EXTREME_THRESHOLD,
      emphasisWarn,
    };
  } finally {
    await browser.close();
  }
}

function formatDeepMarkdown(deep, sectionNo = '1.9') {
  const lines = [];
  lines.push(`### ${sectionNo} 深堀り計測（--deep）`);
  lines.push('');
  lines.push(
    `- 実行ランタイム: \`${deep.runtime}\`（${deepRuntimeLabel(deep.runtime)}）`
  );
  lines.push(
    `- スクリーンショット: \`${path.relative(process.cwd(), deep.screenshotPath)}\``
  );
  lines.push(`- 評価対象（テキスト持ち leaf 要素）: ${deep.evaluatedCount}個`);
  lines.push('');

  // コントラスト
  lines.push('#### コントラスト（WCAG）');
  lines.push('');
  if (deep.contrastIssues.length === 0) {
    lines.push('- 不足要素: 0件 ✅（評価対象内すべてが各しきい値を満たす）');
  } else {
    lines.push(`- 不足要素: ${deep.contrastIssues.length}件 ❌`);
    for (const c of deep.contrastIssues.slice(0, 10)) {
      lines.push(
        `  - \`${c.selector}\` "${c.text}" → 比 ${c.contrastRatio.toFixed(2)}:1（しきい値 ${c.threshold}:1） / fg: ${c.color} on bg: ${c.backgroundColor}`
      );
    }
    if (deep.contrastIssues.length > 10) {
      lines.push(`  - …他 ${deep.contrastIssues.length - 10} 件`);
    }
  }
  lines.push('');

  // 強調度
  lines.push('#### 強調度上位（CP × SP × MP × AP × KP × FWP）');
  lines.push('');
  if (deep.pageBackgroundColor) {
    lines.push(`- ページ背景: \`${deep.pageBackgroundColor}\`（AP の境界判定の基準）`);
    lines.push('');
  }
  if (deep.emphasisRanking.length === 0) {
    lines.push('- 評価対象なし');
  } else {
    lines.push('| # | 要素 | 文字 | 総合 | CP | SP | MP | AP | KP | FWP | 視覚境界 |');
    lines.push('|---|---|---|---|---|---|---|---|---|---|---|');
    deep.emphasisRanking.forEach((r, i) => {
      const fmt = (n) => (n == null ? '—' : n.toFixed(2));
      const vb = r.visualBoundary != null ? fmt(r.visualBoundary) : '—';
      lines.push(
        `| ${i + 1} | \`${r.selector}\` | "${r.text}" | **${fmt(r.total)}** | ${fmt(r.cp)} | ${fmt(r.sp)} | ${fmt(r.mp)} | ${fmt(r.ap)} | ${fmt(r.kp)} | ${fmt(r.fwp)} | ${vb} |`
      );
    });
    lines.push('');
    lines.push('> 視覚境界 = `1 - (1-bg)(1-border)(1-shadow)`。値が大きいほど要素が「視覚的に独立」している（カード化されている）。AP はこの境界の強さで padding が外側余白として効くかを調整する。');
  }
  lines.push('');
  const hi = deep.highThreshold || 30;
  const ex = deep.extremeThreshold || 50;
  const hiCount = deep.highEmphasizedCount || 0;
  const exCount = deep.extremeEmphasizedCount || 0;
  // 強調主役は1件まで許容、複数は階層崩れの兆候。極端強調は1件でも要注意。
  if (exCount > 0) {
    lines.push(
      `> ❌ 極端強調（総合${ex}以上）: ${exCount}件。視覚的に過剰な可能性が高いので確認してください。`
    );
  } else if (hiCount >= 2) {
    lines.push(
      `> ⚠️ 強主役（総合${hi}以上）: ${hiCount}件。1画面の主役は1件が原則です（h1相当）。`
    );
  } else if (hiCount === 1) {
    lines.push(`> ✅ 強主役（総合${hi}以上）: 1件（適切。階層が成立しています）`);
  } else {
    lines.push(
      `> ℹ️ 強主役（総合${hi}以上）: 0件。主役不在の可能性（ID/AEはAIレビュー観点で別途確認）`
    );
  }
  lines.push('');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// 4. ディレクトリ走査
// ---------------------------------------------------------------------------

// HTML / CSS の両方を対象に収集する（後方互換のため関数名は維持）。
function collectHtmlFiles(target) {
  const isTarget = (name) => name.endsWith('.html') || name.endsWith('.css');
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    return isTarget(target) ? [target] : [];
  }
  const result = [];
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      const s = fs.statSync(p);
      if (s.isDirectory()) walk(p);
      else if (isTarget(name)) result.push(p);
    }
  };
  walk(target);
  return result;
}

// ---------------------------------------------------------------------------
// 5. main
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { target: null, format: 'markdown', deep: false };
  for (const a of argv) {
    if (a === '--') continue;
    if (a === '--deep') args.deep = true;
    else if (a.startsWith('--format=')) args.format = a.slice('--format='.length);
    else if (!args.target) args.target = a;
  }
  return args;
}

async function main() {
  const { target, format, deep } = parseArgs(process.argv.slice(2));
  if (!target) {
    console.error(
      'Usage: node scripts/dcs-report.js <file-or-dir> [--format=markdown|json] [--deep]'
    );
    process.exit(1);
  }
  if (!fs.existsSync(target)) {
    console.error(`Not found: ${target}`);
    process.exit(1);
  }

  const meta = loadDefinedTokens();
  const files = collectHtmlFiles(target);
  if (files.length === 0) {
    console.error('No .html files found.');
    process.exit(1);
  }

  // 先に全ファイルの計測を済ませる（CSS は `--deep` の対象外なので fileType で振り分け）。
  const measurements = new Map();
  for (const f of files) {
    measurements.set(f, measureFile(f, meta.tokens));
  }

  // --deep は順次実行（同時に複数ブラウザを立ち上げない）。HTMLのみ対象。
  const deepResults = new Map();
  if (deep) {
    const htmlFiles = files.filter((f) => measurements.get(f).fileType === 'html');
    for (const f of htmlFiles) {
      try {
        deepResults.set(f, await runDeepMeasure(f));
      } catch (err) {
        // ブラウザや依存が無い等の致命系は早期終了。それ以外はファイル単位でエラー記録。
        if (err.code === 'NO_BROWSER' || err.code === 'NO_DEPS') {
          console.error(err.message);
          process.exit(1);
        }
        deepResults.set(f, { error: err.message });
      }
    }
  }

  if (format === 'json') {
    const reports = files.map((f) => ({
      file: path.relative(process.cwd(), f),
      tokensSource: meta.tokensSource ? path.relative(process.cwd(), meta.tokensSource) : null,
      measurements: measurements.get(f),
      deep: deep ? deepResults.get(f) || null : null,
      qualitativeReviewNote:
        'AE / CX / ID / DP / コントラスト感性評価などはAIまたは人のレビュー観点として扱う（自動測定対象外）',
    }));
    process.stdout.write(JSON.stringify(reports, null, 2) + '\n');
    return;
  }

  // markdown
  const out = [];
  for (const f of files) {
    const m = measurements.get(f);
    const d = deep ? deepResults.get(f) : null;
    out.push(formatMarkdown(f, m, meta, d));
    out.push('\n---\n');
  }
  process.stdout.write(out.join('\n'));
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err.stack || err.message);
    process.exit(1);
  });
}

module.exports = {
  measureFile,
  measureHtml, // 後方互換（measureFile の別名）
  formatMarkdown,
  loadDefinedTokens,
  runDeepMeasure,
  computeEmphasis,
  checkHeadingHierarchy,
  checkSpacingHierarchy,
};
