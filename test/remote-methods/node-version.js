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

describe("NodeVersion", () => {
    it("should add a latest node version on the latest LTS for next test.", (done) => {
        chai
            .request(server)
            .post(`/api/NodeVersions`)
            .set('Authorization', testToken)
            .send({
                "node_version": "5.1.1",
                "lts_version": 5
            })
            .end((err, res) => {
              expect(res).to.have.status(200);
              done();
            });
    });
    it("should list the lastest Node Version per LTS on /api/NodeVersions/latest GET", (done) => {
        chai
            .request(server)
            .get(`/api/NodeVersions/latest`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const resp = JSON.parse(res.text);
                expect(resp).to.deep.equal({
                    latest: {
                        node_version: '5.1.1',
                        lts_version_id: 4,
                        id: 5
                    }
                });
                done();
            });
    });
});
