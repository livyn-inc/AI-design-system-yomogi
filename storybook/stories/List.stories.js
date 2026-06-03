import { List } from '../../components/list/List.js';
import '../../components/list/List.css';
import './_matrix.css';
import { renderMatrix } from './_matrix.js';

export default { title: 'components/List' };

export const Overview = () => `
  <div style="padding: var(--spacing-padding-24); display: grid; gap: var(--spacing-padding-24)">
    <div>
      <h4>plain</h4>
      ${List({ variant: 'plain', size: 'md', items: [
        { leading: '📄', title: 'ドキュメント', subtitle: '説明テキスト' },
        { leading: '🔧', title: '設定', subtitle: '環境設定' }
      ] })}
    </div>
    <div>
      <h4>divided</h4>
      ${List({ variant: 'divided', size: 'md', items: [
        { title: '項目A', meta: '情報' },
        { title: '項目B', meta: '詳細' }
      ] })}
    </div>
  </div>
`;

export const CompleteMatrix = () => {
  const sizes = ['sm','md','lg'];
  const states = [
    { key: 'plain', label: 'plain', props: { variant: 'plain' } },
    { key: 'divided', label: 'divided', props: { variant: 'divided' } }
  ];
  return renderMatrix({
    title: 'Complete Matrix (Variant × Size)',
    sizes,
    states,
    renderCell: (size, stateKey) => {
      const st = states.find(s => s.key === stateKey);
      return List({ size, ...st.props, items: [
        { leading: '📄', title: '項目1', subtitle: '説明' },
        { leading: '🔧', title: '項目2', subtitle: '説明' }
      ]});
    }
  });
};

export const SelectionSingle = () => `
  <div style="padding: var(--spacing-padding-24);">
    ${List({ variant: 'divided', size: 'md', selection: 'single', items: [
      { title: 'A' }, { title: 'B' }, { title: 'C' }
    ] })}
  </div>
`;

export const SelectionMultiple = () => `
  <div style="padding: var(--spacing-padding-24);">
    ${List({ variant: 'divided', size: 'md', selection: 'multiple', items: [
      { title: 'メール通知' }, { title: 'プッシュ通知' }, { title: 'ニュースレター' }
    ] })}
  </div>
`;

export const Navigation = () => `
  <div style="padding: var(--spacing-padding-24); width: 320px;">
    ${List({ variant: 'nav', size: 'md', items: [
      { title: 'ダッシュボード', href: '#', current: true },
      { title: 'プロジェクト', children: [ { title: '一覧', href: '#' }, { title: '新規作成', href: '#' } ], defaultOpen: true },
      { type: 'separator' },
      { title: '設定', href: '#' }
    ] })}
  </div>
`;

export const Structured = () => `
  <div style="padding: var(--spacing-padding-24); width: 480px;">
    ${List({ variant: 'structured', size: 'md', items: [
      { key: 'ユーザー名', value: '山田 太郎' },
      { key: 'メール', value: 'taro@example.com' },
      { key: 'ロール', value: '管理者' }
    ] })}
  </div>
`;