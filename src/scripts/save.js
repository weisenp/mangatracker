(async () => {
  const src = chrome.runtime.getURL("src/dist/pocketbase.js");
  const contentMain = await import(src);

  const pb = new PocketBase("https://pocketbase.libus.dev/");

  // if we are on asura scans
  if (window.location.host == "www.asurascans.com") {
    // get the manhwahs filtering by the name
    const resultList = await pb.collection("manhwas").getList(1, 1, {
      filter: `name = "${document.title}"`,
    });

    console.log(resultList);
    // if the manhwa is already saved
    if (resultList.totalItems > 0) {
      // check to see if we should update the manwha
      if (new Date(resultList.items[0].updatableAt) <= Date() || true) {
        let updatableAt = new Date();
        updatableAt.setDate(updatableAt.getDate() + 2);
        // document.querySelector("div.infox > div:nth-child(7) > div:nth-child(2) > span > time")

        let lastUpdated = new Date();
        // const data = {
        //     "latestChapter": "test",
        //     "lastUpdated": ,
        //     updatableAt
        // };

        // const record = await pb.collection('manhwas').update(resultList.items[0].id, data);
      }
    }
    let element = document.querySelector(
      "div.infox > div.flex-wrap > div.fmed:nth-child(2) > span > time"
    );
    element.innerHTML = "hello";
    console.log(element);
  }
})();
