const pb = new PocketBase("https://pocketbase.libus.dev/");

chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  let url = tabs[0].url;
  if (!url.includes("https://www.asurascans.com/manga/")) {
    // hides the div with class of menu and shows the div with class of unavailable
    document.querySelector("body > div.menu").style.display = "none";
    return (document.querySelector("body > div.unavailable").style.display =
      "flex");
  }

  //if not logged in show login screen
  if (!pb.authStore.isValid) {
    document.querySelector("body > div.login").style.display = "block";
    document.querySelector("body > div.menu").style.display = "none";
  }
});
