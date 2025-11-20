describe('Negative Login Scenarios', () => {
    beforeEach(() => {
       cy.fixture('example.json').as('testData') 
    });
   
    it('Ivalid Username and pass',function(){
        cy.NegativeLoginScenario(this.testData.email, this.testData.password);

    });

});
