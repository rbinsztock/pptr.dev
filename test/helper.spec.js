const puppeteer = require('puppeteer');

export class HelperSpec {
  async openingSite(page, waitingOpts) {
    const url = 'http://localhost:8887';
    console.log('waitingOpts :', waitingOpts)
    if (waitingOpts && waitingOpts.length >= 1 && typeof waitingOpts === Array) {
      console.log(waitingOpts);
      await page.goto(url, { waitUntil: waitingOpts });
    }
    await page.goto(url);
  }

  async after(browser, page) {
    const jsCoverage = await page.coverage.stopJSCoverage();
    await page.coverage.stopCSSCoverage();

    let totalBytes = 0;
    let usedBytes = 0;
    const coverage = [...jsCoverage];
    for (const entry of coverage) {
        totalBytes += entry.text.length;
        console.log(`js fileName covered: ${entry.url}`);
        for (const range of entry.ranges)
            usedBytes += range.end - range.start - 1;
    }
    console.log(`Bytes used: ${usedBytes / totalBytes * 100}%`);
    await browser.close();
  }

  async verifyLink(page, element) {
    //return await page.$(element);
    return await page.$eval(element, el => el.href);
  }
}