import { Tabs } from '../../components/tabs/Tabs.js';
import '../../components/tabs/Tabs.css';

export default { title: 'components/Tabs' };

const items = [
  { key: 'a', label: 'Tab A', content: '<p>Content A</p>' },
  { key: 'b', label: 'Tab B', content: '<p>Content B</p>' },
  { key: 'c', label: 'Tab C', content: '<p>Content C</p>' }
];

export const Overview = () => `
  <div style="display:flex; flex-direction:column; gap: var(--spacing-padding-32); padding: var(--spacing-padding-24);">
    <p style="margin:0; color: var(--color-semantic-text-middle-light); font-size: var(--font-size-12);">非アクティブタブはhoverで色＋下地＋下線色が変化します。アクティブは下線primary-500。</p>
    <section>
      <h3 style="margin:0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-14); font-weight: var(--font-weight-500); color: var(--color-semantic-text-middle-light);">基本（A アクティブ）</h3>
      ${Tabs({ items, active: 'a' })}
    </section>
    <section>
      <h3 style="margin:0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-14); font-weight: var(--font-weight-500); color: var(--color-semantic-text-middle-light);">B アクティブ</h3>
      ${Tabs({ items, active: 'b' })}
    </section>
    <section>
      <h3 style="margin:0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-14); font-weight: var(--font-weight-500); color: var(--color-semantic-text-middle-light);">ラベル長め</h3>
      ${Tabs({ items: [
        { key: 'l1', label: 'すこし長めのラベル', content: '<p>Content 1</p>' },
        { key: 'l2', label: 'さらに長めのタブラベルの例', content: '<p>Content 2</p>' },
        { key: 'l3', label: '短い', content: '<p>Content 3</p>' }
      ], active: 'l2' })}
    </section>
  </div>
`;




