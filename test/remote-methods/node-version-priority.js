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

describe("NodeVersion Priority", () => {
    it("should return null if there is no NodeVersion for an LTS on /api/NodeVersions/latest", (done) => {
        chai
            .request(server)
            .get(`/api/NodeVersions/latest`)
            .set('lts', 1)
            .end((err, res) => {
                expect(res).to.have.status(200);
                let resp = JSON.parse(res.text);
                expect(resp).to.deep.equal({
                  "latest": null
                });
                done();
            });
    });
});
