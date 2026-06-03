---
name: package
description: Export, inspect, or explain the Yomogi Package for handing design-system assets to another repository, team, portfolio, or external generation tool. Use when the user asks to run export-package, create package files, hand off BRAND.md/tokens.css/components.html/reference.html/PROMPT.md, or explain when package export is useful versus direct Cursor + Yomogi workspace use.
---

# Yomogi Package

このSkillは、Yomogi Package の書き出しと引き渡しを扱う。Yomogi Package は主運用ではなく保険。Cursor + Yomogi で同じワークスペースを直接見られる場合、通常は `package/` を経由しない。

## When Package Export Helps

- 別リポジトリや別チームへ最小コア資産を渡す
- ポートフォリオや説明用にYomogiの状態をまとめる
- 外部生成ツールへブランド、トークン、参照HTMLをまとめて渡す
- 現在の tokens/components/brand の棚卸しをしたい

Claude Design など単発生成ツールには、精密なコンポーネントAPIより DCoS のムードボードや短い方向性プロンプトの方が合う場合が多い。

## Quick Start

```bash
npm run export-package
```

出力先を変える場合:

```bash
npm run export-package -- --out=<path>
```

## Output Files

- `BRAND.md`: `.cursor/rules/ads/brand.mdc` から抽出した方向性
- `tokens.css`: ページ用トークンCSS
- `components.html`: コンポーネントの簡易カタログ
- `reference.html`: 主要UIを並べた参照画面
- `PROMPT.md`: 外部ツール向けの指示テンプレート
- `README.md`: パッケージの使い方
- `_meta.json`: 生成メタとコンポーネント棚卸し

## Workflow

1. ユーザーの目的を確認する。外部引き渡しでなければ、直接リポジトリ参照で足りるか判断する。
2. `npm run export-package` を実行する。
3. 必要なら `_meta.json` を確認し、コンポーネント棚卸しや欠落を説明する。
4. 外部へ渡す場合は、`PROMPT.md` を起点に何を添付するかを短く案内する。

## Output Format

```markdown
Yomogi Package を書き出しました。

- 出力先: `package/`
- 含まれる主なファイル: `BRAND.md`, `tokens.css`, `components.html`, `reference.html`, `PROMPT.md`
- 次に見るもの: [目的に応じたファイル]
```

## Rules

- `package/` は再生成可能な成果物として扱う。
- 外部ツールに渡す前提を過大評価しない。
- Cursor上でYomogiを使う作業なら、`package/` より既存の `tokens/`, `components/`, `pages/_templates/` を優先する。
