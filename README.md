# AI Design System Yomogi

Yomogi は、AIと人が協働でUIデザインを進めるためのデザインシステムです。本リポジトリは「画面を作るための完結ツール」ではなく、トークン・コンポーネント・規格・ブランド資産を保持して、IDE作業（Cursor等）や外部生成ツール（Claude Design 等）に渡せる**最小コアの判断と資産の置き場**として運用します。

Yomogi は、旧 `AI-design-system` の考え方を引き継ぎつつ、軽量な運用、測定可能なチェック、必要な文脈だけを読むエージェント入口に整理した版です。

---

## 📋 目次

- [はじめに読むもの](#-はじめに読むもの)
- [できること](#-できること)
- [クイックスタート](#-クイックスタート)
- [システムの設計思想](#-システムの設計思想)
- [評価の扱い](#-評価の扱い)
- [主要フォルダ構造](#-主要フォルダ構造)
- [運用と詳細手順](#-運用と詳細手順)
- [公開方針](#-公開方針)

---

## 📖 はじめに読むもの

| 順序 | ファイル | 内容 |
|---|---|---|
| 1 | [`AGENTS.md`](./AGENTS.md) | エージェントの最上位エントリ（守ること／緩和されたこと） |
| 2 | [`SETUP.md`](./SETUP.md) | 環境構築サマリと作業内容別の参照先 |
| 3 | [`docs/OPERATIONS.md`](./docs/OPERATIONS.md) | 運用詳細・開発フロー・FAQ・トラブルシューティング |
| 4 | `.cursor/skills/` | 方向性整理・制作ブリーフ・チェック・改善案・Package書き出しの手順 |

詳細な設計品質ルールは `.cursor/rules/ads/` 配下の各 `.mdc` を参照してください（必要なときだけ）。

---

## 💪 できること

- トークン（色・余白・フォント・角丸・影等）でUIの値を統一管理する
- 既存コンポーネント（Button / Card / Input 等）を組み合わせてページを作る
- ライト／ダークテーマに自動対応する
- AIに指示してページ生成・デザインチェック・改善提案を受ける
- 短いヒアリングから、ブランド方向性と制作ブリーフを整理する

このリポジトリは、Yomogi の中核資産を保持するためのものです。導入先固有のヒアリング結果、生成ページ、スクリーンショット、注釈データは、導入先プロジェクト側で扱います。

### 想定ユーザー

- **デザイナー**: トークンとコンポーネントで効率的にUIを構築する
- **エンジニア**: 実装時にすぐ使えるコード集とルールを参照する
- **ノンデザイナー**: 専門知識がなくても感覚的な指示でAIに作業を依頼する
- **AIエージェント**: AGENTS.md と各mdcに従ってデザインを出力する

---

## 🔁 基本フロー

Yomogi の実運用では次の流れで進めます。

1. **方向性を決める**: どんなサービス / サイトで、誰に何を感じてほしいかを短くヒアリングする。
2. **作る内容を整理する**: 目的、対象ユーザー、主要行動、情報優先度、見た目の方向を制作ブリーフにする。
3. **ページを作る**: `pages/generated/` 配下に、実在トークンと既存コンポーネントを使って作る。
4. **チェックする**: `npm run dcs-report -- <html>` で測定可能な項目を確認する。
5. **直し方を決める**: チェック結果をもとに、今回直す範囲と触らない範囲を決める。
6. **直す**: 今回決めた範囲だけ修正する。
7. **再チェックする**: もう一度 `dcs-report` を実行し、改善を確認する。

通常の会話では「方向性」「制作ブリーフ」「チェック」「直し方」のように自然な言葉で依頼して構いません。各工程の詳細は `.cursor/skills/` に分かれています。

Yomogiでは、作業フローは `.cursor/skills/`、実行処理は npm scripts を基本にします。`/ads-*` はCursorで使える任意のショートカットです。

---

## 🚀 クイックスタート

### 基本セットアップ

必要環境: Node.js 22 以上

```bash
# 1. 依存パッケージのインストール
npm install

# 2. トークン・コンポーネント・ページ用アセットのビルド
npm run build-all

# 3. Storybook起動（任意）
npm run storybook   # http://localhost:6006
```

品質チェックや外部引き渡しには、次のnpm scriptsを使います。

```bash
npm run dcs-report -- pages/generated/example.html
npm run export-package
```

Cursorでは、補助入口として次のスラッシュコマンドも使えます。

| ショートカット | 用途 |
|---|---|
| `/ads-setup` | Yomogi導入時のガイダンス |
| `/ads-gen-page` | 新規ページ生成（`pages/generated/` 配下） |
| `/ads-check` | デザインチェック |
| `/ads-help` | チェック項目の一覧表示 |

Cursorの入力候補には、Yomogi以外のグローバルSkillやCursor由来のコマンドも表示されることがあります。Yomogi固有のコマンド/Skillは `.cursor/commands/ads/` と `.cursor/skills/` にあるものだけです。

新しいページを作るときは、必要に応じて最初に短いヒアリングを行います。Yomogiでは、3〜5問程度で方向性と制作ブリーフを整えます。

詳しい手順・FAQ・トラブルシューティングは [`docs/OPERATIONS.md`](./docs/OPERATIONS.md) を参照。

---

## 🏗️ システムの設計思想

### 「引き算のデザイン」を基本にする

画面内のビジュアル要素を整理し、必要に応じて足し引きを判断します。例:

- 強調が強すぎる要素が複数並んでいる → 優先度を1つに絞る
- 情報密度が過密 → アイコン化・グループ化で整理
- ブランド適合性が弱い → 統一感を加える

「ロジック的に正しい」だけでは美しさは保証できないので、AIレビュー観点での視覚調整も並走させます。

### 設計品質として守ること（共通）

- **直書き禁止**: HTML/CSS/JS に px / hex / rgba / 独自数値を直接書かない。すべてトークン（`var(--xxx)`）。
- **トークン存在確認**: 推測でトークン名を書かない。`build/css/tokens.css` で実在を確認。
- **コンポーネント優先**: 手書きHTMLよりも、既存コンポーネントを優先。
- **生成場所**: 新規ページは `pages/generated/` 配下に置く。
- **Storybook Matrix規格**: State × Size のマトリックスは `_matrix.css` / `_matrix.js` を使う。
- **デザイン原則の保護**: `principles.mdc` を勝手に変えない。衝突する要望は再解釈する。

### 旧ADSからの変更点

旧ADSで強く扱っていた運用ルールは、Yomogiでは日常的に使いやすいガイドへ整理しています。

- エージェントの入口は `AGENTS.md` に集約
- 詳細mdcは必要なときだけ参照
- ファイル変更を伴う大きめの作業では、短い計画を提示してから進行
- 測定可能なチェックとAIレビュー観点を分けて報告

詳しくは [`AGENTS.md`](./AGENTS.md) を参照。

---

## 📊 評価の扱い

Yomogiでは、デザイン評価を次の2層に分けて扱います。

Yomogiは、元ADSの AE / CX / ID / DP や強調度評価の考え方を捨てていません。ただし、それらを完全自動の採点エンジンとして扱うのではなく、測れるものは `dcs-report` で測定し、測れないものはAIレビューで根拠つきに説明します。

### 測定可能な項目（自動チェック対象）

- トークン使用率／直書き検出（px/hex/rgba）
- コンポーネント利用率
- ページ生成場所（`pages/generated/` 配下か）
- アクセシビリティ属性（alt / label / aria）
- 強調度の構成要素（CP / SP / MP / AP / KP / FWP）の有無確認

`npm run dcs-report -- <html|dir>` で扱います。実レンダリング後のコントラストや強調度の目安を見る場合は `--deep` を使います。

### AIレビュー観点（説明として扱う）

- AE（美的表現）: ブランド適合・色彩調和・統一性・主脇役バランス
- CX（コンテキスト評価）: プロダクト・ページ・設計意図の適合
- ID（情報密度）: 占有面積と表示領域のバランス
- DP（発見可能性）: UI要素の見つけやすさ
- 要素間の視覚的関係性、密度バランス、洗練度、一貫性

報告では両者を分けて記述し、スコアを断定せず根拠を併記します。詳細は `.cursor/rules/ads/design-checklist.mdc` の「評価の扱い」を参照。

### あいまいな指示への対応

「もっと目立つように」「もっとコンパクトに」のような曖昧な指示には、軽微／中程度／大幅の段階的選択肢（A/B/C）を提示し、ユーザーに選んでもらいます。各段階で何が変わるかを簡潔に示します。

---

## 📁 主要フォルダ構造

```
ai-design-system-yomogi/
│
├── 📄 README.md                # このファイル（概要）
├── 📄 AGENTS.md                # エージェント向け最上位エントリ
├── 📄 SETUP.md                 # 環境構築サマリ
├── 📄 package.json             # npm scripts と依存関係
├── 📄 package-lock.json        # npm依存関係の固定ファイル
├── 📄 style-dictionary.config.js # トークンビルド設定
│
├── 📁 docs/
│   └── OPERATIONS.md           # 運用ガイド（FAQ・トラブルシューティング）
│
├── 📁 .cursor/
│   ├── 📁 commands/ads/        # /ads-* コマンド定義
│   ├── 📁 rules/ads/           # 設計ルール・ガイドライン
│   │   ├── design-checklist.mdc    # デザインチェック項目
│   │   ├── ai-operations.mdc       # AI/エージェント向け運用ガイド
│   │   ├── tokens.mdc              # トークン総則
│   │   ├── components.mdc          # コンポーネント総則
│   │   ├── layout.mdc              # レイアウト・余白階層
│   │   ├── principles.mdc          # デザイン原則
│   │   ├── accessibility.mdc       # アクセシビリティ
│   │   ├── brand.mdc               # ブランド設定
│   │   ├── patterns.mdc            # 実装パターン
│   │   ├── storybook-matrix.mdc    # Storybook Matrix規格
│   │   ├── glossary.mdc            # 用語集
│   │   ├── layout-templates.mdc    # レイアウトテンプレート
│   │   ├── 📁 components/          # 個別コンポーネント仕様
│   │   ├── 📁 tokens/              # 個別トークン仕様
│   │   ├── 📁 layout/              # ナビゲーション等のレイアウト詳細
│   │   ├── 📁 ai-learning/         # AI向けの学習・補助パターン
│   │   └── 📁 project-config/      # 初期化フロー・評価詳細
│   └── 📁 skills/              # 方向性整理・制作ブリーフ・チェック・改善案・Package
│
├── 📁 tokens/                  # デザイントークン定義（JSON）
├── 📁 components/              # コンポーネント実装（JS + CSS）
├── 📁 pages/                   # ページ関連
│   ├── SETUP.md                # ページ生成環境
│   ├── 📁 _templates/          # ベーステンプレート
│   ├── 📁 _assets/             # ビルド済みCSS/JS
│   └── 📁 generated/           # AI生成ページ
├── 📁 storybook/               # Storybook stories
├── 📁 .storybook/              # Storybook設定
├── 📁 build/                   # ビルド成果物（tokens.css 等）
├── 📁 scripts/                 # ビルド・チェック・Package書き出しスクリプト
└── 📁 package/                 # export-packageで生成される引き渡し用資産
```

`node_modules/`、`tmp/`、OS由来の一時ファイルなどは省略しています。

### データフロー

```
tokens/      → [npm run build-tokens]     → build/css/tokens.css
components/  → [npm run build-components] → pages/_assets/
                                                ↓
                                          pages/generated/
```

通常は `npm run build-all` でまとめて生成できます。

---

## 🛠️ 運用と詳細手順

| 知りたいこと | 参照先 |
|---|---|
| セットアップと日常運用 | [`docs/OPERATIONS.md`](./docs/OPERATIONS.md) |
| エージェントが最初に読む入口 | [`AGENTS.md`](./AGENTS.md) |
| ページ生成環境 | [`pages/SETUP.md`](./pages/SETUP.md) |
| デザイントークン | `tokens/`, `.cursor/rules/ads/tokens.mdc` |
| コンポーネント | `components/`, `.cursor/rules/ads/components.mdc` |
| デザインチェック項目 | `.cursor/rules/ads/design-checklist.mdc` |
| レイアウト・余白・アクセシビリティ | `.cursor/rules/ads/layout.mdc`, `.cursor/rules/ads/accessibility.mdc` |
| Storybook Matrix規格 | `.cursor/rules/ads/storybook-matrix.mdc` |
| 方向性整理・制作ブリーフ・レビュー・改善案 | `.cursor/skills/` |
| 外部ツールや別リポジトリへの引き渡し用Package | `npm run export-package`, `.cursor/skills/package/SKILL.md` |
| デザイン品質の自動レポート | `npm run dcs-report -- <html|dir>` |

---

## 📝 ライセンス・注意事項

- 本リポジトリは公開されていますが、再配布・再公開・商用利用は許可していません。
- 個人利用およびローカルでの改変は許可します。
- 本リポジトリは Yomogi の中核資産です。導入先固有の生成物・ヒアリング結果は別リポジトリで管理します。
- エージェント作業では、まず `AGENTS.md` を読み、必要な詳細mdcやSkillだけを参照します。
