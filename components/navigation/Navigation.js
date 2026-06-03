function Navigation({ variant = 'top', items = [] } = {}) {
  if (variant === 'side') {
    const render = (nodes = []) => nodes.map((it) => {
      if (!it) return '';
      // section grouping
      if (it.type === 'section') {
        const groupCls = it.group === 'divider' ? ' ds-nav__section--divider' : (it.group === 'space' ? ' ds-nav__section--spaced' : '');
        const title = it.title ? `<div class=\"ds-nav__section-title\">${it.title}</div>` : '';
        const list = `<ul class=\"ds-nav__section-list\">${render(it.items || [])}</ul>`;
        return `<li class=\"ds-nav__section${groupCls}\">${title}${list}</li>`;
      }
      const hasChildren = Array.isArray(it.children) && it.children.length > 0;
      const left = it.leftIcon ? `<span class=\"ds-nav__left\">${it.leftIcon}</span>` : '';
      const right = it.rightIcon ? `<span class=\"ds-nav__right\">${it.rightIcon}</span>` : '';
      const linkInner = `${left}<span class=\"ds-nav__label\">${it.label || ''}</span>${right}`;
      const link = it.href
        ? `<a class=\"ds-nav__link${it.current ? ' is-current' : ''}\" href=\"${it.href}\" aria-current=\"${it.current ? 'page' : 'false'}\">${linkInner}</a>`
        : `<span class=\"ds-nav__link\">${linkInner}</span>`;
      const toggle = hasChildren ? `<button class=\"ds-nav__toggle\" aria-expanded=\"${it.defaultOpen ? 'true' : 'false'}\" onclick=\"(function(btn){var exp=btn.getAttribute('aria-expanded')==='true';btn.setAttribute('aria-expanded',exp?'false':'true');var ul=btn.closest('.ds-nav__item').querySelector(':scope > ul'); if(ul){ul.classList.toggle('is-collapsed');}})(this)\"><svg class=\"ds-nav__toggle-icon\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M9 6l6 6-6 6-1.4-1.4 4.6-4.6-4.6-4.6z\"/></svg></button>` : '';
      const row = `<div class=\"ds-nav__row\">${link}${toggle}</div>`;
      const alignCls = ` ds-nav__children--align${it.leftIcon ? ' ds-nav__children--has-left' : ''}`;
      const children = hasChildren ? `<ul class=\"ds-nav__children${alignCls}${it.defaultOpen ? '' : ' is-collapsed'}\">${render(it.children).join ? render(it.children) : render(it.children)}</ul>` : '';
      return `<li class=\"ds-nav__item\">${row}${children}</li>`;
    }).join('');
    return `
      <nav class="ds-navigation ds-navigation--side" role="navigation">
        <ul class="ds-nav__root">${render(items)}</ul>
      </nav>
    `;
  }

  // top (horizontal)
  const itemsHtml = items.map((it) => {
    const cls = `ds-nav__link${it.current ? ' is-current' : ''}`;
    const attrs = it.current ? ' aria-current="page"' : '';
    const left = it.leftIcon ? `<span class=\"ds-nav__left\">${it.leftIcon}</span>` : '';
    const right = it.rightIcon ? `<span class=\"ds-nav__right\">${it.rightIcon}</span>` : '';
    const inner = `${left}<span class=\"ds-nav__label\">${it.label}</span>${right}`;
    return it.href
      ? `<a href="${it.href || '#'}" class="${cls}"${attrs}>${inner}</a>`
      : `<span class="${cls}">${inner}</span>`;
  }).join('');
  return `<nav class="ds-navigation ds-navigation--top" role="navigation">${itemsHtml}</nav>`;
}

export { Navigation };