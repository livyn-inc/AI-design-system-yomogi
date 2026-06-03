function SideNav({
  variant = 'permanent',
  width = 'default',
  collapsed = false,
  logo = null,
  navigation = null,
  footer = null,
  collapsible = true,
  overlay = false
} = {}) {
  
  // Logo section
  const logoSection = logo ? `
    <div class="ds-sidenav__logo">
      ${typeof logo === 'string' ? logo : (logo.href 
        ? `<a href="${logo.href}" class="ds-sidenav__logo-link">${logo.icon || ''}${!collapsed ? (logo.text || '') : ''}</a>`
        : `<span class="ds-sidenav__logo-text">${logo.icon || ''}${!collapsed ? (logo.text || '') : ''}</span>`
      )}
    </div>
  ` : '';

  // Navigation section
  const navSection = navigation ? `
    <nav class="ds-sidenav__navigation" role="navigation">
      ${navigation}
    </nav>
  ` : '';

  // Footer section
  const footerSection = footer ? `
    <div class="ds-sidenav__footer">
      ${footer}
    </div>
  ` : '';

  // Collapse toggle button
  const collapseToggle = collapsible ? `
    <button 
      class="ds-sidenav__toggle" 
      aria-label="${collapsed ? 'メニューを展開' : 'メニューを折りたたむ'}"
      onclick="(function(btn){
        var sidenav = btn.closest('.ds-sidenav');
        var isCollapsed = sidenav.classList.contains('ds-sidenav--collapsed');
        sidenav.classList.toggle('ds-sidenav--collapsed');
        btn.setAttribute('aria-label', isCollapsed ? 'メニューを折りたたむ' : 'メニューを展開');
        
        // Update logo text visibility
        var logoTexts = sidenav.querySelectorAll('.ds-sidenav__logo-text, .ds-sidenav__logo-link');
        logoTexts.forEach(function(el) {
          var icon = el.querySelector('i, svg');
          var textContent = el.textContent.trim();
          if (isCollapsed) {
            el.innerHTML = (icon ? icon.outerHTML : '') + textContent;
          } else {
            el.innerHTML = icon ? icon.outerHTML : '';
          }
        });
      })(this)">
      <i data-lucide="chevron-left"></i>
    </button>
  ` : '';

  // Container classes
  const containerClasses = [
    'ds-sidenav',
    `ds-sidenav--${variant}`,
    `ds-sidenav--width-${width}`,
    collapsed ? 'ds-sidenav--collapsed' : '',
    overlay ? 'ds-sidenav--overlay' : ''
  ].filter(Boolean).join(' ');

  return `
    <aside class="${containerClasses}" role="complementary" aria-label="サイドナビゲーション">
      <div class="ds-sidenav__container">
        ${logoSection}
        ${navSection}
        ${footerSection}
        ${collapseToggle}
      </div>
      ${variant === 'temporary' ? '<div class="ds-sidenav__backdrop"></div>' : ''}
    </aside>
  `;
}

export { SideNav };