window.onload = function () {
  console.log("*************** Content script loaded ***************.");
  // Listen for messages from the popup script
  const h1 = document.querySelector("h1");
  if (h1) {
    // check if h1 has "Incident" in it
    if (h1.innerText.includes("Incident")) {
      console.log("*************** h1 found ***************.");
      console.log(
        "*************** h1 text: " + h1.innerText + " ***************."
      );
    }else{
      console.log("*************** h1 does not contain 'Incident' ***************.");
      console.log("*************** h1 text: " + h1.innerText + " ***************.");
      
    }
  } else {
    console.log("*************** No h1 found ***************.");
  }
};