import React from 'react';
import { createRoot } from 'react-dom/client';
import { FloatingIcon } from '../components/FloatingIcon.Shadow';
import { TranslationPopover } from '../components/TranslationPopover.Shadow';
import { translationService } from '../services/translation';
import { storageService } from '../services/storage';
import type { TranslationResult } from '../types';

// Container IDs
const SHADOW_HOST_ID = 'thoth-extension-root';
const ICON_CONTAINER_ID = 'thoth-icon-container';
const POPOVER_CONTAINER_ID = 'thoth-popover-container';

class ContentScript {
  private shadowHost: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private iconRoot: any = null;
  private popoverRoot: any = null;
  private currentSelection: { text: string; x: number; y: number } | null = null;
  private translationResult: TranslationResult | null = null;

  constructor() {
    this.init();
  }

  private init() {
    console.log('[Thoth] Content script initialized');
    
    // Listen for text selection
    document.addEventListener('mouseup', this.handleTextSelection);
    
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener(this.handleMessage);
    
    // Verify listener is registered
    console.log('[Thoth] Message listener registered');
    
    // Create shadow DOM container
    this.createShadowDOM();
    
    // Send ready signal to background
    chrome.runtime.sendMessage({ action: 'contentScriptReady' }).catch(() => {
      // Ignore errors, background might not be listening
    });
  }

