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

// TODO : make sure it works then enable Travise CI

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server/server");
const expect = chai.expect;

chai.use(chaiHttp);

async function auth(username, user_role, email, password) {
  const User = server.models.User;
  const Role = server.models.Role;
  const RoleMapping = server.models.RoleMapping;
  const user = await User.create({ username, email, password });
  const role = await Role.create({ name: user_role });
  await role.principals.create({
    principalType: RoleMapping.USER,
    principalId: user.id
  });
  const login = await User.login({ email, password});
  return login.id;
}

function importTest(name, path) {
  describe("", function () {
    require(path);
  });
}

describe("Main", () => {
  let users = [
    {name: "test", role: "test", email: "test@gmail.com", password: "test"},
    {name: "admin", role: "admin", email: "admin@gmail.com", password: "admin"},
  ];
  for (let user of users) {
    it("should create an authorised token", (done) => {
      const token = auth(user.name, user.role, user.email, user.password);
      token.then((res) => {
        expect(res).to.not.equal(null);
        if (user.name === "test") {
          process.env.TEST_TOKEN = res;
        } else {
          process.env.ADMIN_TOKEN = res;
        }
        done();
      });
    });
  }

  describe("Priority", () => {
    it("node version priority", (done) => {
      importTest(
        "node version priority",
        "./remote-methods/node-version-priority"
      );
      done();
    });
  });

  const tables = [
    "auth", "architecture", "distribution", "operating-system", "lts-version",
    "module", "module-recommended-lts", "module-version", "dep-module-version",
    "node-version", "valid-platform", "module-version-test"
  ];

  describe("Tables", () => {
    for (let table of tables) {
      it(table.replace(/-/g, " "), (done) => {
        importTest(table.replace(/-/g, " "), `./tables/${table}`);
        done();
      });
    }
  });

  const relations = [
    "node-version", "module-recommended-lts", "module-version-test",
    "module-version", "valid-platform"
  ];

  describe("Relations", () => {
    for (let relation of relations) {
      it(relation.replace(/-/g, " "), (done) => {
        importTest(relation.replace(/-/g, " "), `./relations/${relation}`);
        done();
      });
    }
  });

  const methods = [
    "dep-module-version",
    "lts-version",
    "module-version",
    "module",
    "node-version"
  ];

  describe("Remote Methods", () => {
    for (let method of methods) {
      it(method.replace(/-/g, " "), (done) => {
        importTest(method.replace(/-/g, " "), `./remote-methods/${method}`);
        done();
      });
    }
  });
});
