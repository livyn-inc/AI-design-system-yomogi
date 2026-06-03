# 強調評価システム詳細ルール

## 評価の扱い

Yomogiでは、評価項目を以下の3層に分けて扱います。

1. **測定可能な項目**
   - トークン使用有無、コンポーネント利用状況、強調度（CP × SP × MP × AP × KP × FWP）、ページ生成場所、アクセシビリティ属性など
2. **AIのレビュー観点**
   - 美的表現、文脈適合、情報密度、発見可能性、色彩調和など
3. **設計思想**
   - 引き算のデザイン、原則を壊さない再解釈、AIと人の協働

数値スコアは、測定根拠がある場合だけ判断材料として使用します。測定根拠が曖昧な場合は、断定的な点数ではなくレビュー観点として説明します。以下の詳細式や疑似コードは、元ADS由来の考え方を残すための概念ガイドであり、Yomogiが全項目を完全自動採点するという意味ではありません。

## 🎨 色情報競合チェック（前処理）

### 基本コンセプト
強調計算の前に、色による情報伝達の競合を検出し、必要に応じて自動解決または解決案を提示するシステムです。

### 検出ロジック

#### 1. 色体系の検出
```javascript
const detectColorSystems = (page) => {
  const systems = [];
  
  // カード背景色による分類システム
  if (hasCardColorVariations(page)) {
    systems.push({
      type: 'card-background',
      colors: extractCardColors(page),
      meaning: 'カテゴリ・状態分類',
      importance: 'medium'
    });
  }
  
  // タグ色による分類システム
  if (hasTagColorVariations(page)) {
    systems.push({
      type: 'tag-color',
      colors: extractTagColors(page),
      meaning: '重要度・ステータス',
      importance: 'high'
    });
  }
  
  // ボタン色による分類システム
  if (hasButtonColorVariations(page)) {
    systems.push({
      type: 'button-color',
      colors: extractButtonColors(page),
      meaning: 'アクション種別',
      importance: 'high'
    });
  }
  
  return systems;
};
```

#### 2. 同色重複の検出
```javascript
const detectSemanticConflicts = (colorSystems) => {
  const colorUsageMap = new Map();
  const conflicts = [];
  
  // 各色の使用目的をマッピング
  colorSystems.forEach(system => {
    system.colors.forEach(color => {
      if (!colorUsageMap.has(color)) colorUsageMap.set(color, []);
      colorUsageMap.get(color).push({
        system: system.type,
        meaning: system.meaning,
        importance: system.importance
      });
    });
  });
  
  // 重複検出
  colorUsageMap.forEach((usages, color) => {
    if (usages.length > 1) {
      const uniqueMeanings = [...new Set(usages.map(u => u.meaning))];
      if (uniqueMeanings.length > 1) {
        conflicts.push({
          color,
          conflictingMeanings: uniqueMeanings,
          usages,
          severity: calculateConflictSeverity(usages)
        });
      }
    }
  });
  
  return conflicts;
};
```

#### 3. 競合評価
```javascript
const evaluateColorConflicts = (systems, conflicts) => {
  let severity = 'none';
  
  // 色体系過多チェック
  if (systems.length >= 3) {
    severity = 'high';
  } else if (systems.length === 2 && conflicts.length > 0) {
    severity = 'high';
  } else if (systems.length === 2) {
    severity = 'medium';
  } else if (conflicts.length > 0) {
    severity = 'medium';
  }
  
  return {
    hasConflict: severity !== 'none',
    severity,
    systems,
    conflicts,
    needsResolution: severity === 'high'
  };
};
```

### 解決システム

#### 新規作成時：自動解決
```javascript
const autoResolveColorConflicts = (conflictResult) => {
  if (!conflictResult.needsResolution) return null;
  
  // 重要度に基づく自動判断
  const systemPriority = {
    'button-color': 3,    // 最重要（アクション）
    'tag-color': 2,       // 重要（状態・分類）
    'card-background': 1  // 補助（視覚的分類）
  };
  
  // 最も重要度の低いシステムを無効化
  const systemsToDisable = conflictResult.systems
    .sort((a, b) => systemPriority[a.type] - systemPriority[b.type])
    .slice(0, conflictResult.systems.length - 1);
  
  return {
    action: 'disable-lower-priority-systems',
    disabledSystems: systemsToDisable,
    preservedSystem: conflictResult.systems[conflictResult.systems.length - 1],
    changes: generateAutoResolutionChanges(systemsToDisable)
  };
};
```

