# SETUP

このファイルは、Yomogi を使い始めるための手順サマリです。エージェント向けの最上位エントリは [`AGENTS.md`](./AGENTS.md) です。

---

## 1. 最初に読むもの

- [`AGENTS.md`](./AGENTS.md): エージェントの守るべきこと（ツール非依存の単一情報源）
- [`README.md`](./README.md): システムの概要と機能カタログ
- [`docs/OPERATIONS.md`](./docs/OPERATIONS.md): 運用詳細・FAQ・トラブルシューティング

---

## 2. 環境構築（初回のみ）

必要環境: Node.js 22 以上

```bash
npm install
npm run build-all     # build/css/tokens.css, pages/_assets/bundle.css, pages/_templates/components.js を生成
npm run storybook     # http://localhost:6006 でコンポーネント確認
```

`build-all` をスキップするとページが正常に表示されないので注意。

---

## 3. 作業の進め方

1. AGENTS.md の「設計品質として守るもの」を確認する。
2. 作業内容に応じて、必要な詳細mdcだけ参照する。
3. ファイル変更を伴う作業は、1〜3行の短い計画を提示してから進める。
4. 完了後、何を変えたか / 残課題があるかを報告する。

詳しくは AGENTS.md を参照。

---

## 4. 作業内容別の参照先

| 作業 | 参照する詳細 |
|---|---|
| デザイン作業（ページ作成・修正） | `.cursor/rules/ads/design-checklist.mdc` |
| トークン追加・編集 | `.cursor/rules/ads/tokens.mdc`, `tokens/` |
| コンポーネント追加・編集 | `.cursor/rules/ads/components/*.mdc`, `components/` |
| ページ生成 | [`pages/SETUP.md`](./pages/SETUP.md), `pages/_templates/` |
| Storybook（State × Size マトリックス） | `.cursor/rules/ads/storybook-matrix.mdc` |
| アクセシビリティ | `.cursor/rules/ads/accessibility.mdc` |

---

## 5. ページ制作前のヒアリング

新しいページやサイトを作るときは、必要に応じて短いヒアリングを行います。

確認する内容の目安:

1. 何を作るか
2. 誰向けか
3. 何を達成したいか
4. どんな印象にしたいか
5. 避けたい印象は何か

詳しい進め方は [`AGENTS.md`](./AGENTS.md) と `.cursor/rules/ads/project-config/init-flow.mdc` を参照してください。

---

## 6. 実行コマンドと補助ショートカット

Yomogi の作業フローは `.cursor/skills/`、実行処理は npm scripts を基本にします。

よく使う npm scripts:

- `npm run build-all`: トークン・コンポーネント・ページ用アセットをまとめて生成
- `npm run dcs-report -- <html|dir>`: デザイン品質の自動レポート
- `npm run export-package`: 外部引き渡し用のPackageを書き出し

Cursorでは、任意のショートカットとして次も使えます。

- `/ads-setup` : 導入時のガイダンス
- `/ads-gen-page` : 新規ページ生成
- `/ads-check` : デザインチェック
- `/ads-help` : チェック項目の一覧表示

Cursorの入力候補には、Yomogi以外のグローバルSkillやCursor由来のコマンドも表示されることがあります。Yomogi固有のコマンド/Skillは `.cursor/commands/ads/` と `.cursor/skills/` にあるものだけです。
