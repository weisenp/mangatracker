const pb = new PocketBase("https://pocketbase.libus.dev/");

chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabs) => {
  let url = tabs[0].url;
  if (!url.includes("https://www.asurascans.com/manga/")) {
    // hides the div with class of menu and shows the div with class of unavailable
    document.querySelector("div.menu").style.display = "none";
    return document.querySelector("div.unavailable").classList.toggle("hidden");
  }

  //if not logged in show login screen
  if (!pb.authStore.isValid) {
    document.querySelector("div.login").style.display = "block";
    document.querySelector("div.menu").style.display = "none";
  }

  const resultList = await pb.collection("reading").getList(1, 1, {
    filter: `user.id = "${pb.authStore.model.id}" && manhwa.link = "${url}"`,
  });

  if (resultList.totalItems > 0) {
    // if already reading show read screen
    document.querySelector("div.tracked").classList.toggle("hidden");
    document.querySelector("div.not-tracked").classList.toggle("hidden");
  }
});
