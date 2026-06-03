/**
 * Selectコンポーネント生成関数
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {'default'|'error'|'success'} [props.status]
 * @param {string} [props.placeholder]
 * @param {string} [props.value]
 * @param {string} [props.label]
 * @param {string} [props.helperText]
 * @param {string} [props.errorText]
 * @param {Array} [props.options]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.required]
 * @param {string} [props.id]
 * @param {string} [props.name]
 * @param {string} [props.ariaLabel]
 */
function Select({
  size = 'md',
  status = 'default',
  placeholder = '選択してください',
  value = '',
  label = '',
  helperText = '',
  errorText = '',
  options = [],
  disabled = false,
  required = false,
  id = '',
  name = '',
  ariaLabel = '',
  prefix = ''
} = {}) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const displayId = `${selectId}-display`;
  const helperId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;
  
  const classes = [
    'ds-select',
    `ds-select--${size}`,
    `ds-select--${status}`,
    disabled ? 'ds-select--disabled' : '',
    prefix ? 'ds-select--with-prefix' : ''
  ].filter(Boolean).join(' ');

  const selectClasses = [
    'ds-select__field',
    `ds-select__field--${size}`,
    `ds-select__field--${status}`
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
  if (required) ariaAttrs.push('aria-required="true"');

  const selectAttrs = [
    `id="${selectId}"`,
    name ? `name="${name}"` : '',
    disabled ? 'disabled' : '',
    required ? 'required' : '',
    prefix ? `data-prefix="${prefix}"` : '',
    ...ariaAttrs
  ].filter(Boolean).join(' ');

  const optionsHtml = options.map(option => {
    const optionValue = typeof option === 'object' ? option.value : option;
    const optionLabel = typeof option === 'object' ? option.label : option;
    const optionDisabled = typeof option === 'object' && option.disabled ? 'disabled' : '';
    const selected = value === optionValue ? 'selected' : '';
    return `<option value="${optionValue}" ${selected} ${optionDisabled}>${optionLabel}</option>`;
  }).join('');

  // 初期表示テキスト（prefixあり）
  let initialDisplayText = '';
  if (prefix) {
    const selectedOption = options.find(opt => {
      const optVal = typeof opt === 'object' ? opt.value : opt;
      return optVal === value;
    });
    if (selectedOption) {
      const selectedLabel = typeof selectedOption === 'object' ? selectedOption.label : selectedOption;
      initialDisplayText = prefix + selectedLabel;
    } else if (placeholder) {
      initialDisplayText = prefix + placeholder;
    }
  }

  return `
    <div class="${classes}">
      ${label ? `
        <label for="${selectId}" class="ds-select__label ds-select__label--${size}">
          ${label}
          ${required ? '<span class="ds-select__required" aria-label="必須">*</span>' : ''}
        </label>
      ` : ''}
      
      <div class="ds-select__wrapper">
        <select class="${selectClasses}" ${selectAttrs}>
          ${placeholder && !value ? `<option value="" disabled selected hidden>${placeholder}</option>` : ''}
          ${optionsHtml}
        </select>
        ${prefix ? `
          <div class="ds-select__display" id="${displayId}" aria-hidden="true">
            <span>${initialDisplayText}</span>
          </div>
        ` : ''}
        <span class="ds-select__icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </span>
      </div>
      
      ${status === 'error' && errorText ? `
        <span id="${errorId}" class="ds-select__error-text" role="alert">
          ${errorText}
        </span>
      ` : helperText ? `
        <span id="${helperId}" class="ds-select__helper-text">
          ${helperText}
        </span>
      ` : ''}
    </div>
  `;
}

export { Select };