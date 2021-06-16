/// <reference types="cypress" />

import { isNullOrType } from "../../support"
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

  it("TC_Token_005: Retrieve fail: authorization is sent as null", () => {
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
        authorization: data.valid_login_token,
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
        "content-type": "application/json"
      },
      body: {
        status: "all",
        language: "TH",
        barcode: [data.valid_tracking_no]
      }
    }).should((response) => {
      expect(response.status).to.be.eq(200)
      expect(response.body).to.have.property("response")
      expect(response.body.response).to.have.property("items")
      expect(response.body.response.items).to.have.property(
        data.valid_tracking_no
      )

      const tracking_objects =
        response.body.response.items[data.valid_tracking_no]
      tracking_objects.map((tracking_object) => {
        expect(tracking_object).to.have.property(
          "barcode",
          data.valid_tracking_no
        )
        expect(tracking_object).to.have.property("status").to.be.a("string")
        expect(tracking_object)
          .to.have.property("status_description")
          .to.be.a("string")
        expect(tracking_object)
          .to.have.property("status_description")
          .to.be.a("string")
        expect(tracking_object)
          .to.have.property("status_date")
          .to.be.a("string")
        expect(tracking_object).to.have.property("location").to.be.a("string")
        // TO DO: to check to.be.null or to.be.a("string")
        expect(tracking_object).to.have.property("delivery_status")
        expect(isNullOrType(tracking_object.delivery_status, "string")).to.be
          .true
        expect(tracking_object).to.have.property("delivery_description")
        expect(isNullOrType(tracking_object.delivery_description, "string")).to
          .be.true
        expect(tracking_object).to.have.property("postcode").to.be.a("string")
        expect(isNullOrType(tracking_object.postcode, "string")).to.be.true
        expect(tracking_object).to.have.property("delivery_datetime")
        expect(isNullOrType(tracking_object.delivery_datetime, "string")).to.be
          .true
        expect(tracking_object).to.have.property("receiver_name")
        expect(isNullOrType(tracking_object.receiver_name, "string")).to.be.true
        expect(tracking_object).to.have.property("signature")
        expect(isNullOrType(tracking_object.signature, "string")).to.be.true
      })
      expect(response.body.response).to.have.property("track_count")
      expect(response.body.response.track_count).to.have.all.keys(
        "track_date",
        "count_number",
        "track_count_limit"
      )
      expect(response.body.response.track_count.track_date).to.be.an("string")
      expect(response.body.response.track_count.count_number).to.be.a("number")
      expect(response.body.response.track_count.track_count_limit).to.be.a(
        "number"
      )
      expect(response.body).to.have.property("message").to.be.a("string")
      expect(response.body).to.have.property("status").to.be.a("boolean")
    })
  })

  it("TC_Items_002: Retrieve fail: authorization is not sent", () => {
    cy.request({
      method: "POST",
      url: data.get_items,
      headers: {
        "content-type": "application/json"
      },
      body: {
        status: "all",
        language: "TH",
        barcode: [data.valid_tracking_no]
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.be.eq(403)
    })
  })

  it("TC_Items_003: Retrieve fail: authorization is sent as null", () => {
    cy.request({
      method: "POST",
      url: data.get_items,
      headers: {
        authorization: "",
        "content-type": "application/json"
      },
      body: {
        status: "all",
        language: "TH",
        barcode: [data.valid_tracking_no]
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.be.eq(403)
    })
  })

  it("TC_Items_004: Retrieve fail: 'Token' prefix is not sent", () => {
    cy.request({
      method: "POST",
      url: data.get_items,
      headers: {
        authorization: data.valid_authen_token,
        "content-type": "application/json"
      },
      body: {
        status: "all",
        language: "TH",
        barcode: [data.valid_tracking_no]
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.be.eq(403)
    })
  })

  it("TC_Items_005: Retrieve fail: token key is not sent", () => {
    cy.request({
      method: "POST",
      url: data.get_items,
      headers: {
        authorization: "Token",
        "content-type": "application/json"
      },
      body: {
        status: "all",
        language: "TH",
        barcode: [data.valid_tracking_no]
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.be.eq(403)
    })
  })

  it("TC_Items_006: Retrieve fail: invalid token is sent", () => {
    cy.request({
      method: "POST",
      url: data.get_items,
      headers: {
        authorization: `Token ${data.invalid_authen_token}`,
        "content-type": "application/json"
      },
      body: {
        status: "all",
        language: "TH",
        barcode: [data.valid_tracking_no]
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.be.eq(403)
    })
  })

  it("TC_Items_007: Retrieve fail: incomplete token is sent", () => {
    cy.request({
      method: "POST",
      url: data.get_items,
      headers: {
        authorization: `Token ${data.incomplete_authen_token}`,
        "content-type": "application/json"
      },
      body: {
        status: "all",
        language: "TH",
        barcode: [data.valid_tracking_no]
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.be.eq(403)
    })
  })

  it("TC_Items_008: Retrieve fail: status is not sent: return 'value cannot be null or empty'", () => {
    cy.request({
      method: "POST",
      url: data.get_items,
      headers: {
        authorization: `Token ${data.valid_authen_token}`,
        "content-type": "application/json"
      },
      body: {
        language: "TH",
        barcode: [data.valid_tracking_no]
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.be.eq(200)
      expect(response.body).have.property(
        "message",
        "value cannot be null or empty"
      )
      expect(response.body).have.property("status").to.be.a("boolean")
    })
  })

  it("TC_Items_009: Retrieve fail: status is sent as null: return 'invalid status'", () => {
    cy.request({
      method: "POST",
      url: data.get_items,
      headers: {
        authorization: `Token ${data.valid_authen_token}`,
        "content-type": "application/json"
      },
      body: {
        status: "",
        language: "TH",
        barcode: [data.valid_tracking_no]
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.be.eq(200)
      expect(response.body).have.property("message", "invalid status")
      expect(response.body).have.property("status").to.be.a("boolean")
    })
  })

  it("TC_Items_010: Retrieve fail: invalid status is sent: return 'invalid status'", () => {
    cy.request({
      method: "POST",
      url: data.get_items,
      headers: {
        authorization: `Token ${data.valid_authen_token}`,
        "content-type": "application/json"
      },
      body: {
        status: "ทั้งหมด",
        language: "TH",
        barcode: [data.valid_tracking_no]
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.be.eq(200)
      expect(response.body).have.property("message", "invalid status")
      expect(response.body).have.property("status").to.be.a("boolean")
    })
  })

  it("TC_Items_011: Retrieve fail: valid status is sent as integer: return 'invalid status'", () => {
    cy.request({
      method: "POST",
      url: data.get_items,
      headers: {
        authorization: `Token ${data.valid_authen_token}`,
        "content-type": "application/json"
      },
      body: {
        status: 103,
        language: "TH",
        barcode: [data.valid_tracking_no]
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.be.eq(200)
      expect(response.body).have.property("message", "invalid status")
      expect(response.body).have.property("status").to.be.a("boolean")
    })
  })

  it("TC_Items_012: Retrieve fail: language is not sent: return 'value cannot be null or empty'", () => {
    cy.request({
      method: "POST",
      url: data.get_items,
      headers: {
        authorization: `Token ${data.valid_authen_token}`,
        "content-type": "application/json"
      },
      body: {
        status: "all",
        barcode: [data.valid_tracking_no]
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.be.eq(200)
      expect(response.body).have.property(
        "message",
        "value cannot be null or empty"
      )
      expect(response.body).have.property("status").to.be.a("boolean")
    })
  })

  it("TC_Items_012: Retrieve fail: language is sent as null: return 'value cannot be null or empty'", () => {
    cy.request({
      method: "POST",
      url: data.get_items,
      headers: {
        authorization: `Token ${data.valid_authen_token}`,
        "content-type": "application/json"
      },
      body: {
        status: "all",
        language: "",
        barcode: [data.valid_tracking_no]
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.be.eq(200)
      expect(response.body).have.property(
        "message",
        "value cannot be null or empty"
      )
      expect(response.body).have.property("status").to.be.a("boolean")
    })
  })

  it("TC_Items_013: Retrieve success: unsupported language is sent: default to EN", () => {
    cy.request({
      method: "POST",
      url: data.get_items,
      headers: {
        authorization: `Token ${data.valid_authen_token}`,
        "content-type": "application/json"
      },
      body: {
        status: "all",
        language: "SP",
        barcode: [data.valid_tracking_no]
      }
    }).should((response) => {
      expect(response.status).to.be.eq(200)
      expect(response.body).to.have.property("response")
      expect(response.body.response).to.have.property("items")
      expect(response.body.response.items).to.have.property(
        data.valid_tracking_no
      )

      const tracking_objects =
        response.body.response.items[data.valid_tracking_no]
      tracking_objects.map((tracking_object) => {
        expect(tracking_object).to.have.property(
          "barcode",
          data.valid_tracking_no
        )
        expect(tracking_object).to.have.property("status").to.be.a("string")
        expect(tracking_object)
          .to.have.property("status_description")
          .to.be.a("string")
        expect(tracking_object)
          .to.have.property("status_description")
          .to.be.a("string")
        expect(tracking_object)
          .to.have.property("status_date")
          .to.be.a("string")
        expect(tracking_object).to.have.property("location").to.be.a("string")
        // TO DO: to check to.be.null or to.be.a("string")
        expect(tracking_object).to.have.property("delivery_status")
        expect(isNullOrType(tracking_object.delivery_status, "string")).to.be
          .true
        expect(tracking_object).to.have.property("delivery_description")
        expect(isNullOrType(tracking_object.delivery_description, "string")).to
          .be.true
        expect(tracking_object).to.have.property("postcode").to.be.a("string")
        expect(isNullOrType(tracking_object.postcode, "string")).to.be.true
        expect(tracking_object).to.have.property("delivery_datetime")
        expect(isNullOrType(tracking_object.delivery_datetime, "string")).to.be
          .true
        expect(tracking_object).to.have.property("receiver_name")
        expect(isNullOrType(tracking_object.receiver_name, "string")).to.be.true
        expect(tracking_object).to.have.property("signature")
        expect(isNullOrType(tracking_object.signature, "string")).to.be.true
      })
      expect(response.body.response).to.have.property("track_count")
      expect(response.body.response.track_count).to.have.all.keys(
        "track_date",
        "count_number",
        "track_count_limit"
      )
      expect(response.body.response.track_count.track_date).to.be.an("string")
      expect(response.body.response.track_count.count_number).to.be.a("number")
      expect(response.body.response.track_count.track_count_limit).to.be.a(
        "number"
      )
      expect(response.body).to.have.property("message").to.be.a("string")
      expect(response.body).to.have.property("status").to.be.a("boolean")
    })
  })

  it("TC_Items_014: Retrieve fail: barcode is not sent: return 'value cannot be null or empty'", () => {
    cy.request({
      method: "POST",
      url: data.get_items,
      headers: {
        authorization: `Token ${data.valid_authen_token}`,
        "content-type": "application/json"
      },
      body: {
        status: "all",
        language: "EN"
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.be.eq(200)
      expect(response.body).have.property(
        "message",
        "value cannot be null or empty"
      )
      expect(response.body).have.property("status").to.be.a("boolean")
    })
  })

  it("TC_Items_015: Retrieve fail: barcode is sent as null", () => {
    cy.request({
      method: "POST",
      url: data.get_items,
      headers: {
        authorization: `Token ${data.valid_authen_token}`,
        "content-type": "application/json"
      },
      body: {
        status: "all",
        language: "EN",
        barcode: ""
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.be.eq(400)
    })
  })

  it("TC_Items_016: Retrieve fail: invalid barcode is sent: return track count", () => {
    cy.request({
      method: "POST",
      url: data.get_items,
      headers: {
        authorization: `Token ${data.valid_authen_token}`,
        "content-type": "application/json"
      },
      body: {
        status: "all",
        language: "EN",
        barcode: [data.invalid_tracking_no]
      }
    }).should((response) => {
      expect(response.status).to.be.eq(200)
      expect(response.body).to.have.property("response")
      expect(response.body.response).to.have.property("items")

      expect(response.body.response.items).to.have.property(
        data.invalid_tracking_no
      )
      expect(
        response.body.response.items[data.invalid_tracking_no].length
      ).to.eq(0)
    })
  })
})
