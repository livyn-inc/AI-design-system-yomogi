# OPERATIONS — 運用ガイド

このファイルは、Yomogi の日常運用（環境構築の詳細、開発フロー、FAQ、トラブルシューティング）をまとめたものです。

最上位の方針は [`AGENTS.md`](../AGENTS.md)、概要は [`README.md`](../README.md)、設計品質ルールは `.cursor/rules/ads/*` を参照してください。

---

## 📋 目次

- [1. 環境構築の詳細](#1-環境構築の詳細)
- [2. 初回セットアップの流れ](#2-初回セットアップの流れ)
- [3. 開発フロー](#3-開発フロー)
- [4. 使い分け](#4-使い分け)
- [5. デザインの仕組み](#5-デザインの仕組み)
- [6. よくある質問（FAQ）](#6-よくある質問faq)
- [7. トラブルシューティング](#7-トラブルシューティング)

---

## 1. 環境構築の詳細

### 必要環境
- Node.js 22.x 以上

### 手順

```bash
# 1. 依存パッケージのインストール
npm install

# 2. トークン・コンポーネント・ページ用アセットのビルド
npm run build-all
# → build/、pages/_assets/、pages/_templates/components.js を生成

# 3. Storybookの起動確認（任意・推奨）
npm run storybook
# → http://localhost:6006 でコンポーネントカタログを確認
```

⚠️ `build-all` をスキップするとページが正常に表示されません。

### 直接インストールされるパッケージ

| パッケージ | 用途 | 開発元 |
|---|---|---|
| **style-dictionary** (v5.0.1) | デザイントークンのビルドツール | Amazon (AWS) |
| **storybook** (v8.6.18) | UIコンポーネントカタログ | Chromatic |
| **@storybook/html-webpack5** | HTML向けStorybookビルダー | Chromatic |
| **@storybook/addon-backgrounds** | Storybook背景切り替え | Chromatic |
| **@storybook/addon-essentials** | Storybook基本アドオン群 | Chromatic |
| **storybook-dark-mode** | Storybookのダークモード切り替え | npm package |
| **@playwright/test** | `dcs-report --deep` の実レンダリング・スクリーンショット取得 | Microsoft |
| **wcag-contrast** | `--deep` のWCAGコントラスト計算 | npm package |
| **pngjs** | スクリーンショット画像の解析補助 | npm package |
| **chrome-remote-interface** | Chrome連携の補助 | npm package |
| **dotenv** | 環境変数読み込み | npm package |

多くは開発時のみ使用（`devDependencies`）。詳細は `package.json` を参照。

`npm install` では、Playwrightのブラウザ本体は自動取得しません（`.npmrc` で `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` を指定）。`npm run dcs-report -- <html> --deep` は、まずシステムに入っているGoogle Chrome / Chromiumを優先して使います。

ブラウザが見つからない場合や起動できない場合だけ、次でPlaywright付属Chromiumを取得します。

```bash
npm run dcs-deep:install
```

なお、npmの依存関係としては上記以外にも多数の間接依存が入ります。`package-lock.json` 上では400件以上のパッケージが解決されており、`esbuild` などのビルド補助パッケージや、OS別のoptional dependencyも含まれます。

---

## 2. 初回セットアップの流れ

### npm scriptsで初期化

```bash
npm install
npm run build-all
```

Storybookを確認する場合:

```bash
npm run storybook
```

Cursorでは、補助入口として `/ads-setup` も使えます。ただしYomogiの主運用は、Skillで作業フローを決め、npm scriptsで実行する形です。

### 短い制作ヒアリング（3〜5分／スキップ可）

環境構築後、ページ制作を始める場合は必要に応じて次の内容だけをヒアリングします。Yomogiでは、作業フローをSkill側に寄せ、制作に必要な文脈を短く整理します。

1. **何を作るか**: LP / コーポレート / SaaS / 管理画面 / その他
2. **誰向けか**: 主なターゲットユーザーと利用シーン
3. **何を達成するか**: CTA、CV、主要行動
4. **どんな印象にしたいか**: 信頼感、親しみ、先進性、静けさ、密度感など
5. **避けたい印象**: 既視感、派手すぎる、安っぽい、難しそう、など

詳しくは `.cursor/rules/ads/project-config/init-flow.mdc` を参照。

> ヒアリング結果は導入先プロジェクト側で保存・参照します。Yomogiリポジトリには導入先固有の結果ファイルを含めません。

---

## 3. 開発フロー

### 典型的な開発フロー

1. `components/` 配下で機能を実装する。
2. 必要なら `tokens/` 配下を調整し、`npm run build-tokens` を実行する。
3. `npm run build-all` で全体をビルドする。
4. `npm run storybook` でコンポーネントを確認する。
5. `pages/generated/` 配下でHTMLページを生成する。
6. `npm run dcs-report -- <html>` で品質チェックを実行する。

よく使うコマンド:

```bash
npm run build-tokens
npm run build-all
npm run storybook
npm run dcs-report -- pages/generated/example.html
```

### チーム開発での注意点

1. **トークン変更は影響大**: 必ず事前に相談
2. **コンポーネント追加時**: `pages/SETUP.md` の利用可能コンポーネント一覧を更新
3. **ルール変更時**: `.cursor/rules/ads/` 配下の該当ファイル更新
4. **プルリクエスト前**: `npm run validate-page` で検証

### データフロー

```
tokens/ → [npm run build-tokens] → build/css/tokens.css
                                          ↓
components/ → [npm run build-components] → pages/_assets/
                                          ↓
                                    pages/generated/
```

通常は `npm run build-all` でまとめて生成できます。

---

## 4. 使い分け

Yomogiでは、作業フロー、実行処理、Cursor用ショートカットを分けて扱います。

| 種別 | 役割 |
|---|---|
| Skill | 方向性整理、制作ブリーフ、チェック、改善案、Package書き出しなどの作業フロー |
| npm scripts | ビルド、チェック、Package書き出しなどの実行処理 |
| `/ads-*` スラッシュコマンド | Cursorで使える任意ショートカット |

### Skill

| 場面 | 参照先 |
|---|---|
| 方向性を決める | `.cursor/skills/dcos/SKILL.md` |
| 制作ブリーフを作る | `.cursor/skills/dbs/SKILL.md` |
| 成果物をチェックする | `.cursor/skills/dcs/SKILL.md` |
| 改善案を作る | `.cursor/skills/dip/SKILL.md` |
| 外部引き渡し用Packageを書き出す | `.cursor/skills/package/SKILL.md` |

### npm scripts

| コマンド | 用途 |
|---|---|
| `npm run build-all` | トークン・コンポーネント・ページ用アセットを一括生成 |
| `npm run build-tokens` | トークンのみ再生成 |
| `npm run build-components` | コンポーネントバンドルのみ再生成 |
| `npm run build-page-assets` | ページ用アセット（bundle.css等）のみ再生成 |
| `npm run storybook` | Storybook起動（http://localhost:6006） |
| `npm run validate-page -- <html>` | ページの妥当性チェック（エラー/警告） |
| `npm run dcs-report -- <html|dir>` | DCSレポート生成（測定可能項目／Markdown） |
| `npm run dcs-report -- <html|dir> --format=json` | DCSレポート生成（JSON） |
| `npm run dcs-report -- <html> --deep` | 実レンダリング、コントラスト、強調度、スクリーンショットを含む深掘り計測 |
| `npm run dcs-deep:install` | `--deep` 用のPlaywright付属Chromiumを取得 |
| `npm run export-package` | Yomogi Package を `package/` に書き出し |
| `npm run export-package -- --out=path` | 出力先を指定 |

### Cursorのスラッシュコマンド（任意）

| ショートカット | 用途 |
|---|---|
| `/ads-setup` | 導入時のガイダンス |
| `/ads-gen-page` | 新規ページ生成（`pages/generated/` 配下） |
| `/ads-check` | デザインチェック（総合 / 個別） |
| `/ads-help` | チェック項目の一覧表示 |

スラッシュコマンドは便利な入口ですが、Yomogiの主運用ではありません。自然文で依頼した場合も、同じSkillとnpm scriptsを使って進めます。

Cursorの入力候補には、Yomogi以外のグローバルSkillやCursor由来のコマンドも表示されることがあります。Yomogi固有のコマンド/Skillは `.cursor/commands/ads/` と `.cursor/skills/` にあるものだけです。

### `npm run dcs-report` の出力構造

DCSレポートは「測定可能な項目」と「AIレビュー観点」を必ず分けて出力します。

- **測定可能な項目**: 直書き検出（px/hex/rgba）、トークン使用、未定義トークン、コンポーネント利用、ボタンヒエラルキー、a11y静的（alt/aria-label/role/h1/lang）、構造（DOCTYPE/charset/viewport/title/CSS/JS）、生成場所。`--deep` では実レンダリング後のWCAGコントラストと強調度の目安も測定する。
- **AIレビュー観点**: AE / CX / ID / DP、要素間の視覚的関係性、密度バランス、洗練度、ブランド適合、導線の分かりやすさ。これらは自動スコアとして断定せず、測定結果や画面文脈を根拠にAIまたは人が説明する。

```bash
# 単一ファイル
npm run dcs-report -- pages/generated/example.html

# 実レンダリング・スクリーンショット込み
npm run dcs-report -- pages/generated/example.html --deep

# ディレクトリ全体
npm run dcs-report -- pages/generated

# JSON形式（自動処理に使う場合）
npm run dcs-report -- pages/generated --format=json > report.json
```

### Yomogi Package エクスポート

外部生成ツール（Claude Design / Cursor / v0 / Figma Make 等）や別リポジトリにトーンを伝えるための最小コア資産を、1コマンドで `package/` に書き出します。

```bash
npm run export-package
# 出力先を変える場合
npm run export-package -- --out=../my-other-repo/yomogi-package
```

**含まれるファイル**:

| ファイル | 内容 | 元データ |
|---|---|---|
| `BRAND.md` | 方向性・トーン・Do/Don't | `.cursor/rules/ads/brand.mdc` |
| `tokens.css` | デザイントークンの正本 | `pages/_assets/tokens.css` |
| `components.html` | 28コンポーネントの簡易カタログ（JSDoc / props 自動抽出） | `components/*/Component.js` |
| `reference.html` | 主要UIを並べたサンプル画面 | テンプレート |
| `PROMPT.md` | 外部生成ツールに渡すブリーフと指示テンプレート | テンプレート |
| `README.md` | パッケージの使い方 | テンプレート |
| `_meta.json` | 生成メタ + コンポーネント棚卸（.mdc 未整備の一覧含む） | 自動生成 |

**外部ツールへの渡し方**: `package/PROMPT.md` の「渡し方の例」セクションに、`BRAND.md` / `tokens.css` / `components.html` / `reference.html` をどう添付し、どう指示するかのテンプレートが入っています。

**副産物**: `_meta.json` の `componentMdcMissing` に「.mdc 未整備のコンポーネント一覧」が出力されます。次のコンポーネント整理フェーズの起点に使えます。

### `/ads-check` の使い方（Cursor用ショートカット）

```bash
# 全体を総合チェック
/ads-check

# 特定の観点で詳細チェック
/ads-check type=tokens       # トークン使用状況
/ads-check type=spacing      # 余白
/ads-check type=icons        # アイコン
/ads-check type=contrast     # コントラスト
/ads-check type=layout       # レイアウト・グルーピング
/ads-check type=unify        # 統一性
/ads-check type=components   # コンポーネント利用
/ads-check type=emphasis     # 強調度（測定可能項目）
/ads-check type=aesthetic    # 美的表現（AIレビュー観点）
/ads-check type=density      # 情報密度
/ads-check type=discoverability # 発見可能性
```

報告では「測定可能な項目」と「AIレビュー観点」を分けて記述します。スコアは断定せず、根拠を併記します。詳細は `.cursor/rules/ads/design-checklist.mdc` を参照。

---

## 5. デザインの仕組み

### 基本フロー

1. **方向性を決める**: 何のサイトか、誰向けか、何を達成するか、避けたい印象を確認
2. **作る内容を整理する**: 目的、主要行動、情報優先度、見た目の方向を制作ブリーフ化
3. **ページを作る**: `pages/generated/` 配下で、トークンと既存コンポーネントを組み合わせる
4. **チェックする**: `npm run dcs-report -- <html>` で測定可能な項目を確認
5. **直し方を決める**: チェック結果から今回直す範囲と触らない範囲を決める
6. **直す**: 今回決めた範囲だけ修正
7. **再チェックする**: もう一度 `dcs-report` を実行して改善を確認

### 強調と美的レビューの連携

「目立たせる／控えめに」といった機能的な要求は、コントラスト・サイズ・余白・面積・動き・太さの構成要素として整理できます（CP × SP × MP × AP × KP × FWP）。`--deep` では、このうち実レンダリングから取得できる値を使って強調度の目安を出します。

「ブランドに合っているか」「色彩が調和しているか」「統一感があるか」「操作が見つけやすいか」は、AIレビュー観点として説明します。導入先固有のブランド軸、ページの目的、ユーザーの利用文脈に基づき、改善案を提示します。

両者は分けて報告します。測れるものは測定値として扱い、測れないものはスコアを断定せず、観察した根拠と判断理由を併記します。

### コンテキスト評価

プロダクト・ページ・設計意図の3層を踏まえて、次のような文脈別の最適化を行います。

- **プロダクト層**: 業界・事業フェーズ・競合環境
- **ページ層**: ランディング / ダッシュボード / フォーム等の目的別最適化
- **設計意図層**: ブランド価値・ユーザー体験・技術的制約

詳細は `.cursor/rules/ads/project-config/emphasis-*-detailed.md` を参照。

---

## 6. よくある質問（FAQ）

### 一般的な質問

#### Q: 最初に生成されるデザインが微妙
**A**: このシステムは「対話的な改善」を前提に設計されています。

初回生成では基本品質基準（トークン使用、アクセシビリティ等）をクリアしたベースを提供し、その後の対話で次のように調整します。

- 「もっと目立つように」→ 強調度の構成要素で数値的に調整
- 「ブランドに合わない」→ AIレビュー観点で具体的に改善提案

#### Q: 基本的な品質基準を守れていない時がある
**A**: ルールで組んでいますがAIも完璧ではないので、漏れがあることがあります。気になった時は `npm run dcs-report -- <html>` でチェックしてください。Cursorでは任意ショートカットとして `/ads-check` も使えます。

#### Q: デザイン原則を変更したい
**A**: `principles.mdc` を直接変更するとシステム全体の前提が崩れます。原則と反する内容にしたい場合は、原則は守りつつ再解釈する仕組みがあるので、AIに相談してください。

---

### トークン関連

#### Q: 新しい色を追加したい

トークン定義JSONでは、色の正本としてカラー値を書きます。生成後のHTML/CSS/JSでは、直接値ではなく `var(--xxx)` を使ってください。

`tokens/colors/index.json` を編集:

```json
{
  "color": {
    "brand": {
      "new-color": {
        "value": "#FF5733",
        "type": "color"
      }
    }
  }
}
```

ビルドして確認:

```bash
npm run build-tokens
grep "new-color" build/css/tokens.css
```

#### Q: トークンの命名規則は？

```
基本: --{カテゴリ}-{タイプ}-{名前}-{サイズ/番号}
例:   --color-semantic-primary-500

セマンティック色: --color-semantic-{用途}-{強度}-{theme}
例:   --color-semantic-neutral-50-light

余白: --spacing-{タイプ}-{サイズ}
例:   --spacing-padding-24
```

#### Q: 既存トークンの値を変更したい

```bash
# 1. 該当するJSONファイルを編集
# 例: tokens/spacing/primitives.json

# 2. ビルド
npm run build-tokens

# 3. 影響範囲をStorybookで確認
npm run storybook
```

> トークン値変更はシステム全体に影響するため、原則ユーザー確認を取ってから進めます。

---

### コンポーネント関連

#### Q: 新しいコンポーネントを追加したい

作成するファイル:

```text
components/new-component/
├── NewComponent.js    # 実装
└── NewComponent.css   # スタイル（トークン使用必須）
```

`NewComponent.js`:

```js
function NewComponent({ size = 'md', label = '' } = {}) {
  return `<div class="ds-new-component ds-new-component--${size}">
    ${label}
  </div>`;
}
```

`NewComponent.css`:

```css
.ds-new-component {
  padding: var(--spacing-padding-16);
  color: var(--color-semantic-text-high-light);
}
```

バンドル更新:

```bash
npm run build-all
```

Storybook追加:

```text
storybook/stories/NewComponent.stories.js
```

#### Q: コンポーネントのpropsを変更したい

```bash
# 1. コンポーネント編集
components/button/Button.js

# 2. バンドル更新
npm run build-components

# 3. ドキュメント更新箇所
- pages/SETUP.md（利用可能コンポーネント一覧）
- .cursor/rules/ads/components/button.mdc（詳細仕様）
- storybook/stories/Button.stories.js（サンプル）
```

#### Q: コンポーネントで直接スタイルを指定したい

直書きは禁止です。必ずトークンを使ってください。

```css
/* ❌ */
.ds-component {
  padding: 16px;
  color: #333;
  font-size: 14px;
}

/* ✅ */
.ds-component {
  padding: var(--spacing-padding-16);
  color: var(--color-semantic-text-high-light);
  font-size: var(--font-size-14);
}
```

---

## 7. トラブルシューティング

### Q: トークンが反映されない

```bash
# 1. ビルドを実行したか
npm run build-tokens

# 2. トークン名が正しいか
grep "your-token-name" build/css/tokens.css

# 3. CSSが最新か
npm run build-page-assets
```

### Q: Storybookでエラーが出る

```bash
# 1. 依存関係の確認
npm install

# 2. ビルドのやり直し
npm run build-all

# 3. Storybookの再起動
npm run storybook
```

依存関係の破損が疑われる場合だけ、`node_modules/` の削除と再インストールを検討してください。

### Q: validate-pageでエラーが出る

```
一般的なエラー：
- "Direct px value found":  トークンを使用
- "Direct color code found": カラートークンを使用
- "Multiple primary buttons": 1画面1つに制限
- "Missing alt attribute":   alt属性を追加
```

### Q: AIが思った通りに動かない

1. **AGENTS.md / SETUP.md を確認したか**: 最初の入口を揃える
2. **ファイル変更を伴う作業で短い計画を出させたか**: 大きめの変更時は計画提示を促す
3. **具体的な指示をしたか**: あいまいな指示は段階的選択肢（A/B/C）を求める

---

## 📚 関連ドキュメント

- [`AGENTS.md`](../AGENTS.md): エージェントの最上位エントリ
- [`README.md`](../README.md): システム概要
- [`SETUP.md`](../SETUP.md): 環境構築サマリ
- [`pages/SETUP.md`](../pages/SETUP.md): ページ生成環境
- `.cursor/rules/ads/design-checklist.mdc`: デザインチェック項目
- `.cursor/rules/ads/ai-operations.mdc`: AI運用ガイド
- `.cursor/rules/ads/components/`: 個別コンポーネント仕様
- `.cursor/rules/ads/tokens/`: 個別トークン仕様
