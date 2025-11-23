describe('Trello Login and Board Validation', () => {
    it('should authenticate successfully via API', () => {
        cy.loginViaAPI().then((user) => {
            expect(user).to.have.property('id');
            expect(user).to.have.property('username');
            expect(user.email).to.eq(Cypress.env('TRELLO_EMAIL'));
        });
    });

    it('should retrieve user boards via API', () => {
        cy.loginViaAPI();
        cy.getBoards().then((boards) => {
            expect(boards).to.be.an('array');
            expect(boards.length).to.be.greaterThan(0);
            
            boards.forEach(board => {
                cy.log(`Board: ${board.name} (ID: ${board.id})`);
            });
        });
    });

    it('should retrieve a specific board', () => {
        cy.loginViaAPI();
        cy.getBoard('BashBaHr').then((board) => {
            expect(board).to.have.property('name');
            expect(board).to.have.property('id');
            cy.log(`Board Name: ${board.name}`);
        });
    });
});