#### 既存調整時：3案提示
```javascript
const proposeColorConflictSolutions = (conflictResult, userRequest) => {
  const systems = conflictResult.systems;
  
  return [
    // 案A: 第1システムを主役に
    {
      approach: 'preserve-system-1',
      changes: disableColorSystem(systems[1]),
      impact: 'low',
      description: `${systems[0].meaning}を主役に、${systems[1].meaning}を無色化`
    },
    
    // 案B: 第2システムを主役に
    {
      approach: 'preserve-system-2', 
      changes: disableColorSystem(systems[0]),
      impact: 'low',
      description: `${systems[1].meaning}を主役に、${systems[0].meaning}を無色化`
    },
    
    // 案C: 役割分離
    {
      approach: 'role-separation',
      changes: separateColorRoles(systems),
      impact: 'medium',
      description: '色の役割を分離（位置・形状・アイコン活用）'
    }
  ];
};
```

### notesページ実装例

#### 検出フェーズ
```javascript
// ユーザー要求：「メモをカテゴリ別と重要度で色分けしたい」

colorSystems: [
  { 
    type: 'card-background', 
    meaning: 'カテゴリ分類', 
    colors: ['primary','success','warning'],
    importance: 1
  },
  { 
    type: 'tag-color', 
    meaning: '重要度分類', 
    colors: ['warning','primary','neutral'],
    importance: 2
  }
]

conflicts: [
  {
    color: 'primary',
    conflictingMeanings: ['仕事カテゴリ', '普通重要度'],
    usages: [
      { system: 'card-background', meaning: 'カテゴリ分類' },
      { system: 'tag-color', meaning: '重要度分類' }
    ],
    severity: 'high'
  },
  {
    color: 'warning',
    conflictingMeanings: ['アイデアカテゴリ', '重要'],
    usages: [
      { system: 'card-background', meaning: 'カテゴリ分類' },
      { system: 'tag-color', meaning: '重要度分類' }
    ],
    severity: 'high'
  }
]

evaluation: {
  hasConflict: true,
  severity: 'high',
  needsResolution: true
}
```

#### 自動解決フェーズ（新規作成時）
```javascript
autoResolution: {
  action: 'disable-lower-priority-systems',
  disabledSystems: [{ type: 'card-background', meaning: 'カテゴリ分類' }],
  preservedSystem: { type: 'tag-color', meaning: '重要度分類' },
  changes: [
    'カード背景色をneutralに統一',
    'カテゴリ情報をアイコンで表現：仕事→briefcase、学習→book、アイデア→lightbulb'
  ]
}

結果: 色競合解決済みの高品質デザインを提示
```

#### 調整要求時（「カードも色分けしたい」）
```javascript
solutions: [
  {
    approach: 'preserve-card-colors',
    changes: ['タグ色を無効化', 'タグを形状・アイコンで差別化'],
    impact: 'low',
    description: 'カテゴリ分類を主役に、重要度をアイコン表現'
  },
  {
    approach: 'preserve-tag-colors',
    changes: ['カード色を無効化', 'カテゴリをアイコンで表現'],
    impact: 'low', 
    description: '重要度分類を主役に、カテゴリをアイコン表現'
  },
  {
    approach: 'role-separation',
    changes: ['カードを左端バー色分け', 'タグを背景色分け'],
    impact: 'medium',
    description: '位置と背景で役割分離（新デザインパターン）'
  }
]
```

## 🔥 強調エスカレーション戦略

### 基本階層（柔軟運用）

#### 1. コントラスト調整（第一選択）
**効果**: ★★★★★ | **実装**: ★★★★★ | **汎用性**: ★★★★★
- 背景とテキストのコントラスト比調整
- 濃淡差による視覚的強調
- 日本語フォントでも確実に効果発揮
- **推奨**: まず最初に検討すべき手段

#### 2A. フォントサイズ調整
**効果**: ★★★★☆ | **実装**: ★★★★★ | **汎用性**: ★★★★☆
- ジャンプ率による強調（プライシング価格例）
- 視覚的効果が高い（価格表示等）
- **注意**: 全体バランスへの影響大

#### 2B. 余白調整（粗密コントロール）
**効果**: ★★★☆☆ | **実装**: ★★★★★ | **汎用性**: ★★★★★
- 要素周辺の余白を広くして注目集める
- 密集した情報の中で「呼吸感」を作る
- **特徴**: 上品で洗練された強調方法

