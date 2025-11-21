const featureSection = require('../../support/actions/validate-feature-section-actions.cy');

describe('Features Section Navigation', function() {
    beforeEach(function() {
        featureSection.visit();
        featureSection.assertTitle();
    });

    // Use features array from page object
    featureSection.features.forEach(feature => {
        it(`Navigate to ${feature.label}`, function() {
            // open features menu
            featureSection.clickElement(featureSection.featureElement);
            featureSection.assertNavContains(feature.label);
            
            // click feature and validate URL
            featureSection.clickNavItem(feature.label);
            featureSection.assertUrlContains(feature.path);
            
            // go back and assert homepage
            cy.go('back');
            featureSection.assertUrlContains('/');
        });
    });
});