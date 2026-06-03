import '../../components/button/Button.css';
import '../../components/icon-button/IconButton.css';
import './_matrix.css';
import { renderMatrix } from './_matrix.js';
import { IconButton } from '../../components/icon-button/IconButton.js';

export default {
  title: 'components/IconButton',
};

const closeSvg = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 1 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4z"/></svg>';
const infoSvg = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M11 9h2V7h-2v2zm0 8h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>';
const checkSvg = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M9 16.2l-3.5-3.5L4 14.2 9 19l12-12-1.5-1.5z"/></svg>';
const warnSvg = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2V9h2v5z"/></svg>';
const trashSvg = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1z"/></svg>';

export const Overview = () => `
  <div style="
    max-width: var(--layout-max-width-5xl);
    margin: 0 auto;
    padding: var(--spacing-padding-32);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-padding-24);
  ">
    <h3 style="margin: 0; font-size: var(--font-size-20);">IconButton Overview</h3>

    <section>
      <div style="font-weight: var(--font-weight-600); margin-bottom: var(--spacing-padding-8);">Sizes</div>
      <div style="display:flex; gap: var(--spacing-padding-16); align-items: center;">
        ${IconButton({ icon: closeSvg, size: 'sm', variant: 'ghost', color: 'neutral', ariaLabel: '閉じる' })}
        ${IconButton({ icon: closeSvg, size: 'md', variant: 'ghost', color: 'neutral', ariaLabel: '閉じる' })}
        ${IconButton({ icon: closeSvg, size: 'lg', variant: 'ghost', color: 'neutral', ariaLabel: '閉じる' })}
      </div>
    </section>
  </div>
`;

export const Variations = () => `
  <div style="display:flex; flex-direction: column; gap: 16px;">
    <div style="display:flex; gap: 16px; align-items: center;">
      ${IconButton({ icon: closeSvg, variant: 'solid', color: 'primary', ariaLabel: '閉じる' })}
      ${IconButton({ icon: infoSvg,  variant: 'outline', color: 'primary', ariaLabel: '情報' })}
      ${IconButton({ icon: checkSvg, variant: 'ghost',  color: 'primary', ariaLabel: '決定' })}
    </div>
    <div style="display:flex; gap: 16px; align-items: center;">
      ${IconButton({ icon: closeSvg, variant: 'solid', color: 'neutral', ariaLabel: '閉じる' })}
      ${IconButton({ icon: warnSvg,  variant: 'outline', color: 'neutral', ariaLabel: '注意' })}
      ${IconButton({ icon: infoSvg,  variant: 'ghost',  color: 'neutral', ariaLabel: '情報' })}
    </div>
    <div style="display:flex; gap: 16px; align-items: center;">
      ${IconButton({ icon: trashSvg, variant: 'solid', color: 'negative', ariaLabel: '削除' })}
      ${IconButton({ icon: warnSvg,  variant: 'outline', color: 'negative', ariaLabel: '警告' })}
      ${IconButton({ icon: closeSvg, variant: 'ghost',  color: 'negative', ariaLabel: '閉じる' })}
    </div>
    
    <div style="margin-top: 24px;">
      <h4 style="margin: 0 0 12px 0; font-size: var(--font-size-16); font-weight: var(--font-weight-600);">Absolute Colors（特殊背景用）</h4>
      
      <!-- Warning背景上 -->
      <div style="background: var(--color-semantic-warning-500-light); padding: 12px; border-radius: var(--radius-md); margin-bottom: 12px; display: flex; gap: 12px; align-items: center;">
        <span style="font-size: var(--font-size-14); color: var(--color-semantic-text-high-light); font-weight: var(--font-weight-600); margin-right: 8px;">Warning背景:</span>
        ${IconButton({ icon: closeSvg, variant: 'solid', color: 'absolute-black', size: 'sm', ariaLabel: '閉じる' })}
        ${IconButton({ icon: closeSvg, variant: 'outline', color: 'absolute-black', size: 'sm', ariaLabel: '閉じる' })}
        ${IconButton({ icon: closeSvg, variant: 'ghost', color: 'absolute-black', size: 'sm', ariaLabel: '閉じる' })}
      </div>
      
      <!-- Black背景上 -->
      <div style="background: var(--color-semantic-absolute-black-light); padding: 12px; border-radius: var(--radius-md); display: flex; gap: 12px; align-items: center;">
        <span style="font-size: var(--font-size-14); color: var(--color-semantic-absolute-white-light); font-weight: var(--font-weight-600); margin-right: 8px;">Black背景:</span>
        ${IconButton({ icon: closeSvg, variant: 'solid', color: 'absolute-white', size: 'sm', ariaLabel: '閉じる' })}
        ${IconButton({ icon: closeSvg, variant: 'outline', color: 'absolute-white', size: 'sm', ariaLabel: '閉じる' })}
        ${IconButton({ icon: closeSvg, variant: 'ghost', color: 'absolute-white', size: 'sm', ariaLabel: '閉じる' })}
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
        ${IconButton({ variant: 'outline', color: 'primary', icon: closeSvg, ariaLabel: 'Outline' })}
        ${IconButton({ variant: 'ghost', color: 'primary', icon: infoSvg, ariaLabel: 'Ghost' })}
        ${IconButton({ variant: 'outline', color: 'neutral', icon: checkSvg, ariaLabel: 'Outline Neutral' })}
        ${IconButton({ variant: 'ghost', color: 'neutral', icon: warnSvg, ariaLabel: 'Ghost Neutral' })}
      </div>
      
      <h4 style="color: white; margin: 16px 0 16px 0;">非透過バリアント（背景が透けない）</h4>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        ${IconButton({ variant: 'outline-solid', color: 'primary', icon: closeSvg, ariaLabel: 'Outline-Solid' })}
        ${IconButton({ variant: 'ghost-solid', color: 'primary', icon: infoSvg, ariaLabel: 'Ghost-Solid' })}
        ${IconButton({ variant: 'outline-solid', color: 'neutral', icon: checkSvg, ariaLabel: 'Outline-Solid Neutral' })}
        ${IconButton({ variant: 'ghost-solid', color: 'neutral', icon: warnSvg, ariaLabel: 'Ghost-Solid Neutral' })}
      </div>
    </div>
    
    <!-- 通常背景での比較 -->
    <div style="background: var(--color-semantic-neutral-50-light); padding: 24px; border-radius: 8px;">
      <h4 style="margin: 0 0 16px 0;">通常背景での表示</h4>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        ${IconButton({ variant: 'outline', color: 'primary', icon: closeSvg, ariaLabel: 'Outline' })}
        ${IconButton({ variant: 'outline-solid', color: 'primary', icon: closeSvg, ariaLabel: 'Outline-Solid' })}
        ${IconButton({ variant: 'ghost', color: 'primary', icon: infoSvg, ariaLabel: 'Ghost' })}
        ${IconButton({ variant: 'ghost-solid', color: 'primary', icon: infoSvg, ariaLabel: 'Ghost-Solid' })}
      </div>
    </div>
  </div>
`;

