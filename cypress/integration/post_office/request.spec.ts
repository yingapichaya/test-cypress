/// <reference types="cypress" />

context('PostOffice Requests', () => {
  const base_api = 'https://trackapi.thailandpost.co.th/post/api/v1'
  const get_token = `${base_api}/authenticate/token`
  const my_valid_token =
    'M2ZWJYA?JVG9B8YRCeVJB3Q4WPDUOkUkDbS@QbEXK3BDCJJWNjD=Q2G4HhUVYrBTDNI8BwL7A3Y~QROAGhSyJ!ZQF0XcC3OQW@Q2'
  const my_invalid_token =
    'N2ZWJYA?JVG9B8YRCeVJB3Q4WPDUOkUkDbS@QbEXK3BDCJJWNjD=Q2G4HhUVYrBTDNI8BwL7A3Y~QROAGhSyJ!ZQF0XcC3OQW@Q3'

  it('valid get token', () => {
    cy.request({
      method: 'POST',
      url: get_token,
      headers: {
        authorization: `Token ${my_valid_token}`,
      },
    }).should((response) => {
      expect(response.status).to.be.eq(200)
      expect(response.body).to.have.property('expire')
      expect(response.body).to.have.property('token')
    })
  })

  it('unauthorized get token', () => {
    cy.request({
      method: 'POST',
      url: get_token,
      headers: {
        authorization: `Token ${my_invalid_token}`,
      },
      failOnStatusCode: false,
    }).should((response) => {
      expect(response.status).to.be.eq(401)
    })
  })

  it('bad request', () => {
    cy.request({
      method: 'POST',
      url: get_token,
      headers: {
        authorization: `Token ${my_valid_token}`,
      },
      body: {
        username: 'username',
      },
      failOnStatusCode: false,
    }).should((response) => {
      expect(response.status).to.be.eq(400)
    })
  })
})
