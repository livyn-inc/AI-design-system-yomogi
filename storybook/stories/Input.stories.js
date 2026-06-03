import { Input } from '../../components/input/Input.js';
import '../../components/input/Input.css';
import './_matrix.css';
import { renderMatrix } from './_matrix.js';

export default {
  title: 'components/Input',
  parameters: {
    docs: {
      description: {
        component: '汎用的なテキスト入力コンポーネント。様々なタイプ、サイズ、状態に対応。'
      }
    }
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: '入力フィールドのタイプ'
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: '入力フィールドのサイズ'
    },
    status: {
      control: { type: 'select' },
      options: ['default', 'error', 'success'],
      description: '入力フィールドの状態'
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
    leftIcon: {
      control: 'text',
      description: '左側のアイコン（HTMLとして挿入）'
    },
    rightIcon: {
      control: 'text',
      description: '右側のアイコン（HTMLとして挿入）'
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
const Template = (args) => Input(args);

// 概要 - 代表的なパターンのみ
export const Overview = () => `
  <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">
    <div>
      <h3 style="margin: 0 0 16px 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">Input Overview</h3>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: start;">
        <div style="width: var(--layout-max-width-md);">${Input({ size: 'sm', placeholder: '小サイズ', label: '小サイズ' })}</div>
        <div style="width: var(--layout-max-width-md);">${Input({ size: 'md', placeholder: '中サイズ', label: '中サイズ' })}</div>
        <div style="width: var(--layout-max-width-md);">${Input({ size: 'lg', placeholder: '大サイズ', label: '大サイズ' })}</div>
      </div>
    </div>
  </div>
`;

// Complete Matrix (Status × Size)
export const CompleteMatrix = () => {
  const sizes = ['sm', 'md', 'lg'];
  const states = [
    { key: 'default', label: 'Default', props: { placeholder: 'デフォルト', value: '' } },
    { key: 'hover', label: 'Hover', props: { placeholder: 'ホバー', value: 'ホバー状態のテキスト' } },
    { key: 'focus', label: 'Focus', props: { placeholder: 'フォーカス', value: 'フォーカス状態のテキスト' } },
    { key: 'error', label: 'Error', props: { value: 'エラーのテキスト', status: 'error', errorText: 'エラーメッセージ' } },
    { key: 'success', label: 'Success', props: { value: '成功のテキスト', status: 'success', helperText: '成功メッセージ' } },
    { key: 'disabled', label: 'Disabled', props: { value: '無効化されたテキスト', disabled: true } },
    { key: 'readonly', label: 'Readonly', props: { value: '読み取り専用のテキスト', readonly: true } }
  ];

  const html = renderMatrix({
    title: 'Complete Matrix (State × Size)',
    sizes,
    states,
    renderCell: (size, stateKey) => {
      const st = states.find(s => s.key === stateKey);
      return `<div class=\"input-matrix-cell\" data-state=\"${stateKey}\" style=\"width: var(--layout-max-width-md); margin: 0 auto;\">${Input({ size, id: `input-${stateKey}-${size}`, ...st.props })}</div>`;
    }
  });

  setTimeout(() => {
    const focusInputs = document.querySelectorAll('.input-matrix-cell[data-state="focus"] .ds-input__field');
    focusInputs.forEach((input) => { input.style.outline = 'none'; });
  }, 100);

  return html;
};


// すべてのバリエーション
// Examples: 固有パターンのダイジェスト
export const Variations = () => `
  <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">
    
    <!-- Types -->
    <div>
      <h4 style="margin: 0 0 16px 0; font-size: 16px; font-weight: var(--font-weight-600);">Types</h4>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: start;">
        <div style="width: var(--layout-max-width-md);">${Input({ type: 'email', placeholder: 'email@example.com', label: 'メールアドレス' })}</div>
        <div style="width: var(--layout-max-width-md);">${Input({ type: 'password', placeholder: 'パスワード', label: 'パスワード' })}</div>
      </div>
    </div>

    <!-- Icons -->
    <div>
      <h4 style="margin: 0 0 16px 0; font-size: 16px; font-weight: var(--font-weight-600);">Icons</h4>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: start;">
        <div style="width: var(--layout-max-width-md);">${Input({ leftIcon: '<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"currentColor\"><path d=\"M10 10a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z\"/></svg>', placeholder: 'ユーザー名', label: '左アイコン付き' })}</div>
        <div style="width: var(--layout-max-width-md);">${Input({ rightIcon: '<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"currentColor\"><path d=\"M9 2a1 1 0 000 2h2a1 1 0 100-2H9z\"/><path fill-rule=\"evenodd\" d=\"M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 00-2 2v6a2 2 0 002 2h2a1 1 0 100-2H6V7h8v6h-2a1 1 0 100 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a1 1 0 100 2h2a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V7z\" clip-rule=\"evenodd\"/></svg>', placeholder: 'コピーする', label: '右アイコン付き' })}</div>
      </div>
    </div>

    <!-- States -->
    <div>
      <h4 style="margin: 0 0 16px 0; font-size: 16px; font-weight: var(--font-weight-600);">States</h4>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: start;">
        <div style="width: var(--layout-max-width-md);">${Input({ status: 'error', label: 'エラー', value: '誤り', errorText: 'エラーメッセージ' })}</div>
        <div style="width: var(--layout-max-width-md);">${Input({ status: 'success', label: '成功', value: 'OK', helperText: '成功メッセージ' })}</div>
        <div style="width: var(--layout-max-width-md);">${Input({ required: true, label: '必須', placeholder: '必須項目です' })}</div>
        <div style="width: var(--layout-max-width-md);">${Input({ disabled: true, label: '無効', value: '編集できません' })}</div>
        <div style="width: var(--layout-max-width-md);">${Input({ readonly: true, label: '読み取り専用', value: '読み取り専用の値' })}</div>
      </div>
    </div>

  </div>
`;

