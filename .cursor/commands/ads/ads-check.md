# /ads-check（Yomogi デザインチェック）

## 概要
総合チェック、または特定観点の個別チェックを実行するCursor用ショートカットです。Yomogiの主フローは `.cursor/skills/dcs/SKILL.md` と `npm run dcs-report` にあります。

## 使い方
- 総合チェック: `/ads-check`
- 個別チェック: `/ads-check type=all|tokens|spacing|icons|contrast|layout|unify|components|emphasis|aesthetic|density|discoverability`
- 対象指定（任意）: `/ads-check type=spacing target=pages/generated/foo.html`

## 実行前
- チェックは読み取り中心の操作なので、確認なしで進めて問題ありません。
- 修正提案を実装に移す段階で、ファイル変更を伴う場合は短い計画を提示してから進めます。
- 参照: `AGENTS.md`、`.cursor/skills/dcs/SKILL.md`、`.cursor/rules/ads/design-checklist.mdc`

## 手順
1. チェック範囲を決定（未指定なら `type=all`）。
2. 対象HTMLが分かる場合は `npm run dcs-report -- <html>` を優先して実行し、必要に応じて `--deep` を使う。
3. `.cursor/rules/ads/` 配下の該当.mdc（design-checklist.mdc, layout.mdc, components/*.mdc, tokens/*.mdc, accessibility.mdc 等）を参照。
4. 技術（トークン直値/カラー直値/角丸・影直値、未定義CSS変数の使用）、レイアウト（L1-L4余白、グルーピング/区切り）、アクセシビリティ（alt/ラベル/コントラスト）、コンポーネント利用状況を検証。必要に応じて強調度（CP×SP×MP×AP×KP×FWP）や美的/情報密度/発見可能性のレビュー観点を整理する。
   - 強調度など測定可能な項目と、美的表現・文脈適合などAIのレビュー観点を分けて報告します。
5. レポート出力（定型）:
   - ✅ 良好な点（最大3件）
   - ⚠️ 改善推奨（最大3件、提案含む）
   - 🔴 要修正（重大違反があれば行番号・箇所）
6. 次アクションの提案（例: `/ads-check type=spacing` や `/ads-gen-page`）。

## 失敗時の案内
- トークン未ビルド等が疑われる場合は以下を案内:
  - `npm run build-all` の実行
  - `npm run validate-page`

## 備考
- `/ads-check` はCursor用の任意ショートカットです。自然文で「チェックして」と依頼された場合も、同じSkillとnpm scriptを使えます。
