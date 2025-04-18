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

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrape') {
    const table = document.getElementById('incident_table');
    if (table) {
      const rows = Array.from(table.rows);
      const data = rows.map(row => {
        return Array.from(row.cells).map(cell => cell.innerText);
      });
      sendResponse({ success: true, data });
    } else {
      sendResponse({ success: false, error: 'Table not found' });
    }
  }
  return true; // Keep the message channel open for async responses
});