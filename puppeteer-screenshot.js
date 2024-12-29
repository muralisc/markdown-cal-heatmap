import puppeteer from 'puppeteer';
import minimist from 'minimist';
import fs from 'fs'


(async () => {

var argv = minimist(process.argv.slice(2));
var filename_arg = argv['f']

  // Create a browser instance
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();

  // Set viewport width and height
  await page.setViewport({ width: 1280, height: 720 });

  const website_url = 'http://localhost:9123';

  // Open URL in current page
  await page.goto(website_url, { waitUntil: 'networkidle0' });

  await fs.promises.mkdir(`/var/tmp/cal-heatmap/`, { recursive: true })

  // Capture screenshot
  await page.screenshot({
    path: `/var/tmp/cal-heatmap/screenshot-${filename_arg}.jpg`,
    fullPage: true
  });

  // Close the browser instance
  await browser.close();
})();
