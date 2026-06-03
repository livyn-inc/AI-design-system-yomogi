import fontTokens from '../../tokens/font/primitives.json';
import colorTokens from '../../tokens/colors/index.json';

const fontData = fontTokens.font;
// Extract different categories
const families = {};
const weights = { char: {}, icon: {}, numeric: {} };
const sizes = {};
const lineHeights = {};
const letterSpacings = {};

// Parse the flat structure
Object.entries(fontData).forEach(([key, value]) => {
  if (key.startsWith('family-')) {
    families[key.replace('family-', '')] = value;
  } else if (key.startsWith('weight-char-')) {
    weights.char[key.replace('weight-char-', '')] = value;
  } else if (key.startsWith('weight-icon-')) {
    weights.icon[key.replace('weight-icon-', '')] = value;
  } else if (key.match(/^weight-\d+$/)) {
    // 新しい数値ベースのweight-300, weight-400等
    weights.numeric[key.replace('weight-', '')] = value;
  } else if (key.startsWith('size-')) {
    sizes[key.replace('size-', '')] = value;
  } else if (key.startsWith('lineHeight-')) {
    lineHeights[key.replace('lineHeight-', '')] = value;
  } else if (key.startsWith('letterSpacing-')) {
    letterSpacings[key.replace('letterSpacing-', '')] = value;
  }
});

