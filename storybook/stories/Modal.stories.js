import { Modal } from '../../components/modal/Modal.js';
import '../../components/modal/Modal.css';
import { Button } from '../../components/button/Button.js';
import '../../components/button/Button.css';
export default { title: 'components/Modal' };
export const Default = () => Modal({
  title: 'モーダルタイトル',
  content: 'モーダルの内容',
  size: 'md',
  open: true,
  actions: [
    Button({ variant: 'outline', color: 'neutral', size: 'sm', label: 'キャンセル' }),
    Button({ variant: 'solid', color: 'primary', size: 'sm', label: '保存' })
  ].join('')
});

export const Sizes = () => `
  <style>
    [data-theme="dark"] .ds-modal-sizes-demo { background: var(--color-semantic-overlay-neutral-30-dark) !important; }
  </style>
  <div class="ds-modal-sizes-demo" style="background: var(--color-semantic-overlay-neutral-30-light); padding: var(--spacing-padding-24); border-radius: var(--radius-lg);">
  <div style="display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; align-items:start;">
    ${Modal({ title: 'Small (320px)', content: 'sm', size: 'sm', open: true, staticPreview: true })}
    ${Modal({ title: 'Medium (384px)', content: 'md', size: 'md', open: true, staticPreview: true })}
    ${Modal({ title: 'Large (448px)', content: 'lg', size: 'lg', open: true, staticPreview: true })}
    ${Modal({ title: 'XL (512px)', content: 'xl', size: 'xl', open: true, staticPreview: true })}
    ${Modal({ title: '2XL (576px)', content: '2xl', size: '2xl', open: true, staticPreview: true })}
    ${Modal({ title: '3XL (672px)', content: '3xl', size: '3xl', open: true, staticPreview: true })}
    ${Modal({ title: '4XL (768px)', content: '4xl', size: '4xl', open: true, staticPreview: true })}
    ${Modal({ title: 'Full', content: 'full', size: 'full', open: true, staticPreview: true })}
  </div>
  </div>
`;