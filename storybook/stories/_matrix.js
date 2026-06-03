// 共通Matrixレンダラ
// API:
// renderMatrix({ title, sizes, states, renderCell, comfortable })
// - title: 見出し文字列
// - sizes: ['sm','md','lg'] など
// - states: [{ key: 'default', label: 'Default' }, ...]
// - renderCell: (size, stateKey) => string (セルHTMLを返す)
// - comfortable: true でセルpaddingをゆったりに

export function renderMatrix({ title, sizes = ['sm', 'md', 'lg'], states = [], renderCell, comfortable = false, rowHeaderLabel = 'State' }) {
  const cls = `ds-matrix${comfortable ? ' ds-matrix--comfortable' : ''}`;
  const thead = `
    <thead>
      <tr>
        <th>${rowHeaderLabel}</th>
        ${sizes.map((s) => `<th>${s}</th>`).join('')}
      </tr>
    </thead>`;

  const tbody = `
    <tbody>
      ${states
        .map((st) => `
          <tr>
            <td data-cell="label">${st.label}</td>
            ${sizes.map((size) => `<td>${renderCell(size, st.key)}</td>`).join('')}
          </tr>`)
        .join('')}
    </tbody>`;

  return `
    <div class="${cls}" style="padding: var(--spacing-padding-24);">
      <h4>${title}</h4>
      <table>
        ${thead}
        ${tbody}
      </table>
    </div>
  `;
}


