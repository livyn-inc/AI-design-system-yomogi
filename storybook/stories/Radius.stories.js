import radiusTokens from '../../tokens/radius/primitives.json';

const radii = radiusTokens.radius;

export default {
  title: 'Tokens/Radius',
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

export const RadiusTokens = () => `
  <div style="padding: 24px;">
    <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: var(--font-weight-600);">Border Radius Tokens</h3>
    <div style="display: flex; flex-wrap: wrap; gap: 24px;">
      ${Object.entries(radii)
      .map(
        ([key, obj]) => `
          <div style="display: flex; flex-direction: column; align-items: center; width: 220px;">
            <div style="width: 192px; height: 144px; border-radius: ${obj.value}; background: #eee; margin-bottom: 8px;"></div>
            <div style="font-size: 13px; color: #888;">radius-${key}</div>
            <div style="font-size: 12px; color: #aaa;">${obj.value}</div>
          </div>
        `
        )
        .join('')}
    </div>
  </div>
`;

// テーマ切り替えデコレーター
const ThemeDecorator = (Story, context) => {
  const theme = context.globals.backgrounds?.value === '#18191a' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  return Story();
};

RadiusTokens.decorators = [ThemeDecorator];