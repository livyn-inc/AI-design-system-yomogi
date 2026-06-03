import { Checkbox } from '../../components/checkbox/Checkbox.js';
import '../../components/checkbox/Checkbox.css';
import './_matrix.css';

export default {
  title: 'components/Checkbox',
  parameters: {
    docs: {
      description: {
        component: 'チェックボックスコンポーネント。複数選択や同意確認に使用。様々なサイズと状態に対応。'
      }
    }
  }
};

// Template関数
const Template = (args) => Checkbox(args);

// 概要 - 代表的なパターンのみ
export const Overview = () => `
  <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">
    <div>
      <h3 style="margin: 0 0 16px 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">Checkbox Overview</h3>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: start;">
        <div>${Checkbox({ size: 'sm', label: '小サイズ', value: 'sm' })}</div>
        <div>${Checkbox({ size: 'md', label: '中サイズ', value: 'md' })}</div>
        <div>${Checkbox({ size: 'lg', label: '大サイズ', value: 'lg' })}</div>
      </div>
    </div>
  </div>
`;

// Complete Matrix (Status × Size)
export const CompleteMatrix = () => {
  const sizes = ['sm', 'md', 'lg'];
  const sizeLabels = { sm: 'sm', md: 'md', lg: 'lg' };
  const stateLabels = { 
    default: 'Default', 
    checked: 'Checked', 
    indeterminate: 'Indeterminate',
    disabled: 'Disabled', 
    required: 'Required'
  };
  const states = [
    { key: 'default', label: 'Default', props: { label: 'デフォルト', value: 'default' } },
    { key: 'checked', label: 'Checked', props: { label: 'チェック済み', checked: true, value: 'checked' } },
    { key: 'indeterminate', label: 'Indeterminate', props: { label: '部分選択', indeterminate: true, value: 'indeterminate' } },
    { key: 'disabled', label: 'Disabled', props: { label: '無効化', disabled: true, value: 'disabled' } },
    { key: 'required', label: 'Required', props: { label: '必須', required: true, value: 'required' } }
  ];

  const matrixHTML = `
    <div class=\"ds-matrix\" style=\"padding: var(--spacing-padding-24);\">
      <h4>Complete Matrix (State × Size)</h4>
      <table>
        <thead>
          <tr>
            <th>State</th>
            ${sizes.map(size => `<th>${sizeLabels[size]}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${states.map(state => `
            <tr>
              <td data-cell=\"label\">${stateLabels[state.key]}</td>
              ${sizes.map(size => `<td class=\"checkbox-matrix-cell\" data-state=\"${state.key}\">${Checkbox({ size, id: `checkbox-${state.key}-${size}`, ...state.props })}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <style></style>
  `;

  return matrixHTML;
};

// すべてのバリエーション
// Examples: 固有パターンのダイジェスト
export const Variations = () => `
  <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">
    
    <!-- Indeterminate / Groups -->
    <div>
      <h4 style="margin: 0 0 16px 0; font-size: 16px; font-weight: var(--font-weight-600);">Groups & Indeterminate</h4>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${Checkbox({ label: 'すべて選択', indeterminate: true, value: 'all' })}
        <div style="display: flex; gap: 12px;">
          ${Checkbox({ label: 'A', name: 'grp', value: 'A' })}
          ${Checkbox({ label: 'B', name: 'grp', value: 'B', checked: true })}
          ${Checkbox({ label: 'C', name: 'grp', value: 'C' })}
        </div>
      </div>
    </div>

    <!-- States -->
    <div>
      <h4 style="margin: 0 0 16px 0; font-size: 16px; font-weight: var(--font-weight-600);">States</h4>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: start;">
        <div>${Checkbox({ label: '必須', required: true, value: 'required' })}</div>
        <div>${Checkbox({ label: '無効', disabled: true, value: 'disabled' })}</div>
      </div>
    </div>

  </div>
`;