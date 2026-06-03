# AI用ページ生成環境

このディレクトリは、AIが「○○ページ作って」等の指示を受けた際に、安定した品質でページを生成するための専用環境です。

## 📁 ディレクトリ構造

```
pages/
├── _templates/          # AIが使用するテンプレート
│   ├── base.html       # 基本HTMLテンプレート
│   └── components.js   # 全コンポーネント統合JS
├── _assets/            # 自動生成・管理アセット
│   ├── bundle.css      # 全スタイル統合CSS
│   └── tokens.css      # デザイントークン
├── generated/          # AI生成ページ格納先
│   └── (AIがここにページ生成)
└── SETUP.md           # このファイル
```

## 🤖 AI向け使用方法

### 1. ページ生成指示を受けた場合
1. **必須**: `.cursor/rules/ads/design-checklist.mdc`を確認
2. **テンプレート確認**: `pages/_templates/base.html`を読み込み
3. **コンポーネント確認**: `pages/_templates/components.js`で利用可能コンポーネントを確認
4. **生成**: `pages/generated/`配下に新しいHTMLファイルを作成
5. **品質チェック**: design-checklist.mdcの全チェック項目を満たしているか確認

### 1.1 テーマ方針（必須）
- デフォルトは **OS準拠**（`prefers-color-scheme`）
- 将来的にユーザー指定テーマを許容（`localStorage.theme`）
  - `system` / `light` / `dark`

### 2. base.htmlテンプレートの使用方法
```html
<!-- 以下のプレースホルダーを適切なコンテンツで置換 -->
{{TITLE}}          <!-- ページタイトル -->
{{HEADER_CONTENT}} <!-- ヘッダー内容 -->
{{MAIN_CONTENT}}   <!-- メインコンテンツ -->
{{FOOTER_CONTENT}} <!-- フッター内容 -->
{{PAGE_SCRIPT}}    <!-- ページ固有のJavaScript -->
```

### 3. 利用可能コンポーネント
#### フォームコンポーネント
- `Button()` - ボタン（variant: solid/outline/ghost）
- `IconButton()` - アイコンボタン
- `Input()` - テキスト入力
- `Select()` - 選択リスト
- `Checkbox()` - チェックボックス
- `Radio()` - ラジオボタン
- `Switch()` - スイッチ
- `TextArea()` - テキストエリア

#### レイアウトコンポーネント
- `Card()` - カード
- `PageTemplate()` - ページテンプレート
- `Drawer()` - ドロワー
- `Modal()` - モーダル
- `Tabs()` - タブ

#### ナビゲーション
- `Breadcrumb()` - パンくずリスト
- `Navigation()` - ナビゲーション
- `Pagination()` - ページネーション

#### データ表示
- `Table()` - テーブル
- `List()` - リスト
- `Avatar()` - アバター
- `Tag()` - タグ
- `FileTree()` - ファイルツリー

#### フィードバック
- `Alert()` - アラート
- `Toast()` - トースト
- `Tooltip()` - ツールチップ
- `Popover()` - ポップオーバー

#### インタラクティブ
- `Dropdown()` - ドロップダウン

### 4. コンポーネント使用例
```javascript
// ボタンの生成例
const submitButton = Button({
  variant: 'solid',
  color: 'primary',
  size: 'md',
  label: '送信'
});

// フォームの生成例
const loginForm = Input({
  type: 'email',
  label: 'メールアドレス',
  placeholder: 'example@email.com',
  required: true
});
```

## 🎯 品質保証

### 必須チェック項目
- [ ] すべてのスタイルでトークン（`var(--xxx)`）を使用
- [ ] ボタンヒエラルキールール遵守（1画面1つのprimary/solid）
- [ ] アクセシビリティ基準満足（ARIA属性、コントラスト等）
- [ ] レスポンシブ対応
- [ ] design-checklist.mdcの全項目クリア

### 禁止事項
- 直接px指定（`font-size: 16px`等）
- 直接カラーコード指定（`#333`、`rgba()`等）
- 推測によるトークン名使用

## 🔧 開発者向け

### アセット更新方法
```bash
# トークン・コンポーネント・ページ用アセットをまとめて更新
npm run build-all

# ページ用アセットのみ更新する場合
npm run build-page-assets
```

`components.js`、`tokens.css`、`bundle.css` は `npm run build-all` で生成されます。

### 新しいコンポーネント追加時
1. `components/`配下に新コンポーネント作成
2. `pages/_templates/components.js`を再生成
3. このREADMEの利用可能コンポーネント一覧を更新

---

**重要**: AI生成ページは `pages/generated/` 配下に作成します。生成物はYomogi本体の固定資産ではなく、必要に応じて再生成する前提で扱います。