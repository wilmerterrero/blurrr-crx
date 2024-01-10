"use strict";

(async () => {
  const licenseyKey = "blurrr_crx_license";
  const license = await chrome.storage.local.get([licenseyKey]);
  if (!license[licenseyKey]) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        // Load and apply blur to new elements
        const url = window.location.origin;
        const blurredElements =
          JSON.parse(localStorage.getItem("blurrr_crx_blurredElements")) || {};

        if (blurredElements[url]) {
          blurredElements[url].forEach((selector) => {
            try {
              const element = document.querySelector(selector);
              if (element) {
                element.style.filter = "blur(8px)";
              }
            } catch (e) {
              console.error(
                `blurrr_crx: Error applying blur to selector:`,
                selector,
                e
              );
            }
          });
        }
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
