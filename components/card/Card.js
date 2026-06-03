/**
 * Cardコンポーネント生成関数
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {'elevated'|'outlined'|'filled'} [props.variant]
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {string} [props.content]
 * @param {string} [props.actions]
 * @param {string} [props.image]
 * @param {boolean} [props.clickable]
 * @param {string} [props.href]
 */
function Card({
  size = 'md',
  variant = 'elevated',
  title = '',
  subtitle = '',
  content = '',
  actions = '',
  image = '',
  clickable = false,
  href = ''
} = {}) {
  const classes = [
    'ds-card',
    `ds-card--${size}`,
    `ds-card--${variant}`,
    clickable ? 'ds-card--clickable' : ''
  ].filter(Boolean).join(' ');

  const Tag = href ? 'a' : 'div';
  const tagAttrs = href ? `href="${href}"` : '';

  return `
    <${Tag} class="${classes}" ${tagAttrs}>
      ${image ? `<div class="ds-card__image">${image}</div>` : ''}
      <div class="ds-card__content">
        ${title ? `<h3 class="ds-card__title ds-card__title--${size}">${title}</h3>` : ''}
        ${subtitle ? `<p class="ds-card__subtitle ds-card__subtitle--${size}">${subtitle}</p>` : ''}
        ${content ? `<div class="ds-card__body ds-card__body--${size}">${content}</div>` : ''}
      </div>
      ${actions ? `<div class="ds-card__actions">${actions}</div>` : ''}
    </${Tag}>
  `;
}

export { Card };