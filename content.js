window.onload = function () {
  console.log("*************** Content script loaded ***************.");
  const host = document.location.host;

  // In your content script
  const h1 = deepQuerySelector(document.body, "iframe");
  console.log("Found h1:", h1);
};

function deepQuerySelector(root, selector) {
  // Try normal DOM first
  const found = root.querySelector(selector);
  if (found) return found;

  // Then go into shadow roots
  const allElements = root.querySelectorAll("*");
  for (const el of allElements) {
    if (el.shadowRoot) {
      console.log("Found shadow root:", el.shadowRoot);
      
      const foundInShadow = deepQuerySelector(el.shadowRoot, selector);
      if (foundInShadow) return foundInShadow;
    }
  }

  return null;
}
