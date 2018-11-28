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

describe("ModuleVersion", () => {
    it("should list 0 ModuleVersions on /api/ModuleVersions GET", (done) => {
      chai
        .request(server)
        .get('/api/ModuleVersions')
        .end((err, res) => {
          expect(res).to.have.status(200);
          let resp = JSON.parse(res.text);
          expect(resp).to.be.an('array').and.have.length(0);
          done();
        });
    });
    it("should fail to add empty ModuleVersion on /api/ModuleVersions POST", (done) => {
      chai
        .request(server)
        .post(`/api/ModuleVersions`)
        .set('Authorization', testToken)
        .end((err, res) => {
          expect(res).to.have.status(422);
          done();
        });
    });
    for (let i = 1; i <= 4; i++) {
      it("should add 1 ModuleVersion on /api/ModuleVersions POST", (done) => {
        chai
          .request(server)
          .post(`/api/ModuleVersions`)
          .set('Authorization', testToken)
          .send({
              "module": "Module1",
              "module_major_version": "1.x",
              "module_version": "1.1." + i,
              "license": "MIT",
              "min_dep_license": "GPL",
              "timestamp": "2018-07-10T13:30:45.734Z"
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
    }
    it("should list 4 ModuleVersions on /api/ModuleVersions GET", (done) => {
      chai
        .request(server)
        .get('/api/ModuleVersions')
        .end((err, res) => {
          expect(res).to.have.status(200);
          let resp = JSON.parse(res.text);
          expect(resp).to.be.an('array').and.have.length(4);
          done();
        });
    });
    it("should fail to add duplicate ModuleVersion on /api/ModuleVersions POST", (done) => {
       chai
        .request(server)
        .post(`/api/ModuleVersions`)
        .set('Authorization', testToken)
        .send({
            "module": "Module1",
            "module_major_version": "1.x",
            "module_version": "1.1.1",
            "license": "MIT",
            "min_dep_license": "GPL",
            "timestamp": "2018-07-10T13:30:45.734Z"
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          done();
        });
    });
    const patchData = {
        "module": "Module1",
        "module_major_version": "1.x",
        "module_version": "1.1.5",
        "license": "MIT",
        "min_dep_license": "GPL",
        "timestamp": "2018-07-10T13:30:45.734Z",
        "id": 4
    }
    const patchResponse = {
        "module": "Module1",
        "module_major_version": "1.x",
        "module_version": "1.1.5",
        "license": "MIT",
        "min_dep_license": "GPL",
        "timestamp": "2018-07-10T13:30:45.734Z",
        "id": 4,
        "deps_ids": null,
        "deps_licenses": null,
        "deps_licenses_count": null,
        "module_id": 1
    }
    it("should PATCH ModuleVersion on /api/ModuleVersions PATCH", (done) => {
      chai
        .request(server)
        .patch(`/api/ModuleVersions`)
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
