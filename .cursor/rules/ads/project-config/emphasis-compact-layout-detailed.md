# コンパクトレイアウトシステム詳細ルール

## 🎯 システム概要

コンパクトレイアウトシステムは、無駄なスペースを削減しつつ、メリハリと発見可能性を維持する体系的アプローチです。単純な縮小ではなく、情報の再構成とインタラクティブ要素の活用により、効率的な画面利用を実現します。

## 📐 基本原則

### 1. メリハリ維持の法則
```
コンパクト化 ≠ 一律縮小
コンパクト化 = 重要度に応じた最適配置
```

#### 重要度による処理方針
- **最重要**: サイズ維持、位置最適化
- **重要**: 適度な縮小、グループ化
- **補助**: 大幅縮小、オンデマンド表示
- **詳細**: インタラクティブ化、隠蔽

### 2. 情報密度の最適化
```
情報密度 = 表示情報価値 ÷ 占有面積

目標値:
- 高密度画面（ダッシュボード）: 0.7-0.9
- 中密度画面（一般UI）: 0.5-0.7
- 低密度画面（ランディング）: 0.3-0.5
```

### 3. 認知負荷の制御
```
認知負荷 = スキャン時間 + 理解時間 + 操作時間

制御手法:
├─ グループ化: 関連要素の視覚的結合
├─ 階層化: 重要度による表現差
├─ 予測可能性: 一貫したパターン使用
└─ 段階的開示: 必要な時のみ詳細表示
```

## 🔧 コンパクト化手法分類

### A. 配置変更系（Structure Optimization）

#### A-1. 縦→横変換
```css
/* Pattern: インライン統計 */

/* Before: 縦並び（96px占有） */
.stat-vertical {
  text-align: center;
  padding: var(--spacing-padding-32);
  min-height: 96px;
}
.label { 
  display: block; 
  margin-bottom: var(--spacing-padding-8);
  font-size: var(--font-size-14);
}
.value { 
  display: block; 
  font-size: var(--font-size-32);
}

/* After: 横並び（48px占有） */
.stat-inline {
  display: flex;
  align-items: baseline;
  padding: var(--spacing-padding-12) var(--spacing-padding-16);
  gap: var(--spacing-padding-8);
  min-height: 48px;
}
.icon { 
  width: var(--spacing-padding-16); 
  opacity: var(--opacity-65);
}
.label { 
  font-size: var(--font-size-14); 
  opacity: var(--opacity-80);
}
.value { 
  font-weight: var(--font-weight-600);
  font-size: var(--font-size-20);
}

/* 効果: 50%の領域削減、スキャン性向上 */
```

#### 適用条件
```javascript
const shouldApplyHorizontal = (elements) => {
  return (
    elements.length <= 3 &&                    // 要素数制限
    getTotalTextLength(elements) < 50 &&       // テキスト長制限  
    areSemanticallySimilar(elements) &&        // 意味的関連性
    !isMobileViewport() &&                     // モバイル除外
    getImportanceLevel(elements) === 'equal'   // 同等重要度
  );
};
```

#### A-2. ネスト構造化
```css
/* Pattern: 階層グループ化 */

/* Before: フラット配置（200px占有） */
.info-list {
  display: block;
}
.info-item {
  padding: var(--spacing-padding-16);
  border-bottom: var(--border-width-thin-light) solid var(--color-semantic-divider-extra-high-light);
}

/* After: 親子構造（120px占有） */
.info-group {
  border-radius: var(--radius-md);
  overflow: hidden;
}
.info-parent {
  padding: var(--spacing-padding-12) var(--spacing-padding-16);
  background: var(--color-semantic-neutral-50-light);
  font-weight: var(--font-weight-500);
}
.info-children {
  padding: var(--spacing-padding-8) var(--spacing-padding-24);
  font-size: var(--font-size-14);
  line-height: var(--font-line-height-20);
}

/* 効果: 40%の領域削減、階層明確化 */
```

