
describe('Register spec', () => {
  beforeEach(() => {
    cy.visit('/register')
  })

  it('should register successfully', () => {

    cy.get('input[formControlName=firstName]').type("firstNameTest")
    cy.get('input[formControlName=lastName]').type("lastNameTest")
    cy.get('input[formControlName=email]').type("test@test.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}`)

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200,
      body: {
        email: 'test@test.com',
        firstName: 'firstNameTest',
        lastName: 'lastNameTest',
        password: 'test!1234',
      },
    }).as('registerApiCall');

    cy.get('button.mat-raised-button').click();
    cy.wait('@registerApiCall');
    cy.url().should('include', '/login')

  })

  it('should not register successfully cause email already exist', () => {

    cy.get('input[formControlName=firstName]').type("firstNameTest")
    cy.get('input[formControlName=lastName]').type("lastNameTest")
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}`)

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 400,
      body: {
        email: 'yoga@studio.com',
        firstName: 'firstNameTest',
        lastName: 'lastNameTest',
        password: 'test!1234',
      },
    }).as('registerApiCall');

    cy.get('button.mat-raised-button').click();

    cy.wait('@registerApiCall');
    cy.get('.error').contains('An error occurred')

  })

  it('should not be possible to submit the form', () => {

    cy.get('input[formControlName=firstName]').type("firstNameTest")
    cy.get('input[formControlName=lastName]').type("lastNameTest")
    cy.get('input[formControlName=email]').type("test@test.com")
    cy.get('button.mat-raised-button').should("be.disabled");
  })

})

