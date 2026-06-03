export default {
  title: 'Tokens/Opacity',
  parameters: {
    docs: {
      description: {
        component: 'Opacity tokens for transparency values. Provides consistent transparency levels across components.'
      }
    }
  }
};

// トークンリスト
const opacityTokens = [
  { name: 'opacity/0', cssVar: '--opacity-0', value: '0', usage: '完全透明・要素を非表示' },
  { name: 'opacity/5', cssVar: '--opacity-5', value: '0.05', usage: '微細なホバー効果・軽いシャドウ' },
  { name: 'opacity/15', cssVar: '--opacity-15', value: '0.15', usage: '軽いホバー状態・選択状態' },
  { name: 'opacity/30', cssVar: '--opacity-30', value: '0.30', usage: '無効化テキスト・プレースホルダー' },
  { name: 'opacity/50', cssVar: '--opacity-50', value: '0.50', usage: '無効化要素・モーダル背景' },
  { name: 'opacity/65', cssVar: '--opacity-65', value: '0.65', usage: 'ローディングオーバーレイ・強調無効化' },
  { name: 'opacity/80', cssVar: '--opacity-80', value: '0.80', usage: '無効化コンポーネント・軽い無効化状態' },
  { name: 'opacity/100', cssVar: '--opacity-100', value: '1', usage: '完全不透明（デフォルト）' }
];

export const Overview = () => {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 800px; margin: 20px;">
      <h1 style="margin-bottom: 24px; font-size: 24px;">Opacity Tokens</h1>
      <p style="margin-bottom: 32px; color: #666; line-height: 1.6;">
        透明度の一貫性を保つためのopacityトークン。無効化状態、オーバーレイ、ホバー効果などで使用されます。
      </p>
      
      <div style="display: grid; gap: 16px;">
        ${opacityTokens.map(token => `
          <div style="
            display: flex; 
            align-items: center; 
            padding: 16px; 
            border: 1px solid #e0e0e0; 
            border-radius: 8px;
            background: #fafafa;
          ">
            <div style="
              width: 60px; 
              height: 60px; 
              background: #3f83f8; 
              opacity: var(${token.cssVar}); 
              margin-right: 16px; 
              border-radius: 4px;
              flex-shrink: 0;
            "></div>
            <div style="flex: 1;">
              <div style="
                font-family: 'Monaco', 'Menlo', monospace; 
                font-size: 14px; 
                font-weight: var(--font-weight-600); 
                margin-bottom: 4px;
              ">${token.name}</div>
              <div style="
                font-size: 14px; 
                color: #666; 
                margin-bottom: 4px;
              ">値: ${token.value}</div>
              <div style="
                font-size: 13px; 
                color: #888;
              ">${token.usage}</div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <h2 style="margin: 32px 0 16px; font-size: 18px;">使用例</h2>
      <div style="
        padding: 20px; 
        background: #f8f9fa; 
        border-radius: 8px; 
        font-family: 'Monaco', 'Menlo', monospace; 
        font-size: 14px;
      ">
        <pre style="margin: 0; white-space: pre-wrap;">/* 無効化ボタン */
.button--disabled {
  opacity: var(--opacity-50);
}

/* ホバー効果 */
.card:hover {
  background: rgba(0, 0, 0, var(--opacity-5));
}

/* モーダル背景 */
.modal-backdrop {
  opacity: var(--opacity-50);
}</pre>
      </div>
    </div>
  `;
};

export const UsageExamples = () => {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 800px; margin: 20px;">
      <h1 style="margin-bottom: 24px; font-size: 24px;">Opacity Usage Examples</h1>
      
      <h2 style="margin: 24px 0 16px; font-size: 18px;">Disabled States</h2>
      <div style="display: flex; gap: 16px; margin-bottom: 32px;">
        <button style="
          padding: 12px 24px; 
          border: none; 
          background: #3f83f8; 
          color: white; 
          border-radius: 6px;
          cursor: pointer;
        ">Normal Button</button>
        <button style="
          padding: 12px 24px; 
          border: none; 
          background: #3f83f8; 
          color: white; 
          border-radius: 6px;
          opacity: var(--opacity-50);
          cursor: not-allowed;
        ">Disabled Button</button>
        <button style="
          padding: 12px 24px; 
          border: none; 
          background: #3f83f8; 
          color: white; 
          border-radius: 6px;
          opacity: var(--opacity-65);
          cursor: not-allowed;
        ">Loading Button</button>
      </div>
      
      <h2 style="margin: 24px 0 16px; font-size: 18px;">Text States</h2>
      <div style="margin-bottom: 32px;">
        <p style="margin: 8px 0; opacity: var(--opacity-100);">Primary text (opacity-100)</p>
        <p style="margin: 8px 0; opacity: var(--opacity-65);">Secondary text (opacity-65)</p>
        <p style="margin: 8px 0; opacity: var(--opacity-30);">Disabled text (opacity-30)</p>
        <p style="margin: 8px 0; opacity: var(--opacity-15);">Placeholder text (opacity-15)</p>
      </div>
      
      <h2 style="margin: 24px 0 16px; font-size: 18px;">Overlay Effects</h2>
      <div style="position: relative; height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; margin-bottom: 32px;">
        <div style="
          position: absolute; 
          top: 0; 
          left: 0; 
          right: 0; 
          bottom: 0; 
          background: black; 
          opacity: var(--opacity-30); 
          border-radius: 8px;
        "></div>
        <div style="
          position: absolute; 
          top: 50%; 
          left: 50%; 
          transform: translate(-50%, -50%); 
          color: white; 
          text-align: center;
        ">
          <h3 style="margin: 0 0 8px; font-size: 18px;">Overlay Example</h3>
          <p style="margin: 0; opacity: var(--opacity-65);">30% dark overlay</p>
        </div>
      </div>
    </div>
  `;
};