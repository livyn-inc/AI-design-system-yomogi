import { Dropdown } from '../../components/dropdown/Dropdown.js';
import '../../components/dropdown/Dropdown.css';
import './_matrix.css';
import { renderMatrix } from './_matrix.js';

export default { title: 'components/Dropdown' };

const items = [
  { type: 'section', label: 'マイアカウント', iconLeft: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>' },
  { label: 'プロフィール', href: '#', meta: '⇧⌘P' },
  { label: '請求', href: '#', meta: '⌘B' },
  { label: '設定', href: '#', meta: '⌘S' },
  { label: 'キーボードショートカット', href: '#', meta: '⌘K' },
  { type: 'separator' },
  { type: 'section', label: 'チーム' },
  { label: 'ユーザー招待', submenu: [ { label: 'メール' }, { label: 'メッセージ' }, { label: 'その他...' } ] },
  { label: '新しいチーム', meta: '⌘+T' },
  { label: 'GitHub', href: '#' },
  { label: 'サポート', href: '#' },
  { label: 'API', href: '#' },
  { label: 'ログアウト', danger: true }
];

export const Overview = () => `
  <div style="padding: var(--spacing-padding-24);">
    ${Dropdown({ items, label: '開く', size: 'md', rightIcon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>' })}
  </div>
`;

export const CompleteMatrix = () => {
  const sizes = ['sm','md','lg'];
  const states = [
    { key: 'default', label: 'デフォルト', props: {} },
    { key: 'open', label: '開いた状態', props: { defaultOpen: true } }
  ];
  return renderMatrix({
    title: 'Complete Matrix (State × Size)',
    sizes,
    states,
    renderCell: (size, stateKey) => {
      const st = states.find(s => s.key === stateKey);
      return Dropdown({ items, label: 'メニュー', size, rightIcon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>', ...st.props });
    }
  });
};





