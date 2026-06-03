/**
 * Popover コンポーネント（軽量オーバーレイ）
 * @param {Object} props
 * @param {string} props.content - ポップオーバー内HTML
 * @param {string} [props.triggerHtml] - トリガー要素HTML
 * @param {'top'|'right'|'bottom'|'left'} [props.placement]
 */
function Popover({ content, triggerHtml = '<button class="ds-popover__trigger">Open</button>', placement = 'bottom' } = {}) {
  const classes = ['ds-popover', `ds-popover--${placement}`].join(' ');
  return `
    <span class="${classes}">
      ${triggerHtml}
      <div class="ds-popover__panel" role="dialog">${content}</div>
    </span>
  `;
}

export { Popover };




