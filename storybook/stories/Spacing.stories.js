import paddingTokens from '../../tokens/spacing/primitives.json';
import colorTokens from '../../tokens/colors/index.json';

// Extract padding tokens from flat structure
const paddings = {};
Object.entries(paddingTokens.spacing).forEach(([key, value]) => {
  if (key.startsWith('padding-')) {
    paddings[key.replace('padding-', '')] = value;
  }
});

export default {
  title: 'Tokens/Spacing',
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

export const SpacingTokens = (args, { globals }) => {
  const barColor = colorTokens.color.base.primary['500'].light.value;
  
  return `
  <div style="display: flex; flex-direction: column; gap: 24px; padding: 24px;">
    <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: var(--font-weight-600);">Spacing Tokens</h3>
    <div style="display: flex; flex-wrap: wrap; gap: 16px;">
      ${Object.entries(paddings).map(([key, obj]) => {
        const value = obj.value;
        const px = parseInt(value, 10);
        return `
          <div style=\"width: 220px; min-height: 60px; height: auto; background: #fff; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; border-radius: var(--radius-md); border: 1px solid rgba(238,238,238,0.1); font-size: 14px; padding: 12px;\">
            <div style=\"font-size: 13px; color: #222; margin-bottom: 4px;\">padding-${key}</div>
            <div style=\"font-size: 12px; color: #888; margin-bottom: 8px;\">${value}</div>
            <div style=\"height: 12px; width: ${px}px; background: ${barColor}; border-radius: var(--radius-sm);\"></div>
          </div>
        `;
      }).join('')}
    </div>
  </div>
  `;
};

// テーマ切り替えデコレーター
const ThemeDecorator = (Story, context) => {
  const theme = context.globals.backgrounds?.value === '#18191a' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  return Story();
};

SpacingTokens.decorators = [ThemeDecorator];