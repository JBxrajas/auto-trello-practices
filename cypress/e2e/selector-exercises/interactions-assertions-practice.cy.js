describe('Interactions and Assertions Practice', function() {
    beforeEach(function() {
        
    });

    it('Validate title and navigation to a page',function() {
        // Assert the page title
        cy.visit('http://www.uitestingplayground.com/loaddelay');
        cy.title().should('eq','Load Delays');
 
    });   
    
    it('Validate button appears after delay and click it',function(){
        cy.visit('http://www.uitestingplayground.com/clientdelay');
        cy.title().should('eq','Client Side Delay');
        cy.get('#ajaxButton').click();
        cy.get('.bg-success',{timeout:20000}).should('be.visible');
    })

    it('Validate Input field and typed text after input',function(){
        cy.visit('http://www.uitestingplayground.com/textinput');
        cy.title().should('eq','Text Input');
        const inputText  = 'Hello Im a foo fighter!';
        cy.get('#newButtonName').type(inputText);
        cy.get('#updatingButton').click();
        cy.get('#updatingButton').should('have.text',inputText);


    });

    it.only('Validate Alerts and confirm alert text',function(){ 
        cy.visit('http://www.uitestingplayground.com/alerts');
        cy.title().should('eq','Alerts');
        cy.get('#alertButton').click();
        cy.on('window:alert',(str)=>{
            expect(str).to.equal('Today is a working day.\nOr less likely a holiday.');
        });
    });
});