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

describe("Module", () => {
    it("should list the latest module version for each module /api/Modules/latestModuleVersion GET", (done) => {
        chai
            .request(server)
            .get(`/api/Modules/latestModuleVersion`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const resp = JSON.parse(res.text);
                expect(resp).to.be.an('array').and.have.length(4);
                expect(resp[0]).to.deep.equal({
                    name: 'Module1',
                    tags: null,
                    stability: 'stable',
                    "ModuleRecommendedLTS": [
                      {
                        "LTSVersion": {
                          "id": 1,
                          "lts_version": 1
                        },
                        "id": 1,
                        "lts_version_id": 1,
                        "module_id": 1,
                        "recommended_version": "0.1"
                      },
                      {
                        "LTSVersion": {
                          "id": 2,
                          "lts_version": 2
                        },
                        "id": 2,
                        "lts_version_id": 2,
                        "module_id": 1,
                        "recommended_version": "0.1"
                      },
                      {
                        "LTSVersion": {
                          "id": 3,
                          "lts_version": 3
                        },
                        "id": 3,
                        "lts_version_id": 3,
                        "module_id": 1,
                        "recommended_version": "0.1"
                      }
                    ],
                    commercial_support: null,
                    id: 1,
                    latestModuleVersion: {
                        module_id: 1,
                        module_major_version: '1.x',
                        module_version: '1.1.5',
                        license: 'MIT',
                        deps_ids: null,
                        deps_licenses: null,
                        deps_licenses_count: null,
                        timestamp: '2018-07-10T13:30:45.734Z',
                        id: 4
                    }
                });
                done();
            });
    });
});
