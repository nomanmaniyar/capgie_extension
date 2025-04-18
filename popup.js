console.log('Popup script loaded.');

// Trigger the content script to scrape the webpage
document.addEventListener('DOMContentLoaded', () => {
  const scrapeButton = document.getElementById('scrapeButton');

  if (scrapeButton) {
    // Add an event listener to the scrape button
    scrapeButton.addEventListener('click', () => {
      // Send a message to the content script to scrape the table
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'scrape' }, (response) => {
          if (response && response.success) {
            console.log('Scraped Data:', response.data);
            alert('Table data scraped successfully! Check the console for details.');
          } else {
            console.error('Error scraping table:', response.error);
            alert('Failed to scrape table.');
          }
        });
      });
    });
  }
});