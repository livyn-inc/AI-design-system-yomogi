import { Popover } from '../../components/popover/Popover.js';
import '../../components/popover/Popover.css';
import './_matrix.css';
import { renderMatrix } from './_matrix.js';

export default { title: 'components/Popover' };

export const Overview = () => `
  <div style="display: flex; gap: var(--spacing-padding-24); padding: var(--spacing-padding-24); align-items: start;">
    ${Popover({ content: '<div>コンテンツ</div>' })}
    ${Popover({ placement: 'right', content: '<div>右側</div>' })}
  </div>
`;

export const CompleteMatrix = () => {
  const sizes = ['sm', 'md', 'lg'];
  const states = [
    { key: 'top', label: 'Top', props: { placement: 'top', content: 'Top' } },
    { key: 'right', label: 'Right', props: { placement: 'right', content: 'Right' } },
    { key: 'bottom', label: 'Bottom', props: { placement: 'bottom', content: 'Bottom' } },
    { key: 'left', label: 'Left', props: { placement: 'left', content: 'Left' } }
  ];
  return renderMatrix({
    title: 'Complete Matrix (Placement)',
    sizes,
    states,
    renderCell: (_size, stateKey) => {
      const st = states.find(s => s.key === stateKey);
      return `${Popover({ ...st.props })}`;
    }
  });
};

export const Variations = () => `
  <div style="display: flex; gap: var(--spacing-padding-24); padding: var(--spacing-padding-24); align-items: start;">
    ${Popover({ content: '<strong>リッチ</strong> <em>HTML</em>' })}
  </div>
`;




