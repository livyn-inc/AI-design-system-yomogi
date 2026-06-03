/**
 * PageTemplate
 * @param {Object} props
 * @param {'one-col'|'two-col'|'three-col'} [props.columns]
 * @param {boolean} [props.stickyAside]
 * @param {'compact'|'default'|'comfortable'} [props.density]
 * @param {'constrained'|'full'} [props.container]
 * @param {'md'|'xl'|'5xl'|'7xl'} [props.maxWidth]
 * @param {Array<'main'|'aside'|'aside2'>} [props.columnOrder] - カラムの表示順序
 * @param {Object} [props.slots]
 * @param {string} [props.slots.header]
 * @param {string} [props.slots.subheader]
 * @param {string} [props.slots.toolbar]
 * @param {string} [props.slots.main]
 * @param {string} [props.slots.aside]
 * @param {string} [props.slots.aside2]
 * @param {string} [props.slots.footer]
 */
function PageTemplate({
  columns = 'two-col',
  stickyAside = false,
  density = 'default',
  container = 'constrained',
  maxWidth = '7xl',
  columnOrder = null,
  slots = {}
} = {}) {
  const densityClass = density === 'comfortable' ? 'ds-page--comfortable' : density === 'compact' ? 'ds-page--compact' : '';
  const stickyClass = stickyAside ? 'ds-page--sticky-aside' : '';
  const colClass = columns === 'three-col' ? 'ds-page--three-col' : columns === 'one-col' ? 'ds-page--one-col' : 'ds-page--two-col';

  const maxWidthTokenKey = {
    md: 'var(--layout-max-width-md)',
    xl: 'var(--layout-max-width-xl)',
    '5xl': 'var(--layout-max-width-5xl)',
    '7xl': 'var(--layout-max-width-7xl)'
  }[maxWidth] || 'var(--layout-max-width-7xl)';

  const wrapperStyle = container === 'full'
    ? 'max-width: none;'
    : `max-width: ${maxWidthTokenKey};`;

  const header = slots.header ? `<header class="ds-page__header">${slots.header}</header>` : '';
  const subheader = slots.subheader ? `<div class="ds-page__subheader">${slots.subheader}</div>` : '';
  const toolbar = slots.toolbar ? `<div class="ds-page__toolbar" role="toolbar">${slots.toolbar}</div>` : '';

  const main = `<main class="ds-page__main" role="main">${slots.main || ''}</main>`;
  const aside = slots.aside ? `<aside class="ds-page__aside" aria-label="Aside">${slots.aside}</aside>` : '';
  const aside2 = slots.aside2 ? `<aside class="ds-page__aside2" aria-label="Aside 2">${slots.aside2}</aside>` : '';
  const footer = slots.footer ? `<footer class="ds-page__footer">${slots.footer}</footer>` : '';

  // カラムの順序を決定
  let orderedColumns;
  if (columnOrder && Array.isArray(columnOrder)) {
    // カスタム順序が指定された場合
    const columnMap = { main, aside, aside2 };
    orderedColumns = columnOrder
      .filter(col => columnMap[col]) // 存在するカラムのみ
      .map(col => columnMap[col])
      .join('');
  } else {
    // デフォルトの順序
    orderedColumns = `${aside}${main}${aside2}`;
  }

  const mainarea = `<section class="ds-page__mainarea">${orderedColumns}</section>`;

  return `
    <div class="ds-page ${colClass} ${densityClass} ${stickyClass}" style="${wrapperStyle}">
      ${header}
      ${subheader}
      ${toolbar}
      ${mainarea}
      ${footer}
    </div>
  `;
}

export { PageTemplate };


