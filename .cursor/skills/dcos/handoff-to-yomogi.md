# Handoff to Yomogi

DCoS で確定した方向性を、Yomogi本体（`brand.mdc` と `tokens/*.json`）に書き戻すための差分提案テンプレート集。

このファイルは DCoS Skill から参照される。最終化（Finalization）まで進んだ後、ユーザーが「Yomogi に反映したい」「ブランド設定に書き戻したい」「トークンに反映してほしい」と言った場合に使う。

---

## 1. 出力の流れ

DCoSの最終化が終わったあと、次の順で Handoff 提案を出す。

1. **ユーザーに Handoff の意向を確認する**: 「この方向性を Yomogi のブランド設定とトークンに反映しますか？反映する場合、差分提案を出します。」
2. **Brand Diff（brand.mdc 用 Markdown）を出す**: 後述のフォーマット
3. **Token Diff（tokens/*.json 用 JSON 差分提案）を出す**: 後述のフォーマット
4. **適用手順を案内する**: ユーザーが採用可否を判断 → 適用 → `npm run build-all` → Storybook 確認

JSON は AI が直接書き換えず、差分提案として Markdown のコードブロックで提示する。実ファイルへの反映可否はユーザーが判断する。

---

## 2. Brand Diff（brand.mdc 書き戻し提案）

DCoS Output の各項目を `brand.mdc` の該当セクションへマッピングする。

### マッピング表

| DCoS Output | brand.mdc の書き戻し先 |
|---|---|
| 採用する方向性 | `## 3. 採用するデザイン方向性` |
| デザインコンセプト | `## 3.` の「方向性名」「一文での説明」 |
| なぜこの方向が合うか | `## 3.` の「採用理由」 |
| ユーザーに持ってほしい感情 | `## 3.` の「ユーザーに持ってほしい感情」、`## 2. ミッション・ビジョン` の補強 |
| 見た目の方向性 | `## 5. 見た目の方向性`（カラー/タイポ/余白/角丸/影/アイコン） |
| やること | `## 6. やること（Do）` |
| 避けること | `## 7. 避けること（Don't）` |
| 出力を確認するときの観点 | `## 8. 確認観点` |
| 参照文脈（Reference Mixing） | `## 9. 参考文脈` |

### 出力フォーマット

```markdown
## Brand Diff Proposal（brand.mdc 書き戻し提案）

### 対象ファイル
.cursor/rules/ads/brand.mdc

### 提案する更新

#### 3. 採用するデザイン方向性
- 方向性名: [DCoS Final Direction Name]
- 一文での説明: [短い要約]
- 採用理由: [なぜこの方向が合うか]
- ユーザーに持ってほしい感情: [体験感情]

#### 4. トーン＆マナー
- 言葉遣い: [...]
- カジュアル度: [...]
- 専門用語の扱い: [...]

#### 5. 見た目の方向性
（5.1〜5.5 を必要な範囲で更新。詳細は Token Diff 側で提案）

#### 6. やること（Do）
- [Do 1]
- [Do 2]
- [Do 3]

#### 7. 避けること（Don't）
- [Don't 1]
- [Don't 2]
- [Don't 3]

#### 8. 確認観点
- [観点 1]
- [観点 2]
- [観点 3]

#### 9. 参考文脈
- 参考: [何]
  - 借りる: [どの要素]
  - 真似しない: [どの要素]

#### 10. 更新履歴に追加
| 2026-MM-DD | DCoS確定方向性「[名前]」反映 | initial / iteration N | （Token Diff 側で指定） |
```

---

## 3. Token Diff（tokens 差分提案）

DCoS の「見た目の方向性」をトークン値に落とし込む。実ファイル（`tokens/*.json`）を直接書き換えず、差分提案として出す。

### 対象トークンファイル

| 領域 | ファイル | 主な対象 |
|---|---|---|
| カラー | `tokens/colors/index.json` | プライマリー / アクセント / セマンティック色のセマンティック層 |
| 余白 | `tokens/spacing/primitives.json` | 基本密度の見直し（基本ステップ、L1〜L4 起点） |
| フォント | `tokens/font/primitives.json` | family / size 体系 |
| 角丸 | `tokens/radius/primitives.json` | 角丸の標準値 |
| 影 | `tokens/shadow/primitives.json` | 影の強さ・距離 |

### 出力フォーマット

```markdown
## Token Diff Proposal（tokens 差分提案）

### 概要
DCoS方向性「[名前]」を反映するための、トークン差分の提案です。
すべての値は提案であり、採用可否はユーザーが判断してください。
JSON は手動で書き換えてから `npm run build-tokens` を実行してください。

### Color Diff

#### tokens/colors/index.json

セマンティック層に追加・更新する項目:

```json
{
  "color": {
    "semantic": {
      "primary": {
        "base": {
          "light": { "value": "{color.base.[hue].[step]}" },
          "dark":  { "value": "{color.base.[hue].[step]}" }
        }
        // 強度別（強・中・弱）も同様に
      }
      // accent / bg / surface / text / divider も必要に応じて
    }
  }
}
```

採用根拠:
- プライマリー候補: `[hue]-[step]` → 採用理由: [DCoSの体験感情に合致する根拠]
- アクセント候補: `[hue]-[step]` → 採用理由: [...]

新規プリミティブが必要な場合（既存パレットに該当色がないとき）:

```json
{
  "color": {
    "base": {
      "[新hue名]": {
        "50":  { "light": { "value": "#xxxxxx" }, "dark": { "value": "#xxxxxx" } },
        "100": { "light": { "value": "#xxxxxx" }, "dark": { "value": "#xxxxxx" } },
        // ... 9段階
        "900": { "light": { "value": "#xxxxxx" }, "dark": { "value": "#xxxxxx" } }
      }
    }
  }
}
```

> 新規プリミティブ追加は影響範囲が大きいため、ユーザー確認を必ず取ること。

### Spacing Diff（必要な場合のみ）

#### tokens/spacing/primitives.json

基本密度の方針が「ゆったり」「コンパクト」など現状から変える場合のみ提案。
変更しない場合は「変更なし」と明記する。

### Typography Diff（必要な場合のみ）

#### tokens/font/primitives.json

family / size の追加・差し替え提案。Webフォント追加時は読み込み手順も併記。

### Radius Diff / Shadow Diff（必要な場合のみ）

角丸・影の方針が変わる場合のみ提案。
```

---

## 4. 適用手順（ユーザー向け案内）

Token Diff の最後に、次の手順を案内する。

```markdown
## 適用手順

1. 上記の Brand Diff を `.cursor/rules/ads/brand.mdc` に反映
2. 上記の Token Diff を該当 JSON ファイルに反映
   - `tokens/colors/index.json`
   - 必要なら `tokens/spacing/primitives.json` 等
3. ビルド実行
   ```bash
   npm run build-all
   ```
4. 生成確認
   - `build/css/tokens.css` で新トークンが生成されているか
   - `pages/_assets/bundle.css`、`pages/_templates/components.js` が更新されているか
5. Storybook で目視確認
   ```bash
   npm run storybook
   ```
   - `Tokens/Colors > OverlayColors` 等でライト/ダーク両方を確認
   - 主要コンポーネントの表示崩れがないか確認
6. 影響が大きい変更（プリミティブ追加、セマンティック層の差し替え）は、最小スコープで試験してから採用可否を判断
```

---

## 5. 出力例（簡略版）

DCoS最終化後にユーザーが「Yomogiに反映したい」と言ったときの一括出力イメージ。

```markdown
方向性が確定したので、Yomogi本体への書き戻し提案を出します。
ファイルは直接書き換えず、差分提案として出します。採用可否はご確認ください。

## Brand Diff Proposal
（上記 §2 のフォーマットに従って記述）

## Token Diff Proposal
（上記 §3 のフォーマットに従って記述。変更不要な領域は「変更なし」と明記）

## 適用手順
（上記 §4 のフォーマットに従って記述）
```

---

## 6. 注意

- **JSONを直接書き換えない**: AI は提案までを担当し、実ファイル変更はユーザー判断のもとで行う。
- **新規プリミティブ追加は要注意**: 既存の `gray / blue / red / green / yellow / orange` 等に該当しない色を追加する場合、9段階のステップを設計する必要がある。アクセシビリティ（コントラスト）も併せて確認する。
- **セマンティック層の差し替えで十分なケースが多い**: プリミティブを増やすより、既存プリミティブのどのステップをセマンティックに割り当てるかの差し替えで対応できることが多い。
- **`build-all` を忘れない**: JSON 変更後は必ず `npm run build-all`。生成物（`build/css/tokens.css`、`pages/_assets/bundle.css`）を更新しないと、コンポーネントに反映されない。
- **影響範囲を確認**: トークン変更はシステム全体に波及する。Storybook で必ずライト/ダーク両方を目視。
