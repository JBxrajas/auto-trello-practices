describe('This is a sample test to validate the landing page', function(){
    before(function(){
        cy.log ('Cleanup example'); // Replace with the actual landing page URL
    });
    after(function(){
        cy.log ('Post-test cleanup example');
    });

    beforeEach(function(){
        cy.log ('Setup before each test example');
    })
    afterEach(function(){
        cy.log ('Teardown after each test example');
    });

    it('Visits the landing page and checks for the title', function(){
        cy.log('Hi there! This is a sample test to validate the landing page.');

    });
    it('Test2', function(){
        cy.log('Hi there! This is a sample test to validate the landing page.2');

    });
});