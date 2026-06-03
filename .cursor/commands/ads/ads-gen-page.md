# /ads-gen-page（新規ページ生成）

## 概要
`pages/generated/` 配下にテンプレート準拠で新規ページを生成するCursor用ショートカットです。作成前の方向性整理や制作ブリーフはSkill側を主フローとして扱います。

## 使い方
- 基本: `/ads-gen-page`
  - タイトルはチャットで口頭指定（例:「タイトルは sample_check」）を受け付けます
  - テンプレートは現状 `base` 固定（オプション指定は不要）

## 実行前
- 生成内容（タイトル・主要セクション・使うコンポーネント）を1〜3行で示してから進めます。
- 参照: `AGENTS.md`、`.cursor/skills/dbs/SKILL.md`、`.cursor/rules/ads/design-checklist.mdc`

## 手順
1. タイトルを会話から取得（未指定時はプロンプトで確認）
2. テンプレートは `pages/_templates/base.html` を使用（固定）
3. 生成場所は必ず `pages/generated/`
4. `<link rel="stylesheet" href="../_assets/bundle.css">` を含める
5. 必要に応じて `pages/_templates/components.js` を読み込み、提供コンポーネントを利用
6. 生成後は `npm run validate-page` を案内（または実行）

## 出力例
- 生成ファイルパス
- 追加入力が必要な場合のプロンプト（フォーム項目等）

## 備考
- 参考テンプレート: `pages/_templates/base.html`
- `/ads-gen-page` はCursor用の任意ショートカットです。自然文でページ作成を依頼された場合も、同じルールで進めます。
