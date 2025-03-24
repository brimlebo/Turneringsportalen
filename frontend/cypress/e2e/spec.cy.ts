describe('Test connection to site', () => {
  it('Visits Turneringsportalen', () => {
    cy.visit('https://turneringsportalen-rosy.vercel.app')
    cy.contains('Turneringsportalen')
  })
})

/* 
TODO: Implement login flow test
describe('Login Flow', () => {
  it('should allow a user to log in', () => {
    cy.visit('/login'); 
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard'); // Verify successful login
  });
});
*/
