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

describe("ModuleVersionTest", () => {
    it("should list 0 ModuleVersionTests on /api/ModuleVersionTests GET", (done) => {
      chai
        .request(server)
        .get('/api/ModuleVersionTests')
        .end((err, res) => {
          expect(res).to.have.status(200);
          let resp = JSON.parse(res.text);
          expect(resp).to.be.an('array').and.have.length(0);
          done();
        });
    });
    it("should fail to add empty ModuleVersionTest on /api/ModuleVersionTests POST", (done) => {
      chai
        .request(server)
        .post(`/api/ModuleVersionTests`)
        .set('Authorization', testToken)
        .end((err, res) => {
          expect(res).to.have.status(422);
          done();
        });
    });
    for (let i = 1; i <= 3; i++) {
      it("should add 1 ModuleVersionTest on /api/ModuleVersionTests POST", (done) => {
        chai
        .request(server)
        .post(`/api/ModuleVersionTests`)
        .set('Authorization', testToken)
        .send({
            "arch": "Arch" + i,
            "distro": "Distro" + i,
            "os": "OS" + i,
            "node_version": "1.1.1",
            "module": "Module1",
            "module_version": "1.1.1",
            "code_coverage": 10 * i,
            "passed": true
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
      });
    }
    it("should list 3 ModuleVersionTests on /api/ModuleVersionTests GET", (done) => {
      chai
        .request(server)
        .get('/api/ModuleVersionTests')
        .end((err, res) => {
          expect(res).to.have.status(200);
          let resp = JSON.parse(res.text);
          expect(resp).to.be.an('array').and.have.length(3);
          done();
        });
    });
    it("should fail to add duplicate ModuleVersionTest on /api/ModuleVersionTests POST", (done) => {
       chai
        .request(server)
        .post(`/api/ModuleVersionTests`)
        .set('Authorization', testToken)
        .send({
            "arch": "Arch1",
            "distro": "Distro1",
            "os": "OS1",
            "node_version": "1.1.1",
            "module": "Module1",
            "module_version": "1.1.1",
            "code_coverage": 10,
            "passed": true
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          done();
        });
    });
    const patchData = {
        "arch_id": 1,
        "distro_id": 1,
        "os_id": 1,
        "node_version_id": 1,
        "module_version_id": 1,
        "code_coverage": 100,
        "passed": true,
        "id": 1
    }
    it("should PATCH ModuleVersionTest on /api/ModuleVersionTests PATCH", (done) => {
      chai
        .request(server)
        .patch(`/api/ModuleVersionTests`)
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