### B. 表現変更系（Representation Optimization）

#### B-1. アイコン置換
```css
/* Pattern: ラベル→アイコン変換 */

/* Before: テキストラベル */
.status-verbose {
  display: flex;
  align-items: center;
  gap: var(--spacing-padding-12);
}
.status-label {
  font-size: var(--font-size-14);
  min-width: 80px; /* 「検索中:」等のラベル幅 */
}

/* After: アイコン表現 */
.status-compact {
  display: flex;
  align-items: center;
  gap: var(--spacing-padding-8);
}
.status-icon {
  width: var(--spacing-padding-16);
  height: var(--spacing-padding-16);
  color: var(--color-semantic-primary-600-light);
}

/* 効果: 70%の水平スペース削減、国際化対応 */
```

#### アイコン選択基準
```
検索 → 🔍 (search icon)
時間 → 🕐 (clock icon)  
完了 → ✅ (check icon)
エラー → ❌ (x icon)
警告 → ⚠️ (warning icon)
情報 → ℹ️ (info icon)
ユーザー → 👤 (user icon)
設定 → ⚙️ (gear icon)
```

#### B-2. 情報集約
```css
/* Pattern: 複数状態の統合バッジ */

/* Before: 個別表示（180px占有） */
.status-separate .item {
  display: inline-block;
  padding: var(--spacing-padding-4) var(--spacing-padding-8);
  margin-right: var(--spacing-padding-8);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-12);
}

/* After: 統合表示（60px占有） */
.status-unified {
  display: flex;
  gap: var(--spacing-padding-4);
}
.status-dot {
  width: var(--spacing-padding-8);
  height: var(--spacing-padding-8);
  border-radius: 50%;
  position: relative;
}
.status-dot[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  /* ツールチップスタイル */
}

/* 効果: 67%の領域削減、概要把握向上 */
```

### C. インタラクティブ系（Interactive Optimization）

#### C-1. トリガー表示
```css
/* Pattern: オンデマンド詳細表示 */

.detail-trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-padding-4);
  cursor: help;
  border-bottom: 1px dotted var(--color-semantic-text-middle-light);
}

.detail-icon {
  width: var(--spacing-padding-12);
  height: var(--spacing-padding-12);
  opacity: var(--opacity-65);
}

.detail-tooltip {
  position: absolute;
  z-index: 1000;
  background: var(--color-semantic-neutral-800-light);
  color: var(--color-semantic-neutral-50-light);
  padding: var(--spacing-padding-8) var(--spacing-padding-12);
  border-radius: var(--radius-md);
  font-size: var(--font-size-12);
  max-width: 200px;
  white-space: nowrap;
}
```

#### トリガー表示の適用判定
```javascript
const shouldUseTooltip = (content) => {
  return (
    content.type === 'supplementary' &&        // 補助情報
    content.length > 20 &&                     // 一定の長さ
    content.frequency === 'occasional' &&      // 時々参照
    !content.isActionRequired                  // アクション不要
  );
};

const shouldUseModal = (content) => {
  return (
    content.length > 200 ||                    // 長文
    content.hasInteractiveElements ||          // インタラクティブ要素含む
    content.isStandalone                       // 独立した情報
  );
};

const shouldUseAccordion = (content) => {
  return (
    content.isHierarchical &&                 // 階層的
    content.hasMultipleSections &&            // 複数セクション
    content.frequency === 'moderate'          // 適度な参照頻度
  );
};
```

#### C-2. アコーディオン
```css
/* Pattern: 展開可能セクション */

.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-padding-12) var(--spacing-padding-16);
  background: var(--color-semantic-neutral-50-light);
  border: 1px solid var(--color-semantic-neutral-200-light);
  border-radius: var(--radius-md);
  cursor: pointer;
  user-select: none;
}

.accordion-icon {
  width: var(--spacing-padding-16);
  height: var(--spacing-padding-16);
  transform: rotate(0deg);
  transition: transform 0.15s ease;
}

.accordion-header[aria-expanded="true"] .accordion-icon {
  transform: rotate(180deg);
}

.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.accordion-content[aria-hidden="false"] {
  max-height: 500px; /* 適切な最大高さ */
  padding: var(--spacing-padding-16);
  border: 1px solid var(--color-semantic-neutral-200-light);
  border-top: none;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
}
```

