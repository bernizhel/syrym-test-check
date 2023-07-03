let BUG_ID = "";
// BUG_ID = "/?bug_id=10";

describe("Форма для заполнения", async function () {
  it("BUG_ID=10", async function ({ browser }) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await browser.url("http://localhost:3000/hw/store" + BUG_ID);

    await page.goto("http://localhost:3000/hw/store/catalog" + BUG_ID);

    const searchResultSelector = ".ProductItem-DetailsLink";
    await page.waitForSelector(searchResultSelector);
    await page.click(searchResultSelector);

    const addToCartSelector = ".ProductDetails-AddToCart";
    await page.waitForSelector(addToCartSelector);
    await page.click(addToCartSelector);

    await page.waitForSelector(".text-success");

    await page.goto(" http://localhost:3000/hw/store/cart" + BUG_ID);

    const nameSelector = ".Form-Field_type_name";
    await page.waitForSelector(nameSelector, {
      timeout: 1000,
    });

    await page.click(nameSelector);
    await page.keyboard.type("name");

    const phoneSelector = ".Form-Field_type_phone";
    await page.waitForSelector(phoneSelector, { timeout: 2000 });
    await page.click(phoneSelector);
    await page.keyboard.type("1234567890");

    const addressSelector = ".Form-Field_type_address";
    await page.waitForSelector(addressSelector, { timeout: 2000 });
    await page.click(addressSelector);
    await page.keyboard.type("address");

    const submitSelector = ".Form-Submit";
    await page.waitForSelector(submitSelector, { timeout: 2000 });
    await page.click(submitSelector);

    const succesSelector = ".Cart-SuccessMessage";
    await page.waitForSelector(succesSelector, { timeout: 2000 });

    await browser.assertView("any_cart_well_done", ".Cart", {
      ignoreElements: [".Cart-SuccessMessage", ".Cart-Number"],
    });
  });
});
