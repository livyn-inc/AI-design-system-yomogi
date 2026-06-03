# 美的表現評価（AE：Aesthetic Expression）詳細仕様

## 🎨 基本コンセプト

美的表現評価（AE）は、デザインの視覚的品質を客観的に数値化するシステムです。
ただし、ブランド適合や色彩調和は完全な自動測定が難しいため、Yomogiでは「測定可能な根拠」と「AIのレビュー観点」を分けて扱います。
点数を出す場合も、何を根拠に判断したかを併記します。

**基本計算式：**
```
AE = ブランド適合度 × 色彩調和 × 統一性
```

## 📊 3つの評価要素（原則統合版）

### 1. ブランド適合度（Brand Compatibility：0.7-1.0）
#### 原則統合型ブランド適合度評価
ブランド感情軸とデザイン表現の整合性に加え、**デザイン原則との整合性**を評価します。
原則再解釈システムによって調整された感情軸を基準として判定を行います。

#### 基本コンセプト
各導入先のbrand.mdcで設定されたブランド感情軸とデザイン表現の整合性を評価します。
導入先での初期ヒアリング（init-flow.mdc 4.2）で設定した感情軸と視覚要素の紐付けに基づいて判定します。

#### 評価の仕組み
1. **導入先固有の感情軸設定**
   - ユーザーが「こんな感じ」を伝える（親しみやすい、信頼できる、シンプル等）
   - 感情・印象は誰でも伝えられる

2. **感情軸と視覚要素の紐付け**
   - AIが一般的な対応を提案、ユーザーが確認・調整
   - 導入先ごとに異なる基準を設定可能

3. **適合度の算出（0.7-1.0）**
   ```javascript
   let alignmentLevel = 1.0; // 完全適合から開始
   
   // 導入先固有の評価項目で差異チェック
   // 例：ブランドカラー使用率、フォント、表現スタイル等
   // ※評価項目自体も導入先ごとに変わる
   
   return Math.max(alignmentLevel, 0.7);
   ```

4. **ポジティブな表現での評価**
   - 1.0：「ブランド設定と一致」
   - 0.9：「軽微な違いあり」
   - 0.8：「違いあり」
   - 0.7：「大きな違いあり」

#### 参考：一般的な感情軸と視覚要素の対応例

##### A. 子供向け・教育系ブランド
```
高適合（0.9-1.0）:
├─ パステルカラー使用
├─ 丸い角丸（8px以上）
├─ 楽しい・親しみやすいフォント
└─ 明るく開放的な余白使用

中適合（0.8-0.9）:
├─ セーフカラー（原色避け）
├─ 中程度の角丸（4-8px）
└─ 標準的なフォント

低適合（0.7-0.8）:
├─ モノトーン中心
├─ 鋭い角（2px以下）
├─ 堅い・冷たい印象
└─ 詰めすぎた余白
```

##### B. 高級・プレミアムブランド
```
高適合（0.9-1.0）:
├─ 洗練された色使い（低彩度・モノクロ）
├─ エレガントな余白使用
├─ シンプル・ミニマル
└─ 上質なタイポグラフィ

中適合（0.8-0.9）:
├─ 適度な装飾
├─ バランスの取れた配色
└─ 標準的な要素配置

低適合（0.7-0.8）:
├─ 派手・カジュアル
├─ 高彩度・原色多用
├─ 詰め込み感
└─ ポップな表現
```

##### C. B2B・法人向けブランド
```
高適合（0.9-1.0）:
├─ 安定感のある配色（ブルー・グレー基調）
├─ 明確な階層構造
├─ 機能性重視のレイアウト
└─ 読みやすさ最優先

中適合（0.8-0.9）:
├─ バランスの取れたデザイン
├─ 適度な装飾
└─ 標準的な表現

低適合（0.7-0.8）:
├─ 派手・実験的
├─ エンターテイメント的
├─ 過度な装飾
└─ 遊び心重視
```

##### D. ゲーミング・エンタメブランド
```
高適合（0.9-1.0）:
├─ 鮮やか・ビビッド
├─ 動的要素・エフェクト
├─ 先進的・未来的表現
└─ 高コントラスト

中適合（0.8-0.9）:
├─ 適度なカラフルさ
├─ 標準的な動き
└─ バランス型

低適合（0.7-0.8）:
├─ 地味・保守的
├─ モノトーン中心
├─ 静的・変化なし
└─ 堅い表現
```

