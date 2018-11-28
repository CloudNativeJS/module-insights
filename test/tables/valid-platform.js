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

describe("ValidPlatform", () => {
    it("should list 0 ValidPlatforms on /api/ValidPlatforms GET", (done) => {
      chai
        .request(server)
        .get('/api/ValidPlatforms')
        .end((err, res) => {
          expect(res).to.have.status(200);
          let resp = JSON.parse(res.text);
          expect(resp).to.be.an('array').and.have.length(0);
          done();
        });
    });
    it("should fail to add empty ValidPlatform on /api/ValidPlatforms POST", (done) => {
      chai
        .request(server)
        .post(`/api/ValidPlatforms`)
        .set('Authorization', testToken)
        .end((err, res) => {
          expect(res).to.have.status(422);
          done();
        });
    });
    for (let i = 1; i <= 3; i++) {
      it("should add 1 ValidPlatform on /api/ValidPlatforms POST", (done) => {
        chai
          .request(server)
          .post(`/api/ValidPlatforms`)
          .set('Authorization', testToken)
          .send({
              "os": "OS" + i,
              "arch": "Arch" + i,
              "distro": "Distro" + i
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
    }
    it("should list 3 ValidPlatforms on /api/ValidPlatforms GET", (done) => {
      chai
        .request(server)
        .get('/api/ValidPlatforms')
        .end((err, res) => {
          expect(res).to.have.status(200);
          let resp = JSON.parse(res.text);
          expect(resp).to.be.an('array').and.have.length(3);
          done();
        });
    });
    it("should fail to add duplicate ValidPlatform on /api/ValidPlatforms POST", (done) => {
       chai
        .request(server)
        .post(`/api/ValidPlatforms`)
        .set('Authorization', testToken)
        .send({
            "os": "OS1",
            "arch": "Arch1",
            "distro": "Distro1"
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          done();
        });
    });
    it("should add 1 ValidPlatform to be used in PATCH test", (done) => {
      chai
        .request(server)
        .post(`/api/ValidPlatforms`)
        .set('Authorization', testToken)
        .send({
            "os": "OS1",
            "arch": "Arch2",
            "distro": "Distro3"
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
    const patchData = {
        "os": "OS5",
        "arch": "Arch5",
        "distro": "Distro5",
        "id": 4
    }
    it("should PATCH ValidPlatform on /api/ValidPlatforms PATCH", (done) => {
      chai
        .request(server)
        .patch(`/api/ValidPlatforms`)
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
