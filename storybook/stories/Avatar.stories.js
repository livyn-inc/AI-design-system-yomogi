import { Avatar } from '../../components/avatar/Avatar.js';
import '../../components/avatar/Avatar.css';
import './_matrix.css';
import { renderMatrix } from './_matrix.js';

export default { title: 'components/Avatar' };

export const Overview = () => `
  <div style="display: flex; gap: var(--spacing-padding-16); padding: var(--spacing-padding-24); align-items: center;">
    ${Avatar({ size: 'sm', fallback: 'AB' })}
    ${Avatar({ size: 'md', src: 'https://placehold.co/80', alt: 'Avatar' })}
    ${Avatar({ size: 'lg', fallback: 'CD' })}
  </div>
`;

export const CompleteMatrix = () => {
  const sizes = ['sm', 'md', 'lg'];
  const states = [
    { key: 'image', label: 'Image', props: { src: 'https://placehold.co/160', alt: 'Avatar' } },
    { key: 'fallback', label: 'Fallback', props: { fallback: 'AA' } }
  ];

  return renderMatrix({
    title: 'Complete Matrix (Type × Size)',
    sizes,
    states,
    renderCell: (size, stateKey) => {
      const st = states.find(s => s.key === stateKey);
      return `${Avatar({ size, ...st.props })}`;
    }
  });
};

export const Variations = () => `
  <div style="display: flex; gap: var(--spacing-padding-16); padding: var(--spacing-padding-24); align-items: center;">
    ${Avatar({ size: 'md', fallback: 'EF' })}
    ${Avatar({ size: 'md', src: 'https://placehold.co/120', alt: 'User' })}
  </div>
`;