#### 原則統合型実装アルゴリズム
```javascript
const calculateBrandCompatibility = (design, brandSettings) => {
  // principleAdjustments は brandSettings.principleAdjustments から取得
  const originalBrandAxis = brandSettings.originalEmotions || [];
  const adjustedBrandAxis = brandSettings.adjustedEmotions || [];
  const principleAdjustments = brandSettings.principleAdjustments || {};
  // 1. 調整済み感情軸での基本評価
  const adjustedRules = extractBrandRules(adjustedBrandAxis);
  let alignmentScore = 1.0;
  
  adjustedRules.forEach(rule => {
    const isAligned = checkVisualAlignment(design, rule);
    if (!isAligned) {
      alignmentScore -= rule.weight || 0.1;
    }
  });
  
  // 2. 原則保持度の評価
  const principlePreservation = evaluatePrinciplePreservation(
    design, originalBrandAxis, adjustedBrandAxis, principleAdjustments
  );
  
  // 3. 統合評価（調整済み軸90% × 原則保持10%）
  const finalScore = alignmentScore * 0.9 + principlePreservation * 0.1;
  
  return Math.max(finalScore, 0.7);
};

// 原則保持度の評価
const evaluatePrinciplePreservation = (design, original, adjusted, adjustments) => {
  let preservationScore = 1.0;
  
  adjustments.forEach(adjustment => {
    // 再解釈の妥当性チェック
    const isValidReinterpretation = validateReinterpretation(
      adjustment.originalRequirement,
      adjustment.principleConstraint, 
      adjustment.reinterpretedConcept
    );
    
    if (!isValidReinterpretation) {
      preservationScore -= 0.2;
    }
    
    // 核心価値の保持チェック
    const coreValuePreserved = checkCoreValuePreservation(
      design, adjustment.coreValue
    );
    
    if (!coreValuePreserved) {
      preservationScore -= 0.3;
    }
  });
  
  return Math.max(preservationScore, 0.7);
};

// 例：再解釈事例での評価
const exampleReinterpretation = {
  originalRequirement: "ごちゃごちゃな雰囲気",
  principleConstraint: "シンプルで分かりやすい構造", 
  reinterpretedConcept: "豊かな情報表現・多様性のあるデザイン",
  coreValue: "情報階層の明確性",
  visualAdjustments: {
    colorCount: 5,        // 3色→5色
    harmonyType: 'triadic', // analogous→triadic
    radiusVariation: [4, 8, 12, 16], // 統一→多様
    structuralClarity: true  // 階層は明確に保持
  }
};
```

**注意**: 上記の4分類（子供向け・高級・B2B・ゲーミング）は参考例です。実際の評価は各導入先のbrand.mdc設定に基づいて行われます。

### 2. 色彩調和（Color Harmony：0.6-1.0）

#### 基本コンセプト
強調システムでは判定できない「色相による美しさ・まとまり」を評価します。
ブランド感情軸に応じて重視する調和パターンが変動し、ポジティブ評価とネガティブチェックを組み合わせた総合評価を行います。

#### ブランド連動型の調和パターン評価

##### A. 補色調和（インパクトと調和の両立）
```
特性:
├─ 色相差180°±30°の組み合わせ
├─ お互いを引き立て合う関係
└─ コントラストがありつつ調和

適したブランド例:
├─ 「革新的・インパクト・先進的」→ 重視度高
├─ 「活発・エネルギッシュ」→ 重視度高
└─ 「誠実・安定」→ 重視度低

実装例:
├─ 青（#0066CC）× オレンジ（#FF6600）
├─ 赤（#CC3333）× 緑（#339933）
└─ 紫（#9933CC）× 黄（#CCCC33）
```

##### B. 類似色調和（統一感とまとまり）
```
特性:
├─ 色相差60°以内の組み合わせ
├─ グラデーション的な自然な流れ
└─ 安定感・統一感のある印象

適したブランド例:
├─ 「誠実・信頼・安定」→ 重視度高
├─ 「シンプル・ミニマル」→ 重視度高
└─ 「派手・インパクト」→ 重視度低

実装例:
├─ 青系統一（#0044AA → #3377DD → #66AAFF）
├─ 暖色系統一（#FF4444 → #FF6644 → #FF8844）
└─ 寒色系統一（#4444FF → #4466FF → #4488FF）
```

##### C. 三角配置調和（豊かさとバランス）
```
特性:
├─ 色相差120°の3色組み合わせ
├─ 彩り豊かだが喧嘩しない
└─ 洗練されたバランス感

適したブランド例:
├─ 「洗練・バランス・上品」→ 重視度高
├─ 「多様性・豊かさ」→ 重視度高
└─ 「シンプル・ミニマル」→ 重視度低

実装例:
├─ 赤・青・黄の組み合わせ
└─ 紫・緑・オレンジの組み合わせ
```

