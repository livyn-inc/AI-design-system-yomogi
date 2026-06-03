import '../../components/button/Button.css';
import { Button } from '../../components/button/Button.js';
import './_matrix.css';

export default {
  title: 'components/Button',
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

// サンプル用アイコン（SVG）
const leftIcon = '<svg width="16" height="16" fill="currentColor"><circle cx="8" cy="8" r="7"/></svg>';
const rightIcon = '<svg width="16" height="16" fill="currentColor"><path d="M4 8h8M8 4l4 4-4 4"/></svg>';

// バリエーション一覧
const variants = ['solid', 'outline', 'ghost', 'outline-solid', 'ghost-solid'];
const sizes = ['sm', 'md', 'lg'];
const colors = ['primary', 'neutral', 'negative', 'absolute-white', 'absolute-black'];

// 概要 - 代表的なパターンのみ
export const Overview = () => `
  <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">
    <div>
      <h3 style="margin: 0 0 16px 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">Button Overview</h3>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        ${Button({ variant: 'solid', color: 'primary', label: 'プライマリ' })}
        ${Button({ variant: 'outline', color: 'primary', label: 'アウトライン' })}
        ${Button({ variant: 'ghost', color: 'primary', label: 'ゴースト' })}
        ${Button({ variant: 'solid', color: 'primary', label: 'アイコン付き', leftIcon, rightIcon })}
      </div>
    </div>
    <div>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        ${Button({ variant: 'solid', color: 'neutral', label: 'ニュートラル' })}
        ${Button({ variant: 'outline', color: 'neutral', label: 'アウトライン' })}
        ${Button({ variant: 'ghost', color: 'neutral', label: 'ゴースト' })}
        ${Button({ variant: 'solid', color: 'neutral', label: 'アイコン付き', leftIcon, rightIcon })}
      </div>
    </div>
    <div>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        ${Button({ variant: 'solid', color: 'negative', label: 'ネガティブ' })}
        ${Button({ variant: 'outline', color: 'negative', label: 'アウトライン' })}
        ${Button({ variant: 'ghost', color: 'negative', label: 'ゴースト' })}
        ${Button({ variant: 'solid', color: 'negative', label: 'アイコン付き', leftIcon, rightIcon })}
      </div>
    </div>
    
    <div>
      <h3 style="margin: 0 0 16px 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">Absolute Colors (特殊背景用)</h3>
      
      <!-- Warning背景上 -->
      <div style="background: var(--color-semantic-warning-500-light); padding: 16px; border-radius: var(--radius-lg); margin-bottom: 16px;">
        <p style="margin: 0 0 12px 0; font-size: var(--font-size-14); color: var(--color-semantic-text-high-light); font-weight: var(--font-weight-600);">Warning背景（黄色）上で使用（黒系ボタン）</p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
          ${Button({ variant: 'solid', color: 'absolute-black', size: 'sm', label: 'Solid' })}
          ${Button({ variant: 'outline', color: 'absolute-black', size: 'sm', label: 'Outline' })}
          ${Button({ variant: 'ghost', color: 'absolute-black', size: 'sm', label: 'Ghost' })}
        </div>
      </div>
      
      <!-- Critical背景上 -->
      <div style="background: var(--color-semantic-negative-500-light); padding: 16px; border-radius: var(--radius-lg); margin-bottom: 16px;">
        <p style="margin: 0 0 12px 0; font-size: var(--font-size-14); color: var(--color-semantic-text-high-light); font-weight: var(--font-weight-600);">Critical背景（赤色）上で使用（黒系ボタン）</p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
          ${Button({ variant: 'solid', color: 'absolute-black', size: 'sm', label: 'Solid' })}
          ${Button({ variant: 'outline', color: 'absolute-black', size: 'sm', label: 'Outline' })}
          ${Button({ variant: 'ghost', color: 'absolute-black', size: 'sm', label: 'Ghost' })}
        </div>
      </div>
      
      <!-- 白背景上 -->
      <div style="background: var(--color-semantic-absolute-white-light); padding: 16px; border-radius: var(--radius-lg); border: 1px solid var(--color-semantic-neutral-300-light); margin-bottom: 16px;">
        <p style="margin: 0 0 12px 0; font-size: var(--font-size-14); color: var(--color-semantic-text-high-light); font-weight: var(--font-weight-600);">White背景上で使用（黒系ボタン）</p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
          ${Button({ variant: 'solid', color: 'absolute-black', size: 'sm', label: 'Solid' })}
          ${Button({ variant: 'outline', color: 'absolute-black', size: 'sm', label: 'Outline' })}
          ${Button({ variant: 'ghost', color: 'absolute-black', size: 'sm', label: 'Ghost' })}
        </div>
      </div>
      
      <!-- 黒背景上 -->
      <div style="background: var(--color-semantic-absolute-black-light); padding: 16px; border-radius: var(--radius-lg);">
        <p style="margin: 0 0 12px 0; font-size: var(--font-size-14); color: var(--color-semantic-absolute-white-light); font-weight: var(--font-weight-600);">Black背景上で使用（白系ボタン）</p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
          ${Button({ variant: 'solid', color: 'absolute-white', size: 'sm', label: 'Solid' })}
          ${Button({ variant: 'outline', color: 'absolute-white', size: 'sm', label: 'Outline' })}
          ${Button({ variant: 'ghost', color: 'absolute-white', size: 'sm', label: 'Ghost' })}
        </div>
      </div>
    </div>
  </div>
`;

// 透過/非透過バリアント比較
export const TransparencyComparison = () => `
  <div style="padding: 24px;">
    <h3 style="margin: 0 0 24px 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">透過/非透過バリアント比較</h3>
    
    <!-- 複雑な背景での確認用 -->
    <div style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4); padding: 24px; border-radius: 8px; margin-bottom: 24px;">
      <h4 style="color: white; margin: 0 0 16px 0;">透過バリアント（背景が透ける）</h4>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center; margin-bottom: 16px;">
        ${Button({ variant: 'outline', color: 'primary', label: 'Outline' })}
        ${Button({ variant: 'ghost', color: 'primary', label: 'Ghost' })}
        ${Button({ variant: 'outline', color: 'neutral', label: 'Outline Neutral' })}
        ${Button({ variant: 'ghost', color: 'neutral', label: 'Ghost Neutral' })}
      </div>
      
      <h4 style="color: white; margin: 16px 0 16px 0;">非透過バリアント（背景が透けない）</h4>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        ${Button({ variant: 'outline-solid', color: 'primary', label: 'Outline-Solid' })}
        ${Button({ variant: 'ghost-solid', color: 'primary', label: 'Ghost-Solid' })}
        ${Button({ variant: 'outline-solid', color: 'neutral', label: 'Outline-Solid Neutral' })}
        ${Button({ variant: 'ghost-solid', color: 'neutral', label: 'Ghost-Solid Neutral' })}
      </div>
    </div>
    
    <!-- 通常背景での比較 -->
    <div style="background: var(--color-semantic-neutral-50-light); padding: 24px; border-radius: 8px;">
      <h4 style="margin: 0 0 16px 0;">通常背景での表示</h4>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        ${Button({ variant: 'outline', color: 'primary', label: 'Outline' })}
        ${Button({ variant: 'outline-solid', color: 'primary', label: 'Outline-Solid' })}
        ${Button({ variant: 'ghost', color: 'primary', label: 'Ghost' })}
        ${Button({ variant: 'ghost-solid', color: 'primary', label: 'Ghost-Solid' })}
      </div>
    </div>
  </div>
`;

// Complete Matrix (Color × Variant × Size × State)
export const CompleteMatrix = () => {
  const variantLabels = { solid: 'Solid', outline: 'Outline', ghost: 'Ghost', 'outline-solid': 'Outline-Solid', 'ghost-solid': 'Ghost-Solid' };
  const colorLabels = { primary: 'Primary', neutral: 'Neutral', negative: 'Negative', 'absolute-white': 'Absolute White', 'absolute-black': 'Absolute Black' };
  const sizeLabels = { sm: 'sm', md: 'md', lg: 'lg' };
  const stateLabels = { enable: 'Enable', hover: 'Hover', active: 'Active', loading: 'Loading', disabled: 'Disabled' };
  const states = ['enable', 'hover', 'active', 'loading', 'disabled'];
  
  return `
    <div class="ds-matrix" style="padding: var(--spacing-padding-24);">
      <h4>Complete Matrix (Color × Variant × Size × State)</h4>
      <table>
        <thead>
          <tr>
            <th rowspan="2">Color</th>
            <th rowspan="2">State</th>
            ${variants.map(variant => 
              `<th colspan="${sizes.length}">${variantLabels[variant]}</th>`
            ).join('')}
          </tr>
          <tr>
            ${variants.map((variant, vIndex) => 
              sizes.map((size, sIndex) => 
                `<th style="border-top: 1px solid var(--color-semantic-divider-high-light);${sIndex === 0 ? ' border-left: 1px solid var(--color-semantic-divider-high-light);' : ''}">${sizeLabels[size]}</th>`
              ).join('')
            ).join('')}
          </tr>
        </thead>
        <tbody>
          ${colors.map(color => 
            states.map((state, stateIndex) => `
              <tr>
                ${stateIndex === 0 ? `<td rowspan="${states.length}" data-cell="label" style="writing-mode: vertical-lr; text-orientation: mixed;">${colorLabels[color]}</td>` : ''}
                <td data-cell="label" style="border-left: 1px solid var(--color-semantic-divider-high-light);">${stateLabels[state]}</td>
                ${variants.map(variant => 
                  sizes.map(size => {
                    let buttonProps = { variant, color, size, label: 'ラベル', state };
                    if (state === 'loading') buttonProps.loading = true;
                    if (state === 'disabled') buttonProps.disabled = true;
                    
                    return `<td style="text-align: center;">${Button(buttonProps)}</td>`;
                  }).join('')
                ).join('')}
              </tr>
            `).join('')
          ).join('')}
        </tbody>
      </table>
    </div>
  `;
};


// テーマ切り替えデコレーター
const ThemeDecorator = (Story, context) => {
  const theme = context.globals.backgrounds?.value === '#18191a' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  // テーマに応じてCSS変数を設定
  document.documentElement.style.setProperty('--color-text', theme === 'dark' ? '#ffffff' : '#333333');
  return Story();
};

// 全ストーリーにテーマデコレーターを適用
Overview.decorators = [ThemeDecorator];
TransparencyComparison.decorators = [ThemeDecorator];
CompleteMatrix.decorators = [ThemeDecorator];