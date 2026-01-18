# AutoTesting JS

Automated tests for demoqa.com using Playwright.

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

```bash
npm ci
npx playwright install --with-deps
```

## Running Tests

### Run all tests

```bash
npm test
```

### Run in specific browser

```bash
npm run test:chrome    # Run in Google Chrome
npm run test:firefox   # Run in Mozilla Firefox
```

### Run with specific Viewport

```bash
npm run test:hd        # High resolution (1920x1080)
npm run test:sd        # Standard resolution (1366x768)
```

### Run in Parallel (Workers)

```bash
npm run test:parallel  # Run with 4 workers
```

### Run Specific Test Scenario

```bash
npm run test:alerts    # Run alerts tests
npm run test:form      # Run practice form tests
npm run test:textbox   # Run text box tests
npm run test:tooltips  # Run tooltips tests
npm run test:select    # Run select menu tests
```

### Manual commands (if needed)

For custom configurations, you can still use direct npx commands:

**Cross-browser testing:**

```bash
npx playwright test --project=chromium --project=firefox
```

**Custom viewport (Linux/macOS):**

```bash
VIEWPORT_WIDTH=1920 VIEWPORT_HEIGHT=1080 npx playwright test
```

**Custom viewport (Windows PowerShell):**

```powershell
$env:VIEWPORT_WIDTH="1920"; $env:VIEWPORT_HEIGHT="1080"; npx playwright test
```

### CI/CD

Tests run automatically on push and pull request to main branch, and daily at midnight via GitHub Actions.

#### GitHub Actions Workflow

The project includes automated testing via GitHub Actions (`.github/workflows/playwright-tests.yml`):

- **Triggers:**
  - Push to `main` branches
  - Pull requests to `main` branches
  - Daily schedule at midnight UTC

- **Test Execution:**
  - Runs on Ubuntu with Node.js 18
  - Tests execute with HD resolution (1920x1080) and SD resolution (1366x768)
  - Parallel execution across Chrome and Firefox browsers

- **Artifacts:**
  - HTML test reports (30 days retention)
  - Screenshots from failed tests (30 days retention)

