function TopBar({
  variant = 'primary',
  logo = null,
  navigation = null,
  actions = [],
  background = 'default',
  sticky = false,
  bordered = false,
  height = 'default'
} = {}) {
  
  // Logo section
  const logoSection = logo ? `
    <div class="ds-topbar__logo">
      ${typeof logo === 'string' ? logo : (logo.href 
        ? `<a href="${logo.href}" class="ds-topbar__logo-link">${logo.icon || ''}${logo.text || ''}</a>`
        : `<span class="ds-topbar__logo-text">${logo.icon || ''}${logo.text || ''}</span>`
      )}
    </div>
  ` : '';

  // Navigation section (Breadcrumb or custom navigation)
  const navSection = navigation ? `
    <div class="ds-topbar__navigation">
      ${navigation}
    </div>
  ` : '';

  // Actions section (right side utilities)
  const actionsSection = actions.length > 0 ? `
    <div class="ds-topbar__actions">
      ${actions.map(action => {
        if (typeof action === 'string') return action;
        if (action.type === 'text') {
          return `<span class="ds-topbar__action ds-topbar__action--text">${action.content}</span>`;
        }
        if (action.type === 'icon') {
          return action.href 
            ? `<a href="${action.href}" class="ds-topbar__action ds-topbar__action--icon" ${action.ariaLabel ? `aria-label="${action.ariaLabel}"` : ''}>${action.icon}</a>`
            : `<button class="ds-topbar__action ds-topbar__action--icon" ${action.ariaLabel ? `aria-label="${action.ariaLabel}"` : ''}>${action.icon}</button>`;
        }
        if (action.type === 'button') {
          return `<button class="ds-topbar__action ds-topbar__action--button">${action.content}</button>`;
        }
        return action;
      }).join('')}
    </div>
  ` : '';

  // Container classes
  const containerClasses = [
    'ds-topbar',
    `ds-topbar--${variant}`,
    background !== 'default' ? `ds-topbar--bg-${background}` : '',
    sticky ? 'ds-topbar--sticky' : '',
    bordered ? 'ds-topbar--bordered' : '',
    height !== 'default' ? `ds-topbar--height-${height}` : ''
  ].filter(Boolean).join(' ');

  return `
    <header class="${containerClasses}" role="banner">
      <div class="ds-topbar__container">
        ${logoSection}
        ${navSection}
        ${actionsSection}
      </div>
    </header>
  `;
}

export { TopBar };