import { Table } from '../../components/table/Table.js';
import '../../components/table/Table.css';
export default { title: 'components/Table' };

export const Overview = () => `
  <div style="display: flex; flex-direction: column; gap: 24px; padding: 24px;">
    <section>
      <h3 style="margin: 0 0 8px 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">Outlined（基本）</h3>
      ${Table({
        headers: ['名前', '年齢', '都市'],
        rows: [['田中', '25', '東京'], ['佐藤', '30', '大阪']],
        variant: 'outlined',
        density: 'md'
      })}
    </section>
    <section>
      <h3 style="margin: 0 0 8px 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">Plain（外枠なし）</h3>
      ${Table({
        headers: ['製品', '価格', '在庫'],
        rows: [['ノートPC', '120,000', 'あり'], ['マウス', '3,000', '少ない']],
        variant: 'plain',
        density: 'sm'
      })}
    </section>
    <section>
      <h3 style="margin: 0 0 8px 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">MultiHeader（多段ヘッダ）</h3>
      ${Table({
        variant: 'outlined',
        density: 'md',
        headers: [
          [
            { content: 'カテゴリ', rowspan: 2 },
            { content: '状態', rowspan: 2 },
            { content: '数値', colspan: 2 }
          ],
          [
            { content: '最小' },
            { content: '最大' }
          ]
        ],
        rows: [
          [
            { content: '売上', rowspan: 2, asTh: true },
            '確定',
            '1,000',
            '9,999'
          ],
          [
            '予測',
            '800',
            '12,000'
          ],
          [
            { content: '顧客数', asTh: true },
            '確定',
            '120',
            '1,200'
          ]
        ]
      })}
    </section>
  </div>
`;

export const Variations = () => `
  <div style="display: flex; flex-direction: column; gap: 24px; padding: 24px;">
    <section>
      <h3 style="margin: 0 0 8px 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">外枠なし＋横線のみ</h3>
      ${Table({
        headers: ['製品', '価格', '在庫'],
        rows: [['ノートPC', '120,000', 'あり'], ['マウス', '3,000', '少ない']],
        variant: 'plain',
        density: 'sm',
        vLines: false
      })}
    </section>
    <section>
      <h3 style="margin: 0 0 8px 0; font-size: var(--font-size-18); font-weight: var(--font-weight-600); color: var(--color-semantic-text-middle-light);">外枠あり＋横線あり、縦線あり</h3>
      ${Table({
        headers: ['名前', '年齢', '都市'],
        rows: [['田中', '25', '東京'], ['佐藤', '30', '大阪']],
        variant: 'outlined',
        density: 'md',
        vLines: true
      })}
    </section>
  </div>
`;

// MultiHeaderはOverview内に統合済み