describe('Trello Board Creation and Navigation', () => {
    let createdBoardId;

    afterEach(function() {
        // Cleanup: delete the board after each test
        if (createdBoardId) {
            cy.deleteBoard(createdBoardId);
            createdBoardId = null;
        }
    });

    it('should create a board via API', () => {
        cy.loginViaAPI();
        
        const boardName = `Test Board ${Date.now()}`;
        cy.createBoard(boardName).then((board) => {
            createdBoardId = board.id;
            
            expect(board).to.have.property('id');
            expect(board.name).to.eq(boardName);
            expect(board.closed).to.be.false;
            cy.log(`Created board: ${board.name} (ID: ${board.id})`);
        });
    });

    it('should create a board and verify it appears in user boards list', () => {
        cy.loginViaAPI();
        
        const boardName = `Test Board ${Date.now()}`;
        cy.createBoard(boardName).then((board) => {
            createdBoardId = board.id;
            
            // Verify the board appears in the user's boards
            cy.getBoards().then((boards) => {
                const foundBoard = boards.find(b => b.id === board.id);
                expect(foundBoard).to.exist;
                expect(foundBoard.name).to.eq(boardName);
            });
        });
    });

    it('should create a board with description and verify via API', () => {
        cy.loginViaAPI();
        
        const boardName = `Test Board ${Date.now()}`;
        const description = 'This is a test board created by Cypress automation';
        
        cy.createBoard(boardName, { desc: description }).then((board) => {
            createdBoardId = board.id;
            
            expect(board.desc).to.eq(description);
            
            // Verify by fetching the board again
            cy.getBoard(board.id).then((fetchedBoard) => {
                expect(fetchedBoard.name).to.eq(boardName);
                expect(fetchedBoard.desc).to.eq(description);
            });
        });
    });

    it('should create a private board and verify visibility settings', () => {
        cy.loginViaAPI();
        
        const boardName = `Private Board ${Date.now()}`;
        cy.createBoard(boardName, { prefs_permissionLevel: 'private' }).then((board) => {
            createdBoardId = board.id;
            
            expect(board.prefs.permissionLevel).to.eq('private');
            cy.log(`Created private board: ${board.name}`);
            
            // Verify via GET request
            cy.getBoard(board.id).then((fetchedBoard) => {
                expect(fetchedBoard.prefs.permissionLevel).to.eq('private');
            });
        });
    });

    it('should create multiple boards and verify count', () => {
        cy.loginViaAPI();
        
        const boardNames = [
            `Board 1 - ${Date.now()}`,
            `Board 2 - ${Date.now()}`,
            `Board 3 - ${Date.now()}`
        ];
        
        const boardIds = [];

        // Get initial board count
        cy.getBoards().then((initialBoards) => {
            const initialCount = initialBoards.length;

            // Create multiple boards
            boardNames.forEach((name) => {
                cy.createBoard(name).then((board) => {
                    boardIds.push(board.id);
                    expect(board.name).to.eq(name);
                });
            });

            // Verify new board count
            cy.getBoards().then((updatedBoards) => {
                expect(updatedBoards.length).to.eq(initialCount + boardNames.length);
                
                // Cleanup all created boards
                boardIds.forEach(id => cy.deleteBoard(id));
            });
        });
    });

    it('should update board name after creation', () => {
        cy.loginViaAPI();
        
        const originalName = `Original Board ${Date.now()}`;
        const updatedName = `Updated Board ${Date.now()}`;
        
        cy.createBoard(originalName).then((board) => {
            createdBoardId = board.id;
            expect(board.name).to.eq(originalName);
            
            // Update board name
            cy.updateBoard(board.id, { name: updatedName }).then((updatedBoard) => {
                expect(updatedBoard.name).to.eq(updatedName);
                
                // Verify via GET
                cy.getBoard(board.id).then((fetchedBoard) => {
                    expect(fetchedBoard.name).to.eq(updatedName);
                });
            });
        });
    });

    it('should create a board and add lists via API', () => {
        cy.loginViaAPI();
        
        const boardName = `Board with Lists ${Date.now()}`;
        const listNames = ['To Do', 'In Progress', 'Done'];
        
        cy.createBoard(boardName).then((board) => {
            createdBoardId = board.id;
            
            // Create lists on the board
            listNames.forEach((listName) => {
                cy.createList(board.id, listName).then((list) => {
                    expect(list.name).to.eq(listName);
                    expect(list.idBoard).to.eq(board.id);
                    cy.log(`Created list: ${list.name}`);
                });
            });
            
            // Verify all lists were created
            cy.getBoardLists(board.id).then((lists) => {
                expect(lists.length).to.be.at.least(listNames.length);
            });
        });
    });
});