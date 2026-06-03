import { Toast } from '../../components/toast/Toast.js';
import { IconButton } from '../../components/icon-button/IconButton.js';
import '../../components/icon-button/IconButton.css';
import { Select } from '../../components/select/Select.js';
import { Button } from '../../components/button/Button.js';
import '../../components/toast/Toast.css';
import '../../components/select/Select.css';
import '../../components/button/Button.css';
import './_matrix.css';
import { renderMatrix } from './_matrix.js';

export default { title: 'components/Toast' };

export const Overview = () => {
  return `
    <div style="padding: var(--spacing-padding-64) var(--spacing-padding-24);">
      <h3 style="margin-bottom: var(--spacing-padding-24);">基本的な通知</h3>
      <div style="margin-bottom: var(--spacing-padding-48);">
        <div style="max-width: 300px;">
          ${Select({
            id: 'toastTypeSelect',
            size: 'sm',
            placeholder: '通知タイプを選んでください',
            value: 'info',
            options: [
              { value: 'info', label: '情報通知' },
              { value: 'success', label: '成功通知' },
              { value: 'warning', label: '警告通知' },
              { value: 'negative', label: 'エラー通知' },
              { value: 'action', label: 'アクション付き' }
            ]
          })}
        </div>
      </div>
      
      <h3 style="margin-bottom: var(--spacing-padding-24);">表示位置（選択した通知を表示）</h3>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-padding-12); width: fit-content;">
        <div style="display: flex; gap: var(--spacing-padding-12);">
          <div data-toast-pos="top-left">${Button({ variant: 'outline', color: 'neutral', size: 'sm', label: '左上' })}</div>
          <div data-toast-pos="top-center">${Button({ variant: 'outline', color: 'neutral', size: 'sm', label: '中央上' })}</div>
          <div data-toast-pos="top-right">${Button({ variant: 'outline', color: 'neutral', size: 'sm', label: '右上' })}</div>
        </div>
        <div style="display: flex; gap: var(--spacing-padding-12);">
          <div data-toast-pos="bottom-left">${Button({ variant: 'outline', color: 'neutral', size: 'sm', label: '左下' })}</div>
          <div data-toast-pos="bottom-center">${Button({ variant: 'outline', color: 'neutral', size: 'sm', label: '中央下' })}</div>
          <div data-toast-pos="bottom-right">${Button({ variant: 'outline', color: 'neutral', size: 'sm', label: '右下' })}</div>
        </div>
      </div>
    </div>
    
    <script>
      // モジュールからインポートした関数を直接グローバルに公開
      window.IconButton = (opts) => document.createRange().createContextualFragment(\`${IconButton({})}\`);
      window.Toast = (opts) => {
        const statuses = ['info', 'success', 'warning', 'negative'];
        const icons = {
          info: '<svg class="ds-toast__icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>',
          success: '<svg class="ds-toast__icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
          warning: '<svg class="ds-toast__icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>',
          negative: '<svg class="ds-toast__icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>'
        };
        const id = 'toast-' + Math.random().toString(36).substr(2, 9);
        const status = opts.status || 'info';
        const position = opts.position || 'top-center';
        const role = status === 'negative' ? 'alert' : 'status';
        const ariaLive = status === 'negative' ? 'assertive' : 'polite';
        const closeIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 1 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4z"/></svg>';
        const action = opts.actionButton ? '<div class="ds-toast__action-wrapper">' + opts.actionButton + '</div>' : '';
        return '<div class="ds-toast ds-toast--' + status + ' ds-toast--' + position + '" id="' + id + '" role="' + role + '" aria-live="' + ariaLive + '" data-auto-dismiss="' + (opts.autoDismiss || false) + '" data-duration="' + (opts.duration || 3) + '">' +
          '<div class="ds-toast__icon-container">' + icons[status] + '</div>' +
          '<div class="ds-toast__content"><p class="ds-toast__message">' + opts.message + '</p>' + action + '</div>' +
          '<button class="ds-toast__close ds-btn ds-btn--ghost ds-btn--neutral ds-btn--sm" data-toast-close="' + id + '" aria-label="通知を閉じる"><span class="ds-btn__icon">' + closeIcon + '</span></button>' +
        '</div>';
      };
      console.log('Toast function available:', typeof window.Toast);
      
      function removeExistingToasts() {
        document.querySelectorAll('.ds-toast').forEach(toast => toast.remove());
      }
      
      function addToastEventListeners(toast) {
        const autoDismiss = toast.dataset.autoDismiss === 'true';
        const duration = parseInt(toast.dataset.duration) || 3;
        
        if (autoDismiss) {
          setTimeout(() => {
            toast.classList.add('ds-toast--removing');
            setTimeout(() => toast.remove(), 200);
          }, duration * 1000);
        }
        
        const closeBtn = toast.querySelector('.ds-toast__close');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            toast.classList.add('ds-toast--removing');
            setTimeout(() => toast.remove(), 200);
          });
        }
      }
      
      window.showSelectedToast = function(toastPosition) {
        console.log('showSelectedToast called with position:', toastPosition);
        removeExistingToasts();
        
        // SelectコンポーネントのIDからvalueを取得
        let selectElement = document.getElementById('toastTypeSelect');
        if (!selectElement) {
          selectElement = document.querySelector('select[id="toastTypeSelect"]');
        }
        if (!selectElement) {
          selectElement = document.querySelector('.ds-select__field');
        }
        if (!selectElement) {
          console.error('Select element not found');
          // フォールバック: 固定値でテスト
          const fallbackHtml = window.Toast({ status: 'info', message: 'フォールバック表示', position: toastPosition });
          document.body.insertAdjacentHTML('beforeend', fallbackHtml);
          addToastEventListeners(document.body.lastElementChild);
          return;
        }
        
        const selectedType = selectElement.value;
        console.log('Selected type:', selectedType, 'Position:', toastPosition);
        
        let toastOptions = { position: toastPosition };
        
        switch (selectedType) {
          case 'info':
            toastOptions.status = 'info';
            toastOptions.message = 'システムからのお知らせです';
            break;
          case 'success':
            toastOptions.status = 'success';
            toastOptions.message = '操作が完了しました';
            toastOptions.autoDismiss = true;
            toastOptions.duration = 3;
            break;
          case 'warning':
            toastOptions.status = 'warning';
            toastOptions.message = '注意が必要な状況です';
            break;
          case 'negative':
            toastOptions.status = 'negative';
            toastOptions.message = '問題が発生しました';
            break;
          case 'action':
            toastOptions.status = 'info';
            toastOptions.message = '元に戻すことができます';
            toastOptions.actionButton = '<button class=\"ds-btn ds-btn--solid ds-btn--neutral ds-btn--sm\">元に戻す</button>';
            break;
          default:
            toastOptions.status = 'info';
            toastOptions.message = 'デフォルトメッセージ';
        }
        
        console.log('Toast options:', toastOptions);
        const html = window.Toast(toastOptions);
        console.log('Generated HTML:', html);
        
        document.body.insertAdjacentHTML('beforeend', html);
        addToastEventListeners(document.body.lastElementChild);
      }

      // delegate click
      document.querySelectorAll('[data-toast-pos]').forEach(el => {
        el.addEventListener('click', () => {
          const pos = el.getAttribute('data-toast-pos');
          window.showSelectedToast(pos);
        });
      });
      
    </script>
  `;
};

export const CompleteMatrix = () => {
  const sizes = ['default'];
  const states = [
    { key: 'info', label: 'Info', props: { status: 'info', message: 'Information message' } },
    { key: 'success', label: 'Success', props: { status: 'success', message: 'Success message' } },
    { key: 'warning', label: 'Warning', props: { status: 'warning', message: 'Warning message' } },
    { key: 'negative', label: 'Negative', props: { status: 'negative', message: 'Error message' } }
  ];
  
  return `
    <div style="padding-top: var(--spacing-padding-64); position: relative;">
      ${renderMatrix({
        title: 'Complete Matrix (Status)',
        sizes,
        states,
        renderCell: (_size, stateKey) => {
          const st = states.find(s => s.key === stateKey);
          return `${Toast({ ...st.props })}`;
        }
      })}
    </div>
  `;
};




