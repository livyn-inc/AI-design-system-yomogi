#!/usr/bin/env node

/**
 * 生成されたページの品質チェックスクリプト
 * design-checklist.mdcの要件に基づいて自動検証
 */

const fs = require('fs');
const path = require('path');

/**
 * HTMLファイルの内容をチェック
 * @param {string} filePath - チェック対象のHTMLファイルパス
 * @returns {Object} チェック結果
 */
function validateHtmlFile(filePath) {
  console.log(`\n🔍 Validating: ${path.basename(filePath)}`);
  
  if (!fs.existsSync(filePath)) {
    return { 
      valid: false, 
      errors: [`File not found: ${filePath}`],
      warnings: []
    };
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const errors = [];
  const warnings = [];
  
  // 基本構造チェック
  checkBasicStructure(content, errors, warnings);
  
  // CSSアセット読み込みチェック
  checkAssetLoading(content, errors, warnings);
  
  // トークン使用チェック
  checkTokenUsage(content, errors, warnings);
  
  // アクセシビリティチェック
  checkAccessibility(content, errors, warnings);
  
  // ボタンヒエラルキーチェック
  checkButtonHierarchy(content, errors, warnings);
  
  const valid = errors.length === 0;
  
  // 結果表示
  if (valid && warnings.length === 0) {
    console.log('✅ All checks passed!');
  } else {
    if (errors.length > 0) {
      console.log('\n❌ Errors found:');
      errors.forEach(error => console.log(`   - ${error}`));
    }
    if (warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      warnings.forEach(warning => console.log(`   - ${warning}`));
    }
  }
  
  return { valid, errors, warnings };
}

/**
 * 基本HTML構造チェック
 */
function checkBasicStructure(content, errors, warnings) {
  // DOCTYPE宣言
  if (!content.includes('<!DOCTYPE html>')) {
    errors.push('Missing DOCTYPE declaration');
  }
  
  // 言語属性
  if (!content.includes('lang="ja"') && !content.includes("lang='ja'")) {
    warnings.push('Missing or incorrect lang attribute (should be "ja")');
  }
  
  // メタタグ
  if (!content.includes('charset="UTF-8"')) {
    errors.push('Missing charset meta tag');
  }
  
  if (!content.includes('viewport')) {
    errors.push('Missing viewport meta tag');
  }
  
  // タイトル
  if (!content.includes('<title>') || content.includes('<title></title>')) {
    errors.push('Missing or empty title tag');
  }
}

/**
 * CSSアセット読み込みチェック
 */
function checkAssetLoading(content, errors, warnings) {
  // bundle.css読み込み確認
  if (!content.includes('bundle.css')) {
    errors.push('Missing bundle.css link');
  }
  
  // components.js読み込み確認  
  if (!content.includes('components.js')) {
    errors.push('Missing components.js script');
  }
  
  // 相対パス確認
  if (content.includes('../_assets/bundle.css') || content.includes('../_templates/components.js')) {
    // 正しい相対パス
  } else {
    warnings.push('Check CSS/JS file paths - should use relative paths from pages/generated/');
  }
}

/**
 * トークン使用チェック（アンチパターン検出）
 */
function checkTokenUsage(content, errors, warnings) {
  // 直接px指定検出
  const pxPattern = /:\s*\d+px/g;
  const pxMatches = content.match(pxPattern);
  if (pxMatches) {
    errors.push(`Direct px values found: ${pxMatches.join(', ')} - Use var(--xxx) tokens instead`);
  }
  
  // 直接カラーコード検出
  const colorPattern = /#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)/g;
  const colorMatches = content.match(colorPattern);
  if (colorMatches) {
    errors.push(`Direct color codes found: ${colorMatches.join(', ')} - Use var(--color-xxx) tokens instead`);
  }
  
  // CSSカスタムプロパティ使用確認
  if (content.includes('style=') && content.includes('var(--')) {
    // トークンを使用している
  } else if (content.includes('style=')) {
    warnings.push('Inline styles found - consider using design tokens var(--xxx)');
  }
  
  // CSS変数の存在チェック
  checkCSSVariableExists(content, errors, warnings);
}

/**
 * CSS変数の存在チェック
 */
function checkCSSVariableExists(content, errors, warnings) {
  // tokens.cssファイルを読み込む
  const tokensPath = path.join(__dirname, '../pages/_assets/tokens.css');
  if (!fs.existsSync(tokensPath)) {
    warnings.push('tokens.css not found - skipping CSS variable validation');
    return;
  }
  
  const tokensCSS = fs.readFileSync(tokensPath, 'utf8');
  
  // 定義済みCSS変数を抽出
  const tokenPattern = /--([\w-]+):/g;
  const definedTokens = new Set();
  let match;
  
  while ((match = tokenPattern.exec(tokensCSS)) !== null) {
    definedTokens.add(`--${match[1]}`);
  }
  
  // HTML内のCSS変数使用を検証
  const varPattern = /var\((--[\w-]+)\)/g;
  const undefinedVars = new Set();
  
  while ((match = varPattern.exec(content)) !== null) {
    const varName = match[1];
    if (!definedTokens.has(varName)) {
      undefinedVars.add(varName);
    }
  }
  
  // エラーとして報告
  if (undefinedVars.size > 0) {
    errors.push(`Undefined CSS variables found: ${Array.from(undefinedVars).join(', ')}`);
  }
}

/**
 * アクセシビリティチェック
 */
function checkAccessibility(content, errors, warnings) {
  // role属性確認
  if (!content.includes('role="main"')) {
    warnings.push('Consider adding role="main" to main content area');
  }
  
  // img要素のalt属性
  const imgWithoutAlt = /<img(?![^>]*alt=)[^>]*>/g;
  const imgMatches = content.match(imgWithoutAlt);
  if (imgMatches) {
    errors.push(`Images without alt attributes found: ${imgMatches.length} instances`);
  }
  
  // ボタンのaria-label
  if (content.includes('<button') && !content.includes('aria-label')) {
    warnings.push('Consider adding aria-label to buttons for better accessibility');
  }
  
  // heading構造（h1の存在）
  if (!content.includes('<h1')) {
    warnings.push('Consider adding h1 heading for document structure');
  }
}

/**
 * ボタンヒエラルキーチェック
 */
function checkButtonHierarchy(content, errors, warnings) {
  // primary/solidボタンの数をカウント
  const primarySolidPattern = /Button\([^)]*variant:\s*['"]solid['"][^)]*color:\s*['"]primary['"][^)]*\)|Button\([^)]*color:\s*['"]primary['"][^)]*variant:\s*['"]solid['"][^)]*\)/g;
  const primarySolidMatches = content.match(primarySolidPattern) || [];
  
  if (primarySolidMatches.length > 1) {
    errors.push(`Multiple primary/solid buttons found (${primarySolidMatches.length}) - Should be only one per page`);
  }
  
  if (primarySolidMatches.length === 0) {
    warnings.push('No primary/solid button found - Consider adding one for main action');
  }
}

/**
 * メイン処理
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npm run validate-page <file-path>');
    console.log('Example: npm run validate-page pages/generated/chat.html');
    process.exit(1);
  }
  
  const filePath = args[0];
  const fullPath = path.resolve(filePath);
  
  console.log('🚀 Design System Page Validator');
  console.log(`📁 Target: ${fullPath}`);
  
  const result = validateHtmlFile(fullPath);
  
  if (result.valid) {
    console.log('\n🎉 Page validation completed successfully!');
    process.exit(0);
  } else {
    console.log('\n❌ Page validation failed');
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}

module.exports = { validateHtmlFile };