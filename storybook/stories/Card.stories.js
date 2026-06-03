import { Card } from '../../components/card/Card.js';
import '../../components/card/Card.css';
import './_matrix.css';
import { renderMatrix } from './_matrix.js';

export default {
  title: 'components/Card',
  parameters: {
    docs: {
      description: { component: '情報をまとまりとして表示するカードコンポーネント。variant/sizeに対応。' }
    }
  },
  argTypes: {
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'], description: 'サイズ' },
    variant: { control: { type: 'select' }, options: ['elevated', 'outlined', 'filled'], description: '見た目のバリエーション' },
    title: { control: 'text', description: 'タイトル' },
    subtitle: { control: 'text', description: 'サブタイトル' },
    content: { control: 'text', description: '本文HTML' },
    actions: { control: 'text', description: 'アクションHTML（ボタン等）' },
    image: { control: 'text', description: '画像HTML（<img>等）' },
    clickable: { control: 'boolean', description: 'ホバー時のエレベーション' },
    href: { control: 'text', description: 'リンク先（指定時は<a>で出力）' }
  }
};

// Overview
export const Overview = () => `
  <div style="display: flex; flex-direction: column; gap: var(--spacing-padding-32); padding: var(--spacing-padding-24);">
    <div>
      <h3 style="margin: 0 0 var(--spacing-padding-16) 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600);">Card Overview</h3>
      <div style="display: flex; gap: var(--spacing-padding-16); flex-wrap: wrap; align-items: start;">
        <div style="width: var(--layout-max-width-md);">${Card({ size: 'sm', title: '小サイズ', content: 'コンパクトな表示に適しています。' })}</div>
        <div style="width: var(--layout-max-width-md);">${Card({ size: 'md', title: '中サイズ', content: '標準的なサイズです。' })}</div>
        <div style="width: var(--layout-max-width-md);">${Card({ size: 'lg', title: '大サイズ', content: '大きめの表示でインパクトがあります。' })}</div>
      </div>
    </div>
  </div>
`;

// Complete Matrix (State × Size)
export const CompleteMatrix = () => {
  const sizes = ['sm', 'md', 'lg'];
  const states = [
    { key: 'elevated', label: 'Elevated', props: { variant: 'elevated', title: 'Elevated', content: '浮き上がりを表現（ライト: 影、ダーク: 面の明度差＋控えめな影）。' } },
    { key: 'outlined', label: 'Outlined', props: { variant: 'outlined', title: 'Outlined', content: '枠線で区切る。' } },
    { key: 'filled', label: 'Filled', props: { variant: 'filled', title: 'Filled', content: '背景色で差別化。' } },
    { key: 'clickable', label: 'Clickable', props: { variant: 'elevated', clickable: true, title: 'Clickable', content: 'ホバーで浮き上がり。' } },
  ];

  return renderMatrix({
    title: 'Complete Matrix (State × Size)',
    sizes,
    states,
    renderCell: (size, stateKey) => {
      const st = states.find(s => s.key === stateKey);
      return `<div style="width: var(--layout-max-width-md);">${Card({ size, id: `card-${stateKey}-${size}`, ...st.props })}</div>`;
    }
  });
};

// Variations（固有パターンのダイジェスト）
export const Variations = () => `
  <div style="display: flex; flex-direction: column; gap: var(--spacing-padding-32); padding: var(--spacing-padding-24);">
    <div>
      <h4 style="margin: 0 0 var(--spacing-padding-16) 0; font-size: var(--font-size-16); font-weight: var(--font-weight-600);">With Image</h4>
      <div style="width: var(--layout-max-width-md);">
        ${Card({
          title: '画像付きカード',
          subtitle: '美しい風景',
          content: '画像を含むカードの例です。',
          image: '<img src="https://picsum.photos/400/240" alt="サンプル画像" style="width: 100%; height: auto;" />'
        })}
      </div>
    </div>
    <div>
      <h4 style="margin: 0 0 var(--spacing-padding-16) 0; font-size: var(--font-size-16); font-weight: var(--font-weight-600);">With Actions</h4>
      <div style="width: var(--layout-max-width-md);">
        ${Card({
          title: 'アクション付きカード',
          subtitle: '操作可能なカード',
          content: 'アクションボタンがあるカードです。',
          actions: `
            <button class="ds-button-base ds-btn ds-btn--ghost ds-btn--neutral ds-btn--sm">キャンセル</button>
            <button class="ds-button-base ds-btn ds-btn--solid ds-btn--primary ds-btn--sm">詳細を見る</button>
          `
        })}
      </div>
    </div>
    <div>
      <h4 style="margin: 0 0 var(--spacing-padding-16) 0; font-size: var(--font-size-16); font-weight: var(--font-weight-600);">Clickable / Link</h4>
      <div style="display: flex; gap: var(--spacing-padding-16); flex-wrap: wrap; align-items: start;">
        ${Card({ variant: 'elevated', clickable: true, title: 'クリック可能', subtitle: 'ホバーで浮き上がり', content: 'このカードはクリック可能です。' })}
        ${Card({ variant: 'outlined', clickable: true, href: '#', title: 'リンク付き', subtitle: 'クリックで遷移', content: 'href指定時はリンクになります。' })}
      </div>
    </div>
  </div>
`;