#### 3. 領域拡張（塗り面積）
**効果**: ★★★★☆ | **実装**: ★★★☆☆ | **汎用性**: ★★★☆☆
- 背景色の追加・拡張
- ボーダー・影による領域強調
- **注意**: デザイン品質への影響大

#### 4A. XYZ軸移動（浮き上がり）
**効果**: ★★★★☆ | **実装**: ★★★☆☆ | **汎用性**: ★★☆☆☆
- box-shadow、translateYによる浮き上がり
- ホバー効果での動的強調
- **実装例**: プライシングカードのホバー効果

#### 4B. 明滅・アニメーション
**効果**: ★★★★★ | **実装**: ★★☆☆☆ | **汎用性**: ★☆☆☆☆
- 注意喚起には最強の効果
- **注意**: UX的にはリスク高、慎重に使用

### 🔄 組み合わせパターン

#### よくある組み合わせ
1. **コントラスト + サイズ**: プライシング価格（濃い色 + 48px）
2. **コントラスト + 余白**: 重要な説明文（primary色 + 広い余白）
3. **サイズ + 余白**: 同時調整（大きなフォント + 適切な余白）
4. **領域 + 移動**: カードホバー（背景色変更 + 浮き上がり）

#### 避けるべき組み合わせ
- 明滅 + 他の手段 → 過度に注意を引きすぎる
- 複数要素での同時最大強調 → 全体破綻

## 📊 定量的強調度評価システム

### 基本コンセプト
各強調手段に「強調ポイント」を設定し、異なる手段の組み合わせでも同等の強調レベルを実現可能にする

### 強調ポイント計算式
**総強調度 = コントラストP × サイズP × 余白P × 領域P × 動きP × フォントウェイトP**

#### 各手段のポイント体系（基準値1.0）

##### 1. コントラストポイント (CP)
- **1.0**: デフォルト（--color-semantic-text-middle-light）
- **1.5**: やや強調（--color-semantic-text-high-light）
- **2.0**: 強調（--color-semantic-primary-middle-light）
- **2.5**: 高強調（--color-semantic-primary-600-light）
- **3.0**: 最大（白背景に黒、または逆）

##### 2. サイズポイント (SP)  
- **1.0**: 基準フォント（14px）
- **1.3**: やや大き目（16px）
- **1.7**: 大き目（20px）
- **2.4**: 大きい（24px）
- **3.4**: とても大きい（32px）
- **4.8**: 超大きい（48px）

##### 3. 余白ポイント (MP)
- **1.0**: 通常余白（12-16px）
- **1.5**: やや広め（20-24px）
- **2.0**: 広め（32-40px）
- **2.5**: とても広い（48-64px）
- **3.0**: 極端に広い（72px以上）

##### 4. 領域ポイント (AP)
- **1.0**: 領域なし（背景色なし）
- **1.4**: 薄い背景（subtle variant）
- **1.8**: 背景あり（filled variant）
- **2.2**: 境界線追加（outline + background）
- **2.8**: 影追加（box-shadow）

##### 5. 動きポイント (KP)
- **1.0**: 静的
- **1.6**: ホバー時軽微変化（色変更のみ）
- **2.2**: ホバー時浮き上がり（translateY + shadow）
- **3.0**: 常時アニメーション
- **4.0**: 明滅・パルス

##### 6. フォントウェイトポイント (FWP)
- **1.0**: font-weight: 400（基準）
- **1.05**: font-weight: 500（微小、Windows最適化目的）
- **1.5**: font-weight: 700（確実だが控えめ）

### 🧮 計算例

#### 例1: 薄い色 × 巨大サイズ
```
CP: 1.3（やや薄い色） × SP: 4.8（48px） × MP: 1.0 × AP: 1.0 × KP: 1.0 × FWP: 1.0
= 1.3 × 4.8 × 1.0 × 1.0 × 1.0 × 1.0 = 6.24ポイント
```

#### 例2: 通常色・サイズ × 極端余白
```
CP: 1.0 × SP: 1.0 × MP: 3.0（極端余白） × AP: 1.8（背景） × KP: 1.0 × FWP: 1.0
= 1.0 × 1.0 × 3.0 × 1.8 × 1.0 × 1.0 = 5.4ポイント
```

