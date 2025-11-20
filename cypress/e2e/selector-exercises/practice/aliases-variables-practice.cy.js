describe('Aliases and Variables Practice', function() {

    beforeEach(function(){
        cy.fixture('example.json').as('testData');
    });
    it('Clousures',function(){
        cy.visit('http://www.uitestingplayground.com/home');
        cy.get('.nav-link').then($elements =>{
            cy.log($elements[0].innerText);
            expect($elements[0].innerText).to.equal('Home');

        }) 
    });
    it('Fixtures',function(){

        // Access fixture data using "this" context and alias
        const exampleData =this.testData
        cy.log(exampleData);

        //use @ alias to access fixture data
        cy.get('@testData').then((data)=>{
            cy.log(data);
        });

    });

    it('Alias for dom elements',function(){
        cy.visit('http://www.uitestingplayground.com/home');
        cy.get('.nav-link').as('links');
        cy.get('@links').last().click();
        cy.url().should('include','/resources');
    });
});