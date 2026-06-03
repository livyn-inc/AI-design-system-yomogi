function Breadcrumb({
  items = [],
  separator = '/',
  size = 'md',
  maxVisible = 5,
  collapseMode = 'middle' // 'middle' | 'start' | 'end'
} = {}) {
  const SEP = `<span class=\"ds-breadcrumb__separator\">${separator}</span>`;

  const renderLabel = (it) => {
    const left = it.leftIcon ? `<span class=\"ds-breadcrumb__icon ds-breadcrumb__icon--left\">${it.leftIcon}</span>` : '';
    const right = it.rightIcon ? `<span class=\"ds-breadcrumb__icon ds-breadcrumb__icon--right\">${it.rightIcon}</span>` : '';
    return `${left}<span class=\"ds-breadcrumb__label\">${it.label || ''}</span>${right}`;
  };

  const renderItem = (it, isLast) => {
    if (isLast) {
      return `<li class=\"ds-breadcrumb__item is-current\" aria-current=\"page\"><span class=\"ds-breadcrumb__current\">${renderLabel(it)}</span></li>`;
    }
    const href = it.href || '#';
    return `<li class=\"ds-breadcrumb__item\"><a class=\"ds-breadcrumb__link\" href=\"${href}\">${renderLabel(it)}</a>${SEP}</li>`;
  };

  const renderEllipsis = (hidden) => {
    if (!hidden || hidden.length === 0) return '';
    const menu = hidden.map((h) => `<a class="ds-breadcrumb__more-item" role="menuitem" href="${h.href || '#'}">${renderLabel(h)}</a>`).join('');
    return `
      <li class="ds-breadcrumb__item ds-breadcrumb__morewrap">
        <button class="ds-breadcrumb__more" aria-expanded="false" aria-haspopup="menu">…</button>
        <div class="ds-breadcrumb__more-menu" role="menu">${menu}</div>
        ${SEP}
      </li>
    `;
  };

  const total = items.length;
  let parts = [];
  if (total <= 0) {
    parts = [];
  } else if (!maxVisible || total <= maxVisible) {
    parts = items.map((it, idx) => renderItem(it, idx === total - 1));
  } else {
    // collapse patterns
    if (collapseMode === 'start') {
      const keep = items.slice(total - (maxVisible - 1)); // keep last N-1 plus current among them
      const hidden = items.slice(0, total - (maxVisible - 1));
      parts = [renderEllipsis(hidden), ...keep.map((it, i) => renderItem(it, i === keep.length - 1))];
    } else if (collapseMode === 'end') {
      const keep = items.slice(0, maxVisible - 1);
      const hidden = items.slice(maxVisible - 1, total);
      parts = [...keep.map((it) => renderItem(it, false)), renderEllipsis(hidden.slice(0, -1)), renderItem(hidden[hidden.length - 1], true)];
    } else { // middle
      const headCount = 2;
      const tailCount = 2;
      const head = items.slice(0, headCount);
      const tail = items.slice(total - tailCount);
      const hidden = items.slice(headCount, total - tailCount);
      parts = [
        ...head.map((it) => renderItem(it, false)),
        renderEllipsis(hidden),
        ...tail.map((it, i) => renderItem(it, i === tail.length - 1))
      ];
    }
  }

  const html = parts.join('');
  return `<nav class=\"ds-breadcrumb\" aria-label=\"Breadcrumb\"><ol class=\"ds-breadcrumb__list ds-breadcrumb--${size}\">${html}</ol></nav>`;
}

export { Breadcrumb };


