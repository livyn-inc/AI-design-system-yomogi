import { Radio } from '../../components/radio/Radio.js';
import '../../components/radio/Radio.css';
import './_matrix.css';
import { renderMatrix } from './_matrix.js';

export default {
  title: 'components/Radio',
  parameters: {
    docs: {
      description: {
        component: 'ラジオボタンコンポーネント。単一選択に使用。様々なサイズと状態に対応。'
      }
    }
  }
};

// Template関数
const Template = (args) => Radio(args);

// 概要 - 代表的なパターンのみ
export const Overview = () => `
  <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">
    <div>
      <h3 style="margin: 0 0 16px 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">Radio Overview</h3>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: start;">
        <div>${Radio({ size: 'sm', label: '小サイズ', value: 'sm', name: 'overview-size' })}</div>
        <div>${Radio({ size: 'md', label: '中サイズ', value: 'md', name: 'overview-size' })}</div>
        <div>${Radio({ size: 'lg', label: '大サイズ', value: 'lg', name: 'overview-size' })}</div>
      </div>
    </div>
  </div>
`;

// Complete Matrix (State × Size)
export const CompleteMatrix = () => {
  const sizes = ['sm', 'md', 'lg'];
  const states = [
    { key: 'default', label: 'Default', props: { label: 'デフォルト', value: 'default' } },
    { key: 'checked', label: 'Checked', props: { label: '選択済み', checked: true, value: 'checked' } },
    { key: 'disabled', label: 'Disabled', props: { label: '無効化', disabled: true, value: 'disabled' } },
    { key: 'required', label: 'Required', props: { label: '必須', required: true, value: 'required' } }
  ];

  return renderMatrix({
    title: 'Complete Matrix (State × Size)',
    sizes,
    states,
    renderCell: (size, stateKey) => {
      const st = states.find(s => s.key === stateKey);
      return `${Radio({ size, id: `radio-${stateKey}-${size}`, name: `matrix-${stateKey}-${size}`, ...st.props })}`;
    }
  });
};

// すべてのバリエーション
// Examples: 固有パターンのダイジェスト
export const Variations = () => `
  <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">
    
    <!-- Groups -->
    <div>
      <h4 style="margin: 0 0 16px 0; font-size: 16px; font-weight: var(--font-weight-600);">Groups</h4>
      <div style="display: flex; gap: 48px;">
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <h5 style="margin: 0 0 8px 0; font-size: 14px; font-weight: var(--font-weight-500);">支払い方法</h5>
          ${Radio({ label: 'クレジットカード', name: 'payment', value: 'credit', checked: true })}
          ${Radio({ label: '銀行振込', name: 'payment', value: 'bank' })}
          ${Radio({ label: 'コンビニ決済', name: 'payment', value: 'convenience' })}
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <h5 style="margin: 0 0 8px 0; font-size: 14px; font-weight: var(--font-weight-500);">サイズ</h5>
          ${Radio({ label: 'S', name: 'size', value: 's' })}
          ${Radio({ label: 'M', name: 'size', value: 'm', checked: true })}
          ${Radio({ label: 'L', name: 'size', value: 'l' })}
        </div>
      </div>
    </div>

    <!-- States -->
    <div>
      <h4 style="margin: 0 0 16px 0; font-size: 16px; font-weight: var(--font-weight-600);">States</h4>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: start;">
        <div>${Radio({ label: '必須', required: true, value: 'required', name: 'req' })}</div>
        <div>${Radio({ label: '無効', disabled: true, value: 'disabled', name: 'dis' })}</div>
      </div>
    </div>

  </div>
`;