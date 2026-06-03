import colorsData from '../../tokens/colors/index.json';
import paddingTokens from '../../tokens/spacing/primitives.json';

const colors = colorsData.color.base;
const semanticColors = colorsData.color.semantic;

export default {
  title: 'tokens/Colors',
};

const colorGroups = [
  { group: 'Gray', key: 'gray' },
  { group: 'Blue', key: 'blue' },
  { group: 'Red', key: 'red' },
  { group: 'Green', key: 'green' },
  { group: 'Yellow', key: 'yellow' },
  { group: 'Orange', key: 'orange' },
  { group: 'Coral', key: 'coral' },
  { group: 'Purple', key: 'purple' },
  { group: 'Pink', key: 'pink' },
  { group: 'Cyan', key: 'cyan' },
  { group: 'Primary', key: 'primary' },
];

export const Primitives = () => {
  const steps = ['50','100','200','300','400','500','600','700','800','900'];
  // ライトカラーエリア
  const lightArea = `
    <div style="background: #fff; padding: 32px 40px; border-radius: var(--radius-lg); margin-bottom: 40px;">
      <div style="font-weight: bold; font-size: 18px; margin-left: 24px; margin-bottom: 16px; color: #222;">ライトカラー</div>
      <div style="display: flex; flex-direction: column; gap: 24px;">
        ${colorGroups.map(group => `
          <div>
            <div style="font-weight: bold; margin-bottom: 8px; color: #888; font-size: 13px; letter-spacing: 0.5px; margin-left: 12px;">
              ${group.group}
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
              ${steps.map(step => {
                const colorObj = colors[group.key]?.[step];
                const value = colorObj && colorObj.light && colorObj.light.value ? colorObj.light.value : '—';
                const textColor = getContrastTextColor(value);
                return `
                  <div style="width: 120px; min-height: 80px; background: ${value}; color: ${textColor}; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: var(--radius-md); font-size: 13px; padding: 12px 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.04);">
                    <span style='max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block;'>${group.key}-${step}</span>
                    <span style='font-size:11px;'>${value}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  // ダークカラーエリア
  const darkArea = `
    <div style="background: #18191a; padding: 32px 40px; border-radius: var(--radius-lg);">
      <div style="font-weight: bold; font-size: 18px; margin-left: 24px; margin-bottom: 16px; color: #fff;">ダークカラー</div>
      <div style="display: flex; flex-direction: column; gap: 24px;">
        ${colorGroups.map(group => `
          <div>
            <div style="font-weight: bold; margin-bottom: 8px; color: #aaa; font-size: 13px; letter-spacing: 0.5px; margin-left: 12px;">
              ${group.group}
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
              ${steps.map(step => {
                const colorObj = colors[group.key]?.[step];
                const value = colorObj && colorObj.dark && colorObj.dark.value ? colorObj.dark.value : '—';
                const textColor = getContrastTextColor(value);
                return `
                  <div style="width: 120px; min-height: 80px; background: ${value}; color: ${textColor}; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: var(--radius-md); font-size: 13px; padding: 12px 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.08);">
                    <span style='max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block;'>${group.key}-${step}</span>
                    <span style='font-size:11px;'>${value}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  return `
    <div style="display: flex; flex-direction: column; gap: 48px;">
      ${lightArea}
      ${darkArea}
    </div>
  `;
};

function resolveColor(token, theme = 'light', depth = 0) {
  if (typeof token === 'object') {
    // light/dark構造を持つ場合
    if (token.light && token.dark) {
      return resolveColor(token[theme], theme, depth);
    }
    // valueを持つ場合
    if (token.value) {
      return resolveColor(token.value, theme, depth);
    }
  }
  if (typeof token !== 'string') return token;
  if (depth > 10) return token; // 無限ループ防止

  // すでにカラーコードなら返す
  if (/^#[0-9a-fA-F]{6}$/.test(token)) return token;

  // {color.base.gray.100.light} など
  const matchBaseWithTheme = token.match(/^\{color\.base\.([a-zA-Z]+)\.(\d+)\.(light|dark)\}$/);
  if (matchBaseWithTheme) {
    const [, colorName, step, tokenTheme] = matchBaseWithTheme;
    const next = colors[colorName]?.[step]?.[tokenTheme]?.value;
    if (next) return resolveColor(next, theme, depth + 1);
    return token;
  }

  // {color.base.white.light} / {color.base.black.dark} など（数値ステップなし）
  const matchBaseNoStepWithTheme = token.match(/^\{color\.base\.([a-zA-Z]+)\.(light|dark)\}$/);
  if (matchBaseNoStepWithTheme) {
    const [, colorName, tokenTheme] = matchBaseNoStepWithTheme;
    const next = colors[colorName]?.[tokenTheme]?.value;
    if (next) return resolveColor(next, theme, depth + 1);
    return token;
  }

  // {color.semantic.neutral.100.light} など
  const matchSemanticWithTheme = token.match(/^\{color\.semantic\.([a-zA-Z]+)\.(\d+)\.(light|dark)\}$/);
  if (matchSemanticWithTheme) {
    const [, semanticName, step, tokenTheme] = matchSemanticWithTheme;
    const next = semanticColors[semanticName]?.[step]?.[tokenTheme];
    if (next) return resolveColor(next, theme, depth + 1);
    return token;
  }

  return token;
}

function getContrastTextColor(bgColor) {
  if (!bgColor || !bgColor.startsWith('#') || bgColor.length < 7) return '#222';
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0,2), 16);
  const g = parseInt(hex.substring(2,4), 16);
  const b = parseInt(hex.substring(4,6), 16);
  const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
  return luminance > 0.6 ? '#222' : '#fff';
}

const semanticColorGroups = [
  {
    group: 'Neutral',
    key: 'neutral',
    steps: ['50','100','200','300','400','500','600','700','800','900'],
  },
  {
    group: 'Primary',
    key: 'primary',
    steps: ['50','100','200','300','400','500','600','700','900'],
  },
  {
    group: 'Secondary',
    key: 'secondary',
    steps: ['50','100','200','300','400','500','600','700','800','900'],
  },
  {
    group: 'Info',
    key: 'info',
    steps: ['50','100','200','300','400','500','600','700','800','900'],
  },
  {
    group: 'Success',
    key: 'success',
    steps: ['50','100','200','300','400','500','600','700','900'],
  },
  {
    group: 'Warning',
    key: 'warning',
    steps: ['50','100','200','300','400','500','600','700','900'],
  },
  {
    group: 'Negative',
    key: 'negative',
    steps: ['50','100','200','300','400','500','600','700','900'],
  },
];

export const SemanticColors = () => {
  // ライトテーマ
  const lightArea = `
    <div style="background: #fff; padding: 32px 40px; border-radius: var(--radius-lg); margin-bottom: 40px;">
      <div style="font-weight: bold; font-size: 18px; margin-left: 24px; margin-bottom: 16px; color: #222;">セマンティックカラー（ライト）</div>
      <div style="display: flex; flex-direction: column; gap: 24px;">
        ${semanticColorGroups.map(group => `
          <div>
            <div style="font-weight: bold; margin-bottom: 8px; color: #888; font-size: 13px; letter-spacing: 0.5px; margin-left: 12px;">
              ${group.group}
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
              ${group.steps.map(step => {
                const tokenObj = semanticColors[group.key]?.[step];
                const colorValue = resolveColor(tokenObj, 'light');
                const textColor = getContrastTextColor(colorValue);
                const subTextColor = textColor === '#222' ? 'rgba(34,34,34,0.7)' : 'rgba(255,255,255,0.7)';
                return `
                  <div style="width: 120px; height: 80px; background: ${colorValue}; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); box-shadow: 0 1px 4px rgba(0,0,0,0.04); font-size: 14px;">
                    <div style="text-align: center; width: 100%;">
                      <div style="font-size: 13px; color: ${textColor};">${group.key}-${step}</div>
                      <div style="font-size: 11px; color: ${subTextColor};">${colorValue}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // ダークテーマ
  const darkArea = `
    <div style="background: #18191a; padding: 32px 40px; border-radius: var(--radius-lg);">
      <div style="font-weight: bold; font-size: 18px; margin-left: 24px; margin-bottom: 16px; color: #fff;">セマンティックカラー（ダーク）</div>
      <div style="display: flex; flex-direction: column; gap: 24px;">
        ${semanticColorGroups.map(group => `
          <div>
            <div style="font-weight: bold; margin-bottom: 8px; color: #aaa; font-size: 13px; letter-spacing: 0.5px; margin-left: 12px;">
              ${group.group}
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
              ${group.steps.map(step => {
                const tokenObj = semanticColors[group.key]?.[step];
                const colorValue = resolveColor(tokenObj, 'dark');
                const textColor = getContrastTextColor(colorValue);
                const subTextColor = textColor === '#222' ? 'rgba(34,34,34,0.7)' : 'rgba(255,255,255,0.7)';
                return `
                  <div style="width: 120px; height: 80px; background: ${colorValue}; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); box-shadow: 0 1px 4px rgba(0,0,0,0.08); font-size: 14px;">
                    <div style="text-align: center; width: 100%;">
                      <div style="font-size: 13px; color: ${textColor};">${group.key}-${step}</div>
                      <div style="font-size: 11px; color: ${subTextColor};">${colorValue}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  return `
    <div style="display: flex; flex-direction: column; gap: 48px;">
      ${lightArea}
      ${darkArea}
    </div>
  `;
};

export const DividerColors = () => {
  const lightArea = `
    <div style="background: #fff; padding: 32px 40px; border-radius: var(--radius-lg); margin-bottom: 40px;">
      <div style="font-weight: bold; font-size: 18px; margin-left: 24px; margin-bottom: 16px; color: #222;">Divider（ライト）</div>
      <div style="display: flex; flex-wrap: wrap; gap: 16px;">
        ${Object.entries(semanticColors.divider).map(([key, token]) => {
          const colorValue = resolveColor(token, 'light');
          const textColor = getContrastTextColor(colorValue);
          const subTextColor = textColor === '#222' ? 'rgba(34,34,34,0.7)' : 'rgba(255,255,255,0.7)';
          return `
            <div style="width: 180px; min-height: 60px; height: auto; background: ${colorValue}; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: var(--radius-md); box-shadow: 0 1px 4px rgba(0,0,0,0.04); font-size: 14px;">
              <div style="font-size: 13px; color: ${textColor};">divider/${key}</div>
              <div style="font-size: 11px; color: ${subTextColor};">${colorValue}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  const darkArea = `
    <div style="background: #18191a; padding: 32px 40px; border-radius: var(--radius-lg);">
      <div style="font-weight: bold; font-size: 18px; margin-left: 24px; margin-bottom: 16px; color: #fff;">Divider（ダーク）</div>
      <div style="display: flex; flex-wrap: wrap; gap: 16px;">
        ${Object.entries(semanticColors.divider).map(([key, token]) => {
          const colorValue = resolveColor(token, 'dark');
          const textColor = getContrastTextColor(colorValue);
          const subTextColor = textColor === '#222' ? 'rgba(34,34,34,0.7)' : 'rgba(255,255,255,0.7)';
          return `
            <div style="width: 180px; min-height: 60px; height: auto; background: ${colorValue}; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: var(--radius-md); box-shadow: 0 1px 4px rgba(0,0,0,0.08); font-size: 14px;">
              <div style="font-size: 13px; color: ${textColor};">divider/${key}</div>
              <div style="font-size: 11px; color: ${subTextColor};">${colorValue}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  return `
    <div style="display: flex; flex-direction: column; gap: 48px;">
      ${lightArea}
      ${darkArea}
    </div>
  `;
};

export const TextColors = () => {
  const lightArea = `
    <div style="background: #fff; padding: 32px 40px; border-radius: var(--radius-lg); margin-bottom: 40px;">
      <div style="font-weight: bold; font-size: 18px; margin-left: 24px; margin-bottom: 16px; color: #222;">Text（ライト）</div>
      <div style="display: flex; flex-wrap: wrap; gap: 16px;">
        ${Object.entries(semanticColors.text).map(([key, token]) => {
          const colorValue = resolveColor(token, 'light');
          const textColor = getContrastTextColor(colorValue);
          const subTextColor = textColor === '#222' ? 'rgba(34,34,34,0.7)' : 'rgba(255,255,255,0.7)';
          return `
            <div style="width: 180px; min-height: 90px; height: auto; background: ${colorValue}; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: var(--radius-md); box-shadow: 0 1px 4px rgba(0,0,0,0.04); font-size: 14px; padding: 16px;">
              <div style="font-size: 20px; color: ${textColor}; font-weight: bold; margin-bottom: 8px;">Aa あア亜</div>
              <div style="font-size: 13px; color: ${textColor};">text/${key}</div>
              <div style="font-size: 11px; color: ${subTextColor};">${colorValue}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  const darkArea = `
    <div style="background: #18191a; padding: 32px 40px; border-radius: var(--radius-lg);">
      <div style="font-weight: bold; font-size: 18px; margin-left: 24px; margin-bottom: 16px; color: #fff;">Text（ダーク）</div>
      <div style="display: flex; flex-wrap: wrap; gap: 16px;">
        ${Object.entries(semanticColors.text).map(([key, token]) => {
          const colorValue = resolveColor(token, 'dark');
          const textColor = getContrastTextColor(colorValue);
          const subTextColor = textColor === '#222' ? 'rgba(34,34,34,0.7)' : 'rgba(255,255,255,0.7)';
          return `
            <div style="width: 180px; min-height: 90px; height: auto; background: ${colorValue}; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: var(--radius-md); box-shadow: 0 1px 4px rgba(0,0,0,0.08); font-size: 14px; padding: 16px;">
              <div style="font-size: 20px; color: ${textColor}; font-weight: bold; margin-bottom: 8px;">Aa あア亜</div>
              <div style="font-size: 13px; color: ${textColor};">text/${key}</div>
              <div style="font-size: 11px; color: ${subTextColor};">${colorValue}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  return `
    <div style="display: flex; flex-direction: column; gap: 48px;">
      ${lightArea}
      ${darkArea}
    </div>
  `;
};

export const OverlayColors = () => {
  const steps = ['05', '15', '30'];
  const overlayGroups = [
    { group: 'Overlay Neutral', key: 'neutral' },
    { group: 'Overlay Primary', key: 'primary' },
    { group: 'Overlay Success', key: 'success' },
    { group: 'Overlay Warning', key: 'warning' },
    { group: 'Overlay Negative', key: 'negative' },
  ];

  const lightArea = `
    <div style="background: #fff; padding: 32px 40px; border-radius: var(--radius-lg); margin-bottom: 40px;">
      <div style="font-weight: bold; font-size: 18px; margin-left: 24px; margin-bottom: 16px; color: #222;">Overlay（ライト）</div>
      <div style="display: flex; flex-direction: column; gap: 24px;">
        ${overlayGroups.map(og => `
          <div>
            <div style="font-weight: bold; margin-bottom: 8px; color: #888; font-size: 13px; letter-spacing: 0.5px; margin-left: 12px;">
              ${og.group}
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
              ${steps.map(step => {
                const tokenObj = semanticColors.overlay?.[og.key]?.[step];
                const colorValue = resolveColor(tokenObj, 'light');
                return `
                  <div style="width: 180px; min-height: 60px; background: ${colorValue}; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: var(--radius-md); box-shadow: 0 1px 4px rgba(0,0,0,0.04); font-size: 14px;">
                    <div style="font-size: 13px; color: #222;">overlay/${og.key}-${step}</div>
                    <div style="font-size: 11px; color: rgba(34,34,34,0.7);">${colorValue}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  const darkArea = `
    <div style="background: #18191a; padding: 32px 40px; border-radius: var(--radius-lg);">
      <div style="font-weight: bold; font-size: 18px; margin-left: 24px; margin-bottom: 16px; color: #fff;">Overlay（ダーク）</div>
      <div style="display: flex; flex-direction: column; gap: 24px;">
        ${overlayGroups.map(og => `
          <div>
            <div style="font-weight: bold; margin-bottom: 8px; color: #aaa; font-size: 13px; letter-spacing: 0.5px; margin-left: 12px;">
              ${og.group}
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
              ${steps.map(step => {
                const tokenObj = semanticColors.overlay?.[og.key]?.[step];
                const colorValue = resolveColor(tokenObj, 'dark');
                return `
                  <div style="width: 180px; min-height: 60px; background: ${colorValue}; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: var(--radius-md); box-shadow: 0 1px 4px rgba(0,0,0,0.08); font-size: 14px;">
                    <div style="font-size: 13px; color: #fff;">overlay/${og.key}-${step}</div>
                    <div style="font-size: 11px; color: rgba(255,255,255,0.7);">${colorValue}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  return `
    <div style="display: flex; flex-direction: column; gap: 48px;">
      ${lightArea}
      ${darkArea}
    </div>
  `;
};

// Absolute White/Black の可視化
export const AbsoluteColors = () => {
  const abs = semanticColors.absolute || {};

  const lightArea = `
    <div style="background: #fff; padding: 32px 40px; border-radius: var(--radius-lg); margin-bottom: 40px;">
      <div style="font-weight: bold; font-size: 18px; margin-left: 24px; margin-bottom: 16px; color: #222;">Absolute（ライト）</div>
      <div style="display: flex; flex-wrap: wrap; gap: 16px;">
        ${['white','black'].map(name => {
          const tokenObj = abs[name];
          const colorValue = resolveColor(tokenObj, 'light');
          const textColor = getContrastTextColor(colorValue);
          const subTextColor = textColor === '#222' ? 'rgba(34,34,34,0.7)' : 'rgba(255,255,255,0.7)';
          return `
            <div style="width: 180px; min-height: 60px; background: ${colorValue}; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: var(--radius-md); box-shadow: 0 1px 4px rgba(0,0,0,0.04); font-size: 14px;">
              <div style="font-size: 13px; color: ${textColor};">absolute/${name}</div>
              <div style="font-size: 11px; color: ${subTextColor};">${colorValue}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  const darkArea = `
    <div style="background: #18191a; padding: 32px 40px; border-radius: var(--radius-lg);">
      <div style="font-weight: bold; font-size: 18px; margin-left: 24px; margin-bottom: 16px; color: #fff;">Absolute（ダーク）</div>
      <div style="display: flex; flex-wrap: wrap; gap: 16px;">
        ${['white','black'].map(name => {
          const tokenObj = abs[name];
          const colorValue = resolveColor(tokenObj, 'dark');
          const textColor = getContrastTextColor(colorValue);
          const subTextColor = textColor === '#222' ? 'rgba(34,34,34,0.7)' : 'rgba(255,255,255,0.7)';
          return `
            <div style="width: 180px; min-height: 60px; background: ${colorValue}; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: var(--radius-md); box-shadow: 0 1px 4px rgba(0,0,0,0.08); font-size: 14px;">
              <div style="font-size: 13px; color: ${textColor};">absolute/${name}</div>
              <div style="font-size: 11px; color: ${subTextColor};">${colorValue}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  return `
    <div style="display: flex; flex-direction: column; gap: 48px;">
      ${lightArea}
      ${darkArea}
    </div>
  `;
};

// ブランドカラー（Main / Sub）
export const BrandColors = () => {
  const brand = semanticColors.brand || {};
  const primaryColor = colors.primary?.['400'];

  const brandItems = [
    { 
      name: 'Main', 
      key: 'brand/main',
      light: brand.main?.light?.value || '#AEF5D1',
      dark: brand.main?.dark?.value || '#7BDDB0'
    },
    { 
      name: 'Sub (Primary-400)', 
      key: 'primary-400',
      light: primaryColor?.light?.value || '#ad95fb',
      dark: primaryColor?.dark?.value || '#9162fa'
    },
    { 
      name: 'Black', 
      key: 'brand/black',
      light: resolveColor(brand.black, 'light') || '#18191b',
      dark: resolveColor(brand.black, 'dark') || '#fafcfd'
    },
    { 
      name: 'Gray', 
      key: 'brand/gray',
      light: resolveColor(brand.gray, 'light') || '#f5f7f8',
      dark: resolveColor(brand.gray, 'dark') || '#232527'
    }
  ];

  const lightArea = `
    <div style="background: #fff; padding: 32px 40px; border-radius: var(--radius-lg); margin-bottom: 40px;">
      <div style="font-weight: bold; font-size: 18px; margin-left: 24px; margin-bottom: 16px; color: #222;">Brand Colors（ライト）</div>
      <div style="display: flex; flex-wrap: wrap; gap: 24px;">
        ${brandItems.map(item => {
          const textColor = getContrastTextColor(item.light);
          const subTextColor = textColor === '#222' ? 'rgba(34,34,34,0.7)' : 'rgba(255,255,255,0.7)';
          return `
            <div style="width: 200px; min-height: 100px; background: ${item.light}; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: var(--radius-md); box-shadow: 0 2px 8px rgba(0,0,0,0.08); font-size: 14px; padding: 16px;">
              <div style="font-size: 15px; font-weight: bold; color: ${textColor}; margin-bottom: 4px;">${item.name}</div>
              <div style="font-size: 12px; color: ${subTextColor};">${item.key}</div>
              <div style="font-size: 12px; color: ${subTextColor}; margin-top: 4px;">${item.light}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  const darkArea = `
    <div style="background: #18191a; padding: 32px 40px; border-radius: var(--radius-lg);">
      <div style="font-weight: bold; font-size: 18px; margin-left: 24px; margin-bottom: 16px; color: #fff;">Brand Colors（ダーク）</div>
      <div style="display: flex; flex-wrap: wrap; gap: 24px;">
        ${brandItems.map(item => {
          const textColor = getContrastTextColor(item.dark);
          const subTextColor = textColor === '#222' ? 'rgba(34,34,34,0.7)' : 'rgba(255,255,255,0.7)';
          return `
            <div style="width: 200px; min-height: 100px; background: ${item.dark}; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: var(--radius-md); box-shadow: 0 2px 8px rgba(0,0,0,0.15); font-size: 14px; padding: 16px;">
              <div style="font-size: 15px; font-weight: bold; color: ${textColor}; margin-bottom: 4px;">${item.name}</div>
              <div style="font-size: 12px; color: ${subTextColor};">${item.key}</div>
              <div style="font-size: 12px; color: ${subTextColor}; margin-top: 4px;">${item.dark}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  return `
    <div style="display: flex; flex-direction: column; gap: 48px;">
      ${lightArea}
      ${darkArea}
    </div>
  `;
};