// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('NegativeLoginScenario',(email,password)=>{
    cy.visit('https://trello.com');
    cy.contains('Log in').click();
    //Using Origin to handle cross-origin login
    cy.origin ('https://id.atlassian.com/login', {args: {email, password}}, ({email, password}) => {
    cy.get('#username-uid1').type(email);
    cy.get('#login-submit').click();
    cy.get('#password').should('be.visible');
    cy.get('#password').type(password);
    cy.get('#login-submit').click();
    cy.get('div[data-testid="form-error--content"]').should('be.visible');
    });
});