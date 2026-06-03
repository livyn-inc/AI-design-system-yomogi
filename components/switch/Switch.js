export function Switch({
  id = '',
  name = '',
  checked = false,
  disabled = false,
  size = 'md',
  label = '',
  onChange = () => {},
  className = '',
  ...props
} = {}) {
  const uniqueId = id || `switch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const sizeClasses = {
    sm: 'ds-switch--sm',
    md: 'ds-switch--md',
    lg: 'ds-switch--lg'
  };

  const switchClass = [
    'ds-switch',
    sizeClasses[size],
    disabled ? 'ds-switch--disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return `
    <label class="${switchClass}" for="${uniqueId}">
      <input
        type="checkbox"
        id="${uniqueId}"
        name="${name}"
        class="ds-switch__input"
        ${checked ? 'checked' : ''}
        ${disabled ? 'disabled' : ''}
        onchange="${onChange}"
        ${Object.entries(props).map(([key, value]) => `${key}="${value}"`).join(' ')}
      />
      <span class="ds-switch__slider"></span>
      ${label ? `<span class="ds-switch__label">${label}</span>` : ''}
    </label>
  `;
}