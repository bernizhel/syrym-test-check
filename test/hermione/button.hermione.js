let BUG_ID = "";

// BUG_ID = "/?bug_id=9";

describe("Кнопка добавить в корзину", async function () {
  it("BUG_ID=9", async function ({ browser }) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await browser.url("http://localhost:3000/hw/store" + BUG_ID);

    await page.goto("http://localhost:3000/hw/store/catalog" + BUG_ID);

    const searchResultSelector = ".ProductItem-DetailsLink";
    await page.waitForSelector(searchResultSelector, { timeout: 2000 });
    await page.click(searchResultSelector);

    const detailsSelector = ".ProductDetails";
    await page.waitForSelector(detailsSelector, { timeout: 2000 });

    const nameSelector = ".ProductDetails-Name";
    await page.waitForSelector(nameSelector, { timeout: 2000 });

    const descSelector = ".ProductDetails-Description";
    await page.waitForSelector(descSelector, { timeout: 2000 });

    const priceSelector = ".ProductDetails-Price";
    await page.waitForSelector(priceSelector, { timeout: 2000 });

    const colorSelector = ".ProductDetails-Color";
    await page.waitForSelector(colorSelector, { timeout: 2000 });

    const materialSelector = ".ProductDetails-Material";
    await page.waitForSelector(materialSelector, { timeout: 2000 });

    const buttonSelector = ".ProductDetails-AddToCart";
    await page.waitForSelector(buttonSelector, { timeout: 2000 });

    const imageSelector = ".Image";
    await page.waitForSelector(imageSelector, { timeout: 2000 });

    await browser.assertView("product_details_content", ".ProductDetails", {
      ignoreElements: [
        ".ProductDetails-Name",
        ".ProductDetails-Description",
        ".ProductDetails-Price",
        ".ProductDetails-Color",
        ".ProductDetails-Material",
        ".Image",
      ],
    });
  });
  it("Тест Product details BUG_ID=9", async function ({ browser }) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await browser.url("http://localhost:3000/hw/store" + BUG_ID);

    await page.goto("http://localhost:3000/hw/store/catalog" + BUG_ID);

    const searchResultSelector = ".ProductItem-DetailsLink";
    await page.waitForSelector(searchResultSelector, { timeout: 1000 });
    await page.click(searchResultSelector);

    const addToCartSelector = ".ProductDetails-AddToCart";
    await page.waitForSelector(addToCartSelector, { timeout: 1000 });

    await browser.assertView("add_to_cart", ".ProductDetails-AddToCart");
  });
});
