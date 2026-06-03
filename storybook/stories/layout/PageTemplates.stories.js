import './_templates.css';
import '../../../components/layout/PageTemplate.css';
import '../_matrix.css';
import { renderMatrix } from '../_matrix.js';
import { PageTemplate } from '../../../components/layout/PageTemplate.js';
import { makeBlock, makeCardGrid } from './_templates.js';

export default {
  title: 'layout/PageTemplates',
};

const header = makeBlock('Header');
const subheader = makeBlock('Subheader');
const toolbar = makeBlock('Toolbar');
const main = makeBlock('Main', makeCardGrid(6));
const aside = makeBlock('Aside', makeCardGrid(3));
const aside2 = makeBlock('Aside 2');
const footer = makeBlock('Footer');

export const Overview = () => `
  <div class="tpl-area">
    ${PageTemplate({ columns: 'one-col', maxWidth: '5xl', slots: { header, main, footer } })}
    ${PageTemplate({ columns: 'two-col', maxWidth: '7xl', slots: { header, main, aside, footer } })}
    ${PageTemplate({ columns: 'three-col', maxWidth: '7xl', slots: { header, main, aside, aside2, footer } })}
  </div>
`;

export const Variations = () => `
  <div class="tpl-area">
    ${PageTemplate({ columns: 'two-col', density: 'comfortable', slots: { header, subheader, main, aside, footer } })}
    ${PageTemplate({ columns: 'two-col', stickyAside: true, slots: { header, toolbar, main, aside, footer } })}
    ${PageTemplate({ columns: 'three-col', stickyAside: true, slots: { header, subheader, toolbar, main, aside, aside2, footer } })}
    <!-- 全幅2カラム（edge-to-edge）デモ -->
    ${PageTemplate({ container: 'full', columns: 'two-col', stickyAside: true, slots: { header, main, aside, footer } })}
  </div>
`;

export const ColumnOrderVariations = () => `
  <div class="tpl-area">
    <!-- デフォルト順序（main → aside） -->
    <h3 style="margin-bottom: var(--spacing-padding-16);">右サイドバー（デフォルト）</h3>
    ${PageTemplate({ columns: 'two-col', slots: { header, main, aside, footer } })}
    
    <!-- カスタム順序（aside → main） -->
    <h3 style="margin-top: var(--spacing-padding-32); margin-bottom: var(--spacing-padding-16);">左サイドバー</h3>
    ${PageTemplate({ columns: 'two-col', columnOrder: ['aside', 'main'], slots: { header, main, aside, footer } })}
    
    <!-- 3カラムのカスタム順序 -->
    <h3 style="margin-top: var(--spacing-padding-32); margin-bottom: var(--spacing-padding-16);">3カラム（aside → main → aside2）</h3>
    ${PageTemplate({ columns: 'three-col', columnOrder: ['aside', 'main', 'aside2'], slots: { header, main, aside, aside2, footer } })}
  </div>
`;

export const CompleteMatrix = () => {
  const sizes = ['sm', 'md', 'lg'];
  const states = [
    { key: 'base', label: 'Base', props: { columns: 'two-col', stickyAside: false } },
    { key: 'sticky', label: 'Sticky Aside', props: { columns: 'two-col', stickyAside: true } },
    { key: 'three', label: 'Three Columns', props: { columns: 'three-col', stickyAside: true } },
  ];

  const sizeToMaxWidth = {
    sm: 'md',
    md: 'xl',
    lg: '5xl',
  };

  return renderMatrix({
    title: 'Complete Matrix (State × Size)',
    sizes,
    states,
    renderCell: (size, stateKey) => {
      const st = states.find((s) => s.key === stateKey);
      return PageTemplate({ maxWidth: sizeToMaxWidth[size], ...st.props, slots: { header, main, aside, footer } });
    },
  });
};


