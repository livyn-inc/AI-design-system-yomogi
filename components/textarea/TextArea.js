export function TextArea({
  id = '',
  name = '',
  value = '',
  placeholder = '',
  label = '',
  helperText = '',
  errorText = '',
  status = 'default', // default, error, success
  size = 'md', // sm, md, lg
  rows = 4,
  cols = null,
  resize = 'vertical', // none, vertical, horizontal, both
  disabled = false,
  readonly = false,
  required = false,
  maxLength = null,
  className = '',
  onChange = () => {},
  ...props
} = {}) {
  const uniqueId = id || `textarea-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const helperId = `${uniqueId}-helper`;
  const errorId = `${uniqueId}-error`;
  
  const sizeClasses = {
    sm: 'ds-textarea--sm',
    md: 'ds-textarea--md',
    lg: 'ds-textarea--lg'
  };

  const statusClasses = {
    default: '',
    error: 'ds-textarea--error',
    success: 'ds-textarea--success'
  };

  const resizeClasses = {
    none: 'ds-textarea--resize-none',
    vertical: 'ds-textarea--resize-vertical',
    horizontal: 'ds-textarea--resize-horizontal',
    both: 'ds-textarea--resize-both'
  };

  const containerClass = [
    'ds-textarea',
    sizeClasses[size],
    statusClasses[status],
    disabled ? 'ds-textarea--disabled' : '',
    readonly ? 'ds-textarea--readonly' : '',
    className
  ].filter(Boolean).join(' ');

  const fieldClass = [
    'ds-textarea__field',
    resizeClasses[resize]
  ].filter(Boolean).join(' ');

  // Determine which message to show
  const showError = status === 'error' && errorText;
  const showHelper = !showError && helperText;

  // Accessibility attributes for textarea
  const ariaAttrs = [];
  if (showError) {
    ariaAttrs.push(`aria-invalid="true"`);
    ariaAttrs.push(`aria-describedby="${errorId}"`);
  } else if (showHelper) {
    ariaAttrs.push(`aria-describedby="${helperId}"`);
  }

  return `
    <div class="${containerClass}">
      ${label ? `
        <label class="ds-textarea__label" for="${uniqueId}">
          ${label}
          ${required ? '<span class="ds-textarea__required">*</span>' : ''}
        </label>
      ` : ''}
      
      <div class="ds-textarea__wrapper">
        <textarea
          id="${uniqueId}"
          name="${name}"
          class="${fieldClass}"
          placeholder="${placeholder}"
          rows="${rows}"
          ${cols ? `cols="${cols}"` : ''}
          ${disabled ? 'disabled' : ''}
          ${readonly ? 'readonly' : ''}
          ${required ? 'required' : ''}
          ${maxLength ? `maxlength="${maxLength}"` : ''}
          onchange="${onChange}"
          ${ariaAttrs.join(' ')}
          ${Object.entries(props).map(([key, val]) => `${key}="${val}"`).join(' ')}
        >${value}</textarea>
      </div>
      
      ${showError ? `
        <span id="${errorId}" class="ds-textarea__error-text" role="alert">
          ${errorText}
        </span>
      ` : ''}
      
      ${showHelper ? `
        <span id="${helperId}" class="ds-textarea__helper-text">
          ${helperText}
        </span>
      ` : ''}
      
      ${maxLength ? `
        <div class="ds-textarea__counter">
          <span class="ds-textarea__counter-current">${value.length}</span>
          <span class="ds-textarea__counter-separator">/</span>
          <span class="ds-textarea__counter-max">${maxLength}</span>
        </div>
      ` : ''}
    </div>
  `;
}