"use strict";

chrome.action.onClicked.addListener((tab) => {
  if (tab.url !== "chrome://extensions/") {
    if (tab.id) {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tab.id, {action: "toggleBlur"});
      });
    }
  }
});
