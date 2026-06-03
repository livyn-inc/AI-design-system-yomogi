import { Navigation } from '../../components/navigation/Navigation.js';
import '../../components/navigation/Navigation.css';
import { Input } from '../../components/input/Input.js';
import '../../components/input/Input.css';
import { Avatar } from '../../components/avatar/Avatar.js';
import '../../components/avatar/Avatar.css';

export default { title: 'components/Navigation' };

export const Top = () => {
  const homeIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 8h-3v10h-5V14H11v7H6V11H3z"/></svg>';
  const chevronDown = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>';
  const logo = `<svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Brand" style="display:block;">
    <rect x="0" y="2" width="24" height="20" rx="4" fill="#3F83F8"/>
    <path d="M6 16L10.5 8l3 5 2-3 2.5 6H6z" fill="white"/>
    <text x="32" y="17" fill="#18191a" font-size="14" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-weight="600" letter-spacing="0.5">MyBrand</text>
  </svg>`;
  return `
    <header style="display:flex; align-items:center; justify-content:space-between; padding: var(--spacing-padding-12) var(--spacing-padding-16); border-bottom:1px solid var(--color-semantic-divider-low-light);">
      <div style="display:flex; align-items:center; gap: var(--spacing-padding-16);">
        <div aria-label="Logo" title="Logo" style="display:inline-flex; align-items:center; height: var(--layout-height-input-sm);">${logo}</div>
        ${Navigation({
          variant: 'top',
          items: [
            { label: 'ホーム', href: '#', current: true, leftIcon: homeIcon },
            { label: 'プロダクト', href: '#', rightIcon: chevronDown },
            { label: 'ドキュメント', href: '#' }
          ]
        })}
      </div>
      <div style="display:flex; align-items:center; gap: var(--spacing-padding-12);">
        ${Input({ type: 'search', placeholder: '検索', size: 'sm' })}
        ${Avatar({ size: 'md', fallback: 'AB' })}
      </div>
    </header>
  `;
};

export const Side = () => Navigation({
  variant: 'side',
  items: [
    { type: 'section', title: 'メイン', items: [
      { label: 'ダッシュボード', href: '#', current: true, leftIcon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>' },
      { label: 'プロジェクト', defaultOpen: true, leftIcon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v4H4zM4 10h16v10H4z"/></svg>', children: [ { label: '一覧', href: '#' }, { label: '新規作成', href: '#' } ] },
      { label: 'レポート', href: '#', leftIcon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v2H3V3zm2 4h3v12H5V7zm5 0h3v8h-3V7zm5 0h3v10h-3V7z"/></svg>' }
    ]},
    { type: 'section', title: '管理', group: 'divider', items: [
      { label: 'チーム', href: '#', leftIcon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>' },
      { label: '権限', href: '#', leftIcon: '<svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M12 1l9 4v6c0 5-3.8 9.7-9 11-5.2-1.3-9-6-9-11V5l9-4zm0 6a3 3 0 100 6 3 3 0 000-6z\"/></svg>' },
      { label: '全体設定', href: '#', leftIcon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.66.07-1s-.03-.68-.07-1l2.11-1.65a.5.5 0 00.12-.64l-2-3.46a.5.5 0 00-.6-.22l-2.49 1a7.03 7.03 0 00-1.73-1l-.38-2.65a.5.5 0 00-.5-.42h-4a.5.5 0 00-.5.42l-.38 2.65c-.62.24-1.2.56-1.73 1l-2.49-1a.5.5 0 00-.6.22l-2 3.46a.5.5 0 00.12.64L4.57 10c-.04.32-.07.66-.07 1s.03.68.07 1L2.46 13.65a.5.5 0 00-.12.64l2 3.46c.14.24.43.34.68.22l2.49-1c.53.44 1.11.76 1.73 1l.38 2.65c.05.24.26.42.5.42h4c.24 0 .45-.18.5-.42l.38-2.65c.62-.24 1.2-.56 1.73-1l2.49 1c.25.12.54.02.68-.22l2-3.46a.5.5 0 00-.12-.64L19.43 12.98zM12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z"/></svg>' }
    ]}
  ]
});
