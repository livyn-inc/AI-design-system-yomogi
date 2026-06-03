function Table({
  headers = [],
  rows = [],
  variant = 'outlined', // 'outlined' | 'plain'
  density = 'md',       // 'sm' | 'md' | 'lg'
  caption,
  vLines = false,       // boolean: 縦線の表示切替
  resizable = false     // boolean: 列幅ドラッグ調整機能
} = {}) {
  const isArrayOfArrays = Array.isArray(headers) && headers.length > 0 && Array.isArray(headers[0]);

  const renderAttrs = (attrs = {}) => {
    return Object.entries(attrs)
      .filter(([key, value]) => value !== undefined && value !== null && value !== false)
      .map(([key, value]) => value === true ? `${key}` : `${key}="${String(value)}"`)
      .join(' ');
  };

  const renderHeaderCell = (cell, topLevel = false, index = 0) => {
    if (typeof cell === 'string' || typeof cell === 'number') {
      const resizer = resizable ? `<div class="ds-table__resizer" data-column="${index}" style="position: absolute; right: -2px; top: 0; width: 8px; height: 100%; cursor: col-resize; background: transparent; z-index: 10; border-right: 2px solid transparent;"></div>` : '';
      return `<th class="ds-table__header" scope="col" style="${resizable ? 'position: relative; min-width: 120px; width: auto;' : ''}">${cell}${resizer}</th>`;
    }
    const {
      content = '',
      rowspan,
      colspan,
      cellClass,
      cellAttrs,
      scope
    } = cell || {};
    const cls = ['ds-table__header', cellClass].filter(Boolean).join(' ');
    const attrs = Object.assign({}, cellAttrs || {});
    if (rowspan) attrs.rowspan = rowspan;
    if (colspan) attrs.colspan = colspan;
    attrs.scope = scope || 'col';
    if (resizable) {
      attrs.style = (attrs.style || '') + 'position: relative; min-width: 120px; width: auto;';
    }
    const attrStr = renderAttrs(Object.assign({ class: cls }, attrs));
    const resizer = resizable ? `<div class="ds-table__resizer" data-column="${index}" style="position: absolute; right: -2px; top: 0; width: 8px; height: 100%; cursor: col-resize; background: transparent; z-index: 10; border-right: 2px solid transparent;"></div>` : '';
    return `<th ${attrStr}>${content}${resizer}</th>`;
  };

  const renderBodyCell = (cell) => {
    if (typeof cell === 'string' || typeof cell === 'number') {
      return `<td class="ds-table__cell">${cell}</td>`;
    }
    const {
      content = '',
      rowspan,
      colspan,
      cellClass,
      cellAttrs,
      asTh,
      scope
    } = cell || {};
    const cls = ['ds-table__cell', cellClass].filter(Boolean).join(' ');
    const attrs = Object.assign({}, cellAttrs || {});
    if (rowspan) attrs.rowspan = rowspan;
    if (colspan) attrs.colspan = colspan;
    const tag = asTh ? 'th' : 'td';
    if (asTh) {
      attrs.scope = scope || 'row';
    }
    const attrStr = renderAttrs(Object.assign({ class: cls }, attrs));
    return `<${tag} ${attrStr}>${content}</${tag}>`;
  };

  const headerHtml = (() => {
    if (!headers || headers.length === 0) return '';
    if (isArrayOfArrays) {
      const rowsHtml = headers.map(row => {
        const cells = row.map((cell, index) => renderHeaderCell(cell, false, index)).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      return `<thead>${rowsHtml}</thead>`;
    }
    const singleRow = headers.map((h, index) => renderHeaderCell(h, false, index)).join('');
    return `<thead><tr>${singleRow}</tr></thead>`;
  })();

  const bodyHtml = (() => {
    if (!rows || rows.length === 0) return '';
    const rowsHtml = rows.map(row => {
      const cells = row.map(cell => renderBodyCell(cell)).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<tbody>${rowsHtml}</tbody>`;
  })();

  const tableClasses = [
    'ds-table',
    `ds-table--density-${density}`,
    vLines ? 'ds-table--vlines' : ''
  ].join(' ');

  const containerClasses = [
    'ds-table__container',
    variant === 'outlined' ? 'ds-table__container--outlined' : 'ds-table__container--plain',
    resizable ? 'ds-table__container--resizable' : ''
  ].filter(Boolean).join(' ');

  const figureClasses = 'ds-table__figure';
  const captionHtml = caption ? `<figcaption class="ds-table__caption">${caption}</figcaption>` : '';

  const initScript = resizable ? `
    <script>
    (function() {
      setTimeout(() => {
        const containers = document.querySelectorAll('.ds-table__container--resizable');
        containers.forEach(container => {
          const table = container.querySelector('.ds-table');
          if (!table || table.hasAttribute('data-resizable-init')) return;
          table.setAttribute('data-resizable-init', 'true');
          
          let isResizing = false;
          let currentColumn = null;
          let startX = 0;
          let startWidth = 0;
          
          const resizers = table.querySelectorAll('.ds-table__resizer');
          resizers.forEach(resizer => {
            resizer.addEventListener('mousedown', (e) => {
              e.preventDefault();
              e.stopPropagation();
              
              isResizing = true;
              currentColumn = e.target.closest('th');
              startX = e.clientX;
              startWidth = parseInt(window.getComputedStyle(currentColumn).width, 10);
              
              document.body.style.cursor = 'col-resize';
              document.body.style.userSelect = 'none';
              
              const handleMouseMove = (e) => {
                if (!isResizing || !currentColumn) return;
                const diff = e.clientX - startX;
                const newWidth = Math.max(80, startWidth + diff);
                currentColumn.style.width = newWidth + 'px';
                currentColumn.style.minWidth = newWidth + 'px';
                currentColumn.style.maxWidth = 'none';
              };
              
              const handleMouseUp = () => {
                isResizing = false;
                currentColumn = null;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            });
          });
        });
      }, 100);
    })();
    </script>
  ` : '';

  return `<figure class="${figureClasses}">${captionHtml}<div class="${containerClasses}"><table class="${tableClasses}">${headerHtml}${bodyHtml}</table></div></figure>${initScript}`;
}
export { Table };