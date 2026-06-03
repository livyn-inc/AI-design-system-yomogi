import { TextArea } from '../../components/textarea/TextArea.js';
import '../../components/textarea/TextArea.css';
import './_matrix.css';

export default {
  title: 'components/TextArea',
  parameters: {
    docs: {
      description: {
        component: '複数行テキスト入力コンポーネント。長文入力、コメント、説明文などに使用。'
      }
    }
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'テキストエリアのサイズ'
    },
    status: {
      control: { type: 'select' },
      options: ['default', 'error', 'success'],
      description: 'テキストエリアの状態'
    },
    rows: {
      control: { type: 'number', min: 1, max: 20 },
      description: '表示行数'
    },
    resize: {
      control: { type: 'select' },
      options: ['none', 'vertical', 'horizontal', 'both'],
      description: 'リサイズ方向'
    },
    placeholder: {
      control: 'text',
      description: 'プレースホルダーテキスト'
    },
    value: {
      control: 'text',
      description: '入力値'
    },
    label: {
      control: 'text',
      description: 'ラベルテキスト'
    },
    helperText: {
      control: 'text',
      description: '補助テキスト'
    },
    errorText: {
      control: 'text',
      description: 'エラーテキスト（status="error"時に表示）'
    },
    maxLength: {
      control: { type: 'number' },
      description: '最大文字数'
    },
    disabled: {
      control: 'boolean',
      description: '無効化状態'
    },
    readonly: {
      control: 'boolean',
      description: '読み取り専用状態'
    },
    required: {
      control: 'boolean',
      description: '必須項目'
    }
  }
};

// Template関数
const Template = (args) => TextArea(args);

// 概要
export const Overview = () => `
  <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">
    <div>
      <h3 style="margin: 0 0 16px 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">TextArea Overview</h3>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: start;">
        <div style="width: var(--layout-max-width-md);">${TextArea({ size: 'sm', placeholder: '小サイズ', label: '小サイズ', rows: 3 })}</div>
        <div style="width: var(--layout-max-width-md);">${TextArea({ size: 'md', placeholder: '中サイズ', label: '中サイズ' })}</div>
        <div style="width: var(--layout-max-width-md);">${TextArea({ size: 'lg', placeholder: '大サイズ', label: '大サイズ', rows: 5 })}</div>
      </div>
    </div>
  </div>
`;

// Complete Matrix
export const CompleteMatrix = () => {
  const sizes = ['sm', 'md', 'lg'];
  const states = [
    { key: 'default', label: 'Default', props: { placeholder: 'プレースホルダー' } },
    { key: 'error', label: 'Error', props: { value: 'エラーのあるテキスト', status: 'error', errorText: 'エラーメッセージ' } },
    { key: 'success', label: 'Success', props: { value: '成功したテキスト', status: 'success', helperText: '成功メッセージ' } },
    { key: 'disabled', label: 'Disabled', props: { value: '無効化されたテキスト', disabled: true } },
    { key: 'readonly', label: 'Readonly', props: { value: '読み取り専用テキスト', readonly: true } }
  ];

  return `
    <div class="ds-matrix" style="padding: var(--spacing-padding-24);">
      <h4>Complete Matrix (State × Size)</h4>
      <table>
        <thead>
          <tr>
            <th>State</th>
            ${sizes.map(size => 
              `<th>${size}</th>`
            ).join('')}
          </tr>
        </thead>
        <tbody>
          ${states.map(state => `
            <tr>
              <td data-cell="label">${state.label}</td>
              ${sizes.map(size => {
                const rows = size === 'sm' ? 2 : size === 'lg' ? 4 : 3;
                return `<td style=\"width: var(--layout-max-width-sm);\">
                  ${TextArea({ 
                    size, 
                    rows,
                    id: `textarea-${state.key}-${size}`,
                    ...state.props 
                  })}
                </td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <style></style>
  `;
};

// Examples: 固有パターンのダイジェスト
export const Variations = () => `
  <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">
    
    <!-- Counter -->
    <div>
      <h4 style="margin: 0 0 16px 0; font-size: var(--font-size-16); font-weight: var(--font-weight-600);">Counter</h4>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: start;">
        <div style="width: var(--layout-max-width-md);">${TextArea({ label: 'プロフィール（200文字まで）', maxLength: 200, value: '自己紹介のサンプルテキスト' })}</div>
        <div style="width: var(--layout-max-width-md);">${TextArea({ label: 'メモ（140文字まで）', maxLength: 140, placeholder: '140文字まで' })}</div>
      </div>
    </div>

    <!-- States -->
    <div>
      <h4 style="margin: 0 0 16px 0; font-size: var(--font-size-16); font-weight: var(--font-weight-600);">States</h4>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: start;">
        <div style="width: var(--layout-max-width-md);">${TextArea({ label: 'エラー', status: 'error', value: '短い', errorText: '10文字以上入力してください' })}</div>
        <div style="width: var(--layout-max-width-md);">${TextArea({ label: '成功', status: 'success', value: '条件を満たしています', helperText: '入力内容は有効です' })}</div>
      </div>
    </div>

    <!-- Permission -->
    <div>
      <h4 style="margin: 0 0 16px 0; font-size: var(--font-size-16); font-weight: var(--font-weight-600);">Permission</h4>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: start;">
        <div style="width: var(--layout-max-width-md);">${TextArea({ label: '読み取り専用', readonly: true, value: '読み取り専用テキスト' })}</div>
        <div style="width: var(--layout-max-width-md);">${TextArea({ label: '無効', disabled: true, value: '編集できません' })}</div>
      </div>
    </div>

    <!-- Resize -->
    <div>
      <h4 style="margin: 0 0 16px 0; font-size: var(--font-size-16); font-weight: var(--font-weight-600);">Resize</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
        ${TextArea({ label: '固定（none）', placeholder: '固定', resize: 'none', rows: 3 })}
        ${TextArea({ label: '縦方向（vertical）', placeholder: '縦方向にリサイズ可能', resize: 'vertical', rows: 3 })}
        ${TextArea({ label: '両方向（both）', placeholder: '縦横にリサイズ可能', resize: 'both', rows: 3 })}
      </div>
    </div>

  </div>
`;

// Feature Examples
// FeatureExamplesはSelectと同様の一体型セクションに統合済みのため削除

// Validation Examples
// ValidationExamplesはSelect同様のAllVariationsへ統合済みのため削除

// Dark mode test
// DarkModeTestは不要のため削除