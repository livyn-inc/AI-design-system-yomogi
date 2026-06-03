# AGENTS.md

このファイルは、本リポジトリ（AI Design System Yomogi）でエージェント（Cursor / Claude Code / その他のAI/CLI）が作業するときの最上位エントリです。ツール非依存で書かれており、まずここを読み、必要なときだけ詳細mdcやSkillを参照してください。

---

## 1. このファイルの位置づけ

- 本ファイルは「Yomogiでエージェントが守るべきこと」の単一情報源。
- これより詳細な内容は `.cursor/rules/ads/` 配下の各mdcに分散している。本ファイルと矛盾する記述があった場合は、本ファイルを優先する。
- 旧来の「AI運用8原則を最上位命令として絶対遵守」「ADS-LOG必須」「全mdc必読」「y/n強制」といった儀式表現は、本ファイルで上書きされる。各mdcに残っている古い表現は、本ファイルの方針で読み替える。

---

## 2. 設計品質として守るもの（変更しない）

エージェントは作業内容に関わらず、次は守る。儀式の緩和は、これらの設計品質を緩めることではない。

- **直書き禁止**: HTML/CSS/JS に px / hex / rgba / 独自数値を直接書かない。すべてトークン（`var(--xxx)`）を使う。
- **トークン存在確認**: 未確認のトークン名を推測で書かない。`build/css/tokens.css` で実在を確認してから使う。
- **コンポーネント優先**: 手書きHTMLよりも、`components/` および `pages/_templates/components.js` のコンポーネントを優先する。
- **ページ生成場所**: 新規ページは `pages/generated/` 配下に置く。`sample/` などの旧ディレクトリは使わない。
- **Storybook Matrix規格**: State × Size のマトリックスは `storybook/stories/_matrix.css` / `_matrix.js` を使う（独自CSSや行ラベル直書きは不可）。
- **デザイン原則の保護**: `.cursor/rules/ads/principles.mdc` の内容を勝手に変えない。原則と衝突する要望が来たら、原則を保ったまま再解釈する。

---

## 3. 緩和されたもの（強制から推奨へ）

旧来「最上位命令」「絶対遵守」とされていた次の項目は、運用ガイドに降格した。

| 旧 | 新 |
|---|---|
| 全返答冒頭にADS-LOGを必須出力 | 推奨。出さなくても作業を止めない |
| すべての作業前に y/n 確認を取る | ファイル変更を伴う作業のみ、1〜3行の短い計画を提示してから進める |
| 全mdc必読の初期化フロー | 必要なmdcだけ参照する。広い理解が要るときはDCoSなどのSkillに委譲する |
| 「AI運用8原則」を最上位命令として逐語遵守 | 現代のAgent作法（計画 → 実行 → 報告）として運用する |
| 「Cursor/Claude Code両対応」の明示 | ツール非依存。本ファイルの記述で読み替える |

### 計画提示の目安

- 読み取り・調査・相談: 確認なしで進めてよい。
- 1〜2ファイルの軽微な編集: そのまま進めてよい。完了後に報告する。
- 5本以上の同時編集、ルールmdcの再編、`tokens/` や `components/` の構造変更: 必ず1〜3行で計画を出してから進める。

---

## 4. 作業の進め方（共通フロー）

1. ユーザーの依頼を読み、本ファイルで方針を確認する。
2. 必要なら関連mdc（後述）だけを読む。全部読まなくてよい。
3. 大きめの変更なら短い計画を提示してから進める。
4. 実装する。設計品質ルールは守る。
5. 完了後、何を変えたか / 残課題があるかを報告する。

### Skill / npm scripts / スラッシュコマンドの位置づけ

Yomogi の運用は、次の3層で扱う。

- **Skill**: 作業フローの本体。方向性整理、制作ブリーフ、チェック、改善案、Package書き出しの判断手順を担う。
- **npm scripts**: 実行レイヤー。`build-all`、`dcs-report`、`export-package` など、実際に処理を走らせるコマンド。
- **`/ads-*` スラッシュコマンド**: Cursorで使う任意ショートカット。主運用ではなく、自然文依頼やSkill運用を呼び出しやすくする入口として扱う。

スラッシュコマンドの内容が本ファイル、Skill、npm scripts と矛盾する場合は、本ファイルとSkillを優先する。

### ページ制作の基本フロー

新しいページやサイトを作るときは、旧ADSの長いヒアリングをそのまま始めない。Yomogiでは、必要最小限の質問から次の流れで進める。

