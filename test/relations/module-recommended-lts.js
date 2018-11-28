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

chai.use(chaiHttp);

describe("Module Recommended LTS", () => {
    it("should list 2 ModuleRecommendedLTSs on /api/ModuleRecommendedLTSs", (done) => {
        let filter = {where: {lts_version: 1}};
        chai
          .request(server)
          .get(`/api/ModuleRecommendedLTSs`)
          .set('Authorization', testToken)
          .set('filter', JSON.stringify(filter))
          .end((err, res) => {
            expect(res).to.have.status(200);
            let resp = JSON.parse(res.text);
            expect(resp).to.be.an('array').and.have.length(2);
            done();
          });
    });
    it("should fail to add ModuleRecommendedLTS as invalid LTSVersion on /api/ModuleRecommendedLTSs POST", (done) => {
        chai
          .request(server)
          .post(`/api/ModuleRecommendedLTSs`)
          .set('Authorization', testToken)
          .send({
              "lts_version": 100,
              "module": "Module2",
              "recommended_version": "0.3"
          })
          .end((err, res) => {
            expect(res).to.have.status(422);
            done();
          });
    });
    it("should list 0 ModuleRecommendedLTSs as no Module /api/ModuleRecommendedLTSs", (done) => {
        let filter = {where: {module: "Module3"}};
        chai
          .request(server)
          .get(`/api/ModuleRecommendedLTSs`)
          .set('Authorization', testToken)
          .set('filter', JSON.stringify(filter))
          .end((err, res) => {
            expect(res).to.have.status(200);
            let resp = JSON.parse(res.text);
            expect(resp).to.be.an('array').and.have.length(0);
            done();
          });
    });
    it("should list 3 ModuleRecommendedLTSs /api/ModuleRecommendedLTSs", (done) => {
        let filter = {where: {module: "Module1"}};
        chai
          .request(server)
          .get(`/api/ModuleRecommendedLTSs`)
          .set('Authorization', testToken)
          .set('filter', JSON.stringify(filter))
          .end((err, res) => {
            expect(res).to.have.status(200);
            let resp = JSON.parse(res.text);
            expect(resp).to.be.an('array').and.have.length(3);
            done();
          });
    });
    it("should fail to add ModuleRecommendedLTS as invalid Module on /api/ModuleRecommendedLTSs POST", (done) => {
        chai
          .request(server)
          .post(`/api/ModuleRecommendedLTSs`)
          .set('Authorization', testToken)
          .send({
              "lts_version": 2,
              "module": "NotAModule",
              "recommended_version": "0.3"
          })
          .end((err, res) => {
            expect(res).to.have.status(422);
            done();
          });
    });
    it("should fail to get ModuleRecommendedLTS as no module", (done) => {
      let filter = {
        where: {
          "module": "Invalid"
        }
      };
        chai
          .request(server)
          .get(`/api/ModuleRecommendedLTSs`)
          .set('Authorization', testToken)
          .set('filter', JSON.stringify(filter))
          .end((err, res) => {
            expect(res).to.have.status(422);
            done();
          });
    });
    it("should fail to get ModuleRecommendedLTS as no lts_version", (done) => {
      let filter = {
        where: {
          "module": "Module1",
          "lts_version": 100
        }
      };
        chai
          .request(server)
          .get(`/api/ModuleRecommendedLTSs`)
          .set('Authorization', testToken)
          .set('filter', JSON.stringify(filter))
          .end((err, res) => {
            expect(res).to.have.status(422);
            done();
          });
    });
});