export const CompleteMatrix = () => {
  const variants = ['solid', 'outline', 'ghost', 'outline-solid', 'ghost-solid'];
  const sizes = ['sm', 'md', 'lg'];
  const colors = ['primary', 'neutral', 'negative', 'absolute-white', 'absolute-black'];
  const states = ['enable', 'hover', 'active', 'disabled'];

  return `
    <div class="ds-matrix" style="padding: var(--spacing-padding-24);">
      <h4>Complete Matrix (Color × Variant × Size × State)</h4>
      <table>
        <thead>
          <tr>
            <th rowspan="2">Color</th>
            <th rowspan="2">State</th>
            ${variants.map(v => `<th colspan="${sizes.length}">${v}</th>`).join('')}
          </tr>
          <tr>
            ${variants.map((_, vIndex) => sizes.map((s, sIndex) => `<th style="border-top: 1px solid var(--color-semantic-divider-high-light);${sIndex === 0 ? ' border-left: 1px solid var(--color-semantic-divider-high-light);' : ''}">${s}</th>`).join('')).join('')}
          </tr>
        </thead>
        <tbody>
          ${colors.map(color => 
            states.map((state, idx) => `
              <tr>
                ${idx === 0 ? `<td rowspan="${states.length}" data-cell="label" style="writing-mode: vertical-lr; text-orientation: mixed;">${color}</td>` : ''}
                <td data-cell="label" style="border-left: 1px solid var(--color-semantic-divider-high-light);">${state}</td>
                ${variants.map(variant => sizes.map(size => {
                  const props = { variant, color, size, icon: closeSvg, ariaLabel: '閉じる' };
                  if (state !== 'enable') props.state = state;
                  if (state === 'disabled') props.disabled = true;
                  return `<td style="text-align: center;">${IconButton(props)}</td>`;
                }).join('')).join('')}
              </tr>
            `).join('')
          ).join('')}
        </tbody>
      </table>
    </div>
  `;
};

