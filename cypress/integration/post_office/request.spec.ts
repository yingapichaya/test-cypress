/// <reference types="cypress" />

import * as data from "./data"

context("TrackThailandPost Requests - Get Token", () => {
  it("TC_Token_001: Retrieve success: a valid token and all properties are sent correctly", () => {
    cy.request({
      method: "POST",
      url: data.get_token,
      headers: {
        authorization: `Token ${data.valid_login_token}`,
        "content-type": "application/jason"
      }
    }).should((response) => {
      expect(response.status).to.be.eq(200)
      expect(response.body).to.have.property("expire")
      expect(response.body).to.have.property("token")
    })
  })

  it("TC_Token_002: Retrieve success: valid token is sent; 'content-type' is not sent", () => {
    cy.request({
      method: "POST",
      url: data.get_token,
      headers: {
        authorization: `Token ${data.valid_login_token}`
      }
    }).should((response) => {
      expect(response.status).to.be.eq(200)
      expect(response.body).to.have.property("expire")
      expect(response.body).to.have.property("token")
    })
  })

  it("TC_Token_003: Retrieve success: valid token is sent; 'content-type' is null", () => {
    cy.request({
      method: "POST",
      url: data.get_token,
      headers: {
        authorization: `Token ${data.valid_login_token}`,
        "content-type": ""
      }
    }).should((response) => {
      expect(response.status).to.be.eq(200)
      expect(response.body).to.have.property("expire")
      expect(response.body).to.have.property("token")
    })
  })

  it("TC_Token_004: Retrieve fail: authorization is not sent", () => {
    cy.request({
      method: "POST",
      url: data.get_token,
      headers: {
        "content-type": "application/jason"
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.be.eq(401)
    })
  })

  it("TC_Token_005: Retrieve fail: authorization is null", () => {
    cy.request({
      method: "POST",
      url: data.get_token,
      headers: {
        authorization: "",
        "content-type": "application/jason"
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.be.eq(401)
    })
  })

  it('TC_Token_006: Retrieve fail: "token" prefix is not sent', () => {
    cy.request({
      method: "POST",
      url: data.get_token,
      headers: {
        authorization: "data.valid_login_token",
        "content-type": "application/jason"
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.be.eq(401)
    })
  })

  it("TC_Token_007: Retrieve fail: token key is not sent", () => {
    cy.request({
      method: "POST",
      url: data.get_token,
      headers: {
        authorization: "Token",
        "content-type": "application/jason"
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.be.eq(401)
    })
  })

  it("TC_Token_008: Retrieve fail: invalid token is sent", () => {
    cy.request({
      method: "POST",
      url: data.get_token,
      headers: {
        authorization: `Token ${data.invalid_login_token}`,
        "content-type": "application/jason"
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.be.eq(401)
    })
  })

  it("TC_Token_009: Retrieve fail: incomplete token is sent", () => {
    cy.request({
      method: "POST",
      url: data.get_token,
      headers: {
        authorization: `Token ${data.incomplete_login_token}`,
        "content-type": "application/jason"
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.be.eq(401)
    })
  })
})

context("TrackThailandPost Requests - Get Items", () => {
  it("TC_Items_001: Retrieve success: a valid authentication token and all properties are sent correctly", () => {
    cy.request({
      method: "POST",
      url: data.get_items,
      headers: {
        authorization: `Token ${data.valid_authen_token}`,
        "content-type": "application/jason"
      },
      body: {
        status: "all",
        language: "TH",
        barcode: data.valid_tracking_no
      }
    }).should((response) => {
      expect(response.status).to.be.eq(200)
      expect(response.body).to.have.property("response")
      expect(response.body.response).to.have.property("items")
      expect(response.body.response.items).to.have.property(
        data.valid_tracking_no
      )

      const tracking_object =
        response.body.response.items[data.valid_tracking_no][0]
      expect(tracking_object).to.have.property(
        "barcode",
        data.valid_tracking_no
      )
      expect(tracking_object).to.have.property("status")
    })
  })
})
