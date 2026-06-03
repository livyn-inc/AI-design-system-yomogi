import { Tag } from '../../components/tag/Tag.js';
import '../../components/tag/Tag.css';
import './_matrix.css';

export default { title: 'components/Tag' };

// Overview: サイズのみ（filled + neutral）
export const Overview = () => {
  const sizes = ['sm', 'md', 'lg'];
  return `
    <div style="padding: var(--spacing-padding-32);">
      <div style="margin-bottom: var(--spacing-padding-24);">
        <h3 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">Tag Overview</h3>
        <div style="display: flex; gap: var(--spacing-padding-16); align-items: center; flex-wrap: wrap;">
          ${sizes.map(size => `<div>${Tag({ size, variant: 'filled', color: 'neutral', label: size.toUpperCase() })}</div>`).join('')}
        </div>
      </div>
    </div>
  `;
};

// Complete Matrix: Color × Appearance × Size
export const CompleteMatrix = () => {
  const sizes = ['sm', 'md', 'lg'];
  const appearances = ['filled', 'subtle', 'outline', 'emphasis'];
  const colors = ['neutral', 'primary', 'info', 'success', 'warning', 'negative'];

  const section = (title, rows) => `
    <div style="margin-bottom: var(--spacing-padding-72);">
      <h4 style="margin: 0 0 var(--spacing-padding-16) 0; font-size: var(--font-size-16); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light); text-transform: capitalize;">${title}</h4>
      <table style="border-spacing: 0; width: 100%;">
        <thead>
          <tr>
            <th style="text-align: left; padding: var(--spacing-padding-8) var(--spacing-padding-12); font-size: var(--font-size-14); font-weight: var(--font-weight-500);">Appearance</th>
            ${sizes.map(s => `<th style="text-align: center; padding: var(--spacing-padding-8) var(--spacing-padding-12); font-size: var(--font-size-14); font-weight: var(--font-weight-500);">${s}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;

  const makeRow = (color, appearance) => `
    <tr>
      <td data-cell="label" style="text-align: left; padding: var(--spacing-padding-12); font-size: var(--font-size-14);">${appearance}</td>
      ${sizes.map(size => `
        <td style="text-align: center; padding: var(--spacing-padding-12);">${Tag({ size, variant: appearance, color, label: 'ラベル' })}</td>
      `).join('')}
    </tr>
  `;

  const blocks = colors.map(color => {
    const rows = appearances.map(app => makeRow(color, app)).join('');
    return section(color, rows);
  }).join('');

  return `
    <div class="ds-matrix" style="padding: var(--spacing-padding-32);">${blocks}</div>
    <style></style>
  `;
};

// Variations: 固有パターン（色バリエーション、Removableなど）
export const Variations = () => {
  // 固有パターンのみ（重複はCompleteMatrixへ集約済み）
  const removable = `
    <div style="margin-bottom: var(--spacing-padding-72);">
      <h4 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-16); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">Removable</h4>
      <div style="display: flex; gap: var(--spacing-padding-12); align-items: center; flex-wrap: wrap;">
        ${['neutral','primary','info','success','warning','negative'].map(c => Tag({ size: 'md', variant: 'filled', color: c, label: '削除可能', removable: true })).join('')}
      </div>
    </div>
  `;

  // Badge的な使い方（数値・カウント表示）
  const badgeNumbers = `
    <div style="margin-bottom: var(--spacing-padding-72);">
      <h4 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-16); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">Badge: 数値・カウント表示</h4>
      <div style="display: flex; gap: var(--spacing-padding-12); align-items: center; flex-wrap: wrap;">
        ${Tag({ size: 'sm', variant: 'filled', color: 'negative', label: '3' })}
        ${Tag({ size: 'sm', variant: 'filled', color: 'info', label: '12' })}
        ${Tag({ size: 'sm', variant: 'filled', color: 'success', label: '99+' })}
        ${Tag({ size: 'sm', variant: 'subtle', color: 'neutral', label: '12 コメント' })}
        ${Tag({ size: 'sm', variant: 'subtle', color: 'neutral', label: '456 いいね' })}
      </div>
    </div>
  `;

  // Badge的な使い方（ステータス表示）
  const badgeStatus = `
    <div style="margin-bottom: var(--spacing-padding-72);">
      <h4 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-16); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">Badge: ステータス表示</h4>
      <div style="display: flex; gap: var(--spacing-padding-12); align-items: center; flex-wrap: wrap;">
        ${Tag({ size: 'sm', variant: 'filled', color: 'info', label: '新着' })}
        ${Tag({ size: 'sm', variant: 'filled', color: 'warning', label: '人気' })}
        ${Tag({ size: 'sm', variant: 'filled', color: 'success', label: '更新' })}
        ${Tag({ size: 'sm', variant: 'subtle', color: 'neutral', label: '進行中' })}
        ${Tag({ size: 'sm', variant: 'subtle', color: 'success', label: '完了' })}
        ${Tag({ size: 'sm', variant: 'subtle', color: 'warning', label: '保留' })}
      </div>
    </div>
  `;

  // Badge的な使い方（バージョン・環境表示）
  const badgeVersion = `
    <div style="margin-bottom: var(--spacing-padding-72);">
      <h4 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-16); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">Badge: バージョン・環境表示</h4>
      <div style="display: flex; gap: var(--spacing-padding-12); align-items: center; flex-wrap: wrap;">
        ${Tag({ size: 'sm', variant: 'outline', color: 'neutral', label: 'v2.0.0' })}
        ${Tag({ size: 'sm', variant: 'outline', color: 'info', label: 'Beta' })}
        ${Tag({ size: 'sm', variant: 'outline', color: 'warning', label: 'Preview' })}
        ${Tag({ size: 'sm', variant: 'filled', color: 'success', label: 'Production' })}
        ${Tag({ size: 'sm', variant: 'filled', color: 'warning', label: 'Staging' })}
        ${Tag({ size: 'sm', variant: 'subtle', color: 'neutral', label: 'Development' })}
      </div>
    </div>
  `;

  // Emphasis（強調・濃色塗り）
  const emphasis = `
    <div style="margin-bottom: var(--spacing-padding-72);">
      <h4 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-16); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">Emphasis（強調・濃色塗り）</h4>
      <div style="display: flex; gap: var(--spacing-padding-12); align-items: center; flex-wrap: wrap;">
        ${['neutral','primary','info','success','warning','negative'].map(c => Tag({ size: 'md', variant: 'emphasis', color: c, label: c.toUpperCase() })).join('')}
      </div>
    </div>
  `;

  return `
    <div style="padding: var(--spacing-padding-32);">${emphasis}${removable}${badgeNumbers}${badgeStatus}${badgeVersion}</div>
  `;
};