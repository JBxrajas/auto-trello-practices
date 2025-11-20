describe('Find elements using different selector strategies',function(){
    beforeEach(function(){   
        cy.visit('http://www.uitestingplayground.com/classattr'); 
    });
    it('Find by ID',function(){
        // Example: find an element by its ID and assert it exists
        cy.get('#navbarSupportedContent').should('exist');
    });

    it('Find by class attribute',function(){
        // Example: find elements that have a class attribute and assert they exist
        cy.get('.class1').should('exist');
        cy.get('.class2').should('exist');
        cy.get('.class3').should('exist');
    });

    it('Find by tag',function(){
        // Example: find elements with multiple class names
        cy.get('button').should('exist');
    });

    it('Find by atrribute',function(){
        // Example: find elements with a partial class name using wildcard
        cy.get('[type="button"]').should('exist');
    });

    it('Find by atrribute and tag',function(){
        // Example: find elements with a partial class name using wildcard
        cy.get('button[type="button"]').should('exist');
    });
    it('Find by contains text',function(){
        // Example: find elements that contain specific text
        cy.contains('Home').should('exist');
        cy.contains('hOMe',{matchCase:false}).should('exist');
    });
    it('Find an element and select the first one',function(){
        // Example: find all buttons and select the first one
        cy.viewport(400, 400);
        cy.get('button').first().should('exist');
    });
    it.only('Find an element and select the last one',function(){
        // Example: find all buttons and select the last one
        cy.viewport(400, 400);
        cy.get('button').last().should('exist');
    });
    it('Find an element and select by index',function(){
        // Example: find all buttons and select by index
        cy.viewport(400, 400);
        cy.get('button').eq(2).should('exist');
    });
});