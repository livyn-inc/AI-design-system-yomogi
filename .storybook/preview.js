import '../build/css/tokens.css';

// テーマ設定関数
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

// 背景色をチェックしてテーマを設定
function checkAndSetTheme() {
  // Storybookのプレビューエリア内の要素を探す
  const previewBody = document.body;
  const computedStyle = window.getComputedStyle(previewBody);
  const backgroundColor = computedStyle.backgroundColor;
  
  
  // 背景色からテーマを判定
  if (backgroundColor === 'rgb(24, 25, 26)') {
    if (document.documentElement.getAttribute('data-theme') !== 'dark') {
      setTheme('dark');
    }
  } else if (backgroundColor === 'rgb(255, 255, 255)' || backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor.startsWith('rgba(255, 255, 255')) {
    if (document.documentElement.getAttribute('data-theme') !== 'light') {
      setTheme('light');
    }
  }
}

// 初期設定とポーリング
function setupThemeSync() {
  // デフォルトでlightテーマを設定
  setTheme('light');
  
  // TokenページはThemeDecoratorに依存するため、ポーリングを制限
  const currentPath = window.location.href;
  const isTokenPage = currentPath.includes('tokens-');
  
  if (!isTokenPage) {
    // 初期チェック
    checkAndSetTheme();
    
    // 定期的にチェック（500msごと）
    setInterval(checkAndSetTheme, 500);
    
    // Storybookのツールバーボタンのクリックも監視
    document.addEventListener('click', (e) => {
      // ツールバーのボタンクリック後に少し待ってからチェック
      setTimeout(checkAndSetTheme, 100);
    });
  }
}

// DOM読み込み完了後に実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupThemeSync);
} else {
  // すでに読み込み済みの場合は少し待ってから実行
  setTimeout(setupThemeSync, 100);
}

// テーマ対応のグローバルCSS
const style = document.createElement('style');
style.textContent = `
  /* ライトモードのヘッダー色 */
  [data-theme="light"] h1, 
  [data-theme="light"] h2, 
  [data-theme="light"] h3, 
  [data-theme="light"] h4, 
  [data-theme="light"] h5, 
  [data-theme="light"] h6 { 
    color: var(--color-semantic-text-high-light) !important; 
  }
  
  /* ダークモードのヘッダー色 */
  [data-theme="dark"] h1, 
  [data-theme="dark"] h2, 
  [data-theme="dark"] h3, 
  [data-theme="dark"] h4:not(.ds-alert__title), 
  [data-theme="dark"] h5, 
  [data-theme="dark"] h6 { 
    color: var(--color-semantic-text-high-dark) !important; 
  }
  
`;
document.head.appendChild(style);


export const parameters = {
  backgrounds: {
    default: 'Light',
    values: [
      { name: 'Light', value: '#ffffff' },
      { name: 'Dark', value: '#18191a' }
    ],
  },
};