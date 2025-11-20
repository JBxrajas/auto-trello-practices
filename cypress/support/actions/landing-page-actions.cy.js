const sel = require('../pages/validate-elements-landing-page');

module.exports = {
    visit() {
        cy.visit('https://trello.com');
    },

    assertTitle() {
        cy.title().should('eq', sel.titleText);
    },

    assertNavContains(label) {
        cy.get(sel.navContainer).contains(label).should('be.visible');
    },

    assertPricingMenu(){
        cy.get(sel.pricingMenu).should('be.visible').and('have.text','Pricing');
    },

    assertLoginVisible() {
        cy.get(sel.loginButton).should('be.visible').and('have.text', 'Log in');
    },

    assertSignupVisible() {
        cy.get(sel.signupButton).should('be.visible').and('have.text', "Get Trello for free");
    }
};
