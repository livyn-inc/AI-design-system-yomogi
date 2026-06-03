---
name: dbs
description: Convert an approved design direction, DCoS output, moodboard notes, or rough product intent into a Yomogi build brief before creating HTML/UI/LP pages. Use when the user asks to prepare a prompt, brief, page plan, information priority, visual rules, token/component mapping, or handoff from DCoS into Yomogi implementation.
---

# DBS

DBS（Design Brief System）は、作る前に「何をどう作るか」を短い実装ブリーフへ変換する手順。DCoS が方向性を決める役なら、DBS はその方向性を Yomogi で作れる入力へ落とす役。

ユーザーに内部用語を説明しすぎない。通常は「制作ブリーフ」「実装前の整理」「生成用プロンプト」と呼ぶ。

## Inputs

優先して読むもの:

- DCoS の方向性まとめ、またはユーザーのラフな要望
- `.cursor/rules/ads/brand.mdc`
- `build/css/tokens.css` または `pages/_assets/tokens.css`
- `components/` と `pages/_templates/components.js`
- 必要なら `.cursor/skills/dcos/handoff-to-yomogi.md`

未確認のトークン名は書かない。トークンを指定する場合は、必ず生成済み CSS に実在する名前を確認する。

トークン確認の優先順位:

1. `pages/_assets/tokens.css`
2. `build/css/tokens.css`
3. どちらも無い場合のみ `tokens/*.json` を参考にし、ブリーフでは「実装時にCSSで再確認」と明記する

生成済みCSSが存在する場合は、JSONだけを正本扱いしない。ブリーフに書くトークン名はCSS上で完全一致したものだけにする。例: `--shadow-box-shadow-2xs-light` は可、未確認の `--shadow-boxShadow-2xs-light` は不可。

## Workflow

1. 目的、対象ユーザー、主要行動、情報優先度を確認する。
2. DCoS の方向性を、色、文字、余白、密度、モチーフ、Do/Don't に分解する。
3. Yomogi の実トークンと既存コンポーネントへ対応づける。
4. 新規ページなら `pages/generated/` 配下を前提にする。
5. 実装者または生成AIに渡せるブリーフとして出力する。
6. 受け入れ条件に、作成後のチェックで確認する項目を入れる。

ユーザーやシナリオが作成先パスを指定していない場合、具体的なファイル名を勝手に決めない。`pages/generated/[name].html` のように仮置きとして書くか、ページ作成ステップで確認する。

質問が必要なときは3〜5問に絞る。曖昧なまま進められる場合は仮置きして、仮置きであることを明記する。

## Question Rules

短いヒアリングでは、ユーザーが自分の言葉で答えやすい問いを優先する。

- 自由回答を基本にする。
- 選択肢は補助として使い、ユーザーを特定のペルソナや用途に押し込まない。
- 選択肢を出す場合は「近いものがあれば選んでください。直接入力でも大丈夫です」と添える。
- 1問の中に複数の判断軸を詰め込みすぎない。
- 質問後はユーザーの回答を待つ。回答前に制作ブリーフやHTML作成へ進まない。

推奨する最初の質問:

```text
1. このLPは誰に向けたものですか？
2. その人は今、どんな困りごとを抱えていますか？
3. このLPで最終的に何をしてほしいですか？
4. どんな印象にしたいですか？
5. 逆に、避けたい見た目や既視感はありますか？
```

## Output Format

標準出力はこの形にする。ユーザー向けのブリーフでは、トークン名やコンポーネント候補を長く列挙しない。実装に必要な制約として短く書き、具体的なトークン名は実装時に確認する。

```markdown
# Yomogi 制作ブリーフ

## 目的
[この画面で達成すること]

## 対象ユーザー
[誰向けか]

## 主要行動
[CTA / 完了行動]

## 情報優先度
1. [最優先]
2. [次点]
3. [補助]

## 見た目の方向性
- 色:
- タイポグラフィ:
- 余白 / 密度:
- モチーフ:
- 避けること:

## Yomogi への落とし込み
- トークン: 実装時に `pages/_assets/tokens.css` または `build/css/tokens.css` で確認した実在トークンだけを使う
- コンポーネント: 既存のButton / Card / List / Tableなどを優先し、手書きHTMLを増やしすぎない
- ページ配置: `pages/generated/` 配下

## 受け入れ条件
- `npm run dcs-report -- <html>` が重大違反なし
- 必要に応じて `npm run dcs-report -- <html> --deep` で主役とコントラストを確認
- DCoSで決めた避ける印象に寄っていない

## 次のアクション
このブリーフでページ作成に進む場合は、次のように依頼してください。

```text
この制作ブリーフでページを作成してください。
作成先は pages/generated/[name].html にしてください。
作成後、初回チェックまで実行してください。
```
```

## Prompt Placement

ブリーフの途中に長い「実装 / 生成用プロンプト」を置かない。ユーザーが次に何をすればよいか迷わないよう、ブリーフの最後に「次のアクション」として短いプロンプトを置く。

ユーザーがファイル名を指定していない場合は、`[name]` を仮置きにするか、ページ作成時に確認する。テストシナリオなどで作成先が指定されている場合だけ、そのパスを入れる。

## Rules

- Yomogi だけで画面制作を完結させる前提に戻さない。
- 外部生成ツール向けでも、Yomogi の実装トークンとコンポーネントを過剰に細かく渡しすぎない。
- 方向性がまだ固まっていない場合は、DBSではなく DCoS に戻す。
- 作った後の評価や修正方針が主目的なら、DCS または DIP を使う。
