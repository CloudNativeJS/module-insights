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

describe("Node Version", () => {
    it("should list 4 NodeVersions for LTS on /api/NodeVersions", (done) => {
        let filter = {where: {lts_version: 1}}
        chai
          .request(server)
          .get(`/api/NodeVersions`)
          .set('Authorization', testToken)
          .set('filter', JSON.stringify(filter))
          .end((err, res) => {
            expect(res).to.have.status(200);
            let resp = JSON.parse(res.text);
            expect(resp).to.be.an('array').and.have.length(4);
            done();
          });
    });
    it("should fail to add NodeVersion to invalid LTSVersion /api/NodeVersions POST", (done) => {
        chai
          .request(server)
          .post(`/api/NodeVersions`)
          .set('Authorization', testToken)
          .send({
              "node_version": 4,
              "lts_version": 100
          })
          .end((err, res) => {
            expect(res).to.have.status(422);
            done();
          });
    });
});
