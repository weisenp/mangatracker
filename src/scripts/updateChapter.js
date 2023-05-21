(async () => {
  const src = chrome.runtime.getURL("src/dist/pocketbase.js");
  const contentMain = await import(src);

  const pb = new PocketBase("https://pocketbase.libus.dev/");

  // check the url is on the chapter page
  if (window.location.href.includes("chapter")) {
    const readingList = await pb.collection("reading").getList(1, 1, {
      filter: `manhwa.link = "${document.querySelector("div.allc > a").href}"`,
    });

    console.log(document.querySelector("div.allc > a").href);

    console.log(readingList);

    // wait for ch-next-btn button is clicked
    document
      .querySelector("a.ch-next-btn")
      .addEventListener("click", async (event) => {
        event.preventDefault();

        const url = window.location.href;
        const chapterNumber = url.match(/chapter-(\d+)/i)[0];

        const data = {
          readChapter: chapterNumber,
        };

        const record = await pb
          .collection("reading")
          .update(readingList.items[0], data);
      });

    //   window.href.location =
  }
})();
