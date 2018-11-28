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

describe("Dep Module Version", () => {
    it("should list 4 DepModuleVersions on /api/DepModuleVersions", (done) => {
        chai
            .request(server)
            .get(`/api/DepModuleVersions`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const resp = JSON.parse(res.text);
                expect(resp).to.be.an('array').and.have.length(4);
                done();
            });
    });
    it("should add 3 DepModuleVersions on /api/DepModuleVersions/add", (done) => {
        chai
            .request(server)
            .post(`/api/DepModuleVersions/add`)
            .set('Authorization', testToken)
            .send({
              obj: {
                "Module1@1.1.4": "GPL",
                "Module1@1.1.5": "GPL",
                "Module1@1.1.6": "GPL"
                }
              })
            .end((err, res) => {
                expect(res).to.have.status(200);
                const resp = JSON.parse(res.text)
                expect(resp).to.deep.equal({ ids: '5, 6, 7', licenses: 'GPL [3]', licenses_count: 1 });
                done();
            });
    });
    it("should fail to add DepModuleVersion on /api/DepModuleVersions/add", (done) => {
        chai
            .request(server)
            .post(`/api/DepModuleVersions/add`)
            .set('Authorization', testToken)
            .send({
              obj: {
                  "Invalid": "Invalid"
              }
            })
            .end((err, res) => {
                expect(res).to.have.status(422);
                done();
            });
    });
});
