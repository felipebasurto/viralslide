import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Remove any development platform branding
const removeBranding = () => {
  // Remove Lovable branding elements
  const selectors = [
    '[data-lovable-banner]',
    '[class*="lovable"]',
    '[id*="lovable"]',
    'div[style*="position: fixed"][style*="z-index"]:has-text("Edit")',
    'button:has-text("Edit with")',
    '.development-overlay',
    '.edit-overlay',
    '.platform-branding'
  ];
  
  selectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el && (el.textContent?.includes('Edit with') || el.textContent?.includes('Lovable'))) {
          el.remove();
        }
      });
    } catch (e) {
      // Ignore selector errors
    }
  });
  
  // Also check for any fixed position elements with edit-related content
  const fixedElements = document.querySelectorAll('div[style*="position: fixed"], button[style*="position: fixed"]');
  fixedElements.forEach(el => {
    if (el.textContent?.includes('Edit with') || el.textContent?.includes('Lovable')) {
      el.remove();
    }
  });
};

// Run immediately and on DOM changes
removeBranding();
setTimeout(removeBranding, 100);
setTimeout(removeBranding, 500);
setTimeout(removeBranding, 1000);

// Watch for new elements being added
const observer = new MutationObserver(() => {
  removeBranding();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
