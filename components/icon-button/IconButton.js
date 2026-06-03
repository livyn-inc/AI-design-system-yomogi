/**
 * IconButton コンポーネント（アイコンのみのボタン）
 * 既存 Button と同一の variant / color / size / state 仕様に追従
 * 高さは Button と同サイズで揃う（paddingとフォントサイズを同値利用）
 * @param {string} icon - アイコンのHTML文字列
 * @param {'solid'|'outline'|'ghost'|'outline-solid'|'ghost-solid'} [variant]
 * @param {'sm'|'md'|'lg'} [size]
 * @param {'primary'|'neutral'|'negative'|'absolute-white'|'absolute-black'} [color]
 * @param {'enable'|'hover'|'active'|'loading'|'disabled'} [state]
 * @param {string} [ariaLabel]
 * @param {string} [title]
 * @param {boolean} [disabled]
 * @param {boolean} [loading]
 * @param {string} [className]
 * @param {string} [id]
 * @param {Object} [dataAttributes] - data-* 属性のオブジェクト（例: { deleteIndex: '0' } → data-delete-index="0"）
 */
function IconButton({
  icon = '',
  variant = 'ghost',
  size = 'md',
  color = 'neutral',
  state = 'enable',
  ariaLabel = '',
  title = '',
  disabled = false,
  loading = false,
  className = '',
  id = '',
  dataAttributes = {}
} = {}) {
  const classes = [
    'ds-button-base',
    'ds-btn',
    `ds-btn--${variant}`,
    `ds-btn--${color}`,
    `ds-btn--${size}`,
    'ds-btn--icon',
    state !== 'enable' ? `ds-btn--${state}` : '',
    disabled ? 'ds-btn--disabled' : '',
    loading ? 'ds-btn--loading' : '',
    className
  ].filter(Boolean).join(' ');

  const aria = ariaLabel ? `aria-label="${ariaLabel}"` : '';
  const titleAttr = title ? `title="${title}"` : '';
  const disabledAttr = disabled ? 'disabled' : '';
  const idAttr = id ? `id="${id}"` : '';
  const spinner = loading ? '<span class="ds-btn__spinner" aria-hidden="true"></span>' : '';
  
  // data-* 属性を生成（camelCase → kebab-case変換）
  const dataAttrs = Object.entries(dataAttributes)
    .map(([key, value]) => {
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `data-${kebabKey}="${value}"`;
    })
    .join(' ');

  return `
    <button type="button" class="${classes}" ${aria} ${titleAttr} ${disabledAttr} ${idAttr} ${dataAttrs}>
      <span class="ds-btn__icon" aria-hidden="true">${icon}</span>
      ${spinner}
    </button>
  `;
}

export { IconButton };

