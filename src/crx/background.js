"use strict";

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    const prevState = await chrome.action.setBadgeText({ tabId: tab.id });
    const nextState = prevState === "ON" ? "OFF" : "ON";

    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tab.id, { action: "toggleBlur" });
    });
  }
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === "stop") {
    chrome.action.setBadgeText({ tabId: sender.tab.id, text: "OFF" });
  }
  return true;
});

chrome.runtime.onInstalled.addListener(function () {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.setUninstallURL("https://tally.so/r/3qVPO5");
  }
});
