# /ads-help（Yomogi スラッシュコマンド ヘルプ表示）

## 概要
Cursorで使えるYomogiの任意ショートカット一覧を表示します。Yomogiの作業フロー本体はSkill、実行処理はnpm scriptsです。

## 出力仕様
以下の枠内テキストを目安に、現在の利用状況に合わせて簡潔に案内してください。

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Yomogi - Cursor用ショートカット
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## スラッシュコマンド一覧（入力例つき）

- /ads-help
  - Cursor用ショートカット一覧を表示します
  - 入力例: `/ads-help`

- /ads-setup
  - Yomogi導入時の環境設定を案内します。npm scriptsで直接実行しても構いません。
  - 入力例: `/ads-setup`

- /ads-gen-page
  - 新規ページ作成時のショートカットです。デフォルトでは pages/generated/ に生成します。
  - 入力例: `/ads-gen-page`

- /ads-check
  - 測定可能な項目とAIレビュー観点を分けて、デザインチェックを行うショートカットです。
    全体的なチェックは総合で、type指定するとその項目を中心にチェックします。
  - 入力例: `/ads-check`
  - オプション: `type=all|tokens|spacing|icons|contrast|layout|unify|components|emphasis|aesthetic|density|discoverability`（既定はall）
    - 総合: `/ads-check`
    - トークン: `/ads-check type=tokens`
    - 余白: `/ads-check type=spacing`
    - アイコン: `/ads-check type=icons`
    - コントラスト: `/ads-check type=contrast`
    - レイアウト: `/ads-check type=layout`（区切り・グルーピングも含む）
    - 統一性: `/ads-check type=unify`
    - コンポーネント: `/ads-check type=components`
    - 強調（測定可能項目）: `/ads-check type=emphasis`
    - 美的（ブランド適合等）: `/ads-check type=aesthetic`
    - 情報密度: `/ads-check type=density`
    - 発見可能性: `/ads-check type=discoverability`

## 詳細仕様
- `ads-check.md`（チェック種別・出力体裁）
- `ads-gen-page.md`（生成要件・テンプレ）
- `ads-setup.md`（初期セットアップ）
- Skill本体: `.cursor/skills/`
- 実行コマンド: `npm run dcs-report`, `npm run build-all`, `npm run export-package`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
