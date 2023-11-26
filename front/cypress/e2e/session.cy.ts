import {Teacher} from "../../instrumented/app/interfaces/teacher.interface";
import {Session} from "../../instrumented/app/features/sessions/interfaces/session.interface";

describe('Session spec', () => {
  beforeEach(()=>{
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

    cy.get('.mat-button-wrapper').click();

    cy.url().should('include', '/session')
  })

  it('create a session', () => {
    const sessionCreated: Session =
      {
      name: 'Session de yoga test',
      description: 'description test',
      date: new Date("2024-01-01"),
      teacher_id: 2,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    cy.intercept('POST', '/api/session', {
      body: sessionCreated
    })

    cy.get('input[formControlName="name"]').type("Session de yoga test")
    cy.get('input[formControlName="date"]').type("2024-01-01")
    cy.get('textarea[formControlName="description"]').type("description test")
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains('François Martin').click();

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
      },
      {
        id: 3,
        name: 'Session de yoga test',
        description: 'description test',
        date: new Date("2024-01-01"),
        teacher_id: 2,
        users: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    cy.intercept('GET', '/api/session', {
      body: sessionData,
    });

    cy.get('span.mat-button-wrapper:contains("Save")').click();

    cy.get('span.mat-simple-snack-bar-content:contains("Session created !")').should('exist')
    cy.get('.mat-card').should('have.length', 4);

  })
});
