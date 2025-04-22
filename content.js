console.log('Content script loaded.');

// Function to scrape the table with the static ID 'incident_table'
function scrapeTable() {
  const table = document.getElementById('incident_table');
  if (!table) {
    console.error('Table with ID incident_table not found');
    return { success: false, error: 'Table not found' };
  }

  const rows = Array.from(table.rows);
  const data = rows.map(row => {
    return Array.from(row.cells).map(cell => cell.innerText);
  });

  console.log('Scraped table data:', data);
  return { success: true, data };
}

// Function to handle iframes
function handleIframe() {
  const iframes = document.getElementsByTagName('iframe');
  for (const iframe of iframes) {
    try {
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      const table = iframeDocument.getElementById('incident_table');
      if (table) {
        console.log('Table found inside iframe');
        return scrapeTable.call(iframeDocument);
      }
    } catch (error) {
      console.error('Error accessing iframe:', error);
    }
  }
  return { success: false, error: 'Table not found in iframes' };
}

// Use MutationObserver to wait for the table to load dynamically
function observeTableLoad() {
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const table = document.getElementById('incident_table');
        if (table) {
          console.log('Table dynamically loaded');
          observer.disconnect();
          scrapeTable();
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scrape') {
    let response = scrapeTable();
    if (!response.success) {
      response = handleIframe();
    }
    if (!response.success) {
      observeTableLoad();
    }
    sendResponse(response);
  }
});