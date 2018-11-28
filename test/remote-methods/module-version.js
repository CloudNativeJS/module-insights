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

describe("ModuleVersion", () => {
    it("should list the latest module version on /api/ModuleVersions/:module_name/latest GET", (done) => {
        chai
            .request(server)
            .get(`/api/ModuleVersions/Module1/latest`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const resp = JSON.parse(res.text);
                expect(resp).to.be.an('object');
                expect(resp).to.deep.equal({
                    latest: {
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
    it("should list the latest module version for a given major version on /api/ModuleVersions/:module_name/latest GET", (done) => {
        chai
            .request(server)
            .get(`/api/ModuleVersions/Module1/latest`)
            .query({module_major_version: "1.x"})
            .end((err, res) => {
                expect(res).to.have.status(200);
                const resp = JSON.parse(res.text);
                expect(resp).to.be.an('object');
                expect(resp).to.deep.equal({
                    latest: {
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
