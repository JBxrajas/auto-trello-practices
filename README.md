# auto-trello-practices

This repository contains Cypress practice tests for selector/interaction exercises and Trello automation scenarios. The project demonstrates Cypress best practices including API authentication, page object models, custom commands, fixtures, cross-origin handling, and automated CI/CD with GitHub Actions.

## Project structure 
```
cypress/
├── e2e/
│   ├── selector-exercises/     # Selector/interaction practice specs
│   │   ├── selector-practice.cy.js
│   │   ├── interactions-assertions-practice.cy.js
│   │   ├── aliases-variables-practice.cy.js
│   │   └── validate-landing-page.cy.js
│   └── trello-exercises/       # Trello automation specs (API & UI)
│       ├── negative-scenarios.cy.js
│       ├── login-validate-initial-board.cy.js
│       ├── validate-feature-section-nav.cy.js
│       └── create-board-validation.cy.js
├── fixtures/
│   ├── example.json            # Test credentials (deprecated - use .env)
│   └── dummy-login.json        # Dummy login data for negative scenarios
├── support/
│   ├── actions/                # Page-specific actions (page object methods)
│   │   ├── landing-page-actions.cy.js
│   │   └── validate-feature-section-actions.cy.js
│   ├── pages/                  # Page selectors and data (page objects)
│   │   ├── validate-elements-landing-page.js
│   │   └── validate-elements-features-section.js
│   ├── commands.js             # Custom Cypress commands
│   └── e2e.js                  # Global setup
├── reports/                    # Test reports (gitignored)
├── videos/                     # Test videos (gitignored)
├── screenshots/                # Test screenshots (gitignored)
└── .github/
    └── workflows/
        └── main.yaml           # GitHub Actions CI/CD pipeline
```

## Prerequisites
- Node.js (LTS recommended)
- Git
- Windows (commands below target Windows terminals)
- Trello account with API key and token (for API tests)
- GitHub account (for CI/CD)

## Install
Open a terminal at the project root:
```powershell
cd /d g:\repos\cypress-trello\auto-trello-practices
npm install
```

If you hit PowerShell script execution errors for npx (npx.ps1 blocked), either:
- Use Command Prompt: open cmd.exe and run npx commands there, or
- Use npx.cmd in PowerShell: `npx.cmd cypress open`, or
- Permanently allow signed scripts for current user:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
  ```

## Environment setup

### Create `.env` file for credentials
Create a `.env` file at the project root with your Trello credentials:
```env
TRELLO_EMAIL=your-email@example.com
TRELLO_PASSWORD=your-password
TRELLO_API_KEY=your-api-key
TRELLO_API_TOKEN=your-api-token
```

**Important:** Never commit `.env` — ensure it's in `.gitignore`.

### Get Trello API credentials
1. **API Key**: Visit https://trello.com/power-ups/admin, create a Power-Up, and copy your API key
2. **API Token**: Visit this URL (replace `YOUR_API_KEY`):
   ```
   https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=Cypress%20Tests&key=YOUR_API_KEY
   ```
   Click "Allow" and copy the token

## How to run tests

### Open Cypress Test Runner (interactive):
```powershell
# from project root (PowerShell or CMD)
npx cypress open
# or in PowerShell if npx.ps1 is blocked:
npx.cmd cypress open
```

### Run all specs headless:
```powershell
npx cypress run
```

### Run a single spec (example):
```powershell
npx cypress run --spec "cypress/e2e/trello-exercises/create-board-validation.cy.js"
```

### Run a single spec in headed browser:
```powershell
npx cypress run --headed --browser chrome --spec "cypress/e2e/trello-exercises/create-board-validation.cy.js"
```

## What tests / scenarios are included

### Selector exercises
- `selector-practice.cy.js` — Locating elements and assertions
- `interactions-assertions-practice.cy.js` — Interactions and explicit waits
- `aliases-variables-practice.cy.js` — Use of cy.as() aliases and referencing elements
- `validate-landing-page.cy.js` — Landing page validation with page object pattern

### Trello exercises
- `negative-scenarios.cy.js` — Invalid login attempts with error assertions
- `login-validate-initial-board.cy.js` — API authentication and board validation
- `validate-feature-section-nav.cy.js` — Feature navigation validation (data-driven tests)
- `create-board-validation.cy.js` — Board creation, update, deletion, and list management via API

## Key implementation notes

### Page Object Model (POM)
- **Selectors**: Stored in `support/pages/` (e.g., `validate-elements-landing-page.js`)
- **Actions**: Stored in `support/actions/` (e.g., `landing-page-actions.cy.js`)
- **Pattern**: Actions import selectors and expose reusable methods to specs

Example:
```javascript
// Page selectors
module.exports = {
    titleText: 'Capture, organize, and tackle your to-dos from anywhere | Trello',
    navContainer: 'header',
    loginButton: 'a[data-testid="login-button"]'
};