#### 例3: プライシング価格（実際の実装）
```
CP: 2.0（primary色） × SP: 4.8（48px） × MP: 1.5（適度余白） × AP: 1.0 × KP: 1.0 × FWP: 1.0
= 2.0 × 4.8 × 1.5 × 1.0 × 1.0 × 1.0 = 14.4ポイント
```

### 📏 強調度レベル定義

#### レベル1: 軽微強調（1.0-2.5ポイント）
- 通常テキストからの軽微な差別化
- 例: 色をやや濃くする、わずかに大きくする

#### レベル2: 中度強調（2.6-5.0ポイント）
- 明確に認識される強調、但し控えめ
- 例: 色+サイズの組み合わせ、広い余白

#### レベル3: 高度強調（5.1-10.0ポイント）
- ページ内で目立つレベル
- 例: 上記例1・例2のような組み合わせ

#### レベル4: 最大強調（10.1ポイント以上）
- ページ内で最も目立つ要素（1つまで推奨）
- 例: プライシング価格のような戦略的強調

### 🎯 運用ガイドライン

#### 同一強調度の実現例
**目標: 6.0ポイント前後の中高度強調**

| パターン | CP | SP | MP | AP | KP | FWP | 計算 | ポイント |
|----------|----|----|----|----|----|----|------|----------|
| A: 色彩強調型 | 2.5 | 1.7 | 1.0 | 1.4 | 1.0 | 1.0 | 2.5×1.7×1.4 | 5.95 |
| B: サイズ強調型 | 1.5 | 3.4 | 1.0 | 1.0 | 1.2 | 1.0 | 1.5×3.4×1.2 | 6.12 |
| C: 空間強調型 | 1.0 | 1.0 | 2.5 | 2.2 | 1.1 | 1.0 | 2.5×2.2×1.1 | 6.05 |

#### AIによる自動提案例
```
要求: "価格を目立たせたい（目標8ポイント前後）"

AI提案:
1. コントラスト重視: CP2.0 × SP2.4 × MP1.5 = 7.2ポイント
2. サイズ重視: CP1.5 × SP4.8 × MP1.0 = 7.2ポイント  
3. バランス型: CP2.0 × SP1.7 × MP1.5 × AP1.4 = 7.14ポイント
```

### 運用原則（更新版）

#### エスカレーション順序
1. **2-3ポイント不足**: まずコントラスト調整
2. **4-6ポイント不足**: サイズまたは余白追加（同時可）
3. **7-10ポイント不足**: 領域拡張も検討
4. **10ポイント超**: 動きも含めた総合設計

#### 制約ルール
- **1画面1つの10ポイント超**: 階層破綻防止
- **段階的適用**: 2ポイント刻みでの段階調整推奨
- **全体調和**: ページ内強調度の分散バランス
- **目的との整合**: ビジネス価値との強調度一致

## 🔍 発見可能性評価システム（DP: Discoverability Point）

### 基本コンセプト
**領域節約 vs 発見可能性**のトレードオフを数値化し、適切なUI設計判断を支援する評価システム。

### 発見可能性の5段階評価

#### DP 1.0：常時表示（完全発見可能）
- **例**：メインナビゲーション、主要CTA
- **メリット**：100%発見される
- **デメリット**：画面占有、視覚的負荷

#### DP 0.8：視覚的ヒント付き隠れ要素
- **例**：「詳細フィルター▼」ボタン
- **メリット**：節約＋発見可能性両立
- **デメリット**：1クリック必要

#### DP 0.6：アイコンのみヒント
- **例**：「⋯」「⚙️」のみ表示
- **メリット**：最小限の占有
- **デメリット**：意味を推測が必要

#### DP 0.4：ホバー/コンテキスト表示
- **例**：マウスオーバーで出現
- **メリット**：完全隠蔽可能
- **デメリット**：モバイル非対応

#### DP 0.2：完全隠蔽（ショートカットのみ）
- **例**：キーボードショートカット
- **メリット**：画面占有ゼロ
- **デメリット**：上級者のみ発見

### DP評価マトリックス

#### 表示状態 × 重要度
```
           主要機能  中程度  補助機能
常時表示     1.0     0.95    0.9
ヒント付き   0.7     0.8     0.85
アイコンのみ 0.5     0.6     0.7
ホバー表示   0.3     0.4     0.6
完全隠蔽     0.1     0.2     0.4
```

#### ユーザー習熟度調整
```
初心者向け：基準スコア × 0.9
中級者向け：基準スコア × 1.0
上級者向け：基準スコア × 1.1
```

