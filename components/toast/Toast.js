import { IconButton } from '../icon-button/IconButton.js';

/**
 * Toastコンポーネント（オーバーレイ通知）
 * 画面端に浮いて表示される通知。自動消去または手動消去が可能。
 * 
 * @param {Object} props
 * @param {'info'|'success'|'warning'|'negative'} [props.status] - トーストの種類
 * @param {string} [props.message] - トーストのメッセージ本文
 * @param {boolean} [props.autoDismiss] - 自動消去の有効/無効
 * @param {number} [props.duration] - 自動消去までの時間（秒）
 * @param {string} [props.actionButton] - カスタムアクションボタン（HTML）
 * @param {'top-left'|'top-center'|'top-right'|'bottom-left'|'bottom-center'|'bottom-right'} [props.position] - 表示位置
 * 
 * @example
 * // 基本的な成功通知（3秒で自動消去）
 * Toast({ status: 'success', message: '保存しました', autoDismiss: true, duration: 3 })
 * 
 * // エラー通知（手動消去のみ）
 * Toast({ status: 'negative', message: 'エラーが発生しました' })
 * 
 * // アクション付き通知
 * Toast({ 
 *   status: 'info', 
 *   message: 'ファイルが削除されました',
 *   actionButton: '<button class="ds-toast__action">元に戻す</button>'
 * })
 */

function Toast({
  status = 'info',
  message = '',
  autoDismiss = false,
  duration = 3,
  actionButton = '',
  position = 'top-center'
} = {}) {
  const id = `toast-${Math.random().toString(36).substr(2, 9)}`;
  const classes = ['ds-toast', `ds-toast--${status}`, `ds-toast--${position}`].join(' ');
  
  // アイコンマッピング（Alertより小さめ）
  const icons = {
    info: '<svg class="ds-toast__icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>',
    success: '<svg class="ds-toast__icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
    warning: '<svg class="ds-toast__icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>',
    negative: '<svg class="ds-toast__icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>'
  };
  
  // role属性の決定（重要度による）
  const role = status === 'negative' ? 'alert' : 'status';
  const ariaLive = status === 'negative' ? 'assertive' : 'polite';
  
  // 閉じるボタン（常に表示） - IconButtonで統一
  const closeIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 1 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4z"/></svg>';
  const closeButton = IconButton({ icon: closeIcon, variant: 'ghost', color: 'neutral', size: 'sm', ariaLabel: '通知を閉じる', className: 'ds-toast__close', state: 'enable' })
    .replace('<button', `<button data-toast-close="${id}"`);
  
  // アクションボタン
  const action = actionButton 
    ? `<div class="ds-toast__action-wrapper">${actionButton}</div>`
    : '';

  const toastHTML = `
    <div class="${classes}" id="${id}" role="${role}" aria-live="${ariaLive}" data-auto-dismiss="${autoDismiss}" data-duration="${duration}">
      <div class="ds-toast__icon-container">
        ${icons[status] || icons.info}
      </div>
      <div class="ds-toast__content">
        <p class="ds-toast__message">${message}</p>
        ${action}
      </div>
      ${closeButton}
    </div>
  `;
  
  return toastHTML;
}

export { Toast };




