(async () => {
  const src = chrome.runtime.getURL("src/dist/pocketbase.js");
  const contentMain = await import(src);

  const pb = new PocketBase("https://pocketbase.libus.dev/");

  // check the url is on the chapter page
  if (window.location.href.includes("chapter")) {
    let data = await chrome.storage.sync.get(["userId"]);

    const readingList = await pb.collection("reading").getList(1, 1, {
      filter: `manhwa.link = "${document.querySelector("div.allc > a").href}"`,
      userId: data.userId,
    });

    // scroll to read location
    window.scrollTo({
      top: readingList.items[0].readLocation,
      left: 0,
      behavior: "smooth",
    });

    // save the read location of manhwa
    let timer = null;
    window.addEventListener(
      "scroll",
      function () {
        if (timer !== null) {
          clearTimeout(timer);
        }
        timer = setTimeout(async function () {
          await pb.collection("reading").update(
            readingList.items[0].id,
            {
              readLocation: window.pageYOffset,
            },
            {
              userId: data.userId,
            }
          );
        }, 1000);
      },
      false
    );

    // wait for ch-next-btn button is clicked
    document.querySelectorAll("a.ch-next-btn").forEach((el) => {
      el.addEventListener("click", async (event) => {
        event.preventDefault();

        const url = window.location.href;
        const chapterNumber = url.match(/chapter-(\d+)/i)[1];

        await pb.collection("reading").update(
          readingList.items[0].id,
          {
            readChapter: Number(chapterNumber) + 1,
          },
          {
            userId: data.userId,
          }
        );

        window.location.href = getNextChapter(window.location.href);
      });
    });
  }
})();

function getNextChapter(url) {
  var chapterNumber = parseInt(url.match(/chapter-(\d+)/i)[1]);
  var nextChapterNumber = chapterNumber + 1;
  var nextChapterUrl = url.replace(
    /chapter-\d+/i,
    "chapter-" + nextChapterNumber
  );
  return nextChapterUrl;
}
