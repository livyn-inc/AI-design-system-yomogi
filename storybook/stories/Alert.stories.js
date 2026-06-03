import { Alert } from '../../components/alert/Alert.js';
import '../../components/alert/Alert.css';
import '../../components/button/Button.css';
import { Button } from '../../components/button/Button.js';
import '../../components/icon-button/IconButton.css';
import './_matrix.css';
import { renderMatrix } from './_matrix.js';

export default { title: 'components/Alert' };

export const Overview = () => `
  <div style="
    max-width: var(--layout-max-width-5xl);
    margin: 0 auto;
    padding: var(--spacing-padding-32);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-padding-24);
  ">
    ${Alert({ type: 'info', title: '情報', message: 'これは情報メッセージです。システムからのお知らせを表示します。' })}
    ${Alert({ type: 'success', message: 'データが正常に保存されました。' })}
    ${Alert({
      type: 'warning',
      title: '注意',
      message: 'この操作は元に戻すことができません。',
      actionPrimary: Button({ variant: 'outline', color: 'absolute-black', size: 'sm', label: '続行' }),
      actionSecondary: Button({ variant: 'outline', color: 'absolute-black', size: 'sm', label: 'キャンセル' })
    })}
    ${Alert({
      type: 'critical',
      title: 'エラー',
      message: 'ネットワーク接続に失敗しました。しばらく時間をおいて再度お試しください。',
      actionPrimary: Button({ variant: 'outline', color: 'absolute-black', size: 'sm', label: '再試行' })
    })}

    
  </div>
`;

export const CompleteMatrix = () => {
  const sizes = ['default'];
  const states = [
    { key: 'info', label: 'Info', props: { type: 'info', title: 'Information', message: 'This is an informational message.' } },
    { key: 'success', label: 'Success', props: { type: 'success', title: 'Success', message: 'Operation completed successfully.' } },
    { key: 'warning', label: 'Warning', props: { type: 'warning', title: 'Warning', message: 'Please review before proceeding.' } },
    { key: 'critical', label: 'Critical', props: { type: 'critical', title: 'Error', message: 'An error has occurred.' } }
  ];
  
  return `
    <div style="padding-top: var(--spacing-padding-64);">
      ${renderMatrix({
        title: 'Complete Matrix (Types)',
        sizes,
        states,
        renderCell: (_size, stateKey) => {
          const st = states.find(s => s.key === stateKey);
          return `${Alert({ ...st.props })}`;
        }
      })}
    </div>
  `;
};