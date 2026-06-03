/**
 * Tagコンポーネント
 * カテゴリ、ラベル、ステータス、数値など様々な情報を表示
 * （従来のBadge用途も含む）
 * 
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size] - タグのサイズ
 * @param {'filled'|'subtle'|'outline'|'emphasis'} [props.variant] - タグのスタイル
 * @param {'neutral'|'primary'|'info'|'success'|'warning'|'negative'|'gray'|'red'|'orange'|'yellow'|'green'|'cyan'|'blue'|'purple'|'pink'} [props.color] - タグの色
 * @param {string} [props.label] - タグのテキスト
 * @param {boolean} [props.removable] - 削除ボタンの表示
 * 
 * @example
 * // カテゴリ・ラベル
 * Tag({ label: 'JavaScript', size: 'md' })
 * 
 * // ステータス表示（Badge的な使い方）
 * Tag({ label: '新着', size: 'sm' })
 * 
 * // 数値表示（Badge的な使い方）
 * Tag({ label: '3', size: 'sm' })
 * 
 * // 削除可能なタグ
 * Tag({ label: 'React', removable: true })
 */
function Tag({size = 'md', variant = 'filled', color = 'neutral', label = '', removable = false} = {}) {
  const classes = [`ds-tag`, `ds-tag--${size}`, `ds-tag--${variant}`, `ds-tag--${color}`].filter(Boolean).join(' ');
  
  const removeButton = removable 
    ? `<button class="ds-tag__remove" aria-label="${label}を削除">×</button>` 
    : '';
  
  return `<span class="${classes}">${label}${removeButton}</span>`;
}

export { Tag };