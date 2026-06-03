import { Pagination } from '../../components/pagination/Pagination.js';
import '../../components/pagination/Pagination.css';
import './_matrix.css';
import { renderMatrix } from './_matrix.js';

export default {
  title: 'components/Pagination',
  parameters: {
    docs: {
      description: {
        component: 'ページネーションコンポーネント。ページ間のナビゲーションを提供。'
      }
    }
  }
};

// グローバルにページ変更関数を定義
const script = `
  <script>
    window.handlePageChange = function(page) {
      console.log('Page changed to:', page);
      // 実際の実装では、ここでページ遷移やデータの再取得を行う
      const event = new CustomEvent('page-change', { detail: { page } });
      document.dispatchEvent(event);
    };
  </script>
`;

// Overview - すべてのバリエーションを統合
export const Overview = () => `
  <div style="display: flex; flex-direction: column; gap: var(--spacing-padding-72); padding: 24px;">
    
    <!-- 基本的な使用例 -->
    <div>
      <h3 style="margin: 0 0 var(--spacing-padding-24) 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">基本的なページネーション</h3>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-padding-32);">
        <div>
          <h4 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-14); font-weight: var(--font-weight-500); color: var(--color-semantic-text-middle-light);">デフォルト（1/10ページ）</h4>
          ${Pagination({ currentPage: 1, totalPages: 10, onPageChange: window.handlePageChange })}
        </div>
        <div>
          <h4 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-14); font-weight: var(--font-weight-500); color: var(--color-semantic-text-middle-light);">中間ページ（5/10ページ）</h4>
          ${Pagination({ currentPage: 5, totalPages: 10, onPageChange: window.handlePageChange })}
        </div>
        <div>
          <h4 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-14); font-weight: var(--font-weight-500); color: var(--color-semantic-text-middle-light);">最終ページ（10/10ページ）</h4>
          ${Pagination({ currentPage: 10, totalPages: 10, onPageChange: window.handlePageChange })}
        </div>
      </div>
    </div>
    
    <!-- 多数のページ -->
    <div>
      <h3 style="margin: 0 0 var(--spacing-padding-24) 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">多数のページ</h3>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-padding-32);">
        <div>
          <h4 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-14); font-weight: var(--font-weight-500); color: var(--color-semantic-text-middle-light);">前半（3/50ページ）</h4>
          ${Pagination({ currentPage: 3, totalPages: 50, onPageChange: window.handlePageChange })}
        </div>
        <div>
          <h4 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-14); font-weight: var(--font-weight-500); color: var(--color-semantic-text-middle-light);">中間（25/50ページ）</h4>
          ${Pagination({ currentPage: 25, totalPages: 50, onPageChange: window.handlePageChange })}
        </div>
        <div>
          <h4 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-14); font-weight: var(--font-weight-500); color: var(--color-semantic-text-middle-light);">後半（48/50ページ）</h4>
          ${Pagination({ currentPage: 48, totalPages: 50, onPageChange: window.handlePageChange })}
        </div>
      </div>
    </div>
    
    <!-- オプション -->
    <div>
      <h3 style="margin: 0 0 var(--spacing-padding-24) 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">オプション</h3>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-padding-32);">
        <div>
          <h4 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-14); font-weight: var(--font-weight-500); color: var(--color-semantic-text-middle-light);">前へ/次へボタンなし</h4>
          ${Pagination({ currentPage: 3, totalPages: 7, showPrevNext: false, onPageChange: window.handlePageChange })}
        </div>
        <div>
          <h4 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-14); font-weight: var(--font-weight-500); color: var(--color-semantic-text-middle-light);">カスタムラベル</h4>
          ${Pagination({ currentPage: 3, totalPages: 10, prevLabel: 'Previous', nextLabel: 'Next', onPageChange: window.handlePageChange })}
        </div>
        <div>
          <h4 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-14); font-weight: var(--font-weight-500); color: var(--color-semantic-text-middle-light);">表示ページ数を5に制限</h4>
          ${Pagination({ currentPage: 10, totalPages: 20, maxVisible: 5, onPageChange: window.handlePageChange })}
        </div>
      </div>
    </div>
    
    <!-- エッジケース -->
    <div>
      <h3 style="margin: 0 0 var(--spacing-padding-24) 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">エッジケース</h3>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-padding-32);">
        <div>
          <h4 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-14); font-weight: var(--font-weight-500); color: var(--color-semantic-text-middle-light);">1ページのみ</h4>
          ${Pagination({ currentPage: 1, totalPages: 1, onPageChange: window.handlePageChange })}
        </div>
        <div>
          <h4 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-14); font-weight: var(--font-weight-500); color: var(--color-semantic-text-middle-light);">少ないページ数（2ページ）</h4>
          ${Pagination({ currentPage: 1, totalPages: 2, onPageChange: window.handlePageChange })}
        </div>
        <div>
          <h4 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-14); font-weight: var(--font-weight-500); color: var(--color-semantic-text-middle-light);">超長大（100/1000ページ）</h4>
          ${Pagination({ currentPage: 100, totalPages: 1000, onPageChange: window.handlePageChange })}
        </div>
      </div>
    </div>
    
  </div>
  ${script}
`;

