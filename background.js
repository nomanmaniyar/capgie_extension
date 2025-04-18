chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed.');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scrape') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            func: () => {
              const data = {
                title: document.title,
                url: window.location.href,
                content: document.body.innerText
              };
              return data;
            }
          },
          (results) => {
            if (results && results[0]) {
              sendResponse(results[0].result);
            }
          }
        );
      }
    });
    return true; // Indicates that the response will be sent asynchronously
  }
});