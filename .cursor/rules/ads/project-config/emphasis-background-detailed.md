# 背景・ハイライト強調システム詳細ルール

## 🎨 背景・ハイライト強調ルール

### 基本コンセプト
背景・ハイライトは**情報の階層化**、**エリアの区分**、そして**要素間の区切り**を明確にする重要な強調手段。単なる装飾ではなく、ユーザーの視覚的認知を支援し、情報の構造化を実現する戦略的な手法である。

### 4つの用途分類

#### A. 情報階層用背景
```
目的：情報の重要度・種類を視覚的に表現

Level 0: 通常情報（背景なし）
├─ 使用場面：一般的なテキスト、説明文
├─ 実装：background: transparent
└─ AP（Area Point）：1.0

Level 1: 軽微強調（subtle背景）  
├─ 使用場面：補助情報、ヒント、引用文
├─ 実装：var(--color-semantic-neutral-50-light)
├─ AP：1.4（軽微な区別）
└─ 例：会話エリアの背景、補足説明ボックス

Level 2: 中程度強調（filled背景）
├─ 使用場面：重要情報、メッセージ内容、注目すべきデータ
├─ 実装：var(--color-semantic-neutral-100-light) ～ neutral-200
├─ AP：1.8（明確な区別）
└─ 例：AIメッセージ背景、重要な告知

Level 3: 高強調（semantic背景）
├─ 使用場面：状態通知、Alert、緊急情報
├─ 実装：semantic色系（success, warning, negative等）
├─ AP：2.5-3.0（状態に応じた強調）
└─ 例：エラーメッセージ、成功通知
```

#### B. エリア区分用背景
```
目的：機能的エリアの分離・グルーピング

独立エリア型：
├─ 使用場面：サイドバー、ヘッダー、ナビゲーション
├─ 実装：var(--color-semantic-neutral-50-light)
├─ 特徴：メインコンテンツから明確に分離
└─ 例：チャットUIのサイドバー（白背景）

メインエリア型：
├─ 使用場面：主要コンテンツ領域、作業エリア
├─ 実装：var(--color-semantic-neutral-100-light) ～ neutral-50
├─ 特徴：適度な背景で長時間の閲覧に適する
└─ 例：チャットの会話エリア、ダッシュボードメイン

統一エリア型：
├─ 使用場面：機能的に関連する複数要素
├─ 実装：親要素と同じ背景色
├─ 特徴：視覚的な一体感を演出
└─ 例：入力エリアと会話エリアの背景統一
```

#### C. 要素区切り用背景
```
目的：情報ブロック・セクション間の視覚的分離

Level 1: 最軽量区切り（余白ベース）
├─ 使用場面：関連性の高い情報間、軽い分離
├─ 実装：background: transparent + margin調整
├─ AP：1.0（区切り効果なし、余白のみ）
└─ 例：段落間、リスト項目間

Level 2: 軽微区切り（線ベース）
├─ 使用場面：明確だが控えめな分離が必要
├─ 実装：1px border + var(--color-semantic-neutral-200-light)
├─ AP：1.2（線による軽微な区切り効果）
└─ 例：テーブル行間、フォームセクション間

Level 3: 中程度区切り（面ベース）
├─ 使用場面：異なる情報グループの明確な分離
├─ 実装：背景色差 + var(--color-semantic-neutral-50-light) vs neutral-100
├─ AP：1.6（背景色による区切り効果）
└─ 例：カードリスト背景、ダッシュボードセクション

Level 4: 強区切り（線+面+影ベース）
├─ 使用場面：独立性の高いコンテンツブロック
├─ 実装：背景色 + border + box-shadow
├─ AP：2.4（複合的な区切り効果）
└─ 例：モーダル、ドロワー、カード

Level 5: トレンド区切り（特殊効果）
├─ 使用場面：印象的・先進的な区切り表現
├─ 実装：ユーザー希望時に検討する特殊効果
├─ AP：2.0-3.2（効果により変動）
├─ 例：プレゼン用UI、ランディングページ
├─ **注**: 新規デザイン時で、ユーザーが希望する場合に最新トレンドを調査
└─ 以下の実装例は参考パターン（固定推奨ではない）
```

#### D. インタラクション状態用背景
```
目的：操作可能性・現在の状態を視覚的に表現

クリック可能提示（outline型）：
├─ 使用場面：選択候補、Suggestion、クリック可能要素
├─ 実装：border + transparent background
├─ 特徴：「選択可能」を直感的に表現
└─ 例：チャットのSuggestion Tag（outline variant）

選択・アクティブ状態（filled型）：
├─ 使用場面：選択中の項目、アクティブなタブ
├─ 実装：primary色背景 または neutral-100
├─ AP：2.0-2.2（明確な状態表示）
└─ 例：選択中のエージェント、アクティブなメニュー項目

ホバー状態（subtle変化）：
├─ 使用場面：マウスオーバー時のフィードバック
├─ 実装：opacity: 0.8-0.9 または box-shadow追加
├─ 特徴：軽微な変化で操作反応を示す
└─ 例：ボタンホバー、カードホバー
```

