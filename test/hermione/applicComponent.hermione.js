let BUG_ID = "";

//BUG_ID = "/?bug_id=4";

describe("Тестируем шапку", async function () {
  it("Шапка с BUG_ID=4", async function ({ browser }) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();
    await page.setViewport({ width: 575, height: 1024 });

    await browser.url("http://localhost:3000/hw/store" + BUG_ID);

    const toglerSelector = ".Application-Toggler";
    await page.waitForSelector(toglerSelector, { timeout: 2000 });
    await page.click(toglerSelector);

    const appMenuSelector = ".Application-Menu";
    await page.waitForSelector(appMenuSelector, { timeout: 2000 });

    const navLinkSelector = ".nav-link";
    await page.waitForSelector(navLinkSelector, { timeout: 2000 });
    await page.click(navLinkSelector);

    const appSelector = ".navbar";
    await page.waitForSelector(appSelector, {
      timeout: 1000,
    });

    await browser.assertView("navbar_well_done", ".navbar ");
  });
});
