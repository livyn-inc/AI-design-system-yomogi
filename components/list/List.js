function normalizeVariant(variant) {
  if (variant === 'unordered' || variant === 'ordered') return variant;
  if (variant === 'plain' || variant === 'divided' || variant === 'nav' || variant === 'structured') return variant;
  return 'plain';
}

function renderItem(item) {
  if (typeof item === 'string') return `<li class="ds-list__item">${item}</li>`;
  if (item && item.type === 'separator') return `<li class="ds-list__separator" role="separator"></li>`;
  if (item && item.type === 'section') return `<li class="ds-list__section">${item.label || ''}</li>`;
  const {
    leading = '',
    title = '',
    subtitle = '',
    meta = '',
    trailing = ''
  } = item || {};
  return `
    <li class="ds-list__item">
      ${leading ? `<span class=\"ds-list__leading\">${leading}</span>` : ''}
      <span class="ds-list__content">
        ${title ? `<span class=\"ds-list__title\">${title}</span>` : ''}
        ${subtitle ? `<span class=\"ds-list__subtitle\">${subtitle}</span>` : ''}
      </span>
      ${meta ? `<span class=\"ds-list__meta\">${meta}</span>` : ''}
      ${trailing ? `<span class=\"ds-list__trailing\">${trailing}</span>` : ''}
    </li>
  `;
}

function List({ items = [], variant = 'plain', size = 'md', selection = 'none' } = {}) {
  const v = normalizeVariant(variant);
  const isOrdered = v === 'ordered';
  if (v === 'structured') {
    const rows = (items || []).map((row) => {
      if (!row || typeof row !== 'object') return '';
      return `
        <div class="ds-list__structured-row">
          <dt class="ds-list__structured-key">${row.key ?? ''}</dt>
          <dd class="ds-list__structured-value">${row.value ?? ''}</dd>
        </div>
      `;
    }).join('');
    return `
      <dl class="ds-list ds-list--structured ds-list--${size}">${rows}</dl>
    `;
  }

  if (v === 'nav') {
    const renderNav = (nodeItems = [], depth = 0) => nodeItems.map((it, idx) => {
      if (it.type === 'separator') return `<li class="ds-list__separator" role="separator"></li>`;
      if (it.type === 'section') return `<li class="ds-list__section">${it.label || ''}</li>`;
      const hasChildren = Array.isArray(it.children) && it.children.length > 0;
      const expanded = it.defaultOpen ? ' true' : ' false';
      const current = it.current ? ' page' : ' false';
      const iconToggle = hasChildren ? `<button class="ds-list__nav-toggle" aria-expanded="${it.defaultOpen ? 'true' : 'false'}" onclick="(function(btn){btn.setAttribute('aria-expanded',btn.getAttribute('aria-expanded')==='true'?'false':'true');var sib=btn.nextElementSibling; if(sib) sib.classList.toggle('is-collapsed');})(this)">▸</button>` : '';
      const link = it.href ? `<a class="ds-list__nav-link${it.current ? ' is-current' : ''}" href="${it.href}" aria-current="${it.current ? 'page' : 'false'}">${it.title || ''}</a>` : `<span class="ds-list__nav-link">${it.title || ''}</span>`;
      const child = hasChildren ? `<ul class="ds-list__nav-children${it.defaultOpen ? '' : ' is-collapsed'}" style="--ds-list-depth:${depth}">${renderNav(it.children, depth+1).join ? renderNav(it.children, depth+1) : renderNav(it.children, depth+1)}</ul>` : '';
      return `
        <li class="ds-list__item ds-list__item--nav" style="--ds-list-depth:${depth}">
          ${iconToggle}
          ${link}
          ${child}
        </li>
      `;
    }).join('');
    return `
      <nav class="ds-list ds-list--nav ds-list--${size}" role="navigation">
        <ul class="ds-list__nav-root">${renderNav(items, 0)}</ul>
      </nav>
    `;
  }
  const Tag = isOrdered ? 'ol' : 'ul';
  const itemsHtml = items
    .map((it, idx) => {
      if (typeof it === 'object' && selection !== 'none' && (it.type === undefined || it.type === 'item')) {
        const selected = it.selected ? 'true' : 'false';
        const disabled = it.disabled ? 'true' : 'false';
        const base = renderItem(it);
        return base
          .replace('<li ', `<li ${selection !== 'none' ? 'role="option"' : ''} aria-selected="${selected}" ${it.disabled ? 'aria-disabled="true"' : ''} data-index="${idx}" tabindex="${idx === 0 ? '0' : '-1'}" `)
          .replace('class="ds-list__item"', `class="ds-list__item${it.selected ? ' is-selected' : ''}${it.disabled ? ' is-disabled' : ''}"`);
      }
      return renderItem(it);
    })
    .join('');
  const cls = [
    'ds-list',
    `ds-list--${v}`,
    `ds-list--${size}`
  ].join(' ');
  const roleAttrs = selection !== 'none' ? ` role="listbox" aria-multiselectable="${selection === 'multiple' ? 'true' : 'false'}"` : '';
  const selectionAttr = selection !== 'none' ? ` data-selection="${selection}"` : '';
  return `
    <${Tag} class="${cls}"${roleAttrs}${selectionAttr}>
      ${itemsHtml}
    </${Tag}>
    ${selection !== 'none' ? `
    <script>(function(){
      if(!window.__dsListInit){
        window.__dsListInit=true;
        document.addEventListener('click',function(e){
          var li=e.target.closest('.ds-list__item');
          var list=li && li.closest('.ds-list[data-selection]');
          if(!list||li.getAttribute('aria-disabled')==='true') return;
          var sel=list.getAttribute('data-selection');
          if(sel==='single'){
            list.querySelectorAll('.ds-list__item[aria-selected="true"]').forEach(function(n){n.setAttribute('aria-selected','false');n.classList.remove('is-selected');});
            li.setAttribute('aria-selected','true'); li.classList.add('is-selected');
          }
          if(sel==='multiple'){
            var selected = li.getAttribute('aria-selected')==='true';
            li.setAttribute('aria-selected', selected ? 'false' : 'true');
            li.classList.toggle('is-selected', !selected);
          }
        });
        document.addEventListener('keydown',function(e){
          var list=e.target.closest('.ds-list[data-selection]');
          if(!list) return;
          var items=[].slice.call(list.querySelectorAll('.ds-list__item:not(.is-disabled)'));
          var idx=items.indexOf(e.target.closest('.ds-list__item'));
          if(e.key==='ArrowDown'){ e.preventDefault(); var n=items[Math.min(items.length-1, idx+1)]||items[0]; n.focus(); }
          if(e.key==='ArrowUp'){ e.preventDefault(); var p=items[Math.max(0, idx-1)]||items[items.length-1]; p.focus(); }
          if(e.key==='Enter' || e.key===' '){ var li=e.target.closest('.ds-list__item'); if(li){ li.click(); e.preventDefault(); }}
        });
      }
    })();</script>
    ` : ''}
  `;
}

export { List };