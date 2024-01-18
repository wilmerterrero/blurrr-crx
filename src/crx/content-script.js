"use strict";

import { finder } from "@medv/finder";
import { floatingMenuTemplate } from "../templates";
import {
  APP,
  BLUR,
  MENU_STOP_ID,
  MENU_REMOVE_ALL_ID,
  MENU_FEEDBACK_ID,
  MENU_LICENSE_ID,
  MENU_CONTENT_ID,
  MENU_LICENSE_MODAL_ID,
  MENU_LICENSE_INPUT_ID,
  MENU_LICENSE_BUTTON_ID,
  MENU_LICENSE_ADVICE_ID,
  GUMROAD_PRODUCT_ID,
  LS_CONTAINER,
  LS_LICENSE,
} from "../constants";

// Blur mode
let blurMode = false;

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.action === "toggleBlur") {
    // Toggle blur mode
    blurMode = !blurMode;

    // Create a shadow host element
    const shadowHost = document.createElement("div");
    shadowHost.id = APP;
    document.body.appendChild(shadowHost);

    // Attach a shadow root to the shadow host
    const shadowRoot = shadowHost.attachShadow({ mode: "open" });

    // Insert the HTML into the shadow root
    shadowRoot.innerHTML = floatingMenuTemplate;

    // Add event listener to the document
    document.addEventListener("click", handleElementClick, true);

    const menuContent = shadowRoot.getElementById(MENU_CONTENT_ID);
    const menuStopButton = shadowRoot.getElementById(MENU_STOP_ID);
    const menuRemoveAllButton = shadowRoot.getElementById(MENU_REMOVE_ALL_ID);
    const menuFeedbackButton = shadowRoot.getElementById(MENU_FEEDBACK_ID);
    const licenseButton = shadowRoot.getElementById(MENU_LICENSE_ID);
    const licenseAdvice = shadowRoot.getElementById(MENU_LICENSE_ADVICE_ID);

    // Check for license
    const license = await getLicenseKey();

    if (!license) {
      licenseAdvice.style.display = "block";
    } else {
      licenseButton.style.display = "none";
      licenseAdvice.style.display = "none";
      menuContent.style.width = "300px";
      menuFeedbackButton.style.marginLeft = "10px";
    }

    if (menuStopButton) {
      menuStopButton.addEventListener("click", function () {
        handleStop();
      });
    }

    if (menuRemoveAllButton) {
      menuRemoveAllButton.addEventListener("click", function () {
        removeBlurFromAll();
      });
    }

    if (menuFeedbackButton) {
      menuFeedbackButton.addEventListener("click", function () {
        const feedbackUrl = "https://tally.so/r/3EWP74";
        handleNavigate(feedbackUrl);
      });
    }

    if (licenseButton) {
      licenseButton.addEventListener("click", function () {
        const licenseModal = shadowRoot.getElementById(MENU_LICENSE_MODAL_ID);
        licenseModal.style.display = "flex";

        const licenseInput = shadowRoot.getElementById(MENU_LICENSE_INPUT_ID);
        const licenseSubmitButton = shadowRoot.getElementById(
          MENU_LICENSE_BUTTON_ID
        );

        let _license = "";
        if (licenseInput) {
          licenseInput.onchange = function (event) {
            _license = event.target.value;
          };
        }

        if (licenseSubmitButton) {
          licenseSubmitButton.addEventListener("click", function () {
            if (!_license) return;
            fetch("https://api.gumroad.com/v2/licenses/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                product_id: GUMROAD_PRODUCT_ID,
                license_key: _license,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  setLicenseKey(_license);
                  licenseInput.value = "Valid! Reload the page.";
                } else {
                  licenseInput.value = "Invalid license";
                }
              })
              .catch((error) => console.error("Error:", error));
          });
        }
      });
    }
  }
});

function isDescendantOfMenu(element, menuId) {
  let currentElement = element;
  while (currentElement) {
    if (currentElement.id === menuId) {
      return true;
    }
    currentElement = currentElement.parentElement;
  }
  return false;
}

function handleElementClick(event) {
  if (isDescendantOfMenu(event.target, APP)) return;

  event.preventDefault(); // Prevent the default click action
  event.stopPropagation(); // Stop the click from "bubbling up" the DOM
  toggleBlur(event.target);
}

function handleStop() {
  blurMode = false;
  document.getElementById(APP).remove();
  document.removeEventListener("click", handleElementClick, true);
  chrome.runtime.sendMessage({ action: "stop" });
}

function handleNavigate(url) {
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("target", "_blank");
  a.click();
  a.remove();
}

function toggleBlur(element) {
  if (!blurMode) return;

  if (element.style.filter !== BLUR) {
    element.style.filter = BLUR;
    saveBlurredElement(element);
  } else {
    element.style.filter = "";
    removeBlurredElement(element);
  }
}

// Function to save blurred elements
function saveBlurredElement(element) {
  // Check if license is valid
  const license = getLicenseKey();
  if (!license) return;

  const uniqueSelector = getUniqueSelector(element);
  const url = window.location.origin;
  const blurredElements = JSON.parse(localStorage.getItem(LS_CONTAINER)) || {};

  if (!blurredElements[url]) {
    blurredElements[url] = [];
  }
  blurredElements[url].push(uniqueSelector);
  localStorage.setItem(LS_CONTAINER, JSON.stringify(blurredElements));
}

// Function to remove blurred elements
function removeBlurredElement(element) {
  const uniqueSelector = getUniqueSelector(element);
  const url = window.location.origin;
  const blurredElements = JSON.parse(localStorage.getItem(LS_CONTAINER)) || {};

  if (blurredElements[url]) {
    blurredElements[url] = blurredElements[url].filter(
      (selector) => selector !== uniqueSelector
    );
    localStorage.setItem(LS_CONTAINER, JSON.stringify(blurredElements));
  }
}

// Function to remove blur from all elements
function removeBlurFromAll() {
  // Check if license is valid
  const license = getLicenseKey();

  if (license) {
    const url = window.location.origin;
    const blurredElements =
      JSON.parse(localStorage.getItem(LS_CONTAINER)) || {};
    console.log(blurredElements[url]);

    if (blurredElements[url]) {
      blurredElements[url].forEach((selector) => {
        try {
          const element = document.querySelector(selector);
          if (element) {
            element.style.filter = "";
            // clean up the local storage
            removeBlurredElement(element);
          }
        } catch (e) {
          console.error(
            `${APP} - Error removing blur from selector:`,
            selector,
            e
          );
        }
      });
    }
  } else {
    const runtimeBlurredElements = document.querySelectorAll(
      `[style*='${BLUR}']`
    );
    runtimeBlurredElements.forEach((elem) => {
      const uniqueSelector = getUniqueSelector(elem);
      const element = document.querySelector(uniqueSelector);
      element.style.filter = "";
    });
  }
}

// Function to generate a unique selector for an element
function getUniqueSelector(element) {
  if (!element || !(element instanceof Element)) {
    throw new Error("Invalid element provided");
  }
  const selector = finder(element, {
    className: (name) => !name.startsWith(APP),
  })
  return selector;
}


async function getLicenseKey() {
  const license = await chrome.storage.local.get([LS_LICENSE]);
  return license[LS_LICENSE];
}

async function setLicenseKey(license) {
  await chrome.storage.local.set({ [LS_LICENSE]: license });
}
