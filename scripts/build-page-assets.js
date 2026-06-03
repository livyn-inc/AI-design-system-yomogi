#!/usr/bin/env node

/**
 * pages/ 用のアセット統合ビルドスクリプト
 * - デザイントークン (tokens.css)
 * - 全コンポーネントCSS統合 (bundle.css)
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const ROOT_DIR = path.join(__dirname, '..');
const PAGES_DIR = path.join(ROOT_DIR, 'pages');
const ASSETS_DIR = path.join(PAGES_DIR, '_assets');
const BUILD_DIR = path.join(ROOT_DIR, 'build');
const COMPONENTS_DIR = path.join(ROOT_DIR, 'components');

// ディレクトリ作成
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

/**
 * デザイントークンファイルをコピー
 */
function copyTokens() {
  console.log('📄 Copying design tokens...');
  
  const tokensSource = path.join(BUILD_DIR, 'css', 'tokens.css');
  const tokensTarget = path.join(ASSETS_DIR, 'tokens.css');
  
  if (!fs.existsSync(tokensSource)) {
    console.error('❌ tokens.css not found. Run "npm run build-tokens" first.');
    process.exit(1);
  }
  
  fs.copyFileSync(tokensSource, tokensTarget);
  console.log('✅ tokens.css copied');
}

/**
 * 全コンポーネントCSSを統合してbundle.cssを生成
 */
function buildCssBundle() {
  console.log('🎨 Building CSS bundle...');
  
  // CSSファイルを収集
  const cssFiles = glob.sync('**/*.css', { 
    cwd: COMPONENTS_DIR,
    absolute: true 
  });
  
  console.log(`📦 Found ${cssFiles.length} CSS files`);
  
  // トークンの内容を読み込む
  const tokensSource = path.join(BUILD_DIR, 'css', 'tokens.css');
  const tokensContent = fs.existsSync(tokensSource) 
    ? fs.readFileSync(tokensSource, 'utf8') 
    : '/* tokens.css not found */';
  
  // base.cssの内容を読み込む（存在する場合）
  const baseSource = path.join(PAGES_DIR, '_assets', 'base.css');
  const baseContent = fs.existsSync(baseSource) 
    ? fs.readFileSync(baseSource, 'utf8') 
    : '';
  
  let bundleContent = `/**
 * Design System Components CSS Bundle
 * Auto-generated file - Do not edit directly
 * Generated: ${new Date().toISOString()}
 */

/* ========================================
   DESIGN TOKENS (inlined)
   ======================================== */
${tokensContent}

/* ========================================
   BASE STYLES (if available)
   ======================================== */
${baseContent}

/* ========================================
   COMPONENT STYLES
   ======================================== */
`;

  // 各CSSファイルの内容を統合
  cssFiles.forEach(cssFile => {
    const relativePath = path.relative(COMPONENTS_DIR, cssFile);
    const content = fs.readFileSync(cssFile, 'utf8');
    
    bundleContent += `
/* === ${relativePath} === */
${content}

`;
  });
  
  // bundle.cssを書き出し
  const bundleTarget = path.join(ASSETS_DIR, 'bundle.css');
  fs.writeFileSync(bundleTarget, bundleContent);
  
  console.log(`✅ bundle.css created with ${cssFiles.length} components`);
}

/**
 * ビルド統計情報を表示
 */
function showStats() {
  const tokensPath = path.join(ASSETS_DIR, 'tokens.css');
  const bundlePath = path.join(ASSETS_DIR, 'bundle.css');
  
  const tokensSize = (fs.statSync(tokensPath).size / 1024).toFixed(1);
  const bundleSize = (fs.statSync(bundlePath).size / 1024).toFixed(1);
  
  console.log('\n📊 Build Statistics:');
  console.log(`   tokens.css: ${tokensSize}KB`);
  console.log(`   bundle.css: ${bundleSize}KB`);
  console.log(`   Total: ${(parseFloat(tokensSize) + parseFloat(bundleSize)).toFixed(1)}KB`);
}

/**
 * メイン処理
 */
function main() {
  console.log('🚀 Building page assets...\n');
  
  try {
    copyTokens();
    buildCssBundle();
    showStats();
    
    console.log('\n✅ Page assets build completed!');
    console.log(`📁 Assets location: ${ASSETS_DIR}`);
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}

module.exports = { main, copyTokens, buildCssBundle };