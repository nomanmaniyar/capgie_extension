console.log('Popup script loaded.');

// Trigger the content script to scrape the webpage
document.addEventListener('DOMContentLoaded', () => {
  const scrapeButton = document.getElementById('scrapeButton');

  if (scrapeButton) {
    // Add an event listener to the scrape button
    scrapeButton.addEventListener('click', () => {
      console.log('Scrape button clicked');
      // Send a message to the content script to scrape the table
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log('Active tab details:', tabs[0]);
        chrome.tabs.sendMessage(tabs[0].id, { action: 'scrape' }, (response) => {
          console.log('Response received from content.js:', response);
          if (response && response.success) {
            console.log('Scraped Data:', response.data);
            alert('Table data scraped successfully! Check the console for details.');
          } else {
            console.error('Error scraping table:', response ? response.error : 'No response');
            alert('Failed to scrape table.');
          }
        });
      });
    });
  }
});