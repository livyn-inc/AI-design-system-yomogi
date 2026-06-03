/**
 * Dropdown Menu コンポーネント（簡易）
 * @param {Object} props
 * @param {Array<{ type?: 'item'|'section'|'separator', label?: string, href?: string, iconLeft?: string, meta?: string, danger?: boolean, disabled?: boolean, submenu?: Array<{ label: string, href?: string }> }>} props.items
 * @param {string} [props.triggerHtml]
 * @param {string} [props.label]
 * @param {string} [props.leftIcon] - HTML string for left icon
 * @param {string} [props.rightIcon] - HTML string for right icon
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {boolean} [props.defaultOpen]
 */
function Dropdown({
  items = [],
  triggerHtml,
  label = 'Menu',
  leftIcon = '',
  rightIcon = '',
  size = 'md',
  defaultOpen = false
} = {}) {
  const renderItem = (it) => {
    const kind = it.type || 'item';
    if (kind === 'section') {
      return `<div class=\"ds-dropdown__section\">${it.label || ''}</div>`;
    }
    if (kind === 'separator') {
      return `<div class=\"ds-dropdown__separator\"></div>`;
    }
    const main = `${it.iconLeft ? `<span class=\"ds-dropdown__icon\">${it.iconLeft}</span>` : ''}<span>${it.label}</span>`;
    const row = `<span class=\"ds-dropdown__row\"><span class=\"ds-dropdown__main\">${main}</span>${it.meta ? `<span class=\"ds-dropdown__meta\">${it.meta}</span>` : ''}</span>`;
    const cls = `ds-dropdown__item${it.disabled ? ' ds-dropdown__item--disabled' : ''}${it.danger ? ' ds-dropdown__item--danger' : ''}${it.submenu ? ' ds-dropdown__item--has-submenu' : ''}`;
    const body = it.href ? `<a class=\"${cls}\" href=\"${it.href}\" role=\"menuitem\">${row}</a>` : `<button class=\"${cls}\" type=\"button\" role=\"menuitem\" ${it.disabled ? 'disabled' : ''}>${row}</button>`;
    if (Array.isArray(it.submenu) && it.submenu.length) {
      const sub = it.submenu.map(s => `<button class=\"ds-dropdown__item\" type=\"button\">${s.label}</button>`).join('');
      return `<div class=\"ds-dropdown__itemwrap\">${body}<div class=\"ds-dropdown__submenu\" role=\"menu\">${sub}</div></div>`;
    }
    return body;
  };

  const list = items.map(renderItem).join('');

  const trigger = triggerHtml || `
    <button class="ds-button-base ds-btn ds-btn--outline ds-btn--neutral ds-btn--${size} ds-dropdown__trigger" type="button">
      ${leftIcon ? `<span class=\"ds-dropdown__icon ds-dropdown__icon--left\">${leftIcon}</span>` : ''}
      <span class="ds-dropdown__label">${label}</span>
      ${rightIcon ? `<span class=\"ds-dropdown__icon ds-dropdown__icon--right\">${rightIcon}</span>` : ''}
    </button>`;

  const openClass = defaultOpen ? ' is-open' : '';
  const uniqueId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;

  return `
    <span class="ds-dropdown${openClass}" id="${uniqueId}">
      ${trigger}
      <div class="ds-dropdown__menu" role="menu">${list}</div>
    </span>
    <script>
      setTimeout(function(){
        var dropdown = document.getElementById('${uniqueId}');
        if(dropdown){
          var triggers = dropdown.querySelectorAll('button, a');
          triggers.forEach(function(t){
            if(!t.classList.contains('ds-dropdown__item')){
              t.addEventListener('click', function(e){
                e.stopPropagation();
                dropdown.classList.toggle('is-open');
              });
            }
          });
        }
        if(!window.__dsDropdownInit){
          window.__dsDropdownInit=true;
          document.addEventListener('click',function(e){
            document.querySelectorAll('.ds-dropdown.is-open').forEach(function(el){
              if(!el.contains(e.target)) el.classList.remove('is-open');
            });
          });
          document.addEventListener('keydown',function(e){
            if(e.key==='Escape'){
              document.querySelectorAll('.ds-dropdown.is-open').forEach(function(el){ el.classList.remove('is-open'); });
            }
          });
        }
      }, 100);
    </script>
  `;
}

export { Dropdown };




