/**
 * Inputコンポーネント生成関数
 * @param {Object} props
 * @param {'text'|'email'|'password'|'number'|'tel'|'url'|'search'} [props.type]
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {'default'|'error'|'success'} [props.status]
 * @param {string} [props.placeholder]
 * @param {string} [props.value]
 * @param {string} [props.label]
 * @param {string} [props.helperText]
 * @param {string} [props.errorText]
 * @param {string} [props.leftIcon]
 * @param {string} [props.rightIcon]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.readonly]
 * @param {boolean} [props.required]
 * @param {string} [props.id]
 * @param {string} [props.name]
 * @param {string} [props.ariaLabel]
 * @param {string} [props.ariaDescribedby]
 */
function Input({
  type = 'text',
  size = 'md',
  status = 'default',
  placeholder = '',
  value = '',
  label = '',
  helperText = '',
  errorText = '',
  leftIcon = '',
  rightIcon = '',
  disabled = false,
  readonly = false,
  required = false,
  id = '',
  name = '',
  ariaLabel = '',
  ariaDescribedby = ''
} = {}) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  
  const classes = [
    'ds-input',
    `ds-input--${size}`,
    `ds-input--${status}`,
    disabled ? 'ds-input--disabled' : '',
    readonly ? 'ds-input--readonly' : '',
    leftIcon ? 'ds-input--with-left-icon' : '',
    rightIcon ? 'ds-input--with-right-icon' : ''
  ].filter(Boolean).join(' ');

  const inputClasses = [
    'ds-input__field',
    `ds-input__field--${size}`,
    `ds-input__field--${status}`
  ].filter(Boolean).join(' ');

  // Accessibility attributes
  const ariaAttrs = [];
  if (ariaLabel) ariaAttrs.push(`aria-label="${ariaLabel}"`);
  if (errorText && status === 'error') {
    ariaAttrs.push(`aria-invalid="true"`);
    ariaAttrs.push(`aria-describedby="${errorId}"`);
  } else if (helperText) {
    ariaAttrs.push(`aria-describedby="${helperId}"`);
  }
  if (ariaDescribedby) ariaAttrs.push(`aria-describedby="${ariaDescribedby}"`);
  if (required) ariaAttrs.push('aria-required="true"');

  const inputAttrs = [
    `type="${type}"`,
    `id="${inputId}"`,
    name ? `name="${name}"` : '',
    placeholder ? `placeholder="${placeholder}"` : '',
    value ? `value="${value}"` : '',
    disabled ? 'disabled' : '',
    readonly ? 'readonly' : '',
    required ? 'required' : '',
    ...ariaAttrs
  ].filter(Boolean).join(' ');

  return `
    <div class="${classes}">
      ${label ? `
        <label for="${inputId}" class="ds-input__label ds-input__label--${size}">
          ${label}
          ${required ? '<span class="ds-input__required" aria-label="必須">*</span>' : ''}
        </label>
      ` : ''}
      
      <div class="ds-input__wrapper">
        ${leftIcon ? `<span class="ds-input__icon ds-input__icon--left">${leftIcon}</span>` : ''}
        <input class="${inputClasses}" ${inputAttrs} />
        ${rightIcon ? `<span class="ds-input__icon ds-input__icon--right">${rightIcon}</span>` : ''}
      </div>
      
      ${status === 'error' && errorText ? `
        <span id="${errorId}" class="ds-input__error-text" role="alert">
          ${errorText}
        </span>
      ` : helperText ? `
        <span id="${helperId}" class="ds-input__helper-text">
          ${helperText}
        </span>
      ` : ''}
    </div>
  `;
}

export { Input };