#### 使用頻度調整
```
高頻度：基準スコア × 0.8（隠すリスク大）
中頻度：基準スコア × 1.0
低頻度：基準スコア × 1.2（隠すメリット大）
```

### 隠し要素使用前の必須確認

#### 判定フロー
```
1. 隠す機能の重要度は？
   ├─ 主要機能 → 隠すべきでない（DP 1.0必須）
   ├─ 中程度 → 視覚的ヒント必須（DP 0.8+）
   └─ 補助機能 → 隠してもOK（DP 0.6+）

2. ターゲットユーザーの習熟度は？
   ├─ 初心者多い → 高いDP必要
   ├─ 中級者 → 中程度のDP
   └─ 上級者 → 低いDPでも許容

3. 代替手段はあるか？
   ├─ 他のルートで到達可能 → DP低下許容
   └─ 唯一のアクセス方法 → DP 0.8+必須

4. 使用頻度は？
   ├─ 高頻度 → 隠すべきでない
   ├─ 中頻度 → 工夫して隠す
   └─ 低頻度 → 積極的に隠してOK
```

## 📊 総合品質評価の概念ガイド

### 品質の見方
旧ADSでは **デザイン品質 = ID × CX × AE × DP** という式で説明していました。Yomogiではこの式を「何を確認するか」の概念ガイドとして残し、実運用では測定可能な項目とAIレビュー観点を分けて扱います。

#### ID（情報密度）：0-1.0
- 占有面積 ÷ 表示領域 × 100%
- 5段階レベル別アプローチ

#### CX（コンテキスト）：0-1.0
- 4層構造の評価（原則準拠度を統合）
  - プロダクトコンテキスト（0.8-1.0）
  - ページ用途コンテキスト（0.7-0.9）
  - 設計意図コンテキスト（0.7-0.9）
  - **原則準拠度（0.7-1.0）** ※新規追加

