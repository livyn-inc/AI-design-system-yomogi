/**
 * Radioコンポーネント生成関数
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {string} [props.label]
 * @param {string} [props.value]
 * @param {string} [props.name]
 * @param {boolean} [props.checked]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.required]
 * @param {string} [props.id]
 * @param {string} [props.ariaLabel]
 * @param {string} [props.ariaDescribedby]
 */
function Radio({
  size = 'md',
  label = '',
  value = '',
  name = '',
  checked = false,
  disabled = false,
  required = false,
  id = '',
  ariaLabel = '',
  ariaDescribedby = ''
} = {}) {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;
  
  const classes = [
    'ds-radio',
    `ds-radio--${size}`,
    disabled ? 'ds-radio--disabled' : '',
    checked ? 'ds-radio--checked' : ''
  ].filter(Boolean).join(' ');

  const inputClasses = [
    'ds-radio__input',
    `ds-radio__input--${size}`
  ].filter(Boolean).join(' ');

  // Accessibility attributes
  const ariaAttrs = [];
  if (ariaLabel) ariaAttrs.push(`aria-label="${ariaLabel}"`);
  if (ariaDescribedby) ariaAttrs.push(`aria-describedby="${ariaDescribedby}"`);
  if (required) ariaAttrs.push('aria-required="true"');

  const inputAttrs = [
    `type="radio"`,
    `id="${radioId}"`,
    name ? `name="${name}"` : '',
    value ? `value="${value}"` : '',
    checked ? 'checked' : '',
    disabled ? 'disabled' : '',
    required ? 'required' : '',
    ...ariaAttrs
  ].filter(Boolean).join(' ');

  const radioHTML = `
    <div class="${classes}">
      <div class="ds-radio__control">
        <input class="${inputClasses}" ${inputAttrs} />
        <div class="ds-radio__indicator ds-radio__indicator--${size}">
          <div class="ds-radio__dot ds-radio__dot--${size}"></div>
        </div>
      </div>
      ${label ? `
        <label for="${radioId}" class="ds-radio__label ds-radio__label--${size}">
          ${label}
          ${required ? '<span class="ds-radio__required" aria-label="必須">*</span>' : ''}
        </label>
      ` : ''}
    </div>
  `;
  
  // DOMに挿入後にイベントリスナーを設定
  setTimeout(() => {
    const radio = document.getElementById(radioId);
    if (radio && !radio.hasAttribute('data-initialized')) {
      radio.setAttribute('data-initialized', 'true');
      radio.addEventListener('change', function() {
        const container = this.closest('.ds-radio');
        const name = this.name;
        
        // 同じnameの他のradioのチェックを外す
        if (name) {
          document.querySelectorAll(`input[name="${name}"][type="radio"]`).forEach(otherRadio => {
            const otherContainer = otherRadio.closest('.ds-radio');
            otherContainer.classList.remove('ds-radio--checked');
          });
        }
        
        // 現在のradioをチェック状態に
        if (this.checked) {
          container.classList.add('ds-radio--checked');
        }
      });
    }
  }, 0);
  
  return radioHTML;
}

export { Radio };