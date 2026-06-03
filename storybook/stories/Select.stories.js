import { Select } from '../../components/select/Select.js';
import '../../components/select/Select.css';
import './_matrix.css';
import { renderMatrix } from './_matrix.js';

export default {
  title: 'components/Select',
  parameters: {
    docs: {
      description: {
        component: 'ドロップダウン選択コンポーネント。様々なサイズと状態に対応。'
      }
    }
  }
};

// Template関数
const Template = (args) => Select(args);

const sampleOptions = [
  { value: 'option1', label: 'オプション1' },
  { value: 'option2', label: 'オプション2' },
  { value: 'option3', label: 'オプション3' }
];

// 概要 - 代表的なパターンのみ
export const Overview = () => `
  <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">
    <div>
      <h3 style="margin: 0 0 16px 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">Select Overview</h3>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: start;">
        <div style="width: var(--layout-max-width-md);">${Select({ size: 'sm', placeholder: '小サイズ', options: sampleOptions })}</div>
        <div style="width: var(--layout-max-width-md);">${Select({ size: 'md', placeholder: '中サイズ', options: sampleOptions })}</div>
        <div style="width: var(--layout-max-width-md);">${Select({ size: 'lg', placeholder: '大サイズ', options: sampleOptions })}</div>
      </div>
    </div>
  </div>
`;

// Complete Matrix (Status × Size)
export const CompleteMatrix = () => {
  const sizes = ['sm', 'md', 'lg'];
  const states = [
    { key: 'default', label: 'Default', props: { placeholder: 'デフォルト', options: sampleOptions } },
    { key: 'error', label: 'Error', props: { value: 'option1', status: 'error', errorText: 'エラーメッセージ', options: sampleOptions } },
    { key: 'success', label: 'Success', props: { value: 'option2', status: 'success', helperText: '成功メッセージ', options: sampleOptions } },
    { key: 'disabled', label: 'Disabled', props: { value: 'option1', disabled: true, options: sampleOptions } },
    { key: 'required', label: 'Required', props: { required: true, placeholder: '必須', options: sampleOptions } }
  ];

  return renderMatrix({
    title: 'Complete Matrix (State × Size)',
    sizes,
    states,
    renderCell: (size, stateKey) => {
      const st = states.find(s => s.key === stateKey);
      return `<div class=\"select-matrix-cell\" data-state=\"${stateKey}\" style=\"width: var(--layout-max-width-md); margin: 0 auto;\">${Select({ size, id: `select-${stateKey}-${size}`, ...st.props })}</div>`;
    }
  });
};

// すべてのバリエーション
// Examples: 固有パターンのダイジェスト
export const Variations = () => `
  <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">
    
    <!-- Placeholder Color (未選択) -->
    <div>
      <h4 style="margin: 0 0 16px 0; font-size: 16px; font-weight: var(--font-weight-600);">Placeholder</h4>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: start;">
        <div style="width: var(--layout-max-width-md);">${Select({ label: '未選択時の表示', placeholder: '選択してください', options: sampleOptions })}</div>
      </div>
    </div>

    <!-- States -->
    <div>
      <h4 style="margin: 0 0 16px 0; font-size: 16px; font-weight: var(--font-weight-600);">States</h4>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: start;">
        <div style="width: var(--layout-max-width-md);">${Select({ status: 'error', label: 'エラー', options: sampleOptions, value: 'option1', errorText: 'エラーメッセージ' })}</div>
        <div style="width: var(--layout-max-width-md);">${Select({ status: 'success', label: '成功', options: sampleOptions, value: 'option2', helperText: '成功メッセージ' })}</div>
        <div style="width: var(--layout-max-width-md);">${Select({ disabled: true, label: '無効', options: sampleOptions, value: 'option1' })}</div>
        <div style="width: var(--layout-max-width-md);">${Select({ required: true, label: '必須', options: sampleOptions, placeholder: '必須選択' })}</div>
      </div>
    </div>

  </div>
`;