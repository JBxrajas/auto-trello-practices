describe('Landing Page Element Validation', function() {

    it('Validate landing page elements', function() {
        const landingPage = require('../../support/actions/landing-page-actions.cy');           
        landingPage.visit();
        landingPage.assertTitle();
        landingPage.assertNavContains('Solutions');
        landingPage.assertNavContains('Resources');
        landingPage.assertNavContains('Pricing');
        landingPage.assertLoginVisible();
        landingPage.assertSignupVisible();
    });

});