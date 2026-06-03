/**
 * Checkboxコンポーネント生成関数
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {string} [props.label]
 * @param {string} [props.value]
 * @param {boolean} [props.checked]
 * @param {boolean} [props.indeterminate]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.required]
 * @param {string} [props.id]
 * @param {string} [props.name]
 * @param {string} [props.ariaLabel]
 * @param {string} [props.ariaDescribedby]
 */
function Checkbox({
  size = 'md',
  label = '',
  value = '',
  checked = false,
  indeterminate = false,
  disabled = false,
  required = false,
  id = '',
  name = '',
  ariaLabel = '',
  ariaDescribedby = ''
} = {}) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  
  const classes = [
    'ds-checkbox',
    `ds-checkbox--${size}`,
    disabled ? 'ds-checkbox--disabled' : '',
    checked ? 'ds-checkbox--checked' : '',
    indeterminate ? 'ds-checkbox--indeterminate' : ''
  ].filter(Boolean).join(' ');

  const inputClasses = [
    'ds-checkbox__input',
    `ds-checkbox__input--${size}`
  ].filter(Boolean).join(' ');

  // Accessibility attributes
  const ariaAttrs = [];
  if (ariaLabel) ariaAttrs.push(`aria-label="${ariaLabel}"`);
  if (ariaDescribedby) ariaAttrs.push(`aria-describedby="${ariaDescribedby}"`);
  if (required) ariaAttrs.push('aria-required="true"');

  const inputAttrs = [
    `type="checkbox"`,
    `id="${checkboxId}"`,
    name ? `name="${name}"` : '',
    value ? `value="${value}"` : '',
    checked ? 'checked' : '',
    disabled ? 'disabled' : '',
    required ? 'required' : '',
    ...ariaAttrs
  ].filter(Boolean).join(' ');

  // アイコンの選択
  let iconContent = '';
  if (indeterminate) {
    iconContent = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M4 8h8v1H4z"/>
      </svg>
    `;
  } else if (checked) {
    iconContent = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path fill-rule="evenodd" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
      </svg>
    `;
  }

  const checkboxHTML = `
    <div class="${classes}">
      <div class="ds-checkbox__control">
        <input class="${inputClasses}" ${inputAttrs} />
        <div class="ds-checkbox__indicator ds-checkbox__indicator--${size}">
          ${iconContent}
        </div>
      </div>
      ${label ? `
        <label for="${checkboxId}" class="ds-checkbox__label ds-checkbox__label--${size}">
          ${label}
          ${required ? '<span class="ds-checkbox__required" aria-label="必須">*</span>' : ''}
        </label>
      ` : ''}
    </div>
  `;
  
  // DOMに挿入後にイベントリスナーを設定
  setTimeout(() => {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox && !checkbox.hasAttribute('data-initialized')) {
      checkbox.setAttribute('data-initialized', 'true');
      checkbox.addEventListener('change', function() {
        const container = this.closest('.ds-checkbox');
        const indicator = container.querySelector('.ds-checkbox__indicator');
        
        if (this.checked) {
          container.classList.add('ds-checkbox--checked');
          container.classList.remove('ds-checkbox--indeterminate');
          indicator.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path fill-rule="evenodd" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
          `;
        } else {
          container.classList.remove('ds-checkbox--checked');
          container.classList.remove('ds-checkbox--indeterminate');
          indicator.innerHTML = '';
        }
      });
    }
  }, 0);
  
  return checkboxHTML;
}

export { Checkbox };