export default {
  title: 'tokens/Font',
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

export const FontTokens = (args, { globals }) => {
  // テーマに応じた色とパディングを取得
  const bgValue = globals.backgrounds?.value;
  const isLight = bgValue !== '#18191a'; // ダークモード以外はすべてライトとして扱う
  const colors = isLight ? {
    bg: colorTokens.color.base.gray['50'].light.value,
    border: colorTokens.color.base.gray['200'].light.value,
    rowBorder: colorTokens.color.base.gray['200'].light.value,
    text: colorTokens.color.base.gray['900'].light.value,
    headerBg: colorTokens.color.base.gray['50'].light.value,
    headerText: colorTokens.color.base.gray['900'].light.value,
    sample: colorTokens.color.base.gray['900'].light.value,
  } : {
    bg: colorTokens.color.base.gray['900'].dark.value,
    border: colorTokens.color.base.gray['200'].dark.value,
    rowBorder: colorTokens.color.base.gray['200'].dark.value,
    text: colorTokens.color.base.gray['100'].light.value,
    headerBg: colorTokens.color.base.gray['800'].dark.value,
    headerText: colorTokens.color.base.gray['100'].light.value,
    sample: colorTokens.color.base.gray['100'].light.value,
  };
  const paddings = {
    cell: '8px 16px', // padding-8, padding-16
    header: '10px 16px', // padding-10(近似) padding-16
  };

  // テーブルスタイル
  const tableStyle = `margin-bottom:24px; border-radius:var(--radius-md); border:1px solid ${colors.border}; width:100%; border-collapse:separate; border-spacing:0; table-layout:fixed; overflow:hidden;`;
  const thStyle = `text-align:left; vertical-align:middle; padding:${paddings.header}; color:${colors.headerText}; font-weight:bold; width:33%; border-bottom:1px solid ${colors.rowBorder}; background:none;`;
  const tdStyle = `text-align:left; vertical-align:middle; padding:${paddings.cell}; color:${colors.text}; width:33%; border-bottom:1px solid ${colors.rowBorder}; border:none; background:none;`;
  const sampleStyle = `color:${colors.sample};`;

  // letter-spacingの値をCSS用に変換
  const getLetterSpacingCss = (v) => {
    if (typeof v === 'string' && v.endsWith('%')) {
      return (parseFloat(v) / 100) + 'em';
    }
    return v;
  };

  // 角丸はテーブル外枠のみ
  const getTdRadius = () => '';

  // テーブル行生成（罫線のみで区切る）
  const renderRows = (arr, sampleCss) =>
    arr.map(([k, obj]) =>
      `<tr>
        <td style='${tdStyle}${getTdRadius()}'>${k}</td>
        <td style='${tdStyle}${getTdRadius()}'>${obj.value}</td>
        <td style='${tdStyle}${getTdRadius()} ${sampleCss(obj.value)}'>Ag</td>
      </tr>`
    ).join('');

  // LetterSpacingだけサンプルテキストを長文に
  const renderLetterSpacingRows = (arr) =>
    arr.map(([k, obj]) =>
      `<tr>
        <td style='${tdStyle}${getTdRadius()}'>${k}</td>
        <td style='${tdStyle}${getTdRadius()}'>${obj.value}</td>
        <td style='${tdStyle}${getTdRadius()} letter-spacing:${getLetterSpacingCss(obj.value)}; ${sampleStyle}'>これはサンプルの文章です</td>
      </tr>`
    ).join('');

  return `
    <div style="display: flex; flex-direction: column; gap: 32px;">
      <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 18px; letter-spacing: 0.5px;">Font Family</h3>
      <table style='${tableStyle}'>
        <tr><th style='${thStyle}'>Name</th><th style='${thStyle}'>Value</th><th style='${thStyle}'>Sample</th></tr>
        ${renderRows(Object.entries(families), v => `font-family:${v}; ${sampleStyle}`)}
      </table>
      <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 18px; letter-spacing: 0.5px;">Font Weight</h3>
      <table style='${tableStyle}'>
        <tr><th style='${thStyle}'>Name</th><th style='${thStyle}'>Value</th><th style='${thStyle}'>Sample</th></tr>
        ${Object.entries(weights).flatMap(([group, groupObj]) => {
          if (group === 'numeric') {
            // 数値ベースのweightは数値順でソート
            return Object.entries(groupObj)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([key, obj]) => [key, obj]);
          } else {
            // 既存のchar, iconは従来通り
            return Object.entries(groupObj).map(([key, obj]) => [group + '-' + key, obj]);
          }
        }).map(([k, obj]) =>
          `<tr>
            <td style='${tdStyle}${getTdRadius()}'>${k}</td>
            <td style='${tdStyle}${getTdRadius()}'>${obj.value}</td>
            <td style='${tdStyle}${getTdRadius()} font-weight:${obj.value}; ${sampleStyle}'>Ag</td>
          </tr>`
        ).join('')}
      </table>
      <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 18px; letter-spacing: 0.5px;">Font Size</h3>
      <table style='${tableStyle}'>
        <tr><th style='${thStyle}'>Name</th><th style='${thStyle}'>Value</th><th style='${thStyle}'>Sample</th></tr>
        ${renderRows(Object.entries(sizes), v => `font-size:${v}; ${sampleStyle}`)}
      </table>
      <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 18px; letter-spacing: 0.5px;">Line Height</h3>
      <table style='${tableStyle}'>
        <tr><th style='${thStyle}'>Name</th><th style='${thStyle}'>Value</th><th style='${thStyle}'>Sample</th></tr>
        ${Object.entries(lineHeights).map(([k, obj]) =>
          `<tr>
            <td style='${tdStyle}${getTdRadius()}'>${k}</td>
            <td style='${tdStyle}${getTdRadius()}'>${obj.value}px</td>
            <td style='${tdStyle}${getTdRadius()} line-height:${obj.value}px; ${sampleStyle} position:relative; background: repeating-linear-gradient(transparent, transparent ${obj.value-1}px, rgba(128, 128, 128, 0.3) ${obj.value-1}px, rgba(128, 128, 128, 0.3) ${obj.value}px);'>あのイーハトーヴォの<br>すきとおった風、<br>夏でも底に冷たさを</td>
          </tr>`
        ).join('')}
      </table>
      <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 18px; letter-spacing: 0.5px;">Letter Spacing</h3>
      <table style='${tableStyle}'>
        <tr><th style='${thStyle}'>Name</th><th style='${thStyle}'>Value</th><th style='${thStyle}'>Sample</th></tr>
        ${renderLetterSpacingRows(Object.entries(letterSpacings))}
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
  console.log('Font ThemeDecorator:', { bgValue, theme });
  
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

FontTokens.decorators = [ThemeDecorator];