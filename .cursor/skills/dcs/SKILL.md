---
name: dcs
description: Review Yomogi-generated HTML/CSS/UI outputs by running dcs-report, separating measurable violations from AI design review, and explaining findings. Use when the user asks to check, audit, review, score, validate, or inspect a Yomogi page, generated page, design output, contrast, emphasis hierarchy, token usage, component usage, accessibility, or visual quality.
---

# DCS

DCS（Design Critic System）は、作った後の成果物をレビューする手順。`scripts/dcs-report.js` が返す事実を読み、測定可能な違反とAIレビュー観点を分けて説明する。

ユーザーには通常「チェック」「レビュー」「品質確認」と呼ぶ。

## Quick Start

対象が HTML またはディレクトリなら、まず静的レポートを実行する。

```bash
npm run dcs-report -- <html|dir>
```

見た目の主役、コントラスト、実レンダリング後の値が必要なら `--deep` を使う。

```bash
npm run dcs-report -- <html> --deep
```

JSON が必要な場合:

```bash
npm run dcs-report -- <html|dir> --format=json
```

## Workflow

1. 対象ファイルを確認する。新規ページなら `pages/generated/` 配下かを見る。
2. 静的レポートを実行する。
3. HTML単体で視覚品質を見る場合は `--deep` も実行する。
4. 結果を「測定可能な項目」と「AIレビュー観点」に分ける。
5. 指摘は重要度順に並べる。
6. 修正手順まで求められたら、改善案として今回直す範囲と完了条件に落とす。

## Finding Levels

- **要修正**: 直書き、未定義トークン、構造欠落、重大なa11y、見出し崩れ、コントラスト不足、生成場所違反
- **改善推奨**: コンポーネント利用不足、primary過多、余白階層の規定外、主役不在、強主役の複数化
- 0の余白トークンは、margin / padding のリセット用途なら改善推奨に含めない。
- **観察**: ブランド適合、情報密度、導線の自然さ、コピーの強弱、視線誘導

測定できる項目を美的判断として言い換えない。AIレビュー観点をスコアとして断定しない。

## Output Format

```markdown
# 品質チェック

## 測定可能な項目
- [要修正/改善推奨/良好] [根拠と行番号があれば行番号]

## AIレビュー観点
- [観察したこと]

## 優先度
1. [最初に直すこと]
2. [次に直すこと]
3. [後回しでよいこと]

## 次に使うとよい手順
[改善案を作る / 制作ブリーフを整理し直す / そのまま実装修正する]
```

## Deep Review Notes

`--deep` の強調度は「どれくらい目立つか」の目安として読む。

- 強主役が1件なら、階層が成立している可能性が高い。
- 強主役が複数あるなら、視線誘導が割れている可能性がある。
- 主役不在なら、hero、見出し、CTA、余白、サイズ、背景境界のどれかを強める。
- 背景画像、グラデーション、半透明、blend mode は Tier2/3 ピクセルサンプリング未実装のため、必要なら目視確認も併用する。

## Rules

- レポートの事実を先に出し、感想だけでレビューしない。
- ユーザーが「直して」と言った場合は、レビューで止めずに DIP の考え方で修正順を作る。
- DCoS の方向性と衝突する場合は、原則を壊さず再解釈する。
