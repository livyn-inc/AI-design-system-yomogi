/**
 * Tabs コンポーネント（アイコン対応版）
 * @param {Object} props
 * @param {Array<{ key: string, label: string, content: string, icon?: string }>} props.items - icon は Lucide アイコン名
 * @param {string} [props.active]
 * @param {'sm'|'md'|'lg'} [props.size='md'] - タブのサイズ
 * @param {number} [props.gap] - タブ間の間隔（pxで指定）
 */
function Tabs({ items = [], active = '', size = 'md', gap = null } = {}) {
  const activeKey = active || (items[0] ? items[0].key : '');
  
  // タブボタンの生成
  const headers = items.map(it => {
    const isActive = it.key === activeKey;
    const iconHtml = it.icon ? `<i data-lucide="${it.icon}" class="ds-tabs__icon"></i>` : '';
    const labelHtml = `<span class="ds-tabs__label">${it.label}</span>`;
    
    return `<button class="ds-tabs__tab ds-tabs__tab--${size} ${isActive ? 'is-active' : ''}${it.icon ? ' ds-tabs__tab--with-icon' : ''}" type="button" data-tab-key="${it.key}">${iconHtml}${labelHtml}</button>`;
  }).join('');
  
  // パネルの生成
  const panels = items.map(it => 
    `<div class="ds-tabs__panel" data-panel-key="${it.key}" style="display:${it.key === activeKey ? 'block' : 'none'}">${it.content}</div>`
  ).join('');
  
  // カスタムギャップのスタイル
  const gapStyle = gap !== null ? `style="gap: ${gap}px"` : '';
  
  return `
    <div class="ds-tabs">
      <div class="ds-tabs__list" role="tablist" ${gapStyle}>${headers}</div>
      ${panels}
    </div>
  `;
}

export { Tabs };




