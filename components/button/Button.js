/**
 * Buttonコンポーネント生成関数
 * @param {Object} props
 * @param {'solid'|'outline'|'ghost'|'outline-solid'|'ghost-solid'} [props.variant]
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {'primary'|'neutral'|'negative'|'absolute-white'|'absolute-black'} [props.color]
 * @param {'enable'|'hover'|'active'|'loading'|'disabled'} [props.state]
 * @param {string} [props.leftIcon] - 左側アイコン（HTML文字列）
 * @param {string} [props.rightIcon] - 右側アイコン（HTML文字列）
 * @param {string} [props.label] - ボタンラベル
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.loading]
 * @param {string} [props.ariaLabel] - アクセシビリティ用ラベル
 * @param {string} [props.id] - ボタンのID属性
 */
function Button({
  variant = 'solid',
  size = 'md',
  color = 'primary',
  state = 'enable',
  leftIcon = '',
  rightIcon = '',
  label = '',
  disabled = false,
  loading = false,
  ariaLabel = '',
  id = ''
} = {}) {
  const classes = [
    'ds-button-base',
    'ds-btn',
    `ds-btn--${variant}`,
    `ds-btn--${color}`,
    `ds-btn--${size}`,
    state !== 'enable' ? `ds-btn--${state}` : '',
    disabled ? 'ds-btn--disabled' : '',
    loading ? 'ds-btn--loading' : ''
  ].filter(Boolean).join(' ');

  // アクセシビリティ
  const aria = ariaLabel ? `aria-label="${ariaLabel}"` : label ? `aria-label="${label}"` : '';
  const isDisabled = disabled || loading;
  const disabledAttr = isDisabled ? 'disabled' : '';
  const busyAttr = loading ? 'aria-busy="true"' : '';
  const idAttr = id ? `id="${id}"` : '';

  // ローディング時はスピナー表示（仮）
  const spinner = loading ? '<span class="ds-btn__spinner" aria-hidden="true"></span>' : '';

  return `
    <button type="button" class="${classes}" ${aria} ${disabledAttr} ${busyAttr} ${idAttr}>
      ${leftIcon ? `<span class="ds-btn__icon ds-btn__icon--left">${leftIcon}</span>` : ''}
      <span class="ds-btn__label">${label}</span>
      ${rightIcon ? `<span class="ds-btn__icon ds-btn__icon--right">${rightIcon}</span>` : ''}
      ${spinner}
    </button>
  `;
}

export { Button };