  private createShadowDOM() {
    // Remove existing shadow host if present
    const existing = document.getElementById(SHADOW_HOST_ID);
    if (existing) {
      existing.remove();
    }

    // Create shadow host
    this.shadowHost = document.createElement('div');
    this.shadowHost.id = SHADOW_HOST_ID;
    this.shadowHost.style.position = 'fixed';
    this.shadowHost.style.zIndex = '999999';
    this.shadowHost.style.pointerEvents = 'none';
    
    // Attach shadow root (to isolate CSS)
    this.shadowRoot = this.shadowHost.attachShadow({ mode: 'open' });
    
    // Create containers for icon and popover
    const iconContainer = document.createElement('div');
    iconContainer.id = ICON_CONTAINER_ID;
    iconContainer.style.pointerEvents = 'auto';
    
    const popoverContainer = document.createElement('div');
    popoverContainer.id = POPOVER_CONTAINER_ID;
    popoverContainer.style.pointerEvents = 'auto';
    
    // Inject compiled CSS into shadow DOM
    const style = document.createElement('style');
    // Get the compiled CSS from the bundled stylesheet
    const styleSheets = Array.from(document.styleSheets);
    let cssText = '';
    
    // Try to extract CSS from our bundled styles
    try {
      for (const sheet of styleSheets) {
        try {
          if (sheet.href && sheet.href.includes('index')) {
            const rules = Array.from(sheet.cssRules || []);
            cssText += rules.map(rule => rule.cssText).join('\n');
          }
        } catch (e) {
          // CORS or access issues, skip
        }
      }
    } catch (e) {
      console.warn('[Thoth] Could not extract CSS:', e);
    }
    
    // Fallback: Add essential inline styles
    if (!cssText) {
      cssText = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        button {
          background: #2383E2;
          color: white;
          border: none;
          border-radius: 9999px;
          padding: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08);
        }
        
        button:hover {
          background: #1F7BD7;
          transform: scale(1.1);
        }
        
        .popover {
          background: white;
          border: 1px solid #E9E9E7;
          border-radius: 6px;
          padding: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          max-width: 320px;
        }
        
        .popover h3 {
          font-size: 14px;
          font-weight: 600;
          color: #37352F;
          margin-bottom: 12px;
        }
        
        .popover p {
          font-size: 14px;
          color: #37352F;
          margin-bottom: 8px;
        }
        
        .popover label {
          font-size: 12px;
          color: #787774;
          display: block;
          margin-bottom: 4px;
        }
        
        .popover .translation {
          font-size: 16px;
          font-weight: 600;
          color: #37352F;
        }
        
        .popover .actions {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }
        
        .popover .btn {
          flex: 1;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
        }
        
        .popover .btn-primary {
          background: #2383E2;
          color: white;
        }
        
        .popover .btn-primary:hover {
          background: #1F7BD7;
        }
        
        .popover .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .popover .btn-saved {
          background: #f0fdf4;
          color: #15803d;
          border: 1px solid #bbf7d0;
        }
        
        .popover .close-btn {
          background: none;
          border: none;
          color: #9B9A97;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: none;
        }
        
        .popover .close-btn:hover {
          color: #37352F;
          background: #F7F6F3;
          transform: none;
        }
      `;
    }
    
    style.textContent = cssText;
    
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(iconContainer);
    this.shadowRoot.appendChild(popoverContainer);
    
    document.body.appendChild(this.shadowHost);
    
    // Initialize React roots
    this.iconRoot = createRoot(iconContainer);
    this.popoverRoot = createRoot(popoverContainer);
  }

  private handleTextSelection = (event: MouseEvent) => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (!text || text.length === 0) {
      this.hideFloatingIcon();
      return;
    }

    // Get selection position
    const range = selection?.getRangeAt(0);
    const rect = range?.getBoundingClientRect();

    if (!rect) return;

    this.currentSelection = {
      text,
      x: rect.left + rect.width / 2 - 20, // Center the icon
      y: rect.top - 50, // Position above selection
    };

    this.showFloatingIcon();
  };

  private handleMessage = (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    console.log('[Thoth] Message received:', message);
    
    if (message.action === 'translate') {
      console.log('[Thoth] Translating text...');
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      
      if (text) {
        console.log('[Thoth] Selected text:', text);
        // Translate and send response when complete
        this.translateText(text).then(() => {
          sendResponse({ success: true });
        }).catch((error) => {
          sendResponse({ success: false, error: error.message });
        });
        return true; // Keep message channel open for async response
      } else {
        console.log('[Thoth] No text selected');
        sendResponse({ success: false, error: 'No text selected' });
      }
    }
    
    // Don't return true if we're not handling the message or already sent response
    return false;
  };

  private showFloatingIcon() {
    if (!this.currentSelection || !this.iconRoot) return;

    this.iconRoot.render(
      <FloatingIcon
        position={{ x: this.currentSelection.x, y: this.currentSelection.y }}
        onClick={this.handleIconClick}
      />
    );
  }

  private hideFloatingIcon() {
    if (this.iconRoot) {
      this.iconRoot.render(null);
    }
  }

  private handleIconClick = async () => {
    if (!this.currentSelection) return;

    this.hideFloatingIcon();
    await this.translateText(this.currentSelection.text);
  };

  private async translateText(text: string) {
    console.log('[Thoth] Starting translation for:', text);
    try {
      const result = await translationService.translate({ text });
      console.log('[Thoth] Translation result:', result);
      this.translationResult = result;
      this.showTranslationPopover();
    } catch (error) {
      console.error('[Thoth] Translation error:', error);
    }
  }

  private showTranslationPopover() {
    if (!this.translationResult || !this.currentSelection || !this.popoverRoot) return;

    this.popoverRoot.render(
      <TranslationPopover
        result={this.translationResult}
        position={{ 
          x: this.currentSelection.x - 140, // Center the popover (width 320 / 2 - icon width)
          y: this.currentSelection.y + 60 
        }}
        onClose={this.hideTranslationPopover}
        onSave={this.handleSaveWord}
      />
    );
  }

  private hideTranslationPopover = () => {
    if (this.popoverRoot) {
      this.popoverRoot.render(null);
    }
    this.translationResult = null;
  };

  private handleSaveWord = async (word: string, translation: string) => {
    await storageService.saveWord({
      word,
      translation,
      context: this.currentSelection?.text,
      sourceUrl: window.location.href,
    });
  };
}

// Initialize content script
new ContentScript();
