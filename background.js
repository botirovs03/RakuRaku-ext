chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.source === "getdatas") {
      // Handle the data received from content_scriptRich.js
      console.log("Data received in background script (getdatas): " + message.data);
  
      // You can also perform actions based on the data here
      // For example, change the background color of elements
  
      // Relay the message to content_scriptRaku.js
      chrome.tabs.query({ url: "https://hnyola.rakurakuhanbai.jp/bj7rzba/top/main" }, function (tabs) {
        if (tabs && tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { source: "getdatas", data: message.data });
        }
      });
    } else if (message.source === "estimate") {
      // Relay the message to content_scriptRaku.js
      chrome.tabs.query({ url: "https://hnyola.rakurakuhanbai.jp/bj7rzba/top/main" }, function (tabs) {
        if (tabs && tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { source: "estimate", data: message.data });
        }
      });
      
      // You can perform actions based on the data from content_scriptRaku.js here
    } else if (message.source === "check") {
      // Relay the message to content_scriptRaku.js
      chrome.tabs.query({ url: "https://hnyola.rakurakuhanbai.jp/bj7rzba/top/main" }, function (tabs) {
        if (tabs && tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { source: "check", data: message.data });
        }
      });
      
      // You can perform actions based on the data from content_scriptRaku.js here
    }
  });
  