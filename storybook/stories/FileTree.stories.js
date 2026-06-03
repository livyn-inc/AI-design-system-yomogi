import '../../components/file-tree/FileTree.css';
import { FileTree, initFileTree } from '../../components/file-tree/FileTree.js';

export default {
  title: 'Components/FileTree',
  parameters: {
    layout: 'padded',
  },
};

/**
 * Overview - 基本的なファイルツリー表示
 */
export const Overview = () => {
  const items = [
    { 
      type: 'file', 
      name: 'README.md', 
      icon: 'file-text',
      href: '#readme'
    },
    { 
      type: 'folder', 
      name: 'docs/', 
      icon: 'folder',
      open: true,
      children: [
        { type: 'file', name: 'getting-started.md', icon: 'file-text', href: '#getting-started' },
        { type: 'file', name: 'api-reference.md', icon: 'file-text', href: '#api' }
      ]
    },
    { 
      type: 'folder', 
      name: 'src/', 
      icon: 'folder',
      open: false,
      children: [
        { type: 'file', name: 'index.ts', icon: 'file-code', href: '#index' },
        { type: 'file', name: 'utils.ts', icon: 'file-code', href: '#utils' }
      ]
    },
    { 
      type: 'file', 
      name: 'package.json', 
      icon: 'file',
      href: '#package'
    }
  ];

  const html = `
    <div style="max-width: 400px; padding: var(--spacing-padding-16); background: var(--color-semantic-neutral-50-light); border-radius: var(--radius-md);">
      ${FileTree({ items, id: 'overview-tree' })}
    </div>
  `;

  setTimeout(() => {
    initFileTree('overview-tree', 
      (item) => console.log('File clicked:', item),
      (item) => console.log('Folder toggled:', item)
    );
    if (window.lucide) lucide.createIcons();
  }, 0);

  return html;
};

/**
 * WithBadges - ステータスバッジ付き（Lucideアイコン）
 */
export const WithBadges = () => {
  const items = [
    { 
      type: 'file', 
      name: 'README.md', 
      icon: 'file-text',
      badge: 'modified',
      badgeTooltip: '変更中（未保存）',
      href: '#readme'
    },
    { 
      type: 'file', 
      name: 'IMPORTANT.md', 
      icon: 'file-text',
      badge: 'favorite',
      badgeTooltip: 'お気に入り',
      href: '#important'
    },
    { 
      type: 'file', 
      name: 'conflict.ts', 
      icon: 'file-code',
      badge: 'conflict',
      badgeTooltip: '競合あり',
      href: '#conflict'
    },
    { 
      type: 'file', 
      name: 'config.ts', 
      icon: 'file-code',
      badge: 'readonly',
      badgeTooltip: '読み取り専用',
      href: '#readonly'
    }
  ];

  const html = `
    <div style="max-width: 400px; padding: var(--spacing-padding-16); background: var(--color-semantic-neutral-50-light); border-radius: var(--radius-md);">
      ${FileTree({ items, id: 'badge-tree' })}
    </div>
  `;

  setTimeout(() => {
    initFileTree('badge-tree');
    if (window.lucide) lucide.createIcons();
  }, 0);

  return html;
};

/**
 * NestedStructure - 深い階層構造
 */
export const NestedStructure = () => {
  const items = [
    { 
      type: 'folder', 
      name: 'src/', 
      open: true,
      children: [
        { 
          type: 'folder', 
          name: 'components/', 
          open: true,
          children: [
            { 
              type: 'folder', 
              name: 'button/', 
              open: false,
              children: [
                { type: 'file', name: 'Button.js', icon: 'file-code', href: '#button-js' },
                { type: 'file', name: 'Button.css', icon: 'file-code', href: '#button-css' }
              ]
            },
            { type: 'file', name: 'index.ts', icon: 'file-code', href: '#index' }
          ]
        },
        { 
          type: 'folder', 
          name: 'utils/', 
          open: false,
          children: [
            { type: 'file', name: 'helpers.ts', icon: 'file-code', href: '#helpers' }
          ]
        }
      ]
    }
  ];

  const html = `
    <div style="max-width: 400px; padding: var(--spacing-padding-16); background: var(--color-semantic-neutral-50-light); border-radius: var(--radius-md);">
      ${FileTree({ items, id: 'nested-tree' })}
    </div>
  `;

  setTimeout(() => {
    initFileTree('nested-tree');
    if (window.lucide) lucide.createIcons();
  }, 0);

  return html;
};

/**
 * LongFileName - 長いファイル名の処理
 */
export const LongFileName = () => {
  const items = [
    { 
      type: 'file', 
      name: 'very-long-file-name-that-should-be-truncated-with-ellipsis.md', 
      icon: 'file-text',
      href: '#long'
    },
    { 
      type: 'file', 
      name: 'another-extremely-long-file-name-for-testing-purposes.ts', 
      icon: 'file-code',
      href: '#another'
    },
    { 
      type: 'file', 
      name: 'short.txt', 
      icon: 'file',
      href: '#short'
    }
  ];

  const html = `
    <div style="max-width: 300px; padding: var(--spacing-padding-16); background: var(--color-semantic-neutral-50-light); border-radius: var(--radius-md);">
      <p style="margin-bottom: var(--spacing-padding-8); font-size: var(--font-size-14); color: var(--color-semantic-text-middle-light);">
        ※長いファイル名はhoverで全文表示されます
      </p>
      ${FileTree({ items, id: 'long-tree' })}
    </div>
  `;

  setTimeout(() => {
    initFileTree('long-tree');
    if (window.lucide) lucide.createIcons();
  }, 0);

  return html;
};

/**
 * DarkMode - ダークモード表示
 */
export const DarkMode = () => {
  const items = [
    { 
      type: 'file', 
      name: 'README.md', 
      icon: 'file-text',
      badge: 'modified',
      badgeTooltip: '変更中（未保存）',
      href: '#readme'
    },
    { 
      type: 'file', 
      name: 'IMPORTANT.md', 
      icon: 'file-text',
      badge: 'favorite',
      badgeTooltip: 'お気に入り',
      href: '#important'
    },
    { 
      type: 'folder', 
      name: 'src/', 
      icon: 'folder',
      open: true,
      children: [
        { type: 'file', name: 'index.ts', icon: 'file-code', href: '#index' },
        { 
          type: 'file', 
          name: 'config.ts', 
          icon: 'file-code',
          badge: 'readonly',
          badgeTooltip: '読み取り専用',
          href: '#config'
        }
      ]
    }
  ];

  const html = `
    <div data-theme="dark" style="max-width: 400px; padding: var(--spacing-padding-16); background: var(--color-semantic-neutral-100-dark); border-radius: var(--radius-md);">
      ${FileTree({ items, id: 'dark-tree' })}
    </div>
  `;

  setTimeout(() => {
    initFileTree('dark-tree');
    if (window.lucide) lucide.createIcons();
  }, 0);

  return html;
};

