/**
 * FileTreeコンポーネント生成関数
 * @param {Object} props
 * @param {Array} [props.items] - ツリーアイテムの配列
 * @param {Function} [props.onFileClick] - ファイルクリック時のコールバック
 * @param {Function} [props.onFolderToggle] - フォルダ開閉時のコールバック
 * @param {string} [props.id] - コンテナのID
 * 
 * @typedef {Object} TreeItem
 * @property {'file'|'folder'} type - アイテムタイプ
 * @property {string} name - 表示名
 * @property {string} [icon] - Lucideアイコン名（デフォルト: file/folder）
 * @property {string} [href] - リンク先（ファイルの場合）
 * @property {'modified'|'conflict'|'readonly'|'pinned'} [badge] - バッジタイプ
 * @property {string} [badgeTooltip] - バッジのツールチップテキスト
 * @property {boolean} [open] - フォルダの開閉状態（フォルダの場合）
 * @property {Array<TreeItem>} [children] - 子要素（フォルダの場合）
 */
function FileTree({
  items = [],
  onFileClick = null,
  onFolderToggle = null,
  id = ''
} = {}) {
  const treeId = id || `file-tree-${Math.random().toString(36).substr(2, 9)}`;

  /**
   * ツリーアイテムをHTMLに変換
   */
  function renderTreeItem(item, depth = 0) {
    const isFolder = item.type === 'folder';
    const isOpen = isFolder && item.open;
    
    // アイコン名を決定
    let iconName = item.icon;
    if (!iconName) {
      if (isFolder) {
        iconName = isOpen ? 'folder-open' : 'folder';
      } else {
        iconName = 'file-text';
      }
    }

    // バッジHTML（Lucideアイコン - 塗りタイプ）
    // ※ 12pxサイズでの視認性確保のため fill 属性で塗りつぶし
    const badgeIcons = {
      modified: '<i data-lucide="circle" width="12" height="12" fill="currentColor"></i>',
      conflict: '<i data-lucide="alert-triangle" width="12" height="12" fill="currentColor"></i>',
      readonly: '<i data-lucide="lock" width="12" height="12" fill="currentColor"></i>',
      pinned: '<i data-lucide="pin" width="12" height="12" fill="currentColor"></i>'
    };
    // バッジのデフォルトツールチップテキスト
    const badgeTooltips = {
      modified: '未保存の変更があります',
      conflict: '競合が発生しています',
      readonly: '読み取り専用',
      pinned: 'ピン留め中'
    };
    const badgeIcon = item.badge ? badgeIcons[item.badge] || '' : '';
    const badgeClass = item.badge ? `rs-tree-badge rs-tree-badge--${item.badge}` : '';
    const badgeTooltip = item.badge ? (item.badgeTooltip || badgeTooltips[item.badge] || '') : '';
    // Tooltipコンポーネント構造でバッジをラップ（下方向に表示）
    const badgeHtml = badgeIcon && badgeTooltip
      ? `<span class="ds-tooltip ds-tooltip--bottom">
           <span class="${badgeClass}">${badgeIcon}</span>
           <span class="ds-tooltip__bubble" role="tooltip">${badgeTooltip}</span>
         </span>`
      : badgeIcon ? `<span class="${badgeClass}">${badgeIcon}</span>` : '';

    // ⋮メニューボタン（ホバー時のみ表示）- ファイル・フォルダ共通
    const menuButtonHtml = `<button type="button" class="rs-tree-menu-btn" aria-label="メニュー"><i data-lucide="more-vertical" width="16" height="16"></i></button>`;

    // フォルダの場合
    if (isFolder) {
      const chevronIcon = isOpen ? 'chevron-down' : 'chevron-right';
      const openClass = isOpen ? 'rs-tree-item--open' : '';
      const childrenStyle = isOpen ? '' : 'style="display: none;"';
      const childrenHtml = item.children ? item.children.map(child => renderTreeItem(child, depth + 1)).join('') : '';

      return `
        <div class="rs-tree-item rs-tree-item--folder ${openClass}" data-type="folder" data-name="${item.name}">
          <div class="rs-tree-item-row">
            <button type="button" class="rs-tree-item-content">
              <span class="rs-tree-chevron">
                <i data-lucide="${chevronIcon}" width="14" height="14"></i>
              </span>
              <i data-lucide="${iconName}" width="16" height="16" class="rs-tree-icon"></i>
              <span class="rs-tree-label">${item.name}</span>
            </button>
            ${menuButtonHtml}
          </div>
          <div class="rs-tree-children" ${childrenStyle}>
            ${childrenHtml}
          </div>
        </div>
      `;
    }
    
    // ファイルの場合
    const href = item.href || '#';
    
    return `
      <div class="rs-tree-item rs-tree-item--file" data-type="file" data-name="${item.name}">
        <div class="rs-tree-item-row">
          <a href="${href}" class="rs-tree-item-content">
            <i data-lucide="${iconName}" width="16" height="16" class="rs-tree-icon"></i>
            <span class="rs-tree-label">${item.name}</span>
            ${badgeHtml}
          </a>
          ${menuButtonHtml}
        </div>
      </div>
    `;
  }

  // ツリーHTMLを生成
  const treeHtml = items.map(item => renderTreeItem(item)).join('');

  // ピン留めセクションのサンプルファイル
  const pinnedFilesHtml = `
    <div class="rs-tree-item rs-tree-item--file" data-type="file" data-name="config.yaml" data-section="pinned">
      <div class="rs-tree-item-row">
        <a href="#config" class="rs-tree-item-content">
          <i data-lucide="file-text" width="16" height="16" class="rs-tree-icon"></i>
          <span class="rs-tree-label">config.yaml</span>
        </a>
        <button type="button" class="rs-tree-menu-btn" aria-label="メニュー"><i data-lucide="more-vertical" width="16" height="16"></i></button>
      </div>
    </div>
    <div class="rs-tree-item rs-tree-item--file" data-type="file" data-name="重要メモ.md" data-section="pinned">
      <div class="rs-tree-item-row">
        <a href="#memo" class="rs-tree-item-content">
          <i data-lucide="file-text" width="16" height="16" class="rs-tree-icon"></i>
          <span class="rs-tree-label">重要メモ.md</span>
        </a>
        <button type="button" class="rs-tree-menu-btn" aria-label="メニュー"><i data-lucide="more-vertical" width="16" height="16"></i></button>
      </div>
    </div>
  `;

  // ピン留めセクションHTML（デフォルト閉じ）
  const pinnedSectionHtml = `
    <div class="rs-tree-section rs-tree-section--pinned rs-tree-section--collapsed" data-section="pinned">
      <button type="button" class="rs-tree-section-header">
        <span class="rs-tree-section-chevron">
          <i data-lucide="chevron-right" width="14" height="14"></i>
        </span>
        <i data-lucide="pin" width="16" height="16" class="rs-tree-section-icon"></i>
        <span class="rs-tree-section-label">ピン留め</span>
        <span class="rs-tree-section-count">2</span>
      </button>
      <div class="rs-tree-section-content" style="display: none;">
        ${pinnedFilesHtml}
      </div>
    </div>
  `;

  // 最近セクションHTML（デフォルト閉じ）
  const recentSectionHtml = `
    <div class="rs-tree-section rs-tree-section--recent rs-tree-section--collapsed" data-section="recent">
      <button type="button" class="rs-tree-section-header">
        <span class="rs-tree-section-chevron">
          <i data-lucide="chevron-right" width="14" height="14"></i>
        </span>
        <i data-lucide="clock" width="16" height="16" class="rs-tree-section-icon"></i>
        <span class="rs-tree-section-label">最近</span>
        <span class="rs-tree-section-count">0</span>
      </button>
      <div class="rs-tree-section-content" style="display: none;">
        <div class="rs-tree-section-empty">アイテムはありません</div>
      </div>
    </div>
  `;

  // ゴミ箱セクションのサンプルファイル
  const trashFilesHtml = `
    <div class="rs-tree-item rs-tree-item--file" data-type="file" data-name="old-draft.md" data-section="trash">
      <div class="rs-tree-item-row">
        <a href="#old-draft" class="rs-tree-item-content">
          <i data-lucide="file-text" width="16" height="16" class="rs-tree-icon"></i>
          <span class="rs-tree-label">old-draft.md</span>
        </a>
        <button type="button" class="rs-tree-menu-btn" aria-label="メニュー"><i data-lucide="more-vertical" width="16" height="16"></i></button>
      </div>
    </div>
    <div class="rs-tree-item rs-tree-item--folder" data-type="folder" data-name="old-assets" data-section="trash">
      <div class="rs-tree-item-row">
        <button type="button" class="rs-tree-item-content">
          <span class="rs-tree-chevron">
            <i data-lucide="chevron-right" width="14" height="14"></i>
          </span>
          <i data-lucide="folder" width="16" height="16" class="rs-tree-icon"></i>
          <span class="rs-tree-label">old-assets</span>
        </button>
        <button type="button" class="rs-tree-menu-btn" aria-label="メニュー"><i data-lucide="more-vertical" width="16" height="16"></i></button>
      </div>
      <div class="rs-tree-children" style="display: none;">
        <div class="rs-tree-item rs-tree-item--file" data-type="file" data-name="logo-old.png" data-section="trash">
          <div class="rs-tree-item-row">
            <a href="#logo-old" class="rs-tree-item-content">
              <i data-lucide="file-image" width="16" height="16" class="rs-tree-icon"></i>
              <span class="rs-tree-label">logo-old.png</span>
            </a>
            <button type="button" class="rs-tree-menu-btn" aria-label="メニュー"><i data-lucide="more-vertical" width="16" height="16"></i></button>
          </div>
        </div>
        <div class="rs-tree-item rs-tree-item--file" data-type="file" data-name="banner-v1.jpg" data-section="trash">
          <div class="rs-tree-item-row">
            <a href="#banner-v1" class="rs-tree-item-content">
              <i data-lucide="file-image" width="16" height="16" class="rs-tree-icon"></i>
              <span class="rs-tree-label">banner-v1.jpg</span>
            </a>
            <button type="button" class="rs-tree-menu-btn" aria-label="メニュー"><i data-lucide="more-vertical" width="16" height="16"></i></button>
          </div>
        </div>
      </div>
    </div>
    <div class="rs-tree-item rs-tree-item--file" data-type="file" data-name="backup.json" data-section="trash">
      <div class="rs-tree-item-row">
        <a href="#backup" class="rs-tree-item-content">
          <i data-lucide="file-code" width="16" height="16" class="rs-tree-icon"></i>
          <span class="rs-tree-label">backup.json</span>
        </a>
        <button type="button" class="rs-tree-menu-btn" aria-label="メニュー"><i data-lucide="more-vertical" width="16" height="16"></i></button>
      </div>
    </div>
    <div class="rs-tree-item rs-tree-item--file" data-type="file" data-name="temp.txt" data-section="trash">
      <div class="rs-tree-item-row">
        <a href="#temp" class="rs-tree-item-content">
          <i data-lucide="file" width="16" height="16" class="rs-tree-icon"></i>
          <span class="rs-tree-label">temp.txt</span>
        </a>
        <button type="button" class="rs-tree-menu-btn" aria-label="メニュー"><i data-lucide="more-vertical" width="16" height="16"></i></button>
      </div>
    </div>
  `;

  // ゴミ箱セクションHTML（デフォルト閉じ）
  const trashSectionHtml = `
    <div class="rs-tree-section rs-tree-section--trash rs-tree-section--collapsed" data-section="trash">
      <button type="button" class="rs-tree-section-header">
        <span class="rs-tree-section-chevron">
          <i data-lucide="chevron-right" width="14" height="14"></i>
        </span>
        <i data-lucide="trash" width="16" height="16" class="rs-tree-section-icon"></i>
        <span class="rs-tree-section-label">ゴミ箱</span>
        <span class="rs-tree-section-count">4</span>
      </button>
      <div class="rs-tree-section-content" style="display: none;">
        ${trashFilesHtml}
        <p class="rs-tree-section-note">ゴミ箱のアイテムは削除日から30日後に自動的に完全削除されます</p>
        <a href="#" class="rs-tree-section-link" data-action="open-global-trash">
          すべてのゴミ箱を見る
          <i data-lucide="external-link" width="12" height="12"></i>
        </a>
      </div>
    </div>
  `;

  // コンテキストメニューHTML（通常）
  const contextMenuHtml = `
    <div class="rs-tree-context-menu" id="${treeId}-context-menu" data-menu-type="default">
      <button type="button" class="rs-tree-context-menu-item" data-action="open">
        <i data-lucide="file" width="14" height="14"></i>
        <span>開く</span>
      </button>
      <button type="button" class="rs-tree-context-menu-item" data-action="pin">
        <i data-lucide="pin" width="14" height="14"></i>
        <span>ピン留め</span>
      </button>
      <button type="button" class="rs-tree-context-menu-item" data-action="copy">
        <i data-lucide="copy" width="14" height="14"></i>
        <span>コピー</span>
      </button>
      <button type="button" class="rs-tree-context-menu-item" data-action="rename">
        <i data-lucide="pencil" width="14" height="14"></i>
        <span>名前を変更</span>
      </button>
      <button type="button" class="rs-tree-context-menu-item" data-action="move">
        <i data-lucide="folder-input" width="14" height="14"></i>
        <span>移動</span>
      </button>
      <button type="button" class="rs-tree-context-menu-item rs-tree-context-menu-item--danger" data-action="delete">
        <i data-lucide="trash-2" width="14" height="14"></i>
        <span>削除</span>
      </button>
    </div>
    <div class="rs-tree-context-menu" id="${treeId}-context-menu-pinned" data-menu-type="pinned">
      <button type="button" class="rs-tree-context-menu-item" data-action="open">
        <i data-lucide="file" width="14" height="14"></i>
        <span>開く</span>
      </button>
      <button type="button" class="rs-tree-context-menu-item" data-action="unpin">
        <i data-lucide="pin-off" width="14" height="14"></i>
        <span>ピン留め解除</span>
      </button>
      <button type="button" class="rs-tree-context-menu-item" data-action="copy">
        <i data-lucide="copy" width="14" height="14"></i>
        <span>コピー</span>
      </button>
      <button type="button" class="rs-tree-context-menu-item" data-action="rename">
        <i data-lucide="pencil" width="14" height="14"></i>
        <span>名前を変更</span>
      </button>
      <button type="button" class="rs-tree-context-menu-item" data-action="move">
        <i data-lucide="folder-input" width="14" height="14"></i>
        <span>移動</span>
      </button>
      <button type="button" class="rs-tree-context-menu-item rs-tree-context-menu-item--danger" data-action="delete">
        <i data-lucide="trash-2" width="14" height="14"></i>
        <span>削除</span>
      </button>
    </div>
    <div class="rs-tree-context-menu" id="${treeId}-context-menu-trash" data-menu-type="trash">
      <button type="button" class="rs-tree-context-menu-item" data-action="restore">
        <i data-lucide="undo-2" width="14" height="14"></i>
        <span>もとに戻す</span>
      </button>
      <button type="button" class="rs-tree-context-menu-item rs-tree-context-menu-item--danger" data-action="delete-permanently">
        <i data-lucide="trash-2" width="14" height="14"></i>
        <span>完全に削除</span>
      </button>
    </div>
    <div class="rs-tree-context-menu" id="${treeId}-context-menu-confluence" data-menu-type="confluence">
      <button type="button" class="rs-tree-context-menu-item" data-action="open">
        <i data-lucide="file" width="14" height="14"></i>
        <span>開く</span>
      </button>
      <button type="button" class="rs-tree-context-menu-item" data-action="copy-to-local">
        <i data-lucide="download" width="14" height="14"></i>
        <span>ローカルにコピー</span>
      </button>
    </div>
  `;

  // メインセクションHTML（デフォルト開き、開閉可能）- ファイルセクションのみ
  const mainSectionHtml = `
    <div class="rs-tree-section rs-tree-section--main" data-section="main">
      <button type="button" class="rs-tree-section-header">
        <span class="rs-tree-section-chevron">
          <i data-lucide="chevron-down" width="14" height="14"></i>
        </span>
        <i data-lucide="file" width="16" height="16" class="rs-tree-section-icon"></i>
        <span class="rs-tree-section-label">ファイル</span>
        <span class="rs-tree-section-count">${items.length}</span>
      </button>
      <div class="rs-tree-section-content">
        ${treeHtml}
      </div>
    </div>
  `;

  return `
    <div class="rs-file-tree" id="${treeId}">
      <div class="rs-file-tree__scrollable">
        ${mainSectionHtml}
        <div class="rs-file-tree__scroll-indicator" data-scroll-indicator="scrollable">
          <i data-lucide="chevron-down" width="16" height="16"></i>
        </div>
      </div>
      <div class="rs-file-tree__resize-handle" data-resize-handle></div>
      <div class="rs-file-tree__fixed-bottom">
        <div class="rs-file-tree__fixed-bottom-inner">
          ${pinnedSectionHtml}
          ${recentSectionHtml}
          ${trashSectionHtml}
          <div class="rs-file-tree__scroll-indicator" data-scroll-indicator="fixed-bottom">
            <i data-lucide="chevron-down" width="16" height="16"></i>
          </div>
        </div>
      </div>
      ${contextMenuHtml}
    </div>
  `;
}

