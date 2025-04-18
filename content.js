console.log('Content script loaded.');

// Function to scrape the current webpage and extract data
function scrapePage() {
  const data = {
    title: document.title,
    url: window.location.href,
    content: document.body.innerText
  };
  console.log('Scraped Data:', data);
  return data;
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scrape') {
    const scrapedData = scrapePage();
    sendResponse(scrapedData);
  }
});

// Add a function to wait for the table to load before scraping
function waitForTableToLoad(tableId, callback) {
  const observer = new MutationObserver((mutations, obs) => {
    const table = document.getElementById(tableId);
    if (table) {
      obs.disconnect();
      callback(table);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Update the scrape logic to wait for the table
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in content.js:', request);
  if (request.action === 'scrape') {
    waitForTableToLoad('incident_table', (table) => {
      console.log('Table found with ID incident_table');
      const rows = Array.from(table.rows);
      const data = rows.map(row => {
        return Array.from(row.cells).map(cell => cell.innerText);
      });
      console.log('Scraped table data:', data);
      sendResponse({ success: true, data });
    });

    // Return true to indicate async response
    return true;
  }
});