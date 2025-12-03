describe('Mocks, Stubs, and Spies Exercises', () => {
    let createdBoardId;

    beforeEach(function() {
        cy.loginViaAPI();
    });

    afterEach(function() {
        // Cleanup any boards created during tests
        if (createdBoardId) {
            cy.deleteBoard(createdBoardId);
            createdBoardId = null;
        }
    });

    it('uses cy.spy to verify createBoard was called with correct params', () => {
        // Spy on cy.request to verify it was called with correct URL and params
        cy.spy(cy, 'request').as('requestSpy');

        const boardName = `Spy Test Board ${Date.now()}`;
        cy.createBoard(boardName, { desc: 'Created to test spy' }).then((board) => {
            createdBoardId = board.id;
            
            // Verify board was created with real API
            expect(board.name).to.eq(boardName);
            expect(board.desc).to.eq('Created to test spy');
            
            // Verify the spy recorded the POST request
            cy.get('@requestSpy').should((spy) => {
                const postCall = spy.getCalls().find(call => 
                    call.args[0].method === 'POST' && 
                    call.args[0].url.includes('/boards/')
                );
                expect(postCall).to.exist;
                expect(postCall.args[0].url).to.include(encodeURIComponent(boardName));
            });
        });
    });

    it('intercepts and mocks GET boards request in the browser', () => {
        // This demonstrates cy.intercept with browser fetch/XHR
        cy.fixture('mocks/boards-mocks.json').then((mockBoards) => {
            cy.intercept('GET', '**/1/members/me/boards*', {
                statusCode: 200,
                body: mockBoards
            }).as('getBoards');
        });

        // If you visit a page that fetches boards via XHR/fetch, the intercept will work
        // For now, let's call getBoards API and verify real response
        cy.getBoards().then((boards) => {
            expect(boards).to.be.an('array');
            expect(boards.length).to.be.greaterThan(0);
        });
    });

    it('stubs cy.request to return mocked board data', () => {
        // Stub cy.request specifically for POST /boards
        cy.window().then(() => {
            const originalRequest = cy.request.bind(cy);
            
            cy.stub(cy, 'request').callsFake((options) => {
                // Check if this is a board creation request
                if (options.method === 'POST' && options.url.includes('/1/boards/')) {
                    // Return mocked response
                    return cy.wrap({
                        status: 200,
                        body: {
                            id: 'mockedBoardId123',
                            name: 'Mocked Board',
                            desc: options.body?.desc || '',
                            url: 'https://trello.com/b/mocked',
                            prefs: { permissionLevel: 'private' }
                        }
                    });
                }
                // For all other requests, call the original
                return originalRequest(options);
            }).as('requestStub');
        });

        // Now createBoard will use the stubbed cy.request
        cy.createBoard('Mocked Board', { desc: 'Stubbed board' }).then((board) => {
            expect(board.id).to.eq('mockedBoardId123');
            expect(board.name).to.eq('Mocked Board');
            expect(board.desc).to.eq('Stubbed board');
        });

        // Verify the stub was called
        cy.get('@requestStub').should('have.been.called');
    });

    it('uses mock mode flag for deterministic testing', () => {
        // Enable mock mode and wrap in cy.then() to ensure it executes in order
        cy.then(() => {
            Cypress.env('MOCK_MODE', true);
        }).then(() => {
            // Now createBoard returns mocked data
            return cy.createBoard('Mocked Board', { desc: 'Mocked via flag' });
        }).then((board) => {
            expect(board.id).to.eq('mockedBoardId123');
            expect(board.name).to.eq('Mocked Board');
            expect(board.desc).to.eq('Mocked via flag');
            
            // Disable mock mode for subsequent tests
            Cypress.env('MOCK_MODE', false);
        });
    });

    it('creates a real board and verifies API response structure', () => {
        const boardName = `Real Test Board ${Date.now()}`;
        
        cy.createBoard(boardName, { desc: 'Real board for testing' }).then((board) => {
            createdBoardId = board.id;
            
            // Verify real Trello response structure
            expect(board).to.have.property('id');
            expect(board).to.have.property('name');
            expect(board).to.have.property('desc');
            expect(board).to.have.property('url');
            expect(board).to.have.property('prefs');
            
            // Verify values
            expect(board.id).to.match(/^[a-f0-9]{24}$/); // Real Trello ID format
            expect(board.name).to.eq(boardName);
            expect(board.desc).to.eq('Real board for testing');
        });
    });
});