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

describe("Module Version Test", () => {
    it("should list 1 ModuleVersionTest on /api/ModuleVersionTests", (done) => {
        let filter = {where: {arch: "Arch1"}};
        chai
          .request(server)
          .get(`/api/ModuleVersionTests`)
          .set('Authorization', testToken)
          .set('filter', JSON.stringify(filter))
          .end((err, res) => {
            expect(res).to.have.status(200);
            let resp = JSON.parse(res.text);
            expect(resp).to.be.an('array').and.have.length(1);
            done();
          });
    });
    it("should fail to add ModuleVersionTest as Invalid Architecture", (done) => {
        chai
          .request(server)
          .post(`/api/ModuleVersionTests`)
          .set('Authorization', testToken)
          .send({
              "arch": "InvalidArch",
              "distro": "Distro1",
              "os": "OS1",
              "node_version": "1.1.1",
              "module": "Module1",
              "module_version": "1.1.3",
              "code_coverage": 0,
              "passed": false
          })
          .end((err, res) => {
            expect(res).to.have.status(422);
            done();
          });
    });
    it("should list 1 ModuleVersionTest on /api/ModuleVersionTests", (done) => {
        let filter = {where: {distro: "Distro1"}};
        chai
          .request(server)
          .get(`/api/ModuleVersionTests`)
          .set('Authorization', testToken)
          .set('filter', JSON.stringify(filter))
          .end((err, res) => {
            expect(res).to.have.status(200);
            let resp = JSON.parse(res.text);
            expect(resp).to.be.an('array').and.have.length(1);
            done();
          });
    });
    it("should fail to add ModuleVersionTest as Invalid Distribution", (done) => {
        chai
          .request(server)
          .post(`/api/ModuleVersionTests`)
          .set('Authorization', testToken)
          .send({
              "arch": "Arch1",
              "distro": "InvalidDistro",
              "os": "OS1",
              "node_version": "1.1.1",
              "module": "Module1",
              "module_version": "1.1.3",
              "code_coverage": 0,
              "passed": false
          })
          .end((err, res) => {
            expect(res).to.have.status(422);
            done();
          });
    });
    it("should list 1 ModuleVersionTest on /api/ModuleVersionTests", (done) => {
        let filter = {where: {os: "OS1"}};
        chai
          .request(server)
          .get(`/api/ModuleVersionTests`)
          .set('Authorization', testToken)
          .set('filter', JSON.stringify(filter))
          .end((err, res) => {
            expect(res).to.have.status(200);
            let resp = JSON.parse(res.text);
            expect(resp).to.be.an('array').and.have.length(1);
            done();
          });
    });
    it("should fail to add ModuleVersionTest as Invalid Operating System", (done) => {
        chai
          .request(server)
          .post(`/api/ModuleVersionTests`)
          .set('Authorization', testToken)
          .send({
              "arch": "Arch1",
              "distro": "Distro1",
              "os": "InvalidOS",
              "node_version": "1.1.1",
              "module": "Module1",
              "module_version": "1.1.3",
              "code_coverage": 0,
              "passed": false
          })
          .end((err, res) => {
            expect(res).to.have.status(422);
            done();
          });
    });
    it("should list 3 ModuleVersionTest on /api/ModuleVersionTests", (done) => {
        let filter = {where: {node_version: "1.1.1"}};
        chai
          .request(server)
          .get(`/api/ModuleVersionTests`)
          .set('Authorization', testToken)
          .set('filter', JSON.stringify(filter))
          .end((err, res) => {
            expect(res).to.have.status(200);
            let resp = JSON.parse(res.text);
            expect(resp).to.be.an('array').and.have.length(3);
            done();
          });
    });
    it("should fail to add ModuleVersionTest as Invalid NodeVersion", (done) => {
        chai
          .request(server)
          .post(`/api/ModuleVersionTests`)
          .set('Authorization', testToken)
          .send({
              "arch": "Arch1",
              "distro": "Distro1",
              "os": "OS1",
              "node_version": "2.0.0",
              "module": "Module1",
              "module_version": "1.1.3",
              "code_coverage": 0,
              "passed": false
          })
          .end((err, res) => {
            expect(res).to.have.status(422);
            done();
          });
    });
    it("should list 3 ModuleVersionTest on /api/ModuleVersionTests", (done) => {
        let filter = {where: {module: "Module1", module_version: "1.1.1"}};
        chai
          .request(server)
          .get(`/api/ModuleVersionTests`)
          .set('Authorization', testToken)
          .set('filter', JSON.stringify(filter))
          .end((err, res) => {
            expect(res).to.have.status(200);
            let resp = JSON.parse(res.text);
            expect(resp).to.be.an('array').and.have.length(3);
            done();
          });
    });
    it("should fail to add ModuleVersionTest as Invalid ModuleVersion", (done) => {
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
              "module_version": "InvalidModuleVersion",
              "code_coverage": 0,
              "passed": false
          })
          .end((err, res) => {
            expect(res).to.have.status(422);
            done();
          });
    });
});