#### CX評価の統合アルゴリズム（原則準拠度統合版）
```javascript
const calculateContextualFit = (design, context, principleCompliance) => {
  // 従来の3層評価
  const productContext = evaluateProductContext(design, context.product);
  const pageContext = evaluatePageContext(design, context.page);
  const designContext = evaluateDesignIntent(design, context.intent);
  
  // 原則準拠度の算出
  const principleScore = calculatePrincipleCompliance(design, context.principleAdjustments);
  
  // 重み付け統合（原則準拠度は20%、他は80%を3等分）
  const weights = {
    product: 0.27,    // 80% ÷ 3
    page: 0.27,       // 80% ÷ 3  
    intent: 0.26,     // 80% ÷ 3
    principle: 0.20   // 20%
  };
  
  const totalScore = (
    productContext * weights.product +
    pageContext * weights.page + 
    designContext * weights.intent +
    principleScore * weights.principle
  );
  
  return Math.max(totalScore, 0.7); // 最低0.7保証
};

// 原則準拠度の評価
const calculatePrincipleCompliance = (design, principleAdjustments) => {
  const evaluations = principleAdjustments.preserved_core_values.map(principle => {
    switch (principle.name) {
      case '一貫性のあるUIパターン':
        return evaluateUIConsistency(design);
      case 'シンプルで分かりやすい構造':
        return evaluateStructuralClarity(design);
      case 'ニュートラルなデザイン':
        return evaluateDesignNeutrality(design);
      case 'ユーザーの操作負担を最小限':
        return evaluateUsabilityBurden(design);
      default:
        return 1.0;
    }
  });
  
  // 最小値重視（1つでも大きく外れると低評価）
  return Math.min(...evaluations);
};

// 個別原則の評価関数
const evaluateUIConsistency = (design) => {
  let score = 1.0;
  
  // 同じ意味の要素で異なる表現をチェック
  const inconsistencies = detectPatternInconsistencies(design);
  score -= inconsistencies.length * 0.1;
  
  // ボタンの一貫性チェック
  const buttonInconsistencies = checkButtonConsistency(design);
  score -= buttonInconsistencies.length * 0.05;
  
  return Math.max(score, 0.7);
};

// 実装補助関数
const detectPatternInconsistencies = (design) => {
  // 同じ機能の要素で異なるスタイルを検出
  const patterns = ['button', 'card', 'form', 'navigation'];
  const inconsistencies = [];
  
  patterns.forEach(pattern => {
    const elements = design.elements?.filter(el => el.type === pattern) || [];
    if (elements.length > 1) {
      const styles = elements.map(el => el.style);
      const uniqueStyles = [...new Set(styles)];
      if (uniqueStyles.length > 1) {
        inconsistencies.push({
          pattern,
          count: elements.length,
          styleVariations: uniqueStyles.length
        });
      }
    }
  });
  
  return inconsistencies;
};

const checkButtonConsistency = (design) => {
  const buttons = design.elements?.filter(el => el.type === 'button') || [];
  const inconsistencies = [];
  
  // プライマリボタンの重複チェック
  const primaryButtons = buttons.filter(btn => btn.variant === 'primary');
  if (primaryButtons.length > 1) {
    inconsistencies.push({
      type: 'multiple_primary',
      count: primaryButtons.length
    });
  }
  
  return inconsistencies;
};

const evaluateStructuralClarity = (design) => {
  let score = 1.0;
  
  // 情報階層の明確さ
  const hierarchyClarity = evaluateInformationHierarchy(design);
  if (hierarchyClarity < 0.8) score -= 0.2;
  
  // 過度な装飾のチェック  
  const decorationOveruse = detectExcessiveDecoration(design);
  score -= decorationOveruse * 0.15;
  
  return Math.max(score, 0.7);
};

// 情報階層評価の実装
const evaluateInformationHierarchy = (design) => {
  const elements = design.elements || [];
  
  // 見出しレベルの適切性チェック
  const headings = elements.filter(el => el.type?.startsWith('heading'));
  let hierarchyScore = 1.0;
  
  if (headings.length === 0) return 0.5; // 見出しなしは低評価
  
  // H1からH6の順序チェック
  const headingLevels = headings.map(h => parseInt(h.level || '1'));
  for (let i = 1; i < headingLevels.length; i++) {
    if (headingLevels[i] - headingLevels[i-1] > 1) {
      hierarchyScore -= 0.1; // レベルのスキップは減点
    }
  }
  
  return Math.max(hierarchyScore, 0.3);
};

const detectExcessiveDecoration = (design) => {
  let decorationScore = 0;
  const elements = design.elements || [];
  
  // 過度なシャドウ、グラデーション、アニメーションをチェック
  elements.forEach(element => {
    if (element.style?.shadows?.length > 2) decorationScore += 0.1;
    if (element.style?.gradient) decorationScore += 0.1;
    if (element.style?.animations?.length > 1) decorationScore += 0.1;
    if (element.style?.backgroundImage) decorationScore += 0.1;
  });
  
  return Math.min(decorationScore, 1.0);
};

const evaluateDesignNeutrality = (design) => {
  let score = 1.0;
  
  // ブランド特化装飾の検出
  const brandSpecificity = detectBrandSpecificElements(design);
  score -= brandSpecificity * 0.1;
  
  // 過度なスタイリングのチェック
  const stylingOveruse = detectExcessiveStyling(design);  
  score -= stylingOveruse * 0.1;
  
  return Math.max(score, 0.7);
};

// ブランド特化要素の検出
const detectBrandSpecificElements = (design) => {
  let specificity = 0;
  const elements = design.elements || [];
  
  elements.forEach(element => {
    // ブランド色の過度な使用
    if (element.style?.brandColors?.length > 2) specificity += 0.2;
    
    // 特定企業のロゴやイラスト
    if (element.type === 'logo' || element.type === 'brand-illustration') specificity += 0.3;
    
    // カスタムフォントの使用
    if (element.style?.fontFamily && !element.style.fontFamily.includes('system')) {
      specificity += 0.1;
    }
  });
  
  return Math.min(specificity, 1.0);
};

const detectExcessiveStyling = (design) => {
  let overuse = 0;
  const elements = design.elements || [];
  
  elements.forEach(element => {
    const style = element.style || {};
    
    // 複数の視覚効果の同時使用
    let effectCount = 0;
    if (style.gradient) effectCount++;
    if (style.shadows?.length > 0) effectCount++;
    if (style.borderRadius > 16) effectCount++;
    if (style.animations?.length > 0) effectCount++;
    
    if (effectCount > 2) overuse += 0.1;
  });
  
  return Math.min(overuse, 1.0);
};

const evaluateUsabilityBurden = (design) => {
  let score = 1.0;
  
  // 操作ステップ数の評価
  const operationSteps = countRequiredSteps(design);
  if (operationSteps > 3) score -= (operationSteps - 3) * 0.1;
  
  // 直感性の評価
  const intuitiveness = evaluateIntuitiveness(design);
  score *= intuitiveness;
  
  return Math.max(score, 0.7);
};

// 操作ステップ数のカウント
const countRequiredSteps = (design) => {
  const interactiveElements = design.elements?.filter(el => 
    el.type === 'button' || el.type === 'input' || el.type === 'link'
  ) || [];
  
  // 主要なタスクフローを想定したステップ数
  let steps = 0;
  
  // フォームがあれば入力ステップを加算
  const forms = design.elements?.filter(el => el.type === 'form') || [];
  forms.forEach(form => {
    const inputs = form.children?.filter(child => child.type === 'input') || [];
    steps += inputs.length + 1; // 入力数 + 送信
  });
  
  // ナビゲーション要素があればクリック数を想定
  const navigation = design.elements?.filter(el => el.type === 'navigation') || [];
  navigation.forEach(nav => {
    const links = nav.children?.filter(child => child.type === 'link') || [];
    if (links.length > 5) steps += 2; // 多すぎる場合は探索コストを加算
  });
  
  return Math.max(steps, 1);
};

const evaluateIntuitiveness = (design) => {
  let score = 1.0;
  const elements = design.elements || [];
  
  // 一般的でないパターンの使用をチェック
  elements.forEach(element => {
    // 期待と異なる配置（送信ボタンが左など）
    if (element.type === 'submit' && element.position?.includes('left')) {
      score -= 0.1;
    }
    
    // 意味不明なラベル
    if (element.type === 'button' && element.label?.length > 20) {
      score -= 0.05;
    }
    
    // 色による意味の混乱（赤で進む、緑で止まるなど）
    if (element.style?.color === 'red' && element.action?.includes('proceed')) {
      score -= 0.15;
    }
  });
  
  return Math.max(score, 0.5);
};
```

