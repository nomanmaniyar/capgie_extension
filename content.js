console.log('Content script loaded.');

// Logger function to standardize logging
function logger(level, message, data = null) {
  const timestamp = new Date().toISOString();
  if (data) {
    console[level](`[${timestamp}] ${message}`, data);
  } else {
    console[level](`[${timestamp}] ${message}`);
  }
}

// Updated scrapeTable function with logging
function scrapeTable() {
  logger('info', 'Attempting to scrape table with ID incident_table');
  const table = document.getElementById('incident_table');
  if (!table) {
    logger('error', 'Table with ID incident_table not found');
    return { success: false, error: 'Table not found' };
  }

  const rows = Array.from(table.rows);
  const data = rows.map(row => {
    return Array.from(row.cells).map(cell => cell.innerText);
  });

  logger('info', 'Successfully scraped table data', data);
  return { success: true, data };
}

// Updated handleIframe function with logging
function handleIframe() {
  logger('info', 'Checking for iframes to locate table');
  const iframes = document.getElementsByTagName('iframe');
  for (const iframe of iframes) {
    try {
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      const table = iframeDocument.getElementById('incident_table');
      if (table) {
        logger('info', 'Table found inside iframe');
        return scrapeTable.call(iframeDocument);
      }
    } catch (error) {
      logger('error', 'Error accessing iframe', error);
    }
  }
  logger('warn', 'Table not found in any iframes');
  return { success: false, error: 'Table not found in iframes' };
}

// Updated observeTableLoad function with logging
function observeTableLoad() {
  logger('info', 'Setting up MutationObserver to detect dynamic table loading');
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const table = document.getElementById('incident_table');
        if (table) {
          logger('info', 'Table dynamically loaded');
          observer.disconnect();
          scrapeTable();
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Updated message listener with logging
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  logger('info', 'Received message from extension', message);
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