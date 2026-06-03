import { Switch } from '../../components/switch/Switch.js';
import '../../components/switch/Switch.css';
import './_matrix.css';
import { renderMatrix } from './_matrix.js';

export default {
  title: 'components/Switch',
  parameters: {
    docs: {
      description: {
        component: 'ON/OFF切り替えスイッチコンポーネント。設定の有効/無効などに使用。'
      }
    }
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'スイッチのサイズ'
    },
    checked: {
      control: 'boolean',
      description: 'チェック状態'
    },
    disabled: {
      control: 'boolean',
      description: '無効化状態'
    },
    label: {
      control: 'text',
      description: 'ラベルテキスト'
    }
  }
};

// Template関数
const Template = (args) => Switch(args);

// 概要
export const Overview = () => `
  <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">
    <div>
      <h3 style="margin: 0 0 16px 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">Switch Overview</h3>
      <div style="display: flex; gap: 24px; flex-wrap: wrap; align-items: start;">
        <div>${Switch({ size: 'sm', label: '小サイズ' })}</div>
        <div>${Switch({ size: 'md', label: '中サイズ' })}</div>
        <div>${Switch({ size: 'lg', label: '大サイズ' })}</div>
      </div>
    </div>
    <div>
      <div style="display: flex; gap: 24px; flex-wrap: wrap; align-items: start;">
        <div>${Switch({ checked: false, label: 'OFF状態' })}</div>
        <div>${Switch({ checked: true, label: 'ON状態' })}</div>
        <div>${Switch({ disabled: true, label: '無効化' })}</div>
        <div>${Switch({ checked: true, disabled: true, label: '無効化（ON）' })}</div>
      </div>
    </div>
  </div>
`;

// Complete Matrix
export const CompleteMatrix = () => {
  const sizes = ['sm', 'md', 'lg'];
  const states = [
    { key: 'unchecked', label: 'Unchecked', props: { checked: false } },
    { key: 'checked', label: 'Checked', props: { checked: true } },
    { key: 'disabled-off', label: 'Disabled (OFF)', props: { disabled: true, checked: false } },
    { key: 'disabled-on', label: 'Disabled (ON)', props: { disabled: true, checked: true } }
  ];

  return renderMatrix({
    title: 'Complete Matrix (State × Size)',
    sizes,
    states,
    renderCell: (size, stateKey) => {
      const st = states.find(s => s.key === stateKey);
      return `${Switch({ size, id: `switch-${stateKey}-${size}`, ...st.props })}`;
    }
  });
};

// Usage Examples
export const Variations = () => `
  <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

    <!-- States -->
    <div>
      <h4 style="margin: 0 0 16px 0; font-size: var(--font-size-16); font-weight: var(--font-weight-600);">States</h4>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: start;">
        <div>${Switch({ label: 'Unchecked', checked: false })}</div>
        <div>${Switch({ label: 'Checked', checked: true })}</div>
        <div>${Switch({ label: 'Disabled (OFF)', disabled: true })}</div>
        <div>${Switch({ label: 'Disabled (ON)', checked: true, disabled: true })}</div>
      </div>
    </div>

    <!-- Groups -->
    <div>
      <h4 style="margin: 0 0 16px 0; font-size: var(--font-size-16); font-weight: var(--font-weight-600);">Groups</h4>
      <div style="display: flex; gap: 32px;">
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${Switch({ label: '通知を受け取る', checked: true })}
          ${Switch({ label: 'ダークモード', checked: false })}
          ${Switch({ label: '自動保存', checked: true })}
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${Switch({ label: '公開プロフィール', checked: true })}
          ${Switch({ label: 'メール通知', checked: false })}
          ${Switch({ label: 'ベータ参加', disabled: true })}
        </div>
      </div>
    </div>

  </div>
`;