/**
 * FileTreeコンポーネントの初期化（イベントリスナーの設定）
 * @param {string} containerId - ツリーコンテナのID
 * @param {Function} onFileClick - ファイルクリック時のコールバック
 * @param {Function} onFolderToggle - フォルダ開閉時のコールバック
 */
function initFileTree(containerId, onFileClick = null, onFolderToggle = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // ファイルのクリックイベント
  const fileItems = container.querySelectorAll('.rs-tree-item--file .rs-tree-item-content');
  fileItems.forEach(fileLink => {
    fileLink.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // 全ての選択状態を解除
      container.querySelectorAll('.rs-tree-item-content').forEach(item => {
        item.classList.remove('selected');
      });
      
      // クリックされた項目を選択状態に
      fileLink.classList.add('selected');
      
      // コールバック実行
      if (onFileClick) {
        const treeItem = fileLink.closest('.rs-tree-item');
        const fileName = treeItem.getAttribute('data-name');
        const href = fileLink.getAttribute('href');
        onFileClick({ name: fileName, href: href, element: treeItem });
      }
    });
  });

  // フォルダの開閉機能
  const folderItems = container.querySelectorAll('.rs-tree-item--folder');
  folderItems.forEach(folder => {
    const content = folder.querySelector('.rs-tree-item-content');
    const chevron = folder.querySelector('.rs-tree-chevron');
    const icon = folder.querySelector('.rs-tree-icon');
    const children = folder.querySelector('.rs-tree-children');

    if (content && children) {
      content.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // 開閉状態を切り替え
        const isOpen = folder.classList.contains('rs-tree-item--open');
        
        if (isOpen) {
          folder.classList.remove('rs-tree-item--open');
          children.style.display = 'none';
          chevron.innerHTML = '<i data-lucide="chevron-right" width="14" height="14"></i>';
          icon.setAttribute('data-lucide', 'folder');
        } else {
          folder.classList.add('rs-tree-item--open');
          children.style.display = 'block';
          chevron.innerHTML = '<i data-lucide="chevron-down" width="14" height="14"></i>';
          icon.setAttribute('data-lucide', 'folder-open');
        }

        // Lucideアイコンを再初期化
        if (window.lucide) {
          lucide.createIcons();
        }

        // コールバック実行
        if (onFolderToggle) {
          const folderName = folder.getAttribute('data-name');
          onFolderToggle({ name: folderName, isOpen: !isOpen, element: folder });
        }
      });
    }
  });

  // Lucideアイコンを初期化
  if (window.lucide) {
    lucide.createIcons();
  }

  // ファイル名が省略されている場合、ツールチップを追加
  const allLabels = container.querySelectorAll('.rs-tree-label');
  allLabels.forEach(label => {
    // テキストが省略されているかチェック
    if (label.scrollWidth > label.clientWidth) {
      const content = label.closest('.rs-tree-item-content');
      if (content && !content.hasAttribute('data-badge-tooltip')) {
        content.setAttribute('title', label.textContent.trim());
      }
    }
  });

  // コンテキストメニュー表示関数
  const contextMenuDefault = container.querySelector('[data-menu-type="default"]');
  const contextMenuPinned = container.querySelector('[data-menu-type="pinned"]');
  const contextMenuTrash = container.querySelector('[data-menu-type="trash"]');
  const contextMenuConfluence = container.querySelector('[data-menu-type="confluence"]');
  const allContextMenus = [contextMenuDefault, contextMenuPinned, contextMenuTrash, contextMenuConfluence];
  let currentMenuTarget = null;

  function getContextMenuForSection(sectionType) {
    switch (sectionType) {
      case 'pinned':
        return contextMenuPinned;
      case 'trash':
        return contextMenuTrash;
      case 'confluence':
        return contextMenuConfluence;
      default:
        return contextMenuDefault;
    }
  }

  function hideAllContextMenus() {
    allContextMenus.forEach(menu => {
      if (menu) menu.classList.remove('rs-tree-context-menu--open');
    });
  }

  function showContextMenu(treeItem, anchorElement) {
    currentMenuTarget = treeItem;
    
    // セクションタイプを取得
    const sectionType = treeItem.getAttribute('data-section') || 
                        treeItem.closest('.rs-tree-section')?.getAttribute('data-section') || 
                        'main';
    
    // 適切なメニューを取得
    const contextMenu = getContextMenuForSection(sectionType);
    if (!contextMenu) return;
    
    // 他のメニューを閉じる
    hideAllContextMenus();
    
    // メニュー位置を計算（⋮ボタンの真下に表示）
    const rect = anchorElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const menuWidth = 200; // メニューの想定幅
    
    // 左位置: ボタンの右端からメニュー幅分左にオフセット
    let left = rect.right - containerRect.left - menuWidth;
    
    // 左端からはみ出る場合は左端に揃える
    if (left < 0) {
      left = 4;
    }
    
    contextMenu.style.top = `${rect.bottom - containerRect.top + 4}px`;
    contextMenu.style.left = `${left}px`;
    contextMenu.classList.add('rs-tree-context-menu--open');
    
    // Lucideアイコンを再初期化
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // ⋮メニューボタンのクリックイベント
  const menuButtons = container.querySelectorAll('.rs-tree-menu-btn');
  menuButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const treeItem = btn.closest('.rs-tree-item');
      showContextMenu(treeItem, btn);
    });
  });

  // 右クリックでもメニュー表示
  const allTreeItems = container.querySelectorAll('.rs-tree-item');
  allTreeItems.forEach(item => {
    item.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      currentMenuTarget = item;
      
      // セクションタイプを取得
      const sectionType = item.getAttribute('data-section') || 
                          item.closest('.rs-tree-section')?.getAttribute('data-section') || 
                          'main';
      
      // 適切なメニューを取得
      const contextMenu = getContextMenuForSection(sectionType);
      if (!contextMenu) return;
      
      // 他のメニューを閉じる
      hideAllContextMenus();
      
      // 右クリック位置を基準にメニュー表示
      const containerRect = container.getBoundingClientRect();
      const menuWidth = 200;
      
      let left = e.clientX - containerRect.left;
      // 右端からはみ出る場合
      if (left + menuWidth > containerRect.width) {
        left = containerRect.width - menuWidth - 8;
      }
      
      contextMenu.style.top = `${e.clientY - containerRect.top}px`;
      contextMenu.style.left = `${left}px`;
      contextMenu.classList.add('rs-tree-context-menu--open');
      
      if (window.lucide) {
        lucide.createIcons();
      }
    });
  });

  // 確認モーダルを表示するヘルパー関数
  function showFileTreeModal(title, content, confirmLabel, confirmColor, onConfirm) {
    // 既存のモーダルコンテナを確認、なければ作成
    let modalContainer = document.getElementById('fileTreeModalContainer');
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.id = 'fileTreeModalContainer';
      document.body.appendChild(modalContainer);
    }
    
    // Modalコンポーネントが利用可能か確認
    if (typeof Modal === 'undefined') {
      // Modalがない場合はconfirmにフォールバック
      if (confirm(content.replace(/<[^>]*>/g, ''))) {
        onConfirm();
      }
      return;
    }
    
    // Buttonコンポーネントが利用可能か確認
    const hasButton = typeof Button !== 'undefined';
    
    const actionsHtml = hasButton ? `
      <div style="display: flex; gap: var(--spacing-padding-8); justify-content: flex-end;">
        ${Button({
          label: 'キャンセル',
          variant: 'outline',
          color: 'neutral',
          size: 'md',
          id: 'fileTreeModalCancelBtn'
        })}
        ${Button({
          label: confirmLabel,
          variant: 'solid',
          color: confirmColor,
          size: 'md',
          id: 'fileTreeModalConfirmBtn'
        })}
      </div>
    ` : `
      <div style="display: flex; gap: var(--spacing-padding-8); justify-content: flex-end;">
        <button type="button" id="fileTreeModalCancelBtn" class="ds-btn ds-btn--outline ds-btn--neutral ds-btn--md">キャンセル</button>
        <button type="button" id="fileTreeModalConfirmBtn" class="ds-btn ds-btn--solid ds-btn--${confirmColor} ds-btn--md">${confirmLabel}</button>
      </div>
    `;
    
    const modalHtml = Modal({
      title: title,
      content: content,
      actions: actionsHtml,
      open: true,
      size: 'lg'
    });
    
    modalContainer.innerHTML = modalHtml;
    
    // Lucideアイコンを初期化
    if (window.lucide) {
      lucide.createIcons();
    }
    
    // モーダルを閉じる関数
    function closeFileTreeModal() {
      const modal = modalContainer.querySelector('.ds-modal');
      if (modal) {
        modal.classList.remove('ds-modal--open');
        setTimeout(() => {
          modalContainer.innerHTML = '';
        }, 300);
      }
    }
    
    // イベントリスナーを設定
    const confirmBtn = document.getElementById('fileTreeModalConfirmBtn');
    const cancelBtn = document.getElementById('fileTreeModalCancelBtn');
    const closeBtn = modalContainer.querySelector('.ds-modal__close');
    const backdrop = modalContainer.querySelector('.ds-modal__backdrop');
    
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        closeFileTreeModal();
        onConfirm();
      });
    }
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', closeFileTreeModal);
    }
    
    if (closeBtn) {
      closeBtn.addEventListener('click', closeFileTreeModal);
    }
    
    if (backdrop) {
      backdrop.addEventListener('click', closeFileTreeModal);
    }
  }

  // メニュー項目のクリックイベント（すべてのメニューに対応）
  const allMenuItems = container.querySelectorAll('.rs-tree-context-menu-item');
  allMenuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const action = item.getAttribute('data-action');
      const fileName = currentMenuTarget ? currentMenuTarget.getAttribute('data-name') : '';
      const targetItem = currentMenuTarget;
      
      // メニューを閉じる
      hideAllContextMenus();
      
      // アクション実行（モック）
      console.log(`Action: ${action}, File: ${fileName}`);
      
      // 各アクションの処理（モック）
      switch (action) {
        case 'open':
          alert(`「${fileName}」を開きます`);
          break;
        case 'pin':
          alert(`「${fileName}」をピン留めしました`);
          break;
        case 'unpin':
          alert(`「${fileName}」のピン留めを解除しました`);
          break;
        case 'copy':
          alert(`「${fileName}」をコピーしました`);
          break;
        case 'rename':
          const newName = prompt(`新しい名前を入力:`, fileName);
          if (newName && newName !== fileName) {
            alert(`「${fileName}」を「${newName}」に変更しました`);
          }
          break;
        case 'move':
          alert(`「${fileName}」の移動先を選択（未実装）`);
          break;
        case 'delete':
          showFileTreeModal(
            'ファイル削除の確認',
            `<p style="margin: 0 0 var(--spacing-padding-12) 0; line-height: 1.6;">
              <strong>${fileName}</strong> を削除しますか？
            </p>
            <p style="margin: 0; font-size: var(--font-size-14); color: var(--color-semantic-text-middle-light); line-height: 1.6;">
              削除されたファイルはゴミ箱に移動されます。
            </p>`,
            '削除する',
            'negative',
            () => {
              console.log(`「${fileName}」をゴミ箱に移動しました`);
              // ここで実際の削除処理やUI更新を行う
              if (targetItem) {
                targetItem.style.transition = 'opacity 0.3s ease';
                targetItem.style.opacity = '0';
                setTimeout(() => targetItem.remove(), 300);
              }
            }
          );
          break;
        case 'restore':
          alert(`「${fileName}」を元に戻しました`);
          break;
        case 'delete-permanently':
          showFileTreeModal(
            '完全に削除の確認',
            `<p style="margin: 0 0 var(--spacing-padding-12) 0; line-height: 1.6;">
              <strong>${fileName}</strong> を完全に削除しますか？
            </p>
            <p style="margin: 0; font-size: var(--font-size-14); color: var(--color-semantic-text-middle-light); line-height: 1.6;">
              この操作は取り消せません。ファイルは完全に削除されます。
            </p>`,
            '完全に削除',
            'negative',
            () => {
              console.log(`「${fileName}」を完全に削除しました`);
              // ここで実際の削除処理やUI更新を行う
              if (targetItem) {
                targetItem.style.transition = 'opacity 0.3s ease';
                targetItem.style.opacity = '0';
                setTimeout(() => targetItem.remove(), 300);
              }
            }
          );
          break;
        case 'copy-to-local':
          alert(`「${fileName}」をローカルにコピーしました`);
          console.log(`Confluence: 「${fileName}」をローカルにコピー`);
          break;
      }
      
      currentMenuTarget = null;
    });
  });

  // 外部クリックでメニューを閉じる（mousedownで早期にキャッチ）
  document.addEventListener('mousedown', function(e) {
    // いずれかのメニューが開いているか確認
    const anyMenuOpen = allContextMenus.some(menu => menu && menu.classList.contains('rs-tree-context-menu--open'));
    
    if (anyMenuOpen) {
      // クリックがメニュー内でもメニューボタンでもない場合
      const isInsideMenu = allContextMenus.some(menu => menu && menu.contains(e.target));
      if (!isInsideMenu && !e.target.closest('.rs-tree-menu-btn')) {
        e.preventDefault();
        e.stopPropagation();
        hideAllContextMenus();
        currentMenuTarget = null;
      }
    }
  }, true); // キャプチャフェーズで処理

  // Escキーでメニューを閉じる
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      hideAllContextMenus();
      currentMenuTarget = null;
    }
  });

  // セクションの折りたたみ機能
  const sections = container.querySelectorAll('.rs-tree-section');
  sections.forEach(section => {
    const header = section.querySelector('.rs-tree-section-header');
    const content = section.querySelector('.rs-tree-section-content');
    const chevron = section.querySelector('.rs-tree-section-chevron');

    if (header && content) {
      header.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const isCollapsed = section.classList.contains('rs-tree-section--collapsed');
        
        if (isCollapsed) {
          section.classList.remove('rs-tree-section--collapsed');
          content.style.display = 'block';
          if (chevron) {
            chevron.innerHTML = '<i data-lucide="chevron-down" width="14" height="14"></i>';
          }
        } else {
          section.classList.add('rs-tree-section--collapsed');
          content.style.display = 'none';
          if (chevron) {
            chevron.innerHTML = '<i data-lucide="chevron-right" width="14" height="14"></i>';
          }
        }

        // Lucideアイコンを再初期化
        if (window.lucide) {
          lucide.createIcons();
        }
      });
    }
  });

  // リサイズハンドルの処理
  const resizeHandle = container.querySelector('[data-resize-handle]');
  const fixedBottom = container.querySelector('.rs-file-tree__fixed-bottom');
  
  if (resizeHandle && fixedBottom) {
    let isDragging = false;
    let startY = 0;
    let startHeight = 0;
    
    resizeHandle.addEventListener('mousedown', function(e) {
      e.preventDefault();
      isDragging = true;
      startY = e.clientY;
      startHeight = fixedBottom.offsetHeight;
      resizeHandle.classList.add('is-dragging');
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    });
    
    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      
      const deltaY = startY - e.clientY;
      // 最小高さ: 3セクションヘッダー(115px) + スクロールインジケーター(24px) = 139px
      const newHeight = Math.max(139, Math.min(startHeight + deltaY, container.offsetHeight * 0.6));
      fixedBottom.style.height = `${newHeight}px`;
    });
    
    document.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        resizeHandle.classList.remove('is-dragging');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        
        // 高さをlocalStorageに保存
        const height = fixedBottom.offsetHeight;
        try {
          localStorage.setItem('fileTree-fixedBottom-height', height);
        } catch (e) {
          // localStorage使用不可の場合は無視
        }
      }
    });
    
    // localStorageから高さを復元
    try {
      const savedHeight = localStorage.getItem('fileTree-fixedBottom-height');
      if (savedHeight) {
        fixedBottom.style.height = `${savedHeight}px`;
      }
    } catch (e) {
      // localStorage使用不可の場合は無視
    }
  }

  // スクロールインジケーターの処理（共通関数）
  function setupScrollIndicator(scrollArea, indicator) {
    if (!scrollArea || !indicator) return;
    
    // スクロール状態をチェックする関数
    function updateIndicator() {
      const indicatorHeight = indicator.classList.contains('is-visible') ? 24 : 0;
      const hasOverflow = scrollArea.scrollHeight > scrollArea.clientHeight + indicatorHeight;
      const isAtBottom = scrollArea.scrollHeight - scrollArea.scrollTop <= scrollArea.clientHeight + 5;
      
      if (hasOverflow && !isAtBottom) {
        indicator.classList.add('is-visible');
      } else {
        indicator.classList.remove('is-visible');
      }
    }
    
    // 初期チェック
    setTimeout(updateIndicator, 200);
    
    // スクロール時にチェック
    scrollArea.addEventListener('scroll', updateIndicator);
    
    // リサイズ時にもチェック
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(updateIndicator, 50);
    });
    resizeObserver.observe(scrollArea);
    
    // DOM変更を監視（セクション開閉など）
    const mutationObserver = new MutationObserver(() => {
      setTimeout(updateIndicator, 50);
    });
    mutationObserver.observe(scrollArea, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    // インジケータークリックでスクロール
    indicator.addEventListener('click', function(e) {
      e.stopPropagation();
      scrollArea.scrollBy({ top: 50, behavior: 'smooth' });
    });
  }
  
  // ファイルセクションのスクロールインジケーター
  const scrollableArea = container.querySelector('.rs-file-tree__scrollable');
  const scrollableIndicator = container.querySelector('[data-scroll-indicator="scrollable"]');
  setupScrollIndicator(scrollableArea, scrollableIndicator);
  
  // 下部固定エリアのスクロールインジケーター
  const fixedBottomInner = container.querySelector('.rs-file-tree__fixed-bottom-inner');
  const fixedBottomIndicator = container.querySelector('[data-scroll-indicator="fixed-bottom"]');
  setupScrollIndicator(fixedBottomInner, fixedBottomIndicator);

  // ドラッグ＆ドロップのハイライト機能
  const scrollableForDrop = container.querySelector('.rs-file-tree__scrollable');
  
  if (scrollableForDrop) {
    let dragCounter = 0; // ドラッグ中のカウンター（子要素の出入りを管理）

    scrollableForDrop.addEventListener('dragenter', function(e) {
      e.preventDefault();
      dragCounter++;
      scrollableForDrop.classList.add('rs-file-tree__scrollable--drag-over');
    });

    scrollableForDrop.addEventListener('dragleave', function(e) {
      dragCounter--;
      if (dragCounter === 0) {
        scrollableForDrop.classList.remove('rs-file-tree__scrollable--drag-over');
      }
    });

    scrollableForDrop.addEventListener('dragover', function(e) {
      e.preventDefault(); // ドロップを許可
    });

    scrollableForDrop.addEventListener('drop', function(e) {
      e.preventDefault();
      dragCounter = 0;
      scrollableForDrop.classList.remove('rs-file-tree__scrollable--drag-over');
      
      // ドロップされたファイルを処理
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        // カスタムイベントを発火して親コンポーネントに通知
        const event = new CustomEvent('filetreedrop', { 
          detail: { files: Array.from(files) },
          bubbles: true 
        });
        container.dispatchEvent(event);
      }
    });
  }
}

// ブラウザ環境でグローバルに公開
if (typeof window !== 'undefined') {
  window.FileTree = FileTree;
  window.initFileTree = initFileTree;
}

// Node.js環境でエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FileTree, initFileTree };
}

