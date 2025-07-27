/**
 * Simple client-side toast utility
 * Shows notifications to users
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  duration?: number; // in milliseconds
  position?: 'top' | 'bottom';
}

/**
 * Show a toast notification
 * For now, uses console + browser notification, can be upgraded to UI toast later
 */
export function showToast(message: string, type: ToastType = 'info', options: ToastOptions = {}) {
  const { duration = 4000 } = options;
  
  // Log to console with appropriate level
  switch (type) {
    case 'error':
      console.error(`🚨 ${message}`);
      break;
    case 'warning':
      console.warn(`⚠️ ${message}`);
      break;
    case 'success':
      console.log(`✅ ${message}`);
      break;
    default:
      console.info(`ℹ️ ${message}`);
  }

  // If we're in the browser, try to show a visual notification
  if (typeof window !== 'undefined') {
    // Create a simple toast element
    createVisualToast(message, type, duration);
  }
}

/**
 * Create a visual toast notification in the DOM
 */
function createVisualToast(message: string, type: ToastType, duration: number) {
  // Create toast container if it doesn't exist
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.textContent = message;
  
  const bgColor = {
    success: '#10b981',
    error: '#ef4444', 
    warning: '#f59e0b',
    info: '#3b82f6'
  }[type];
  
  toast.style.cssText = `
    background: ${bgColor};
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-size: 14px;
    font-weight: 500;
    max-width: 400px;
    word-wrap: break-word;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease-in-out;
    pointer-events: auto;
  `;

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });

  // Auto remove after duration
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

// Convenience functions
export const toast = {
  success: (message: string, options?: ToastOptions) => showToast(message, 'success', options),
  error: (message: string, options?: ToastOptions) => showToast(message, 'error', options),
  warning: (message: string, options?: ToastOptions) => showToast(message, 'warning', options),
  info: (message: string, options?: ToastOptions) => showToast(message, 'info', options),
};