### トレンド区切り手法詳細（Level 5）

#### A. グラスモーフィズム区切り
```css
/* 半透明 + ぼかし効果による未来感区切り */
.separator-glass {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

/* 適用場面：プレゼン、ランディングページ、先進的ブランド */
/* AP値：2.8（視覚的インパクト大、透明感による軽やかさ） */
```

#### B. グラデーション境界線区切り
```css
/* 動的感のあるグラデーション境界 */
.separator-gradient-border {
  background: var(--color-semantic-neutral-50-light);
  border: 2px solid transparent;
  border-image: linear-gradient(90deg, 
    var(--color-semantic-primary-400-light), 
    var(--color-semantic-primary-600-light),
    var(--color-semantic-success-400-light)
  ) 1;
  border-radius: var(--radius-md);
}

/* 適用場面：ダッシュボード、データビジュアライゼーション */
/* AP値：2.4（カラフルだが上品、動的印象） */
```

#### C. ネオン風エフェクト区切り
```css
/* 先進性・テック感を表現する発光区切り */
.separator-neon {
  background: var(--color-semantic-neutral-900-light);
  border: 1px solid var(--color-semantic-primary-500-light);
  box-shadow: 
    0 0 5px var(--color-semantic-primary-300-light),
    inset 0 0 5px var(--color-semantic-primary-100-light);
  border-radius: var(--radius-md);
}

/* ダークモード専用バリエーション */
.separator-neon--dark {
  background: rgba(0, 0, 0, 0.8);
  border-color: var(--color-semantic-info-400-light);
  box-shadow: 
    0 0 10px var(--color-semantic-info-300-light),
    inset 0 0 10px var(--color-semantic-info-100-light);
}

/* 適用場面：ゲーミングUI、テック系プロダクト、イベント告知 */
/* AP値：3.2（高い注意喚起効果、強いブランド印象） */
```

#### D. 立体影区切り（ニューモーフィズム）
```css
/* ソフトな立体感による上品な区切り */
.separator-neumorphism {
  background: var(--color-semantic-neutral-100-light);
  border-radius: var(--radius-xl);
  box-shadow: 
    20px 20px 60px var(--color-semantic-neutral-300-light),
    -20px -20px 60px var(--color-semantic-neutral-50-light);
}

/* 内側凹み効果バリエーション */
.separator-neumorphism--inset {
  box-shadow: 
    inset 20px 20px 60px var(--color-semantic-neutral-300-light),
    inset -20px -20px 60px var(--color-semantic-neutral-50-light);
}

/* 適用場面：高級感重視、ミニマルデザイン、プレミアム製品 */
/* AP値：2.6（上品な立体感、高級感） */
```

### トレンド手法の適用ガイドライン

#### プロジェクト特性による選択
```
短期・実験的プロジェクト:
├─ 全トレンド手法適用OK
├─ ユーザーインパクト最優先
└─ ブランド実験としての価値

長期・安定運用プロジェクト:
├─ 控えめなトレンド適用（グラデーション境界等）
├─ 基本手法との組み合わせ推奨
└─ 将来的な見直し前提
```

#### AIによるトレンド適用判定
```javascript
const shouldSuggestTrendSeparation = (context) => {
  const trendTriggers = [
    "トレンド", "印象的", "先進的", "モダン", 
    "未来的", "斬新", "最新", "インパクト"
  ];
  
  const isProjectShortTerm = context.duration < 12; // 月
  const hasExplicitRequest = trendTriggers.some(keyword => 
    context.userInput.includes(keyword)
  );
  
  if (hasExplicitRequest || isProjectShortTerm) {
    return {
      glassmorphism: "未来感・透明感重視",
      gradientBorder: "動的・カラフル表現", 
      neon: "テック感・ゲーミング要素",
      neumorphism: "高級感・上品な立体感"
    };
  }
  
  return null; // 普遍的手法のみ提案
};
```

### 具体的実装例（ハイブリッド型）

#### Chat UI実装例
```css
/* 情報階層：AIメッセージを中程度強調 */
.chat-message--ai {
  background: var(--color-semantic-neutral-200-light); /* Level 2 */
  padding: var(--spacing-padding-16);
  border-radius: var(--radius-md);
}

/* エリア区分：サイドバーを独立エリアとして表現 */
.chat-sidebar {
  background: white; /* 独立エリア型 */
  border-right: 1px solid var(--color-semantic-neutral-100-light);
}

/* インタラクション：Suggestionを選択可能として表現 */
.chat-suggestion {
  /* outline型で「クリック可能」を表現 */
  background: transparent;
  border: 1px solid var(--color-semantic-neutral-300-light);
}
```

#### ECサイト実装例
```css
/* 情報階層：セール商品を軽微強調 */
.product-card--sale {
  background: var(--color-semantic-neutral-50-light); /* Level 1 */
  position: relative;
}

/* エリア区分：フィルターサイドバー */
.filter-sidebar {
  background: white; /* 独立エリア型 */
  padding: var(--spacing-padding-24);
}

/* インタラクション：商品カードホバー */
.product-card:hover {
  box-shadow: var(--shadow-box-shadow-md-light); /* subtle変化 */
  transform: translateY(-2px);
}
```

