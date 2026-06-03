function Modal({title = '', content = '', actions = '', open = false, size = 'md', staticPreview = false} = {}) {
  return `<div class="ds-modal ${open ? 'ds-modal--open' : ''} ${staticPreview ? 'ds-modal--static' : ''} ds-modal--size-${size}">
    <div class="ds-modal__backdrop"></div>
    <div class="ds-modal__content">
      <header class="ds-modal__header">
        <h2 class="ds-modal__title">${title}</h2>
        <button class="ds-button-base ds-btn ds-btn--solid ds-btn--primary ds-btn--sm ds-modal__close" aria-label="閉じる"><span class="ds-btn__icon">✕</span></button>
      </header>
      <div class="ds-modal__body">${content}</div>
      ${actions ? `<footer class="ds-modal__footer">${actions}</footer>` : ''}
    </div>
  </div>`;
}
export { Modal };