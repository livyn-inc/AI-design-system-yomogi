import shadowTokens from '../../tokens/shadow/primitives.json';
import colorTokens from '../../tokens/colors/index.json';

// Extract boxShadow tokens from flat structure
const boxShadows = {};
Object.entries(shadowTokens.shadow).forEach(([key, value]) => {
  if (key.startsWith('boxShadow-')) {
    boxShadows[key.replace('boxShadow-', '')] = value;
  }
});

export default {
  title: 'tokens/Shadow',
  parameters: {
    backgrounds: {
      default: 'Light',
      values: [
        { name: 'Light', value: '#ffffff' },
        { name: 'Dark', value: '#18191a' }
      ]
    }
  }
};

export const ShadowTokens = (args, { globals }) => {
  // テーマに応じた色とshadowを設定
  const bgValue = globals.backgrounds?.value;
  const isLight = bgValue !== '#18191a'; // ダークモード以外はすべてライトとして扱う
  const textColor = isLight ? colorTokens.color.base.gray['900'].light.value : colorTokens.color.base.gray['50'].dark.value;
  const labelColor = isLight ? colorTokens.color.base.gray['600'].light.value : colorTokens.color.base.gray['400'].dark.value;
  const valueColor = isLight ? colorTokens.color.base.gray['400'].light.value : colorTokens.color.base.gray['600'].dark.value;
  const borderColor = isLight ? colorTokens.color.base.gray['200'].light.value : colorTokens.color.base.gray['200'].dark.value;
  const cardBg = isLight ? colorTokens.color.base.gray['50'].light.value : colorTokens.color.base.gray['200'].dark.value;
  
  return `
    <div style="padding: 24px;">
      <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">Box Shadow Tokens</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 24px; align-items: start;">
        ${Object.entries(boxShadows)
          .map(
            ([key, obj]) => {
              const shadowValue = isLight ? obj.light?.value : obj.dark?.value;
              return `
                <div style="display: flex; flex-direction: column; align-items: center; padding: 16px 24px; border-radius: var(--radius-md); background: ${isLight ? 'transparent' : colorTokens.color.base.gray['100'].dark.value}; border: 1px solid ${borderColor};">
                  <div style="width: 80px; height: 60px; border-radius: var(--radius-md); box-shadow: ${shadowValue}; margin-bottom: 16px; background: ${cardBg};"></div>
                  <div style="font-size: 14px; font-weight: var(--font-weight-600); color: ${labelColor}; margin-bottom: 8px; text-align: center;">boxShadow-${key}</div>
                  <div style="font-size: 12px; color: ${valueColor}; text-align: center; word-break: break-all; line-height: 1.4; max-width: 100%;">${shadowValue}</div>
                </div>
              `;
            }
          )
          .join('')}
      </div>
    </div>
  `;
};

// テーマ切り替えデコレーター
const ThemeDecorator = (Story, context) => {
  const bgValue = context.globals.backgrounds?.value || '#ffffff';
  const theme = (bgValue === '#18191a') ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  // CSS変数も明示的に設定
  document.documentElement.style.setProperty('--color-text', theme === 'dark' ? '#ffffff' : '#333333');
  console.log('Shadow ThemeDecorator:', { bgValue, theme });
  
  // 強制的にライトテーマのスタイルを適用
  setTimeout(() => {
    if (theme === 'light') {
      const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, td, th');
      elements.forEach(el => {
        el.style.color = '#333333';
      });
    }
  }, 0);
  
  return Story();
};

ShadowTokens.decorators = [ThemeDecorator];