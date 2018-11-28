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

describe("LTSVersion", () => {
    it("should list the latest Node Version for each LTS on /api/LTSVersions/latestNodeVersion GET", (done) => {
        chai
            .request(server)
            .get(`/api/LTSVersions/latestNodeVersion`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const resp = JSON.parse(res.text);
                expect(resp).to.be.an('array').and.have.length(4);
                expect(resp[0]).to.deep.equal({
                  lts_version: 1, id: 1, latestNodeVersion: '1.1.5'
                });
                done();
            });
    });
    it("should return the latest LTSVersion on /api/LTSVersions/latest GET", (done) => {
        chai
            .request(server)
            .get(`/api/LTSVersions/latest`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const resp = JSON.parse(res.text);
                expect(resp).to.be.an('object');
                expect(resp).to.deep.equal({ latest: { lts_version: 5, id: 4 } });
                done();
            });
    });
});
