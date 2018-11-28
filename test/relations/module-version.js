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

describe("Module Version", () => {
    it("should list 4 ModuleVersion on /api/ModuleVersions", (done) => {
        let filter = {where: {module: "Module1"}};
        chai
          .request(server)
          .get(`/api/ModuleVersions`)
          .set('Authorization', testToken)
          .set('filter', JSON.stringify(filter))
          .end((err, res) => {
            expect(res).to.have.status(200);
            let resp = JSON.parse(res.text);
            expect(resp).to.be.an('array').and.have.length(4);
            done();
          });
    })
    it("should fail to add ModuleVersion as Invalid Module", (done) => {
        chai
          .request(server)
          .post(`/api/ModuleVersions`)
          .set('Authorization', testToken)
          .send({
              "module": "InvalidModule",
              "module_major_version": "1",
              "module_version": "1.1.3",
              "license": "MIT",
              "min_dep_license": "GPL",
              "timestamp": "2018-07-10T13:30:45.734Z"
          })
          .end((err, res) => {
            expect(res).to.have.status(422);
            done();
          });
    });
    it("should fail to get module version on /api/ModuleVersions", (done) => {
      let filter = {where: {module: "Invalid"}};
      chai
        .request(server)
        .get(`/api/ModuleVersions`)
        .set('Authorization', testToken)
        .set('filter', JSON.stringify(filter))
        .end((err, res) => {
          expect(res).to.have.status(422);
          done();
        });
  })
});