#### 管理画面実装例
```css
/* 情報階層：警告行を高強調 */
.table-row--warning {
  background: var(--color-semantic-warning-50-light); /* Level 3 */
}

/* エリア区分：ダッシュボードカード */
.dashboard-card {
  background: white; /* カード型区分 */
  border: 1px solid var(--color-semantic-neutral-100-light);
}

/* インタラクション：編集可能行 */
.table-row--editable {
  cursor: pointer;
  border: 1px solid transparent;
}
.table-row--editable:hover {
  border-color: var(--color-semantic-primary-300-light);
}
```

#### フォーム実装例
```css
/* 情報階層：エラーフィールドを高強調 */
.form-field--error {
  background: var(--color-semantic-negative-50-light); /* Level 3 */
  border-color: var(--color-semantic-negative-400-light);
}

/* エリア区分：フォームセクション */
.form-section {
  background: var(--color-semantic-neutral-100-light); /* メインエリア型 */
  padding: var(--spacing-padding-32);
  margin-bottom: var(--spacing-padding-24);
}

/* インタラクション：フォーカス状態 */
.form-input:focus {
  background: white;
  border-color: var(--color-semantic-primary-400-light);
  box-shadow: 0 0 0 3px var(--color-semantic-primary-100-light);
}
```

### NGパターン集（誤解防止）

#### ❌ 避けるべきパターン
```
1. 隣接要素での同レベル背景：
├─ 問題：視覚的な区別がつかない
├─ 例：AIメッセージとユーザーメッセージが同じ背景色
└─ 解決：異なるレベルの背景を使用

2. 背景の過剰使用（塗りつぶし状態）：
├─ 問題：どこが重要か分からない
├─ 例：すべてのセクションに背景色
└─ 解決：重要度に応じて選択的に使用

3. 誤解を招く背景使用：
├─ 問題：クリック不可なのにボタンに見える
├─ 例：情報表示にprimary色の塗り背景
└─ 解決：インタラクティブ要素のみに使用

4. 不適切な階層表現：
├─ 問題：補助情報が主要情報より目立つ
├─ 例：ヒントテキストがLevel 2、本文がLevel 0
└─ 解決：情報の重要度に応じた階層設定

5. 色の競合：
├─ 問題：背景色と文字色のコントラスト不足
├─ 例：薄い背景に薄い文字
└─ 解決：WCAG基準（4.5:1以上）の確保
```

### 強調度ポイント（AP：Area Point）詳細

#### 計算への組み込み
```
総強調度 = CP × SP × MP × AP × KP × FWP

APの詳細値：
├─ 1.0：背景なし（基準）
├─ 1.4：subtle背景（Level 1）
├─ 1.8：filled背景（Level 2）
├─ 2.2：outline + 背景
├─ 2.5-3.0：semantic背景（Level 3）
├─ 2.8：shadow追加
├─ 3.5：高コントラスト背景
└─ 4.0：inverse（反転色）

組み合わせ例：
├─ subtle背景 + shadow：1.4 × 1.5 = 2.1
├─ filled背景 + border：1.8 × 1.2 = 2.16
└─ semantic背景 + shadow：2.5 × 1.5 = 3.75
```

### AIの判定フロー

#### 背景強調の提案プロセス
```
Step 1: 用途の特定
├─ 情報階層の強調か？
├─ エリア区分か？
└─ インタラクション状態か？

Step 2: 周辺要素の確認
├─ 隣接要素の背景レベル確認
├─ 全体の背景使用密度確認
└─ 競合する要素の有無確認

Step 3: 適切なレベル選択
├─ Level 0-3から選択
├─ 用途に応じた実装方法決定
└─ 代替手段の検討

Step 4: 実装提案
├─ 具体的なCSS提示
├─ NGパターンの回避確認
└─ アクセシビリティチェック
```

#### AI提案例
```
ユーザー：「この価格情報を目立たせたい」

AI判定：
1. 用途特定 → 情報階層の強調
2. 周辺確認 → 商品説明がLevel 0、カードがLevel 1
3. レベル選択 → Level 2は重すぎる
4. 提案：「Level 1のsubtle背景 + 文字色強調を推奨します。
         周辺要素との差別化を保ちつつ、過度な強調を避けられます」

実装コード：
.price-highlight {
  background: var(--color-semantic-neutral-50-light);
  color: var(--color-semantic-primary-600-light);
  padding: var(--spacing-padding-8) var(--spacing-padding-12);
  border-radius: var(--radius-sm);
}
```

### 実装時のチェックリスト

#### 背景使用前の確認事項
- [ ] 本当に背景が必要か？（他の手段で十分では？）
- [ ] 周辺要素との競合はないか？
- [ ] 用途（情報階層/エリア区分/状態）は明確か？
- [ ] 適切なレベル（0-3）を選択したか？
- [ ] コントラスト比は十分か？（WCAG 4.5:1以上）
- [ ] NGパターンに該当していないか？
- [ ] レスポンシブでの表示は問題ないか？
