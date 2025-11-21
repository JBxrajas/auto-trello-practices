const selFeatureSection = require('../pages/validate-elements-features-section');

const actions = {
    visit: function() {
        cy.visit('https://trello.com/');
    },

    assertTitle: function() {
        cy.title().should('eq', selFeatureSection.titleText);
    },

    assertElements: function() {
        Object.values(selFeatureSection).forEach(function(selector) {
            cy.get(selector).should('exist');
        });
    },

    assertNavContains: function(label) {
        cy.get(selFeatureSection.navContainer).contains(label).should('be.visible');
    },

    clickNavItem: function(label) {
        cy.get(selFeatureSection.navContainer).contains(label).click();
    },

    assertUrlContains: function(path) {
        cy.url().should('include', path);
    },
    
    clickElement: function(selector) {
        if (!selector) throw new Error('clickElement: selector is undefined');
        cy.get(selector).first().click();
    }
};

// expose page selectors so tests can use featureSection.featuresInbox, etc.
module.exports = Object.assign(actions, selFeatureSection);