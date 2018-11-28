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

const tables = [
  'Architecture', 'Distribution', 'LTSVersion', 'Module', 'ModuleRecommendedLTS',
  'ModuleVersion', 'ModuleVersionTest', 'NodeVersion', 'OperatingSystem', 'ValidPlatform'
];

describe("Auth", () => {
  for (let table of tables) {
    it(`should fail to add ${table} on /api/${table}s POST because no token`, (done) => {
      chai
        .request(server)
        .post(`/api/${table}s`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
    it(`should fail to add ${table} on /api/${table}s POST because invalid token`, (done) => {
      chai
        .request(server)
        .post(`/api/${table}s`)
        .set('Authorization', "fake-token")
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
    it(`should fail to add ${table} on /api/${table}s POST token in query string`, (done) => {
      chai
        .request(server)
        .post(`/api/${table}s?access_token=${testToken}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
    it(`should not be able to DELETE on /api/${table}s/:id as test role`, (done) => {
      chai
        .request(server)
        .delete(`/api/${table}s/1`)
        .set('Authorization', testToken)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
    it(`should not be able to PATCH on /api/${table}s as test role`, (done) => {
      chai
        .request(server)
        .patch(`/api/${table}s`)
        .set('Authorization', testToken)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  }
});
