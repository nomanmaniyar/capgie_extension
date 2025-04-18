console.log('Popup script loaded.');

// Trigger the content script to scrape the webpage
document.addEventListener('DOMContentLoaded', () => {
  const scrapeButton = document.getElementById('scrapeButton');

  if (scrapeButton) {
    scrapeButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'scrape' }, (response) => {
        if (response) {
          document.getElementById('output').textContent = JSON.stringify(response, null, 2);
        } else {
          document.getElementById('output').textContent = 'No data received.';
        }
      });
    });
  }
});