export function makeBlock(label = 'Block', content = '') {
  return `
    <div class="tpl-block">
      <div style="font-weight: var(--font-weight-600); margin-bottom: var(--spacing-padding-8);">${label}</div>
      <div>${content || sampleParagraph()}</div>
    </div>
  `;
}

export function makeCardGrid(count = 6) {
  const items = Array.from({ length: count }).map((_, i) => `
    <div class="tpl-card">Card ${i + 1}<div style="opacity: var(--opacity-65); font-size: var(--font-size-14);">${sampleLine()}</div></div>
  `).join('');
  return `<div class="tpl-grid">${items}</div>`;
}

function sampleParagraph() {
  return '説明テキストが入ります。説明テキストが入ります。説明テキストが入ります。';
}

function sampleLine() {
  return 'ダミーテキスト';
}


