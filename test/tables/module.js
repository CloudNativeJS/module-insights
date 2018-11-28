"use strict";

/***************************************************************************
*
* (C) Copyright IBM Corp. 2018
*
*  This program and the accompanying materials are made available
*  under the terms of the Apache License v2.0 which accompanies
*  this distribution.
*
*      The Apache License v2.0 is available at
*      http://www.opensource.org/licenses/apache2.0.php
*
* Contributors:
*   Multiple authors (IBM Corp.) - initial implementation and documentation
***************************************************************************/



const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../server/server");
const expect = chai.expect;
const testToken = process.env.TEST_TOKEN;
const adminToken = process.env.ADMIN_TOKEN;

chai.use(chaiHttp);

describe("Module", () => {
    it("should list 0 Modules on /api/Modules GET", (done) => {
      chai
        .request(server)
        .get('/api/Modules')
        .end((err, res) => {
          expect(res).to.have.status(200);
          let resp = JSON.parse(res.text);
          expect(resp).to.be.an('array').and.have.length(0);
          done();
        });
    });
    it("should fail to add empty Module on /api/Modules POST", (done) => {
      chai
        .request(server)
        .post(`/api/Modules`)
        .set('Authorization', testToken)
        .end((err, res) => {
          expect(res).to.have.status(422);
          done();
        });
    });
    for (let i = 1; i <= 4; i++) {
      it("should add 1 Module on /api/Modules POST", (done) => {
        chai
          .request(server)
          .post(`/api/Modules`)
          .set('Authorization', testToken)
          .send({
              "name": "Module" + i,
              "stability": "stable"
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
    }
    it("should list 4 Modules on /api/Modules GET", (done) => {
      chai
        .request(server)
        .get('/api/Modules')
        .end((err, res) => {
          expect(res).to.have.status(200);
          let resp = JSON.parse(res.text);
          expect(resp).to.be.an('array').and.have.length(4);
          done();
        });
    });
    it("should fail to add duplicate Module on /api/Modules POST", (done) => {
       chai
        .request(server)
        .post(`/api/Modules`)
        .set('Authorization', testToken)
        .send({
            "name": "Module1",
            "stability": "stable"
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          done();
        });
    });
    const patchData = {
      "name": "Module5",
      "commercial_support": null,
      "stability": "stable",
      "tags": null,
      "id": 4
    }
    it("should PATCH Module on /api/Modules PATCH", (done) => {
      chai
        .request(server)
        .patch(`/api/Modules`)
        .set('Authorization', adminToken)
        .send(patchData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          let resp = JSON.parse(res.text);
          expect(resp).to.be.an('object');
          expect(resp).to.deep.equal(patchData);
          done();
        });
    });
});
