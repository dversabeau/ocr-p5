import {Session} from "../../src/app/features/sessions/interfaces/session.interface";
import {Teacher} from "../../instrumented/app/interfaces/teacher.interface";

describe('Sessions spec', () => {

  beforeEach(() => {
    const sessionData: Session[] = [
      {
        id: 1,
        name: 'session 1',
        description: 'description',
        date: new Date(),
        teacher_id: 1,
        users: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'session 2',
        description: 'description',
        date: new Date(),
        teacher_id: 1,
        users: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

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

    cy.intercept('GET', '/api/session', {
      body: sessionData,
    });

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)


    cy.url().should('include', '/sessions')
  })

  it('should have a list of session with a button create and detail with admin credentials', () => {
    cy.get('.mat-card').should('have.length', 3);
    cy.get('button span span.ml1:contains("Create")').should('exist');
    cy.get('button span span.ml1:contains("Detail")').should('exist');
  })

  it('should display information and delete button with admin credentials', () => {
    const sessionData: Session =
      {
        id: 1,
        name: 'session 1',
        description: 'description',
        date: new Date(),
        teacher_id: 1,
        users: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

    cy.intercept('GET', '/api/session/1', {
      body: sessionData,
    });

    cy.get('button:contains("Detail")').eq(0).click();


    cy.url().should('include', '/sessions/detail/1')

    cy.get('span.mat-button-wrapper span.ml1:contains("Delete")').should('exist');
    cy.get('.created').should('exist');
    cy.get('.updated').should('exist');
    cy.get('.description').should('exist');
  })

  it('delete a session', () => {
    const sessionData: Session =
      {
        id: 1,
        name: 'session 1',
        description: 'description',
        date: new Date(),
        teacher_id: 1,
        users: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

    cy.intercept('GET', '/api/session/1', {
      body: sessionData,
    });

    cy.get('button:contains("Detail")').eq(0).click();


    cy.url().should('include', '/sessions/detail/1')

    cy.intercept('DELETE', '/api/session/1', {
      body: sessionData,
    });

    cy.get('span.mat-button-wrapper span.ml1:contains("Delete")').click();

    cy.get('span.mat-simple-snack-bar-content:contains("Session deleted !")').should('exist')
    cy.get('.mat-card').should('have.length', 3);
  })

  it('should modify a session', () => {
    const sessionData: Session =
      {
        id: 1,
        name: 'session 1',
        description: 'description',
        date: new Date(),
        teacher_id: 1,
        users: [],
      };

    const sessionDataUpdate: Session =
      {
        id: 1,
        name: 'session 1 modifier',
        description: 'description modifier',
        date: new Date(),
        teacher_id: 1,
        users: [],
      };
    cy.intercept('GET', '/api/session/1', {
      body: sessionData,
    });

    const teachers: Teacher[] =
      [
        {
          id: 1,
          lastName: 'Dupont',
          firstName: 'Jean',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          lastName: 'Martin',
          firstName: 'François',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];

    cy.intercept('GET', '/api/teacher', {
      body: teachers
    })

    cy.get('button:contains("Edit")').eq(0).click();

    cy.intercept('PUT', '/api/session/1', {
      body: sessionDataUpdate,
    });

    cy.url().should('include', '/sessions/update/1')

    cy.get('span.mat-button-wrapper:contains("Save")').click();

    cy.get('span.mat-simple-snack-bar-content:contains("Session updated !")').should('exist')
    cy.get('.mat-card').should('have.length', 3);
  })

});