## 🎛️ 適用判定システム

### 判定フローチャート
```
Step1: コンテンツ分析
├─ 情報量（文字数）
├─ 重要度レベル
├─ アクセス頻度  
├─ 意味的関連性
└─ インタラクティブ要素の有無

Step2: コンテキスト評価
├─ 画面タイプ（ダッシュボード/一般/ランディング）
├─ ユーザー行動パターン
├─ デバイス制約
└─ アクセシビリティ要件

Step3: 手法選択
├─ 配置変更系: 関連性高 + 同等重要度
├─ 表現変更系: 補助情報 + アクセス頻度低
├─ インタラクティブ系: 詳細情報 + 時々参照
└─ 組み合わせ: 複合条件

Step4: 品質チェック
├─ 認知負荷テスト
├─ アクセシビリティ確認
├─ レスポンシブ対応
└─ パフォーマンス影響
```

### 制約ルール

#### 横並び制限
```javascript
// 横並び適用の制約条件
const horizontalConstraints = {
  maxElements: 3,              // 最大3要素まで
  maxTextLength: 50,           // 合計文字数50文字まで
  minElementWidth: 60,         // 要素最小幅60px
  maxLineHeight: 2,            // 最大2行まで
  semanticSimilarity: 0.8,     // 意味的類似度80%以上
  excludedTypes: [             // 除外タイプ
    'longText',                // 長文
    'errorMessage',            // エラーメッセージ  
    'instructions',            // 手順説明
    'legalText'               // 法的文言
  ]
};

// モバイル端末での制限
const mobileConstraints = {
  maxElements: 2,              // モバイルは2要素まで
  maxTextLength: 30,           // 文字数さらに制限
  forceVertical: [             // 強制縦並び
    'formFields',              // フォーム項目
    'navigationItems'          // ナビゲーション
  ]
};
```

#### アクセシビリティ制約
```css
/* 最小タップエリア確保 */
.interactive-element {
  min-width: 44px;
  min-height: 44px;
}

/* コントラスト比維持 */
.compact-text {
  color: var(--color-semantic-text-high-light); /* 4.5:1以上 */
}

/* フォーカス可視化 */
.compact-interactive:focus {
  outline: 2px solid var(--color-semantic-primary-600-light);
  outline-offset: 2px;
}
```

## 📊 効果測定システム

### KPI定義
```javascript
const compactLayoutKPIs = {
  // 領域効率
  areaReduction: (beforeArea, afterArea) => {
    return ((beforeArea - afterArea) / beforeArea) * 100;
  },

  // 情報密度  
  informationDensity: (infoValue, occupiedArea) => {
    return infoValue / occupiedArea;
  },

  // スキャン効率
  scanEfficiency: (elementsCount, scanTime) => {
    return elementsCount / scanTime;
  },

  // 操作効率
  taskEfficiency: (tasksCompleted, totalTime) => {
    return tasksCompleted / totalTime;
  }
};
```

### 品質閾値
```
領域削減率:
├─ 優秀: 40%以上
├─ 良好: 25-40%
├─ 標準: 15-25%
└─ 要改善: 15%未満

情報密度向上:
├─ 優秀: 50%以上向上
├─ 良好: 30-50%向上
├─ 標準: 15-30%向上
└─ 要改善: 15%未満向上

認知負荷:
├─ 許容: スキャン時間20%以内の増加
├─ 注意: 20-40%の増加
└─ 危険: 40%以上の増加
```

## 🚨 回避すべきパターン

