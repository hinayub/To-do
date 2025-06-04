// const { test, expect, chromium } = require("@playwright/test");
// const {
//   Eyes,
//   VisualGridRunner,
//   Configuration,
//   BrowserType,
//   DeviceName,
// } = require("@applitools/eyes-playwright");

// test("To-Do List App Visual Test", async () => {
//   const browser = await chromium.launch();
//   const context = await browser.newContext();
//   const page = await context.newPage();

//   const eyes = new Eyes(new VisualGridRunner({ testConcurrency: 1 }));

//   // Set API key here in config for consistency
//   const config = new Configuration();
//   config.setApiKey("z99ExxmEWZBgzZf1H9JHsYsdxgjhezq7pTJeGZ1eWXQ110");
//   config.setAppName("To-Do List App");
//   config.setTestName("Home Page Visual Test");
//   config.addBrowser(800, 600, BrowserType.CHROME);
//   config.addDeviceEmulation(DeviceName.iPhone_X);

//   eyes.setConfiguration(config);

//   await eyes.open(page, "To-Do List App", "Home Page Visual Test");

//   await page.goto("http://127.0.0.1:5500/src/index.html");
//   const title = await page.title();
//   expect(title).toContain("Modern To-Do List App");

//   await eyes.check("Main Page", { fully: true });
//   await eyes.close();
//   await browser.close();
// });

const { test, expect, chromium } = require("@playwright/test");
const {
  Eyes,
  VisualGridRunner,
  Configuration,
  BrowserType,
  DeviceName,
} = require("@applitools/eyes-playwright");

test("To-Do List App Visual Test", async () => {
  let browser;
  let context;
  let page;
  let eyes;

  try {
    // Launch browser with explicit options
    browser = await chromium.launch({
      headless: true, // Set to false for debugging
      timeout: 30000,
    });

    context = await browser.newContext({
      viewport: { width: 800, height: 600 },
    });

    page = await context.newPage();

    // Set page timeout
    page.setDefaultTimeout(15000);

    // Initialize Applitools Eyes
    const runner = new VisualGridRunner({ testConcurrency: 1 });
    eyes = new Eyes(runner);

    // Configuration
    const config = new Configuration();
    config.setApiKey("z99ExxmEWZBgzZf1H9JHsYsdxgjhezq7pTJeGZ1eWXQ110");
    config.setAppName("To-Do List App");
    config.setTestName("Home Page Visual Test");
    config.addBrowser(800, 600, BrowserType.CHROME);
    config.addDeviceEmulation(DeviceName.iPhone_X);

    eyes.setConfiguration(config);

    console.log("Opening Eyes session...");
    await eyes.open(page, "To-Do List App", "Home Page Visual Test");

    console.log("Navigating to page...");
    // Add wait for network idle and check if server is running
    await page.goto("http://127.0.0.1:5500/src/index.html", {
      waitUntil: "networkidle",
      timeout: 10000,
    });

    console.log("Checking page title...");
    const title = await page.title();
    expect(title).toContain("Modern To-Do List App");

    // Wait for page to be fully loaded
    await page.waitForLoadState("domcontentloaded");

    // Optional: Wait for specific elements to ensure page is ready
    // await page.waitForSelector('body', { timeout: 5000 });

    console.log("Taking visual snapshot...");
    await eyes.check("Main Page", { fully: true });

    console.log("Closing Eyes session...");
    await eyes.close();

    console.log("Test completed successfully!");
  } catch (error) {
    console.error("Test failed with error:", error.message);

    // Ensure Eyes session is properly closed even on failure
    if (eyes) {
      try {
        await eyes.abort();
      } catch (abortError) {
        console.error("Failed to abort Eyes session:", abortError.message);
      }
    }

    throw error;
  } finally {
    // Cleanup
    if (browser) {
      await browser.close();
    }
  }
});

// Alternative simplified version without Applitools for debugging
test("To-Do List App Basic Test (Debugging)", async () => {
  const browser = await chromium.launch({ headless: false }); // Visible browser
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log("Testing basic page load...");
    await page.goto("http://127.0.0.1:5500/src/index.html", {
      waitUntil: "networkidle",
      timeout: 10000,
    });

    const title = await page.title();
    console.log("Page title:", title);
    expect(title).toContain("Modern To-Do List App");

    // Take a screenshot for manual verification
    await page.screenshot({ path: "debug-screenshot.png", fullPage: true });
    console.log("Screenshot saved as debug-screenshot.png");
  } catch (error) {
    console.error("Basic test failed:", error.message);
    throw error;
  } finally {
    await browser.close();
  }
});

// Test configuration options
test.describe.configure({ timeout: 60000 }); // Increase timeout to 60 seconds
