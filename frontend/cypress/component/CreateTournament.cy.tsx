import CreateTournamentForm from "@/components/createTournament/CreateTournamentForm"

describe('CreateTournament.cy.tsx', () => {
  it('playground', () => {
    cy.mount(<CreateTournamentForm />)
    cy.get('input').first().type('World Cup 2030')
    cy.get('input').should('have.value', 'World Cup 2030')

    cy.get('input').eq(1).type('2021-12-24')
    cy.get('input').eq(1).should('have.value', '2021-12-24')

    cy.get('input').eq(2).type('12:00')
    cy.get('input').eq(2).should('have.value', '12:00')  

    cy.get('input').eq(3).type('Sui Arena')
    cy.get('input').eq(3).should('have.value', 'Sui Arena')

    cy.get('input').eq(4).type('{backspace}')
    cy.get('input').eq(4).type('8')
    cy.get('input').eq(4).should('have.value', '8')
    
    cy.get('input').eq(5).type('{backspace}')
    cy.get('input').eq(5).type('30')
    cy.get('input').eq(5).should('have.value', '30')

    cy.contains('button', 'Create Tournament').click()

    cy.contains('button', 'Use keyword and number').click()
    cy.get('input').eq(6).type('Arena')
    cy.get('input').eq(6).should('have.value', 'Arena')
    //cy.contains('button', 'Save').click() need backend to answer response
  })
})
