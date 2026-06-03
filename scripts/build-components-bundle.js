#!/usr/bin/env node

/**
 * コンポーネントバンドルの自動生成スクリプト
 * 
 * 目的：
 * - components/以下の各コンポーネントから自動的にbundleを生成
 * - 実装の不一致を防ぐ
 * - 手動コピーによるミスを排除
 */

const fs = require('fs');
const path = require('path');

// 対象コンポーネントリスト
const components = [
  'button/Button.js',
  'input/Input.js',
  'textarea/TextArea.js',
  'select/Select.js',
  'tag/Tag.js',
  'icon-button/IconButton.js',
  'breadcrumb/Breadcrumb.js',
  'tooltip/Tooltip.js',
  'card/Card.js',
  'pagination/Pagination.js',
  'navigation/Navigation.js',
  'layout/PageTemplate.js',
  'table/Table.js',
  'modal/Modal.js',
  'alert/Alert.js',
  'toast/Toast.js',
  'switch/Switch.js',
  'checkbox/Checkbox.js',
  'radio/Radio.js',
  'drawer/Drawer.js',
  'dropdown/Dropdown.js',
  'popover/Popover.js',
  'tabs/Tabs.js',
  'list/List.js',
  'avatar/Avatar.js',
  'file-tree/FileTree.js',
  'sidenav/SideNav.js',
  'topbar/TopBar.js'
];

// バンドルのヘッダー
const bundleHeader = `// Auto-generated Components Bundle
// Generated at: ${new Date().toISOString()}
// DO NOT EDIT MANUALLY - Use 'npm run build:bundle' instead

`;

// 各コンポーネントを読み込んでバンドル化
let bundleContent = bundleHeader;

components.forEach(componentPath => {
  const fullPath = path.join(__dirname, '../components/', componentPath);
  
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // export文とimport文を削除（バンドルでは不要）
    const cleanedContent = content
      .replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '') // import文を削除
      .replace(/^import\s*{[^}]+}\s*from\s+['"].*?['"];?\s*$/gm, '') // named import削除
      .replace(/^export\s+function\s+/gm, 'function ')
      .replace(/^export\s+const\s+/gm, 'const ')
      .replace(/^export\s+default\s+/gm, '')
      .replace(/export\s*{[^}]+};\s*$/gm, '')
      .replace(/export\s+default\s+\w+;\s*$/gm, '')
      .trim();
    
    bundleContent += `\n// ${componentPath}\n${cleanedContent}\n\n`;
  } else {
    console.warn(`Warning: Component not found: ${fullPath}`);
  }
});

// バンドルファイルを出力
const outputPath = path.join(__dirname, '../pages/_templates/components.js');
fs.writeFileSync(outputPath, bundleContent);

console.log('✅ Components bundle generated successfully!');
console.log(`📦 Output: ${outputPath}`);