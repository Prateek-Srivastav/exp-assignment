const puppeteer = require("puppeteer");

module.exports = async function getBookDetails(url) {
  console.log(url);

  const browser = await puppeteer.launch({
    // executablePath: "/usr/bin/chromium-browser",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: false,
  });

  const page = await browser.newPage();
  console.log("page opened");
  await page.goto(url, { waitUntil: "domcontentloaded" });
  console.log(page);
  await page.waitForSelector("#productTitle");
  await page.waitForSelector("#editorialReviews_feature_div");
  // await page.waitForSelector("span.thumb-text.thumb");
  // await page.click("span.thumb-text.thumb");

  const modalVisible = await page
    .$(
      "div.a-popover.a-popover-modal.a-declarative.a-popover-modal-fixed-height"
    )
    .then(async (modal) => {
      const displayValue = await modal.evaluate((node) => node.style.display);
      return displayValue !== "none";
    });

  console.log(modalVisible);

  const details = await page.evaluate(() => {
    const title = document.querySelector("#productTitle").textContent?.trim();
    let imgUrls = document.querySelectorAll(
      "div.a-popover.a-popover-modal.a-declarative.a-popover-modal-fixed-height .a-column.a-span4.ig-thumbs.a-span-last img"
    );

    imgUrls = Array.from(imgUrls).map((img) => {
      let url = img.src.split("/");
      let imgId = img.src
        .split("/")
        [img.src.split("/").length - 1].split(".")[0];
      url[url.length - 1] = imgId + ".jpg";
      url = url.join("/");
      return url;
    });
    let authorName = document.querySelectorAll(
      ".a-link-normal.contributorNameID"
    );

    authorName = Array.from(authorName).map((name) => {
      return name.textContent.trim();
    });

    authorName = authorName.join(" and ");

    let aboutAuthor = document
      .querySelector("#editorialReviews_feature_div")
      .textContent.trim();
    aboutAuthor = aboutAuthor.split("About the Author")[1]?.trim();
    const subTitle = document
      .querySelector("#productSubtitle")
      .textContent.trim();
    const price = document.querySelector("#price").textContent.trim().slice(1);
    const bookDescription = document
      .querySelector("#bookDescription_feature_div")
      .textContent.trim();
    let bookDetails = document
      .querySelector("#detailBullets_feature_div")
      .textContent.trim();

    bookDetails = bookDetails.slice(
      bookDetails.indexOf("Publisher"),
      bookDetails.indexOf("Best Sellers")
    );

    bookDetails = bookDetails.replace(/(\r\n|\n|\r)/gm, "");

    const words = bookDetails
      .split(":")
      .map((str) => str.replace(/\s+/g, " ").trim());

    const pagesIndexArr = words.map((str, index) => {
      if (str.match(/Paperback/) || str.match(/Hardcover/)) return index;
    });

    const dimensionsIndexArr = words.map((str, index) => {
      if (str.match(/Dimension/)) return index;
    });

    let numOfPagesIndex;
    let dimensionsIndex;

    dimensionsIndexArr.forEach((e) => {
      if (!isNaN(e)) {
        dimensionsIndex = e + 1;
        return e;
      }
    });

    pagesIndexArr.forEach((e) => {
      if (!isNaN(e)) {
        numOfPagesIndex = e + 1;
        return e;
      }
    });

    const numberOfPages = words[numOfPagesIndex]?.split("pages")[0] + "Pages";
    const dimensions = words[dimensionsIndex]?.split("cm")[0] + "cm";
    const weight = words[dimensionsIndex - 1]?.split("Dimensions")[0]?.trim();
    let publisher = bookDetails?.split("Language")[0];
    let language = bookDetails?.split("Paperback")[0];

    language = language
      .split(":")
      .map((str) => str.replace(/\s+/g, "").trim())[2];

    publisher = publisher
      .split(":")
      .map((str) => str.replace(/\s+/g, "").trim());

    publisher = publisher[1].trim();
    return {
      imgUrls,
      title,
      subTitle,
      authorName,
      aboutAuthor,
      price,
      bookDescription,
      numberOfPages,
      weight,
      dimensions,
      language: language.trim(),
      publisher,
    };
  });

  // console.log(details);

  await browser.close();
  return details;
};

// getData("https://www.amazon.in/dp/0375705104");
