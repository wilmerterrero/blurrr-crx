"use strict";

import { floatingMenuTemplate } from "../templates";
import {
  APP,
  MENU_STOP_ID,
  MENU_REMOVE_ALL_ID,
  MENU_FEEDBACK_ID,
  MENU_DONATE_ID,
  LS_CONTAINER,
} from "../constants";

// Blur mode
let blurMode = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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

    // Add event listeners to the menu buttons
    const menuStopButton = shadowRoot.getElementById(MENU_STOP_ID);
    const menuRemoveAllButton = shadowRoot.getElementById(MENU_REMOVE_ALL_ID);
    const menuFeedbackButton = shadowRoot.getElementById(MENU_FEEDBACK_ID);
    const menuDonateButton = shadowRoot.getElementById(MENU_DONATE_ID);

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

    if (menuDonateButton) {
      menuDonateButton.addEventListener("click", function () {
        const donateUrl = "https://www.buymeacoffee.com/wilmerterrero";
        handleNavigate(donateUrl);
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

  if (element.style.filter !== "blur(8px)") {
    element.style.filter = "blur(8px)";
    saveBlurredElement(element);
  } else {
    element.style.filter = "";
    removeBlurredElement(element);
  }
}

// Function to save blurred elements
function saveBlurredElement(element) {
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
  const url = window.location.origin;
  const blurredElements = JSON.parse(localStorage.getItem(LS_CONTAINER)) || {};

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
        console.error("Error removing blur from selector:", selector, e);
      }
    });
  }
}

// Function to generate a unique selector for an element
function getUniqueSelector(element, maxDepth = 5) {
  let tagName = element.tagName.toLowerCase();

  // For div elements
  if (tagName === "div") {
    // Check for dataset, id, title, or use nth-of-type
    if (element.dataset && Object.keys(element.dataset).length > 0) {
      const [dataKey, dataValue] = Object.entries(element.dataset)[0];
      return `div[data-${dataKey}="${dataValue}"]`;
    } else if (element.id) {
      return `div#${element.id}`;
    } else if (element.title) {
      return `div[title="${element.title}"]`;
    }
  }
  // For img elements
  else if (tagName === "img" && element.src) {
    // Extract the src attribute directly as is
    let srcAttr = element.getAttribute("src");

    // Extract the URL part after the domain
    let urlPath = srcAttr.split("/").slice(2).join("/");

    // Create a selector that matches the end of the src attribute
    return `img[src$="${urlPath}"]`;
  }
  // For a (link) elements
  else if (tagName === "a" && element.href) {
    // Normalize the href attribute to an absolute URL
    let href = new URL(element.href, window.location.href).href;

    // Use the starts-with selector for links as well
    return `a[href^="${href}"]`;
  } else if (element.id) {
    return `#${element.id}`;
  }
  // For other elements with title
  else if (element.title) {
    return `*[title="${element.title}"]`;
  }

  // Fallback to nth-of-type
  let path = [];
  let depth = 0;

  while (element && depth < maxDepth) {
    let selector = element.tagName.toLowerCase();

    let siblingIndex = Array.prototype.indexOf.call(
      element.parentNode?.children || [],
      element
    );
    selector += `:nth-of-type(${siblingIndex + 1})`;

    path.unshift(selector);
    element = element.parentElement;
    depth++;
  }

  return path.join(" > ");
}
