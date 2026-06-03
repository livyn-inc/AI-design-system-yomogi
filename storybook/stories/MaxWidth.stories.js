import maxWidthTokens from '../../tokens/layout/primitives.json';
import colorTokens from '../../tokens/colors/index.json';

// Extract maxWidth tokens from flat structure
const maxWidths = {};
Object.entries(maxWidthTokens.layout).forEach(([key, value]) => {
  if (key.startsWith('maxWidth-')) {
    maxWidths[key.replace('maxWidth-', '')] = value;
  }
});

export default {
  title: 'tokens/MaxWidth',
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

export const MaxWidthTokens = (args, { globals }) => {
  // テーマに応じた色を設定
  const bgValue = globals.backgrounds?.value;
  const isLight = bgValue !== '#18191a'; // ダークモード以外はすべてライトとして扱う
  const textColor = isLight ? colorTokens.color.base.gray['900'].light.value : colorTokens.color.base.gray['100'].light.value;
  const borderColor = isLight ? colorTokens.color.base.gray['200'].light.value : colorTokens.color.base.gray['200'].dark.value;
  const barColor = colorTokens.color.base.primary['500'].light.value;
  
  const data = Object.entries(maxWidths);
  const rows = data.map(([key, obj]) => `
    <tr>
      <td style="padding:12px 16px;min-width:160px;color:${textColor};font-size:13px;">max-width/${key}</td>
      <td style="padding:12px 16px;color:${textColor};font-size:12px;">${obj.value}</td>
      <td style="padding:12px 16px;color:${textColor};font-size:12px;">${parseInt(obj.value, 10) / 16}rem</td>
      <td style="padding:12px 16px;">
        <div style="background:${barColor};height:12px;width:${obj.value};border-radius:var(--radius-sm);"></div>
      </td>
    </tr>
  `).join('');
  return `
    <div style="padding: 24px;">
      <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">Max Width Tokens</h3>
      <table style="border-collapse:collapse;min-width:480px;width:100%;border:1px solid ${borderColor};border-radius:var(--radius-md);overflow:hidden;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px 16px;min-width:160px;color:${textColor};border-bottom:1px solid ${borderColor};font-size:13px;">Name</th>
            <th style="text-align:left;padding:8px 16px;color:${textColor};border-bottom:1px solid ${borderColor};font-size:13px;">Value</th>
            <th style="text-align:left;padding:8px 16px;color:${textColor};border-bottom:1px solid ${borderColor};font-size:13px;">rem</th>
            <th style="text-align:left;padding:8px 16px;color:${textColor};border-bottom:1px solid ${borderColor};font-size:13px;">Example</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
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
  console.log('MaxWidth ThemeDecorator:', { bgValue, theme });
  
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

MaxWidthTokens.decorators = [ThemeDecorator];