// Page actions
const sel = require('../pages/validate-elements-landing-page');
module.exports = {
    visit() { cy.visit('/'); },
    assertTitle() { cy.title().should('eq', sel.titleText); }
};
```

### Custom commands
Defined in `support/commands.js`:

#### API Authentication (bypasses 2FA)
```javascript
cy.loginViaAPI(); // Returns user object
```

#### Board Management
```javascript
cy.createBoard('Board Name'); // Create board
cy.createBoard('Board Name', { desc: 'Description' }); // With options
cy.updateBoard(boardId, { name: 'New Name' }); // Update board
cy.deleteBoard(boardId); // Delete board
cy.getBoards(); // Get all user boards
cy.getBoard(boardId); // Get specific board
```

#### List Management
```javascript
cy.createList(boardId, 'List Name'); // Create list on board
cy.getBoardLists(boardId); // Get all lists on board
```

#### UI negative login scenario
```javascript
cy.NegativeLoginScenario(email, password);
```

### Environment variables
- Loaded via `dotenv` in `cypress.config.js`
- Access in tests: `Cypress.env('TRELLO_API_KEY')`
- Configured in `.env` file (never commit this file)
- In CI: Set as GitHub Secrets

### Fixtures
- `example.json` and `dummy-login.json` store test data
- Access with `cy.fixture('example.json').as('testData')` or `cy.get('@testData')`
- Use `function()` callbacks (not arrow functions) to access `this.testData`

### Data-driven tests
Feature navigation tests use data arrays from page objects:
```javascript
// In page object
module.exports = {
    features: [
        { label: 'Inbox', path: '/inbox' },
        { label: 'Planner', path: '/planner' }
    ]
};

// In spec
featureSection.features.forEach(feature => {
    it(`Navigate to ${feature.label}`, function() {
        // test implementation
    });
});
```

### Cross-origin handling
Uses `cy.origin()` for Atlassian login flows:
```javascript
cy.origin('https://id.atlassian.com', { args: { email, password } }, ({ email, password }) => {
    cy.get('#username').type(email);
    cy.get('#login-submit').click();
});
```

### Test reporting
- Uses **Mochawesome** for HTML reports
- Reports generated in `cypress/reports/`
- Merged JSON reports converted to single HTML file
- Reports published to GitHub Pages automatically via CI/CD

## CI/CD with GitHub Actions

### Workflow features
-  Runs on every push to `main`, `master`, or `develop` branches
-  Runs on pull requests
-  Manual trigger via workflow_dispatch
-  Runs tests in Chrome browser
-  Generates Mochawesome HTML reports
-  Automatically publishes reports to GitHub Pages
-  Uploads screenshots on test failures


### View test reports


**For this repo:**
```
https://jbxrajas.github.io/auto-trello-practices/
```

### Manual workflow trigger

You can manually trigger the workflow:
1. Go to **Actions** tab in GitHub
2. Select "Cypress Tests" workflow
3. Click **Run workflow** → Select branch → **Run workflow**

### Workflow artifacts

Each workflow run produces:
- **cypress-report** - Mochawesome HTML report
- **cypress-screenshots** - Screenshots (on test failures)
- **cypress-videos** - Videos of test runs

Artifacts are available for 30 days (reports) or 7 days (screenshots/videos).

### View workflow runs

1. Go to: `https://github.com/YOUR_USERNAME/cypress-trello/actions`
2. Click on any workflow run to see:
   - Test execution logs
   - Artifacts (downloadable)
   - Deployment status
   - Test summary

## Common pitfalls
- Use `Cypress` (capital C) when referencing the global API; `cypress` (lowercase) causes "cypress is not defined" errors
- Ensure `.as()` has a dot before it: `cy.get(...).as('name')`
- Use `function()` (not arrow functions) when accessing `this` context in Mocha tests
- Always restart Cypress after changing `.env` or `cypress.config.js`
- For Cypress command chain mixing errors: don't mix `cy.*` commands with synchronous `return` statements in the same `.then()` callback
- Don't commit `.env`, API keys, tokens, or passwords to version control
- GitHub Actions needs secrets configured in repository settings
- GitHub Pages must be enabled with "GitHub Actions" as source

## Configuration
- **Base URL**: Set in `cypress.config.js` to avoid hardcoding URLs
- **Timeouts**: Default timeout is 4000ms; override with `{ timeout: 10000 }` for slow elements
- **Environment variables**: Loaded from `.env` via `dotenv.config()` in `cypress.config.js`
- **Reporter**: Mochawesome configured in `cypress.config.js` for HTML reports

## Git
The `.gitignore` excludes:
```
node_modules/
cypress/videos/
cypress/screenshots/
cypress/reports/
.env
keys.env
cypress.env.json
.vscode/
```

**Security reminder:** Never commit `.env`, API keys, tokens, or passwords to version control.

## Test coverage

### Current scenarios
- ✅ Selector exercises and interactions
- ✅ API authentication (bypasses 2FA)
- ✅ Negative login scenarios
- ✅ Board creation, update, deletion
- ✅ List creation and management
- ✅ Data-driven feature navigation tests
- ✅ Cross-origin authentication flows
- ✅ Automated CI/CD with GitHub Actions
- ✅ HTML test reports published to GitHub Pages


## Resources
- **Cypress Documentation**: https://docs.cypress.io
- **Trello API Documentation**: https://developer.atlassian.com/cloud/trello/rest/api-group-actions/
- **Mochawesome Reporter**: https://www.npmjs.com/package/mochawesome
- **GitHub Actions Documentation**: https://docs.github.com/en/actions
- **GitHub Pages Documentation**: https://docs.github.com/en/pages

## Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-test`
3. Commit changes: `git commit -m "Add new test scenario"`
4. Push to branch: `git push origin feature/new-test`
5. Open a Pull Request

## License
This project is for educational purposes and practice with Cypress automation.

---

**Live Test Reports:** https://jbxrajas.github.io/auto-trello-practices/

**Repository:** https://github.com/JBxrajas/auto-trello-practices