### よくある失敗例

#### ❌ 過度な横並び
```html
<!-- BAD: 読みにくい横並び -->
<div class="overcompact">
  重要なお知らせ: システムメンテナンス | 2024/01/15 | 詳細はこちら | 影響範囲: 全サービス
</div>

<!-- GOOD: 適切なグループ化 -->
<div class="well-grouped">
  <h3>重要なお知らせ: システムメンテナンス</h3>
  <div class="meta">
    <span class="date">2024/01/15</span>
    <span class="scope">影響: 全サービス</span>
  </div>
  <a href="#" class="details-link">詳細を見る</a>
</div>
```

#### ❌ 情報の過度な隠蔽
```html
<!-- BAD: 重要情報が見えない -->
<div class="over-hidden">
  エラー <span class="tooltip-trigger" title="データベース接続エラーが発生しました。管理者に連絡してください。">?</span>
</div>

<!-- GOOD: 適切な情報露出 -->
<div class="appropriate-exposure">
  <span class="error-type">データベースエラー</span>
  <details class="error-details">
    <summary>詳細</summary>
    <p>接続エラーが発生しました。管理者に連絡してください。</p>
  </details>
</div>
```

#### ❌ 一貫性のない省略
```html
<!-- BAD: 不統一な省略 -->
<div class="inconsistent">
  <div>ユーザー数: 1,234</div>
  <div>👥 5,678</div>
  <div>アクティブ: 890人</div>
</div>

<!-- GOOD: 統一されたパターン -->
<div class="consistent">
  <div>👤 1,234</div>
  <div>👥 5,678</div>
  <div>⚡ 890</div>
</div>
```

## 🔄 実装ワークフロー

### 段階的適用プロセス

#### 1. 分析
```
1. 現状調査
   ├─ 画面要素の洗い出し
   ├─ 重要度の評価
   ├─ ユーザー行動の観察
   └─ 領域使用率の測定

2. 改善余地の特定
   ├─ 無駄スペースの特定
   ├─ 冗長な表現の発見
   ├─ 階層の不明確さの確認
   └─ インタラクション阻害要因の調査
```

#### 2. 設計
```
3. コンパクト化計画
   ├─ 適用手法の選択
   ├─ 優先順位の決定
   ├─ 制約条件の確認
   └─ 成功指標の設定

4. プロトタイプ作成
   ├─ 主要パターンの実装
   ├─ A/Bテスト用バリエーション
   └─ アクセシビリティチェック
```

#### 3. 実装・検証
```
5. 段階的ロールアウト
   ├─ 非重要画面から適用開始
   ├─ ユーザーフィードバック収集
   ├─ データに基づく調整
   └─ 段階的拡大適用

6. 継続改善
   ├─ 定期的な効果測定
   ├─ 新しいパターンの発見
   ├─ システムの継続更新
   └─ チーム知識の蓄積
```

## 🎯 実装時チェックリスト

### 適用前チェック
- [ ] コンテンツの重要度評価は完了しているか？
- [ ] ユーザーのアクセスパターンは調査済みか？
- [ ] 制約条件（モバイル、アクセシビリティ）は確認済みか？
- [ ] 代替表示方法（ツールチップ等）は準備されているか？

### 実装中チェック
- [ ] 適用判定条件に合致しているか？
- [ ] デザインシステムのトークンを使用しているか？
- [ ] レスポンシブ対応は適切か？
- [ ] アニメーション/トランジションは滑らかか？

### 完了後チェック
- [ ] 領域削減効果は測定されているか？
- [ ] ユーザビリティテストは実施済みか？
- [ ] アクセシビリティ基準は満たしているか？
- [ ] 他の画面への影響は確認済みか？

---

> **重要**: このシステムは強調システム（ID×CX×AE×DP）と連携し、コンパクト化によって情報の発見可能性や美的品質が低下しないよう設計されています。適用時は必ず総合評価も併せて実施してください。
