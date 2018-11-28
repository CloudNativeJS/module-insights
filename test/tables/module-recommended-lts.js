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

describe("ModuleRecommendedLTS", () => {
    it("should list 0 ModuleRecommendedLTSs on /api/ModuleRecommendedLTSs GET", (done) => {
      chai
        .request(server)
        .get('/api/ModuleRecommendedLTSs')
        .end((err, res) => {
          expect(res).to.have.status(200);
          let resp = JSON.parse(res.text);
          expect(resp).to.be.an('array').and.have.length(0);
          done();
        });
    });
    it("should fail to add empty ModuleRecommendedLTS on /api/ModuleRecommendedLTSs POST", (done) => {
      chai
        .request(server)
        .post(`/api/ModuleRecommendedLTSs`)
        .set('Authorization', testToken)
        .end((err, res) => {
          expect(res).to.have.status(422);
          done();
        });
    });
    for (let i = 1; i <= 3; i++) {
      it("should add 1 ModuleRecommendedLTS on /api/ModuleRecommendedLTSs POST", (done) => {
        chai
          .request(server)
          .post(`/api/ModuleRecommendedLTSs`)
          .set('Authorization', testToken)
          .send({
              "lts_version": i,
              "module": "Module1",
              "recommended_version": "0.1"
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
    }
    it("should list 3 ModuleRecommendedLTSs on /api/ModuleRecommendedLTSs GET", (done) => {
      chai
        .request(server)
        .get('/api/ModuleRecommendedLTSs')
        .end((err, res) => {
          expect(res).to.have.status(200);
          let resp = JSON.parse(res.text);
          expect(resp).to.be.an('array').and.have.length(3);
          done();
        });
    });
    it("should fail to add duplicate ModuleRecommendedLTS on /api/ModuleRecommendedLTSs POST", (done) => {
       chai
        .request(server)
        .post(`/api/ModuleRecommendedLTSs`)
        .set('Authorization', testToken)
        .send({
            "lts_version": 1,
            "module": "Module1",
            "recommended_version": "0.1"
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          done();
        });
    });
    it("should fail to add ModuleRecommendedLTS with no LTS given on /api/ModuleRecommendedLTSs POST", (done) => {
      chai
       .request(server)
       .post(`/api/ModuleRecommendedLTSs`)
       .set('Authorization', testToken)
       .send({
         "lts_version": 1
       })
       .end((err, res) => {
         expect(res).to.have.status(422);
         done();
       });
   });
   it("should add 1 ModuleRecommendedLTS to be used in PATCH test", (done) => {
     chai
       .request(server)
       .post(`/api/ModuleRecommendedLTSs`)
       .set('Authorization', testToken)
       .send({
           "lts_version_id": 1,
           "module_id": 2,
           "recommended_version": "0.1"
       })
       .end((err, res) => {
         expect(res).to.have.status(200);
         done();
       });
   });
   const patchData = {
       "lts_version_id": 1,
       "module_id": 2,
       "recommended_version": "0.2",
       "id": 4
   }
   it("should PATCH ModuleRecommendedLTS on /api/ModuleRecommendedLTSs PATCH", (done) => {
     chai
       .request(server)
       .patch(`/api/ModuleRecommendedLTSs`)
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
