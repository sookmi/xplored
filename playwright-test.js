const { chromium } = require('playwright');

async function testSite() {
  console.log('🚀 Starting Playwright test...\n');

  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {
    passed: [],
    failed: []
  };

  // Test 1: Homepage loads
  console.log('📋 Test 1: Homepage load');
  try {
    const response = await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    if (response.status() === 200) {
      results.passed.push('Homepage loads successfully (200 OK)');
      console.log('   ✅ PASS - Status:', response.status());
    } else {
      results.failed.push(`Homepage returned status ${response.status()}`);
      console.log('   ❌ FAIL - Status:', response.status());
    }
  } catch (error) {
    results.failed.push(`Homepage failed to load: ${error.message}`);
    console.log('   ❌ FAIL -', error.message);
  }

  // Test 2: Page title
  console.log('\n📋 Test 2: Page title check');
  try {
    const title = await page.title();
    if (title && title.length > 0) {
      results.passed.push(`Page has title: "${title}"`);
      console.log('   ✅ PASS - Title:', title);
    } else {
      results.failed.push('Page has no title');
      console.log('   ❌ FAIL - No title found');
    }
  } catch (error) {
    results.failed.push(`Title check failed: ${error.message}`);
    console.log('   ❌ FAIL -', error.message);
  }

  // Test 3: Header exists
  console.log('\n📋 Test 3: Header component');
  try {
    const header = await page.locator('header').first();
    const isVisible = await header.isVisible();
    if (isVisible) {
      results.passed.push('Header component is visible');
      console.log('   ✅ PASS - Header is visible');
    } else {
      results.failed.push('Header is not visible');
      console.log('   ❌ FAIL - Header not visible');
    }
  } catch (error) {
    results.failed.push(`Header check failed: ${error.message}`);
    console.log('   ❌ FAIL -', error.message);
  }

  // Test 4: Main content
  console.log('\n📋 Test 4: Main content area');
  try {
    const main = await page.locator('main').first();
    const isVisible = await main.isVisible();
    if (isVisible) {
      results.passed.push('Main content area is visible');
      console.log('   ✅ PASS - Main content visible');
    } else {
      results.failed.push('Main content not visible');
      console.log('   ❌ FAIL - Main content not visible');
    }
  } catch (error) {
    results.failed.push(`Main content check failed: ${error.message}`);
    console.log('   ❌ FAIL -', error.message);
  }

  // Test 5: No JavaScript errors
  console.log('\n📋 Test 5: JavaScript errors');
  const jsErrors = [];
  page.on('pageerror', error => jsErrors.push(error.message));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  if (jsErrors.length === 0) {
    results.passed.push('No JavaScript errors detected');
    console.log('   ✅ PASS - No JS errors');
  } else {
    results.failed.push(`JavaScript errors: ${jsErrors.join(', ')}`);
    console.log('   ❌ FAIL - JS errors:', jsErrors);
  }

  // Test 6: About page
  console.log('\n📋 Test 6: About page navigation');
  try {
    const response = await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle', timeout: 30000 });
    if (response.status() === 200) {
      results.passed.push('About page loads successfully');
      console.log('   ✅ PASS - About page status:', response.status());
    } else {
      results.failed.push(`About page returned status ${response.status()}`);
      console.log('   ❌ FAIL - Status:', response.status());
    }
  } catch (error) {
    results.failed.push(`About page failed: ${error.message}`);
    console.log('   ❌ FAIL -', error.message);
  }

  // Take screenshot
  console.log('\n📸 Taking screenshot...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.screenshot({ path: './screenshot-homepage.png', fullPage: true });
  console.log('   Screenshot saved to ./screenshot-homepage.png\n');

  await browser.close();

  // Summary
  console.log('═'.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('═'.repeat(50));
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log('');

  if (results.passed.length > 0) {
    console.log('Passed tests:');
    results.passed.forEach(p => console.log(`  • ${p}`));
  }

  if (results.failed.length > 0) {
    console.log('\nFailed tests:');
    results.failed.forEach(f => console.log(`  • ${f}`));
  }

  console.log('\n' + '═'.repeat(50));

  return results.failed.length === 0;
}

testSite()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error('Test runner error:', err);
    process.exit(1);
  });
