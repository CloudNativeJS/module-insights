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

describe("NodeVersion", () => {
    it("should list 0 NodeVersions on /api/NodeVersions GET", (done) => {
      chai
        .request(server)
        .get('/api/NodeVersions')
        .end((err, res) => {
          expect(res).to.have.status(200);
          let resp = JSON.parse(res.text);
          expect(resp).to.be.an('array').and.have.length(0);
          done();
        });
    });
    it("should fail to add empty NodeVersion on /api/NodeVersions POST", (done) => {
      chai
        .request(server)
        .post(`/api/NodeVersions`)
        .set('Authorization', testToken)
        .end((err, res) => {
          expect(res).to.have.status(422);
          done();
        });
    });
    for (let i = 1; i <= 4; i++) {
      it("should add 1 NodeVersion on /api/NodeVersions POST", (done) => {
        chai
          .request(server)
          .post(`/api/NodeVersions`)
          .set('Authorization', testToken)
          .send({
              "node_version": "1.1." + i,
              "lts_version": 1
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
    }
    it("should list 4 NodeVersions on /api/NodeVersions GET", (done) => {
      chai
        .request(server)
        .get('/api/NodeVersions')
        .end((err, res) => {
          expect(res).to.have.status(200);
          let resp = JSON.parse(res.text);
          expect(resp).to.be.an('array').and.have.length(4);
          done();
        });
    });
    it("should fail to add duplicate NodeVersion on /api/NodeVersions POST", (done) => {
       chai
        .request(server)
        .post(`/api/NodeVersions`)
        .set('Authorization', testToken)
        .send({
            "node_version": "1.1.1",
            "lts_version": 1
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          done();
        });
    });
    const patchData = {
      "node_version": "1.1.5",
      "lts_version": 1,
      "id": 4
    }
    const patchResponse = {
      "node_version": "1.1.5",
      "lts_version": 1,
      "lts_version_id": 1,
      "id": 4
    }
    it("should PATCH NodeVersion on /api/NodeVersions PATCH", (done) => {
      chai
        .request(server)
        .patch(`/api/NodeVersions`)
        .set('Authorization', adminToken)
        .send(patchData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          let resp = JSON.parse(res.text);
          expect(resp).to.be.an('object');
          expect(resp).to.deep.equal(patchResponse);
          done();
        });
    });
});