#### AE（美的表現）
美的表現評価は、ブランド適合性・色彩調和・統一性・主脇役バランスを見るためのレビュー観点です。完全自動の復活実装システムではなく、`dcs-report` の測定結果と画面文脈をもとに、AIまたは人が根拠つきで判断します。

**旧ADS由来の概念式：**
```
AE = ブランド適合度 × 色彩調和 × 統一性
```

- **ブランド適合度**：導入先固有の感情軸と視覚要素の整合性
- **色彩調和**：ブランド連動型の調和パターン評価＋ネガティブチェック
  - 強調システムでは判定できない「色相による美しさ」を評価
  - ハレーション、色数過多、セマンティック競合を検出
- **統一性**：フォント・余白・角丸等の一貫性

詳細は `emphasis-aesthetic-detailed.md` を参照。

#### DP（発見可能性）
発見可能性評価は、ユーザーが必要なUI要素や主要導線を見つけられるかを見るレビュー観点です。primaryボタン数、強調度、コントラスト、見出し構造などの測定結果を材料にしつつ、画面目的やユーザー熟練度を踏まえて判断します。

### 実用例：チャットUIレビュー

#### 現状分析の表現例
```
- ID: 中密度。情報量は多すぎないが、主要アクションの周辺に補足が不足している
- CX: チャット用途には合っているが、履歴確認と新規入力の優先度が少し競合している
- AE: 全体は整っているが、色数と境界の扱いにわずかなばらつきがある
- DP: 主要入力は見つけやすい。一方、補助操作はアイコンだけで意味が伝わりにくい
```

#### 改善後予測の表現例
```
- ID: 入力まわりの補足を整理し、密度を少し上げても読みやすさを維持する
- CX: 会話履歴と入力欄の役割分担を明確にする
- AE: 境界線と背景面の使い方を統一し、静かな印象を保つ
- DP: 補助操作にラベルまたはツールチップを追加し、発見しやすくする
```

### AIによる3案提示システム

#### 標準フロー
```
ユーザー要求：「価格を12pt相当に強調してください」

提案A: 絶対強調（従来）
├─ 変更: 価格を32px + primary色に変更
├─ 効果: 確実、インパクト大（12.24pt）
├─ 適用: 単体で目立たせたい場合
└─ 注意: 全体バランスへの影響あり

提案B: 相対強調（新手法）
├─ 変更: 価格はそのまま、説明文等をopacity: 0.7に
├─ 効果: 上品、調和保持（12pt相当）
├─ 適用: 情報密度が高い場合、複数カード
└─ 注意: 効果が控えめ、気づかれにくい可能性

提案C: ハイブリッド（推奨）
├─ 変更: 価格を24px（軽微拡大）+ 周辺opacity: 0.6
├─ 効果: バランスの良い強調（12pt相当）
├─ 適用: 多くの場面で最適解
└─ 注意: 微調整が必要な場合あり
```

