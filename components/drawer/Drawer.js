/**
 * Drawer（サイドパネル・静的デモ）
 * @param {Object} props
 * @param {'left'|'right'} [props.side]
 * @param {string} props.content
 */
function Drawer({ side = 'right', content = '' } = {}) {
  const classes = ['ds-drawer', `ds-drawer--${side}`].join(' ');
  return `
    <div class="${classes}">
      <div class="ds-drawer__panel">${content}</div>
    </div>
  `;
}

export { Drawer };




