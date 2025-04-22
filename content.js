console.log('Content script loaded.');

// Directly scrape the table with the static ID 'incident_table'
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

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scrape') {
    const response = scrapeTable();
    sendResponse(response);
  }
});