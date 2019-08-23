import { HelperSpec } from "./helper.spec";

const puppeteer = require("puppeteer");
const assert = require("assert");
const helperSpec = new HelperSpec();
let browser;
let page;

describe("Loading pptr.dev site", () => {
  before(async () => {
    try {
      browser = await puppeteer.launch({ headless: false });
      page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      await Promise.all([
        page.coverage.startJSCoverage(),
        page.coverage.startCSSCoverage()
      ]);
      await helperSpec.openingSite(page);
    } catch {
      await browser.close();
    }
  });

  after(async () => {
    helperSpec.after(browser, page);
  });

  describe("while puppeteer documentation load", async () => {
    it("display a loader", async () => {
      const element = await page.$("loading-screen");
      assert.equal(!!element, true);
    });

    it("page has no title", async () => {
      assert.equal(await page.title(), "");
    });
  });

  describe("when all releases are loaded", async () => {
    before(async () =>
      await page.waitForSelector('content-component')
    )

    it("does not display a loader", async () => {
      const element = await page.$("loading-screen");
      assert.equal(!!element, false);
    });

    it("change update page title", async () => {
      const pageTitle = "Puppeteer";
      const currentPageTitle = await page.title();
      assert.equal(currentPageTitle.includes(pageTitle), true);
    });


    it('verify SO Link', async () => {
      const linkStackOverFlow = await helperSpec.verifyLink(page, '.pptr-stackoverflow');
      const linkSO = 'https://stackoverflow.com/questions/tagged/puppeteer';
      assert.equal(linkStackOverFlow, linkSO)
    });
  });
});