1. **方向性を決める**: 何のサイトか、誰向けか、何を達成したいか、どんな印象を避けたいかを確認する。
2. **作る内容を整理する**: 目的、主要行動、情報優先度、見た目の方向を制作ブリーフにする。
3. **ページを作る**: `pages/generated/` 配下に、実在トークンと既存コンポーネントを使って作る。
4. **チェックする**: `npm run dcs-report -- <html>` を実行する。必要なら `--deep` も使う。
5. **直し方を決める**: チェック結果から今回直す範囲と触らない範囲を決める。
6. **直す**: 今回決めた範囲だけ修正する。
7. **再チェックする**: もう一度 `dcs-report` を実行し、改善を確認する。

方向性が曖昧なら `.cursor/skills/dcos/SKILL.md`、制作ブリーフ化は `.cursor/skills/dbs/SKILL.md`、レビューは `.cursor/skills/dcs/SKILL.md`、改善案づくりは `.cursor/skills/dip/SKILL.md` を使う。

短いヒアリングでは、自由回答しやすい質問を基本にする。選択肢を出す場合も、特定の用途に押し込む形にせず「近いものがあれば選ぶ、直接入力でもよい」と伝える。ユーザー回答前に制作ブリーフやHTML作成へ進まない。

---

## 5. 参照する詳細ドキュメント

迷ったときに開く一次資料の地図。順番に全部読む必要はない。

### 詳細ルール（必要なときだけ）
- `.cursor/rules/ads/design-checklist.mdc`: デザイン作業時のチェック項目。
- `.cursor/rules/ads/ai-operations.mdc`: AI/エージェント向けの運用ガイド（本ファイルの詳細版）。
- `.cursor/rules/ads/tokens.mdc`, `.cursor/rules/ads/tokens/*.mdc`: トークン体系。
- `.cursor/rules/ads/components.mdc`, `.cursor/rules/ads/components/*.mdc`: コンポーネント仕様。
- `.cursor/rules/ads/layout.mdc`: レイアウトと余白階層。
- `.cursor/rules/ads/accessibility.mdc`: アクセシビリティ基準。
- `.cursor/rules/ads/storybook-matrix.mdc`: Storybook Matrix規格（必読：マトリックスを作るとき）。

### 上下流のSkill
- `.cursor/skills/dcos/SKILL.md`: 上流（方向性のファシリテーション）。
- `.cursor/skills/dcos/handoff-to-yomogi.md`: DCoS結果から brand.mdc / tokens への書き戻しテンプレート。
- `.cursor/skills/dbs/SKILL.md`: 制作前ブリーフ化。
- `.cursor/skills/dcs/SKILL.md`: 成果物レビュー。
- `.cursor/skills/dip/SKILL.md`: 改善案づくり。
- `.cursor/skills/package/SKILL.md`: Yomogi Package の書き出しと引き渡し。

### Yomogi Package
外部生成ツール（Claude Design / Cursor / v0 等）や別リポジトリへ渡すための最小コア資産は、次のコマンドで一括書き出しできる。

```bash
npm run export-package
```

出力先は `package/` 配下。含まれるもの: `BRAND.md` / `tokens.css` / `components.html` / `reference.html` / `PROMPT.md` / `README.md` / `_meta.json`。詳細は `docs/OPERATIONS.md` の「Yomogi Package エクスポート」を参照。

---

## 6. 評価表現について

旧表記の「独自定量評価システム」「総合品質スコア」は、現状の実装より大きい看板になっている。本ファイルでは、評価を次の2層に分けて扱う。

- **測定可能な項目**: トークン使用率、直書き検出（px/hex/rgba）、コンポーネント利用、a11y属性、ボタンヒエラルキー、生成場所等。`scripts/dcs-report.js` で自動レポートが出る。
- **AIレビュー観点**: 美的表現、色彩調和、情報密度、発見可能性、ブランド適合、文脈評価、コントラスト感性評価等。AIが説明する観点として扱い、スコアを断定しない。

両者を混ぜず、根拠を分けて報告する。

```bash
# DCSレポート生成
npm run dcs-report -- pages/generated/example.html
npm run dcs-report -- pages/generated --format=json
```

レポートは「測定可能な項目」と「AIレビュー観点（自動測定対象外）」を分けて出力する。

---

## 7. やらないこと（混乱防止）

- Yomogiだけで画面制作を完結させる前提に戻ること。
- 8原則を最上位命令として教義化し直すこと。
- 「独自定量評価」を実装の裏付けなくマーケ表現として復活させること。
- ルールmdcを本ファイルの方針と無関係に再編すること。

---

## 8. 補足

- 実運用では、AGENTS.md、Skill、tokens、components、pages、scripts を主な参照元にする。
- `/ads-*` はCursor向けの補助入口として扱い、Yomogiの主運用をスラッシュコマンド前提にしない。
