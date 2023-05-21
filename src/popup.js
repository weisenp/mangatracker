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

  const readingResult = await pb.collection("reading").getList(1, 1, {
    filter: `user.id = "${pb.authStore.model.id}" && manhwa.link = "${url}"`,
  });

  const manhwaResult = await pb.collection("manhwas").getList(1, 1, {
    filter: `link = "${url}"`,
  });

  const planToReadResult = await pb.collection("plantoread").getList(1, 1, {
    filter: `user.id = "${pb.authStore.model.id}" && manhwa.link = "${url}"`,
  });

  // if the manhwa is already saved
  if (planToReadResult.totalItems > 0) {
    planToReadToggle();
  } else if (readingResult.totalItems > 0) {
    toggleRead();

    // show the last read chapter
    document.getElementById("lastRead").innerHTML =
      readingResult.items[0].readChapter;

    // get the manhwa
    const manwha = await pb
      .collection("manhwas")
      .getOne(readingResult.items[0].manhwa);

    // show the title
    document.getElementById("title").innerHTML = manwha.name.split(" - ")[0];

    // Show the date last updated
    document.getElementById("dateUpdated").innerHTML = `${new Date(
      manwha.lastUpdated
    ).getDate()}/${new Date(manwha.lastUpdated).getMonth()}/${new Date(
      manwha.lastUpdated
    ).getFullYear()}`;
  }

  // handle read button click
  document.getElementById("read").addEventListener("click", async () => {
    goToChapter();
  });

  // handle untrack button click
  document.getElementById("untrack").addEventListener("click", async () => {
    // delete the reading record
    await pb.collection("reading").delete(readingResult.items[0].id);

    // show the menu
    toggleRead();

    // hides the title
    document.getElementById("title").innerHTML = "";
  });

  // handle the track button
  document.getElementById("track").addEventListener("click", async () => {
    const data = {
      readChapter: 1,
      readLocation: 0,
      manhwa: manhwaResult.items[0].id,
      user: pb.authStore.model.id,
    };

    const record = await pb.collection("reading").create(data);

    toggleRead();
    goToChapter();
  });

  // handle the saveForLater button
  document
    .getElementById("saveForLater")
    .addEventListener("click", async () => {
      const data = {
        manhwa: manhwaResult.items[0].id,
        user: pb.authStore.model.id,
      };

      const record = await pb.collection("plantoread").create(data);

      location.reload();
    });

  // handle the startReading button
  document
    .getElementById("startReading")
    .addEventListener("click", async () => {
      await pb.collection("plantoread").delete(planToReadResult.items[0].id);

      const data = {
        readChapter: 1,
        readLocation: 0,
        manhwa: manhwaResult.items[0].id,
        user: pb.authStore.model.id,
      };

      const record = await pb.collection("reading").create(data);

      goToChapter();
      location.reload();
    });

  // handle the rmPLanToRead button
  document
    .getElementById("rmPlanToRead")
    .addEventListener("click", async () => {
      await pb.collection("plantoread").delete(planToReadResult.items[0].id);
      location.reload();
    });

  function goToChapter() {
    // split the url after manga/
    let manhwaLink = url.split("manga/")[1];
    //remove the last / from the string
    manhwaLink = manhwaLink.replace("/", "");

    if (manhwaLink.includes("8239705535"))
      return chrome.tabs.update(url.id, {
        url: `https://www.asurascans.com/${
          manhwaLink.split("8239705535-")[1]
        }-chapter-${
          readingResult?.items[0]?.readChapter
            ? readingResult.items[0].readChapter
            : 1
        }`,
      });
    chrome.tabs.update(url.id, {
      url: `https://www.asurascans.com/${manhwaLink}-chapter-${
        readingResult?.items[0]?.readChapter
          ? readingResult.items[0].readChapter
          : 1
      }`,
    });
  }
});

function toggleRead() {
  // if already reading show read screen
  document.querySelectorAll(".tracked").forEach((element) => {
    element.classList.toggle("hidden");
  });
  document.querySelectorAll(".not-tracked").forEach((element) => {
    element.classList.toggle("hidden");
  });
}

function planToReadToggle() {
  document.querySelectorAll(".plan").forEach((element) => {
    element.classList.toggle("hidden");
  });
  document.querySelectorAll(".not-tracked").forEach((element) => {
    element.classList.toggle("hidden");
  });
}
