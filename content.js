window.onload = function () {
  console.log("*************** Content script loaded ***************.");

  // wait for h1 to be loaded add delay that cjheck the h1 tag every 2 seconds for 30 seconds
  let count = 0;
  const interval = setInterval(() => {
    const h1 = document.querySelector("h1");
    if (h1) {
      clearInterval(interval);
      startScrapig();
    } else {
      count++;
      if (count > 15) {
        clearInterval(interval);
        console.log(
          "*************** Page did not have h1 in 30s ***************."
        );
      }
    }
  }, 2000);
};

const startScrapig = () => {
  // Listen for messages from the popup script
  const h1 = document.querySelector("h1");
  if (h1) {
    // check if h1 has "Incident" in it
    if (h1.innerText.includes("Incident")) {
      console.log("*************** h1 found ***************.");
      console.log(
        "*************** h1 text: " + h1.innerText + " ***************."
      );
    } else {
      console.log(
        "*************** h1 does not contain 'Incident' ***************."
      );
      console.log(
        "*************** h1 text: " + h1.innerText + " ***************."
      );
    }
  } else {
    console.log("*************** No h1 found ***************.");
  }
};
