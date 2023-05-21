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
    document.querySelectorAll(".tracked").forEach((element) => {
      element.classList.toggle("hidden");
    });
    document.querySelectorAll(".not-tracked").forEach((element) => {
      element.classList.toggle("hidden");
    });

    document.getElementById("lastRead").innerHTML =
      resultList.items[0].readChapter;

    const manwha = await pb
      .collection("manhwas")
      .getOne(resultList.items[0].manhwa);
    console.log(manwha);

    document.getElementById("title").innerHTML = manwha.name.split(" - ")[0];

    document.getElementById("dateUpdated").innerHTML = `${new Date(
      manwha.lastUpdated
    ).getDate()}/${new Date(manwha.lastUpdated).getMonth()}/${new Date(
      manwha.lastUpdated
    ).getFullYear()}`;
  }
});
