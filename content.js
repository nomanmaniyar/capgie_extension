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