// service_worker/background.js

console.log("Background service worker is running.");

// Example: Listener for when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed.");
});

// Example: Listener for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message:", message);
  sendResponse({ response: "Message received by background.js" });
});
