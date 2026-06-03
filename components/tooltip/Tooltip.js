/**
 * Tooltip コンポーネント
 * CSSは `components/tooltip/Tooltip.css` を使用してください。
 * 本関数はHTML文字列を返します。
 *
 * @param {Object} props
 * @param {'top'|'right'|'bottom'|'left'} [props.placement]
 * @param {string} [props.content] - 吹き出し内テキスト（HTML可）
 * @param {string} [props.triggerHtml] - トリガー要素のHTML（省略時はボタンを自動生成）
 * @param {string} [props.id] - 吹き出しID（省略時は自動生成）
 */
function Tooltip({ placement = 'top', content = '', triggerHtml = '', id = '' } = {}) {
  const allowed = new Set(['top', 'right', 'bottom', 'left']);
  const place = allowed.has(placement) ? placement : 'top';
  const tooltipId = id || `ds-tooltip-${Math.random().toString(36).slice(2, 8)}`;

  const trigger = triggerHtml && triggerHtml.trim().length > 0
    ? triggerHtml
    : `<button type="button" class="ds-tooltip__trigger" aria-describedby="${tooltipId}">Tooltip</button>`;

  return `
    <span class="ds-tooltip ds-tooltip--${place}">
      ${trigger}
      <span class="ds-tooltip__bubble" id="${tooltipId}" role="tooltip">${content || ''}</span>
    </span>
  `;
}

export { Tooltip };