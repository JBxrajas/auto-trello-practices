# auto-trello-practices

This repository contains Cypress practice tests for a few selector / interaction exercises and a Trello practice automation scenarios. The intent is to practice Cypress commands, fixtures, aliases, cross-origin handling via cy.origin, and writing maintainable E2E tests.

## Project structure 
  - e2e/
    - selector-exercises/ (selector/interaction practice specs)
    - trello-exercises/ (Trello negative-login spec)
  - fixtures/
    - example.json (test credentials)
  - support/
    - commands.js (custom commands, e.g. NegativeLoginScenario)
  - reports/, videos/, screenshots/ (test outputs)

## Prerequisites
- Node.js (LTS recommended)
- Git
- Windows (commands below target Windows terminals)

## Install
Open a terminal at the project root:
```powershell
cd /d g:\repos\cypress-trello\auto-trello-practices
npm install
```

If you hit PowerShell script execution errors for npx (npx.ps1 blocked), either:
- Use Command Prompt: open cmd.exe and run npx commands there, or
- Use npx.cmd in PowerShell: npx.cmd cypress open, or
- Permanently allow signed scripts for current user:
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force

## How to run tests
Open Cypress Test Runner (interactive):
```powershell
# from project root (PowerShell or CMD)
npx cypress open
# or in PowerShell if npx.ps1 is blocked:
npx.cmd cypress open
```

Run all specs headless:
```powershell
npx cypress run
```

Run a single spec (example):
```powershell
npx cypress run --spec "cypress/e2e/trello-exercises/negative-scenarios.cy.js"
```

Run a single spec in headed browser:
```powershell
npx cypress run --headed --browser chrome --spec "cypress/e2e/trello-exercises/negative-scenarios.cy.js"
```

## What tests / scenarios are included
- Selector exercises
  - selector-practice.cy.js — locating elements and assertions
  - interactions-assertions-practice.cy.js — interactions and explicit waits
  - aliases-variables-practice.cy.js — use of cy.as() aliases and referencing elements
  - validate-landing-page.cy.js — simple landing page validation
- Trello exercises
  - negative-scenarios.cy.js — attempts to log in with invalid credentials and asserts error message

## Key implementation notes
- Fixtures
  - example.json stores test credentials. Use cy.fixture('example.json').as('testData') or cy.get('@testData') to access fixture data.
  - If using Mocha's `this` context to access fixture data, use function() callbacks (not arrow functions) so `this.testData` is defined.
- Custom command
  - Cypress.Commands.add('NegativeLoginScenario', (email, password) => { ... })
  - The command visits trello.com, clicks Log in and uses cy.origin to handle the Atlassian login flow, then asserts the form error for invalid credentials.
- Common pitfalls
  - Use `Cypress` (capital C) when referencing the global API; `cypress` (lowercase) will cause "cypress is not defined".
  - Ensure you use a dot before `.as()` (e.g., cy.get(...).as('name')) so it isn't parsed as a TypeScript assertion in JS files.
  - If TypeScript parsing errors persist in JS files, restart the TS server in VS Code or add `// @ts-nocheck` at the top of the file.

## Git
A project-level .gitignore is recommended to avoid committing node_modules, test artifacts, videos, screenshots, and local env files:
- node_modules/
- cypress/videos/
- cypress/screenshots/
- cypress/reports/
- .env
- .vscode/
- etc.


## Notes & next steps
- Add more negative and positive scenarios for Trello flows (2FA, session handling).
- Add CI integration (GitHub Actions) to run Cypress in headless mode on pushes.
