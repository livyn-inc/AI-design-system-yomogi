import { Breadcrumb } from '../../components/breadcrumb/Breadcrumb.js';
import '../../components/breadcrumb/Breadcrumb.css';

export default { title: 'components/Breadcrumb' };

export const Overview = () => `
  <div style="display:flex; flex-direction:column; gap: var(--spacing-padding-72); padding: var(--spacing-padding-24);">
    <!-- 基本 -->
    <section>
      <h3 style="margin:0 0 var(--spacing-padding-24) 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">基本</h3>
      ${Breadcrumb({
        items: [
          { label: 'ホーム', href: '#', leftIcon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 8h-3v10h-5V14H11v7H6V11H3z"/></svg>' },
          { label: 'プロジェクト', href: '#' },
          { label: '設定' }
        ],
        separator: '/',
        size: 'md'
      })}
    </section>

    <!-- セパレータ変更 -->
    <section>
      <h3 style="margin:0 0 var(--spacing-padding-24) 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">セパレータ変更</h3>
      <div style="display:flex; flex-direction:column; gap: var(--spacing-padding-16);">
        ${Breadcrumb({ items: [
          { label: 'ホーム', href: '#' }, { label: 'ライブラリ', href: '#' }, { label: 'ドキュメント' }
        ], separator: '/', size: 'md' })}
        ${Breadcrumb({ items: [
          { label: 'ホーム', href: '#' }, { label: 'ライブラリ', href: '#' }, { label: 'ドキュメント' }
        ], separator: '›', size: 'md' })}
      </div>
    </section>

    <!-- 省略パターン -->
    <section>
      <h3 style="margin:0 0 var(--spacing-padding-24) 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">省略パターン</h3>
      <div style="display:flex; flex-direction:column; gap: var(--spacing-padding-16);">
        <div>
          <h4 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-14); font-weight: var(--font-weight-500); color: var(--color-semantic-text-middle-light);">middle（先頭2 + … + 末尾2）</h4>
          ${Breadcrumb({
            items: [
              { label: 'ホーム', href: '#' }, { label: 'ワークスペース', href: '#' }, { label: 'プロジェクト', href: '#' }, { label: '設定', href: '#' }, { label: '通知', href: '#' }, { label: '詳細' }
            ],
            maxVisible: 5, collapseMode: 'middle'
          })}
        </div>
        <div>
          <h4 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-14); font-weight: var(--font-weight-500); color: var(--color-semantic-text-middle-light);">start（… + 末尾N）</h4>
          ${Breadcrumb({
            items: [
              { label: 'ホーム', href: '#' }, { label: 'ワークスペース', href: '#' }, { label: 'プロジェクト', href: '#' }, { label: '設定', href: '#' }, { label: '通知', href: '#' }, { label: '詳細' }
            ],
            maxVisible: 4, collapseMode: 'start'
          })}
        </div>
        <div>
          <h4 style="margin: 0 0 var(--spacing-padding-12) 0; font-size: var(--font-size-14); font-weight: var(--font-weight-500); color: var(--color-semantic-text-middle-light);">end（先頭N + …）</h4>
          ${Breadcrumb({
            items: [
              { label: 'ホーム', href: '#' }, { label: 'ワークスペース', href: '#' }, { label: 'プロジェクト', href: '#' }, { label: '設定', href: '#' }, { label: '通知', href: '#' }, { label: '詳細' }
            ],
            maxVisible: 3, collapseMode: 'end'
          })}
        </div>
      </div>
    </section>
  </div>
`;


