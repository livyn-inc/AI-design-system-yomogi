/**
 * Avatar コンポーネント
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {string} [props.src]
 * @param {string} [props.alt]
 * @param {string} [props.fallback] - 画像がない場合のイニシャル
 */
function Avatar({ size = 'md', src = '', alt = '', fallback = '' } = {}) {
  const classes = ['ds-avatar', `ds-avatar--${size}`].join(' ');
  const content = src
    ? `<img class="ds-avatar__img" src="${src}" alt="${alt || ''}" />`
    : `<span class="ds-avatar__fallback" aria-hidden="${fallback ? 'false' : 'true'}">${fallback || ''}</span>`;
  return `<span class="${classes}">${content}</span>`;
}

export { Avatar };




