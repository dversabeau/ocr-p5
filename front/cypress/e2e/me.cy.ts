it('should display user information successfully', () => {
  cy.visit('/login')

  cy.intercept('POST', '/api/auth/login', {
    body: {
      id: 1,
      username: 'userName',
      firstName: 'firstName',
      lastName: 'lastName',
      admin: true
    },
  })

  cy.intercept(
    {
      method: 'GET',
      url: '/api/session',
    },
    []).as('session')

  cy.get('input[formControlName=email]').type("yoga@studio.com")
  cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

  cy.url().should('include', '/sessions')

  cy.intercept('GET', '/api/user/1', {
    body: {
      id: 1,
      username: 'userName',
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'test@test.fr',
      admin: true
    },
  })

  cy.get('span.link:contains("Account")').click();
  cy.url().should('include', '/me')

  cy.contains('p', `Name: firstName LASTNAME`);

  cy.contains('p', `Email: test@test.fr`);

  cy.contains('p', 'You are admin');
})