### 階層的強調度管理

#### 情報密度による選択指針
```
高密度ページ（商品一覧、ダッシュボード等）:
├─ 推奨: 相対強調 > ハイブリッド > 絶対強調
├─ 理由: 絶対強調多用で全体が破綻しやすい
└─ 例: 商品カード9個 × 価格強調 = 相対強調が最適

中密度ページ（記事、フォーム等）:
├─ 推奨: ハイブリッド > 絶対強調 > 相対強調
├─ 理由: バランスを取りながら確実な効果
└─ 例: 記事内の重要なポイント強調

低密度ページ（LP、ヒーロー等）:
├─ 推奨: 絶対強調 > ハイブリッド > 相対強調
├─ 理由: インパクト重視、全体破綻リスク低
└─ 例: プライシング価格の大胆な強調
```

#### パターンC：詳細5階層
```
15pt → 10pt → 7pt → 4pt → 2pt
├─ 比率：0.67倍、0.7倍、0.57倍、0.5倍
└─ 適用：情報密度が高い場合
```

## 🌟 コンテキスト判定によるトレンド提案システム

### 基本コンセプト
デザイン作業の文脈（新規・追加・特別ページ）を自動判定し、状況に応じて適切なトレンド提案を行うシステム。プロジェクト属性ではなく、その時の作業コンテキストに基づいて判断する。

### コンテキスト判定システム

#### 判定フロー
```javascript
const analyzeDesignContext = (request, existingFiles) => {
  const context = {
    isNewProject: detectNewProject(request, existingFiles),
    hasExistingDesign: detectExistingDesign(existingFiles), 
    isSpecialPage: detectSpecialPage(request),
    isPrototype: detectPrototype(request)
  };
  
  return getTrendSuggestionLevel(context);
};

const detectNewProject = (request, files) => {
  // pages/generated/が空 または 明示的な新規指示
  return files.length === 0 || request.includes('新規') || request.includes('プロトタイプ');
};

const detectExistingDesign = (files) => {
  // 既存のHTMLファイルが存在
  return files.some(file => file.endsWith('.html'));
};

const detectSpecialPage = (request) => {
  // 特別・キャンペーン・独立性のキーワード
  const specialKeywords = ['特別', 'キャンペーン', '独立', 'LP', 'ランディング'];
  return specialKeywords.some(k => request.includes(k));
};
```

#### 動作パターン
```javascript
const getTrendSuggestionLevel = (context) => {
  // 新規プロジェクト・プロトタイプ
  if (context.isNewProject || context.isPrototype) {
    return {
      action: 'SUGGEST_TRENDS',
      message: '新規デザインを作成します。最新のデザイントレンドを取り入れますか？調査して提案することも可能です',
      shouldAsk: true
    };
  }
  
  // 既存デザインへの追加
  if (context.hasExistingDesign && !context.isSpecialPage) {
    return {
      action: 'NO_SUGGESTION', 
      message: '既存ページとの統一性を重視してデザインします',
      shouldAsk: false
    };
  }
  
  // 特別ページ・独立性あり
  if (context.isSpecialPage) {
    return {
      action: 'CONDITIONAL_SUGGESTION',
      message: '特別なページのようですが、既存デザインと統一するか、独自の表現を検討するか選択してください',
      shouldAsk: true
    };
  }
  
  // デフォルト（既存統一）
  return {
    action: 'DEFAULT_CONSISTENT',
    message: '既存デザインとの統一性を保ちます',
    shouldAsk: false
  };
};
```

### トレンド提案の実行フロー

#### 1. コンテキスト自動判定
```
ユーザーリクエスト受信
├─ 既存ファイル確認
├─ リクエスト内容解析  
├─ コンテキスト判定実行
└─ 適切な動作パターン選択
```

#### 2. 状況別の動作
```
新規・プロトタイプ:
├─ トレンド採用確認
├─ 希望時は最新調査実行
└─ 調査結果に基づく提案

既存システム追加:
├─ 統一性重視で進行
├─ トレンド提案なし
└─ ユーザー明示時のみ検討

特別ページ:
├─ 統一 vs 独自の選択確認
├─ 独自選択時はトレンド検討
└─ 統一選択時は既存踏襲
```
