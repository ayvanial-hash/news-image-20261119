const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

async function render() {
    const browser = await chromium.launch({
        executablePath: '/root/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome'
    });
    const context = await browser.newContext({
        viewport: { width: 1024, height: 1024 }
    });
    const page = await context.newPage();
    const filePath = 'file://' + path.resolve('news.html');
    await page.goto(filePath);
    await page.screenshot({ path: 'entry.png' });
    await browser.close();
    console.log('Screenshot saved to entry.png');
}

render().catch(console.error);
