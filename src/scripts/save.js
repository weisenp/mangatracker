(async () => {
  const src = chrome.runtime.getURL("src/dist/pocketbase.js");
  const contentMain = await import(src);

  const pb = new PocketBase("https://pocketbase.libus.dev/");
  // get the manhwahs filtering by the name
  const resultList = await pb.collection("manhwas").getList(1, 1, {
    filter: `name = "${document.title}"`,
  });

  // if the manhwa is already saved
  if (resultList.totalItems > 0) {
    // check to see if we should update the manwha
    if (new Date() >= new Date(resultList.items[0].updatableAt)) {
      // update the manhwa
      console.log("update");
      const data = getSiteData(window.location.host);

      const record = await pb
        .collection("manhwas")
        .update(resultList.items[0].id, {
          latestChapter: data.latestChapter,
          lastUpdated: data.lastUpdated,
          updatableAt: data.updatableAt,
        });
    }
  } else {
    // if the manhwa is not saved, save it
    const data = getSiteData(window.location.host);
    const record = await pb.collection("manhwas").create(data);
  }
})();

function getSiteData(site) {
  if (site == "www.asurascans.com" || site == "asurascans.com") {
    // set when it should be updated
    let updatableAt = new Date();
    updatableAt.setDate(updatableAt.getDate() + 1);

    // get the last updated date
    let timeElement = document.querySelector(
      "div.infox > div.flex-wrap > div.fmed:nth-child(2) > span > time"
    );
    let updateDate = new Date(timeElement.innerHTML);
    updateDate.setDate(updateDate.getDate() + 1);

    // get the latest chapter
    let chapter = document.querySelector("span.epcur.epcurlast").innerHTML;
    let chapterNum = chapter.match(/\d+/g);

    // get the thumbnail
    let thumb = document.querySelector("div.thumb > img").src;

    return {
      name: document.title,
      latestChapter: chapterNum[0],
      lastUpdated: updateDate,
      link: window.location.href,
      thumbnail: thumb,
      updatableAt: updatableAt,
    };
  }
}
