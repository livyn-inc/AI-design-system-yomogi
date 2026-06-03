/**
 * Alertコンポーネント（インライン通知）
 * ページ内のコンテンツ領域に表示される通知。手動で閉じる。
 * 
 * @param {Object} props
 * @param {'info'|'success'|'warning'|'critical'} [props.type] - アラートの種類
 * @param {string} [props.title] - アラートのタイトル
 * @param {string} [props.message] - アラートのメッセージ本文
 * @param {boolean} [props.dismissible] - 閉じるボタンの表示
 * @param {string} [props.actionPrimary] - プライマリアクションボタン（HTML）
 * @param {string} [props.actionSecondary] - セカンダリアクションボタン（HTML）
 * 
 * @example
 * // 基本的な情報表示
 * Alert({ type: 'info', title: 'お知らせ', message: 'メンテナンスを実施します。' })
 * 
 * // アクションボタン付き
 * Alert({ 
 *   type: 'warning', 
 *   title: '未保存の変更',
 *   message: 'ページを離れると変更が失われます。',
 *   actionPrimary: '<button class="ds-btn ds-btn--solid ds-btn--primary">保存</button>',
 *   actionSecondary: '<button class="ds-btn ds-btn--outline ds-btn--neutral">破棄</button>'
 * })
 */
import { IconButton } from '../icon-button/IconButton.js';

function Alert({
  type = 'info', 
  title = '', 
  message = '', 
  dismissible = true,
  actionPrimary = '',
  actionSecondary = ''
} = {}) {
  const classes = [`ds-alert`, `ds-alert--${type}`].filter(Boolean).join(' ');
  
  // アイコンマッピング（Material Design Icons）
  const icons = {
    info: '<svg class="ds-alert__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
    success: '<svg class="ds-alert__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
    warning: '<svg class="ds-alert__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
    critical: '<svg class="ds-alert__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>'
  };
  
  const closeIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 1 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4z"/></svg>';
  const closeButton = dismissible 
    ? IconButton({ icon: closeIcon, variant: 'ghost', color: 'neutral', size: 'sm', ariaLabel: 'アラートを閉じる', className: 'ds-alert__close' })
    : '';
    
  const actions = (actionPrimary || actionSecondary) 
    ? `<div class="ds-alert__actions">
         ${actionPrimary}
         ${actionSecondary}
       </div>`
    : '';

  return `<div class="${classes}" role="alert">
    <div class="ds-alert__icon-container">
      ${icons[type] || icons.info}
    </div>
    <div class="ds-alert__content">
      ${title ? `<h4 class="ds-alert__title">${title}</h4>` : ''}
      <div class="ds-alert__message">${message}</div>
      ${actions}
    </div>
    ${closeButton}
  </div>`;
}

export { Alert };