#### ネガティブチェックシステム

##### 1. ハレーション検出（調和パターン依存）
```javascript
const detectHalation = (colors, harmonyType) => {
  // 類似色調和重視の場合
  if (harmonyType === 'analogous') {
    // 高彩度の隣接色相は厳しくチェック
    return strictHalationCheck(colors);
  }
  // 補色調和重視の場合
  else if (harmonyType === 'complementary') {
    // ある程度のコントラストは許容
    return lenientHalationCheck(colors);
  }
};
```

##### 2. 色数過多チェック（調和パターン依存）
```javascript
const checkColorCount = (colors, harmonyType) => {
  const limits = {
    'analogous': 3,      // 類似色は3色まで
    'complementary': 4,  // 補色は4色まで
    'triadic': 5        // 三角配置は5色まで
  };
  return colors.length <= limits[harmonyType];
};
```

##### 3. セマンティックカラー競合（普遍的）
```javascript
const checkSemanticConflict = (colors) => {
  const semanticColors = {
    error: '#E94E77',    // 警告赤
    success: '#4CAF50',  // 成功緑
    warning: '#FFA726',  // 注意橙
    info: '#29B6F6'      // 情報青
  };
  
  // 機能的意味を持つ色との競合をチェック
  return detectConflictWithSemanticColors(colors, semanticColors);
};
```

##### 4. 意図しない強調検出
```javascript
const checkUnintendedEmphasis = (colors) => {
  // 色相による意図しない強調や埋没をチェック
  return detectColorBasedEmphasisIssues(colors);
};
```

#### 統合評価アルゴリズム
```javascript
const calculateColorHarmony = (colors, brandAxis) => {
  // 1. ブランドに応じた調和パターンと判定基準を決定
  const harmonyType = determineHarmonyType(brandAxis);
  
  // 2. ポジティブ評価（調和パターン評価）
  const harmonyScore = evaluateHarmonyPattern(colors, harmonyType);
  
  // 3. パターン依存のネガティブチェック
  const contextualIssues = {
    halation: detectHalation(colors, harmonyType),
    colorCount: checkColorCount(colors, harmonyType),
    unintendedEmphasis: checkUnintendedEmphasis(colors)
  };
  
  // 4. 普遍的ネガティブチェック
  const universalIssues = {
    semanticConflict: checkSemanticConflict(colors),
    contrastRatio: checkAccessibilityContrast(colors)
  };
  
  // 5. 総合スコア算出
  let score = harmonyScore;
  
  // ネガティブチェックによる減点
  if (contextualIssues.halation) score *= 0.8;
  if (contextualIssues.colorCount) score *= 0.9;
  if (contextualIssues.unintendedEmphasis) score *= 0.85;
  if (universalIssues.semanticConflict) score *= 0.7;
  if (!universalIssues.contrastRatio) score *= 0.8;
  
  return Math.max(score, 0.6); // 最低0.6
};
```

#### 評価基準値
```
優秀（0.9-1.0）:
├─ ブランドに最適な調和パターン
├─ ネガティブチェック全てクリア
└─ 推奨レベル

良好（0.75-0.9）:
├─ 調和パターンは適切
├─ 軽微な問題1-2件
└─ 実用可能品質

要注意（0.6-0.75）:
├─ 明確な問題あり
├─ 改善推奨
└─ 修正すれば使用可能

問題あり（0.6未満）:
├─ 深刻な色彩問題
├─ 再設計推奨
└─ ハレーション、競合等の重大問題
```

### 3. 統一性（Consistency：0.5-1.0）

#### 基本コンセプト
フォント・余白・角丸・色使用の一貫性を評価します。

#### 評価項目と基準

##### A. フォント統一性（ブランド連動型：0.5-1.0）
```
基本コンセプト：
ブランド感情軸に合ったフォント特性で、サービス全体に美的統一感があるか評価

ブランド別フォント特性例：
├─ 「親しみやすさ」→ やや太め（500-600）、ゆったりした line-height（1.6-1.8）
├─ 「信頼性・誠実」→ 標準（400-500）、読みやすい line-height（1.5-1.6）
├─ 「洗練・高級」→ 細め（300-400）、タイトな line-height（1.4-1.5）
└─ 「力強さ」→ 太め（600-700）、しっかりした印象

評価基準：
完全統一（1.0）：ブランド特性と完全一致、種類数2-3に統制
良好統一（0.8-0.9）：ブランド特性に概ね一致、軽微なばらつき
不統一（0.5-0.7）：ブランド特性と不一致、または無秩序な使用

調整ロジック：
├─ 既存トークンの範囲で近似値選択（font-size-12 ～ font-size-48）
├─ ウェイト調整も既存値で（300, 400, 500, 600, 700）
├─ トークン追加時はユーザー確認必須
└─ 例：「もう少し親しみやすく」→ 400を500に、line-height 1.5を1.6に
```

