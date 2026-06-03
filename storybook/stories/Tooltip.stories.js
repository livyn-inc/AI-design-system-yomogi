import { Tooltip } from '../../components/tooltip/Tooltip.js';
import '../../components/tooltip/Tooltip.css';
import './_matrix.css';
import { renderMatrix } from './_matrix.js';

export default { title: 'components/Tooltip' };

export const Overview = () => `
  <div style="display: flex; gap: var(--spacing-padding-24); padding: var(--spacing-padding-120) var(--spacing-padding-24) var(--spacing-padding-24) var(--spacing-padding-120); flex-wrap: wrap;">
    ${Tooltip({ content: '短', triggerHtml: '<button class="ds-tooltip__trigger">短文</button>' })}
    ${Tooltip({ content: 'これは中程度の長さのツールチップテキストです', triggerHtml: '<button class="ds-tooltip__trigger">中文</button>' })}
    ${Tooltip({ content: 'これは非常に長いツールチップのテキストです。文字量が多い場合でも適切に改行されて表示されることを確認するためのサンプルテキストになります。', triggerHtml: '<button class="ds-tooltip__trigger">長文</button>' })}
    ${Tooltip({ content: 'This is a very long English tooltip text to check if word wrapping works correctly for English sentences as well.', triggerHtml: '<button class="ds-tooltip__trigger">English</button>' })}
  </div>
`;

export const CompleteMatrix = () => {
  const sizes = ['md'];
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
      return `${Tooltip({ ...st.props })}`;
    }
  });
};



