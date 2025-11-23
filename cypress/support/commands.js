Cypress.Commands.add('NegativeLoginScenario',(email,password)=>{
    cy.visit('https://trello.com');
    cy.contains('Log in').click();
    //Using Origin to handle cross-origin login
    cy.origin ('https://id.atlassian.com/login', {args: {email, password}}, ({email, password}) => {
    cy.get('#username-uid1').type(email);
    cy.get('#login-submit').click();
    cy.get('#password').should('be.visible');
    cy.get('#password').type(password);
    cy.get('#login-submit').click();
    cy.get('div[data-testid="form-error--content"]').should('be.visible');
    });
});

Cypress.Commands.add('loginViaAPI', () => {
    const apiKey = Cypress.env('TRELLO_API_KEY');
    const apiToken = Cypress.env('TRELLO_API_TOKEN');

    if (!apiKey || !apiToken) {
        throw new Error('TRELLO_API_KEY or TRELLO_API_TOKEN not set in environment');
    }

    cy.log(`Verifying API credentials...`);

    // Verify token works and get user info
    return cy.request({
        method: 'GET',
        url: `https://api.trello.com/1/members/me?key=${apiKey}&token=${apiToken}`,
    }).then((response) => {
        expect(response.status).to.eq(200);
        
        // Store credentials in Cypress env for later use
        Cypress.env('authenticatedUser', response.body);
        
        // Return user object directly (no cy commands after this)
        return response.body;
    });
});

// Add a command to get boards via API
Cypress.Commands.add('getBoards', () => {
    const apiKey = Cypress.env('TRELLO_API_KEY');
    const apiToken = Cypress.env('TRELLO_API_TOKEN');

    return cy.request({
        method: 'GET',
        url: `https://api.trello.com/1/members/me/boards?key=${apiKey}&token=${apiToken}`,
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
});

// Add a command to get a specific board
Cypress.Commands.add('getBoard', (boardId) => {
    const apiKey = Cypress.env('TRELLO_API_KEY');
    const apiToken = Cypress.env('TRELLO_API_TOKEN');

    return cy.request({
        method: 'GET',
        url: `https://api.trello.com/1/boards/${boardId}?key=${apiKey}&token=${apiToken}`,
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
});

// Create a new board
Cypress.Commands.add('createBoard', (name, options = {}) => {
    const apiKey = Cypress.env('TRELLO_API_KEY');
    const apiToken = Cypress.env('TRELLO_API_TOKEN');

    return cy.request({
        method: 'POST',
        url: `https://api.trello.com/1/boards/?key=${apiKey}&token=${apiToken}&name=${encodeURIComponent(name)}`,
        body: options,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        // Remove cy.log() - can't mix with return
        return response.body;
    });
});

// Update a board
Cypress.Commands.add('updateBoard', (boardId, updates) => {
    const apiKey = Cypress.env('TRELLO_API_KEY');
    const apiToken = Cypress.env('TRELLO_API_TOKEN');

    return cy.request({
        method: 'PUT',
        url: `https://api.trello.com/1/boards/${boardId}?key=${apiKey}&token=${apiToken}`,
        body: updates,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
});

// Delete a board
Cypress.Commands.add('deleteBoard', (boardId) => {
    const apiKey = Cypress.env('TRELLO_API_KEY');
    const apiToken = Cypress.env('TRELLO_API_TOKEN');

    return cy.request({
        method: 'DELETE',
        url: `https://api.trello.com/1/boards/${boardId}?key=${apiKey}&token=${apiToken}`,
        failOnStatusCode: false
    }).then((response) => {
        // Don't add cy.log here either
        return response.body;
    });
});

// Create a list on a board
Cypress.Commands.add('createList', (boardId, name) => {
    const apiKey = Cypress.env('TRELLO_API_KEY');
    const apiToken = Cypress.env('TRELLO_API_TOKEN');

    return cy.request({
        method: 'POST',
        url: `https://api.trello.com/1/lists?key=${apiKey}&token=${apiToken}&name=${encodeURIComponent(name)}&idBoard=${boardId}`,
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
});

// Get all lists on a board
Cypress.Commands.add('getBoardLists', (boardId) => {
    const apiKey = Cypress.env('TRELLO_API_KEY');
    const apiToken = Cypress.env('TRELLO_API_TOKEN');

    return cy.request({
        method: 'GET',
        url: `https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${apiToken}`,
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
});