##### B. 余白統一性（ブランド連動型：0.6-1.0）
```
基本コンセプト：
ブランド感情軸に合った余白感で、サービス全体に美的統一感があるか評価
※トークン使用は前提条件（design-checklist.mdcで別途チェック）

ブランド別余白特性例：
├─ 「ゆとりのある・親しみ」→ 余白倍率1.5、最小セクション間72px
├─ 「コンパクト・効率」→ 余白倍率0.8、最小セクション間32px  
├─ 「標準・バランス」→ 余白倍率1.0、最小セクション間48px
└─ 「高級・洗練」→ 余白倍率1.3、大きな余白で高級感演出

評価基準：
完全統一（1.0）：ブランド余白感と完全一致、使用種類3-5に統制
良好統一（0.8-0.9）：ブランド余白感に概ね一致、軽微なばらつき
不統一（0.6-0.8）：ブランド余白感と不一致、または無秩序な使用

調整ロジック：
├─ 既存トークンの範囲で近似値選択（8px ～ 96px）
├─ 段階移動での調整（48px → 64px、32px → 24px等）
├─ トークン追加時はユーザー確認必須
└─ 例：「もう少しゆとりを」→ 48px → 64px、32px → 48px
```

##### C. 角丸統一性（ブランド連動型：0.6-1.0）
```
基本コンセプト：
ブランド感情軸に合った角丸度合いで、サービス全体に美的統一感があるか評価
※トークン使用は前提条件（design-checklist.mdcで別途チェック）

ブランド別角丸特性例：
├─ 「親しみやすさ・柔らかさ」→ 角丸多用、8px以上中心、統一された丸み
├─ 「信頼性・誠実」→ 適度な角丸、4-8px中心、機能的使い分け
├─ 「シャープ・力強さ」→ 直線基調、2px以下または0px中心
└─ 「高級・洗練」→ 控えめな角丸、統一された上品な丸み

評価基準：
完全統一（1.0）：ブランド角丸感と完全一致、種類数2-3に統制
良好統一（0.8-0.9）：ブランド角丸感に概ね一致、軽微なばらつき  
不統一（0.6-0.8）：ブランド角丸感と不一致、または無秩序な使用

調整ロジック：
├─ 既存トークンの範囲で近似値選択（0px, 2px, 4px, 8px, 12px, 16px）
├─ 段階移動での調整（4px → 8px、12px → 8px等）
├─ トークン追加時はユーザー確認必須  
└─ 例：「もう少し柔らかく」→ 4px → 8px、直線要素に角丸追加
```

#### 統一性実装アルゴリズム（ブランド連動型）
```javascript
const calculateConsistency = (designElements, brandAxis) => {
  // 1. ブランド感情軸から各要素の理想特性を決定
  const idealProfile = extractBrandIdealProfile(brandAxis);
  
  // 2. 各統一性要素をブランド適合度で評価
  const fontConsistency = evaluateBrandFontConsistency(
    designElements.fonts, idealProfile.font
  );
  const spacingConsistency = evaluateBrandSpacingConsistency(
    designElements.spacing, idealProfile.spacing
  );
  const radiusConsistency = evaluateBrandRadiusConsistency(
    designElements.radius, idealProfile.radius
  );
  
  // 3. 調和平均（最低値の影響大）
  const scores = [fontConsistency, spacingConsistency, radiusConsistency];
  return calculateHarmonicMean(scores);
};

// 例：ブランド理想プロファイル
const extractBrandIdealProfile = (brandAxis) => {
  if (brandAxis.includes("親しみやすい")) {
    return {
      font: { weight: 500, lineHeight: 1.6 },
      spacing: { multiplier: 1.3, style: "ゆったり" },
      radius: { preference: "多用", baseSize: 8 }
    };
  }
  if (brandAxis.includes("シャープ")) {
    return {
      font: { weight: 400, lineHeight: 1.4 },
      spacing: { multiplier: 0.9, style: "引き締め" },
      radius: { preference: "最小限", baseSize: 2 }
    };
  }
  // デフォルト
  return {
    font: { weight: 400, lineHeight: 1.5 },
    spacing: { multiplier: 1.0, style: "標準" },
    radius: { preference: "適度", baseSize: 4 }
  };
};
```