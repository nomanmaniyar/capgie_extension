console.log('Popup script loaded.');

// Trigger the content script to scrape the webpage
document.addEventListener('DOMContentLoaded', () => {
  const scrapeButton = document.getElementById('scrapeButton');

  if (scrapeButton) {
    scrapeButton.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id) {
          chrome.scripting.executeScript(
            {
              target: { tabId: tabs[0].id },
              func: () => {
                chrome.runtime.sendMessage({ action: 'scrape' }, (response) => {
                  console.log('Scraped Data:', response);
                  alert(JSON.stringify(response, null, 2));
                });
              }
            }
          );
        }
      });
    });
  }
});