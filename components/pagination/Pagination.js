/**
 * Paginationコンポーネント生成関数
 * @param {Object} props
 * @param {number} props.currentPage - 現在のページ番号（1から始まる）
 * @param {number} props.totalPages - 総ページ数
 * @param {function} [props.onPageChange] - ページ変更時のコールバック関数
 * @param {boolean} [props.showPrevNext] - 前へ/次へボタンの表示
 * @param {number} [props.maxVisible] - 表示する最大ページ番号数
 * @param {string} [props.prevLabel] - 前へボタンのラベル
 * @param {string} [props.nextLabel] - 次へボタンのラベル
 * @param {string} [props.ariaLabel] - アクセシビリティ用ラベル
 */
function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showPrevNext = true,
  maxVisible = 7,
  prevLabel = '前へ',
  nextLabel = '次へ',
  ariaLabel = 'ページネーション'
} = {}) {
  // ページ番号の配列を生成
  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= maxVisible) {
      // 全ページが表示可能な場合
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 省略記号を使用する場合
      const halfVisible = Math.floor(maxVisible / 2);
      
      if (currentPage <= halfVisible) {
        // 前半のページ
        for (let i = 1; i <= maxVisible - 2; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - halfVisible + 1) {
        // 後半のページ
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - maxVisible + 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 中間のページ
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - halfVisible + 2; i <= currentPage + halfVisible - 2; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // ページ変更ハンドラー
  const handlePageChange = (page) => {
    if (onPageChange && typeof onPageChange === 'function') {
      return `onclick="${onPageChange.name}(${page})"`;
    }
    return '';
  };

  // 前へボタン
  const prevButton = showPrevNext ? `
    <button 
      type="button"
      class="ds-button-base ds-pagination__item ds-pagination__prev ${isFirstPage ? 'is-disabled' : ''}"
      ${isFirstPage ? 'disabled' : ''}
      ${handlePageChange(currentPage - 1)}
      aria-label="前のページへ"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      <span>${prevLabel}</span>
    </button>
  ` : '';

  // 次へボタン
  const nextButton = showPrevNext ? `
    <button 
      type="button"
      class="ds-button-base ds-pagination__item ds-pagination__next ${isLastPage ? 'is-disabled' : ''}"
      ${isLastPage ? 'disabled' : ''}
      ${handlePageChange(currentPage + 1)}
      aria-label="次のページへ"
    >
      <span>${nextLabel}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  ` : '';

  // ページ番号ボタン
  const pageButtons = pageNumbers.map(page => {
    if (page === '...') {
      return `<span class="ds-pagination__item ds-pagination__ellipsis" aria-hidden="true">...</span>`;
    }
    
    const isCurrent = page === currentPage;
    return `
      <button 
        type="button"
        class="ds-button-base ds-pagination__item ds-pagination__number ${isCurrent ? 'is-current' : ''}"
        ${handlePageChange(page)}
        aria-label="ページ ${page}${isCurrent ? ' (現在のページ)' : ''}"
        ${isCurrent ? 'aria-current="page"' : ''}
      >
        ${page}
      </button>
    `;
  }).join('');

  return `
    <nav class="ds-pagination" role="navigation" aria-label="${ariaLabel}">
      ${prevButton}
      ${pageButtons}
      ${nextButton}
    </nav>
  `;
}

export { Pagination };