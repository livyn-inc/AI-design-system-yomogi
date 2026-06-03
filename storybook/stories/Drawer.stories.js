import { Drawer } from '../../components/drawer/Drawer.js';
import '../../components/drawer/Drawer.css';

export default { title: 'components/Drawer' };

export const Overview = () => `
  <div style="position: relative; height: 200px; border: 1px solid var(--color-semantic-divider-middle-light);">
    ${Drawer({ side: 'right', content: '<div>右からのパネル</div>' })}
  </div>
`;

export const Variations = () => `
  <div style="display: grid; gap: var(--spacing-padding-24); padding: var(--spacing-padding-24);">
    <div style="position: relative; height: 160px; border: 1px solid var(--color-semantic-divider-middle-light);">${Drawer({ side: 'left', content: '<div>左からのパネル</div>' })}</div>
    <div style="position: relative; height: 160px; border: 1px solid var(--color-semantic-divider-middle-light);">${Drawer({ side: 'right', content: '<div>右からのパネル</div>' })}</div>
  </div>
`;




