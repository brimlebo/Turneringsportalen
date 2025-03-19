describe('Click on Create Tournament in nav bar', () => {
  it('Visits Turneringsportalen', () => {
    cy.visit('https://turneringsportalen-rosy.vercel.app')
    cy.contains('Create Tournament').click()
    cy.url().should('include', '/tournaments/create')
  })
})
