'use strict';

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

const request = require('request')

module.exports = function (server) {
  const router = server.loopback.Router();
  const LTSVersion = server.models.LTSVersion;
  const NodeVersion = server.models.NodeVersion;
  const Architecture = server.models.Architecture;
  const Distribution = server.models.Distribution;
  const OperatingSystem = server.models.OperatingSystem;
  const Module = server.models.Module;
  const ModuleVersion = server.models.ModuleVersion;
  const ModuleVersionTest = server.models.ModuleVersionTest;
  const ModuleRecommendedLTS = server.models.ModuleRecommendedLTS;
  const ValidPlatform = server.models.ValidPlatform;

  const app_version = require('../../package.json').version;

  let ARCH = {};
  let OS = {};
  let DISTRO = {};
  let VALIDPLATFORM;
  let LTS_VERSIONS = [];
  let LATEST_NODE_VERSIONS;
  let validPlatformsStr;

  //TODO: Remove when stored in db.
  const commercial_support = require('../../client/public/json/commercial_support.json');

  const getDate = (timestamp) => {
    let t = timestamp.toISOString().replace(/T/, ' ');
    t = t.substring(0, t.lastIndexOf(':'));
    return t;
  }

  let last_scanned = getDate(new Date());

  router.get('/', async (req, res, next) => {

    // if no platforms exist, load error page
    if (VALIDPLATFORM.length == 0) {
      res.render('error', {
        "error_code": 500
      });
    }

    let arch = req.query.arch;
    let distro = req.query.distro;

    // defaults to ubuntu-16.04&arch=x64
    if (ARCH[arch] == undefined || DISTRO[distro] == undefined) {
      res.redirect("/?distro=ubuntu-16.04&arch=x64");
    }

    //TODO: Should be a related table.
    let modules = await Module.latestModuleVersion();
    modules = JSON.parse(JSON.stringify(modules));


    for (let lts in LTS_VERSIONS) {
      let latestNodeVersion = LTS_VERSIONS[lts].latestNodeVersion.id;
      //TODO: provide latest version
      let moduleVersionTest = await ModuleVersionTest.find({
        where: {
          arch_id: ARCH[arch],
          distro_id: DISTRO[distro],
          node_version_id: latestNodeVersion
        },
        include: [{
          "ModuleVersion": "Module"
        }, {
          "NodeVersion": "LTSVersion"
        }]
      });

      moduleVersionTest = JSON.parse(JSON.stringify(moduleVersionTest));

      for (let test in moduleVersionTest) {
        let currentTest = moduleVersionTest[test];
        let modulesArr = modules;
        for (let module in modulesArr) {

          // check test results are not orphaned
          if (currentTest.ModuleVersion && currentTest.ModuleVersion.Module) {
            // match the test to a module via id's
            if (modulesArr[module].id == currentTest.ModuleVersion.Module.id) {
              let moduleLTSs = modulesArr[module].ModuleRecommendedLTS;
              for (let moduleLTS in moduleLTSs) {
                if (moduleLTSs[moduleLTS].lts_version_id == moduleVersionTest[test].NodeVersion.lts_version_id) {
                  if (modules[module].ModuleRecommendedLTS[moduleLTS].recommended_version == currentTest.ModuleVersion.module_major_version) {
                    modules[module].ModuleRecommendedLTS[moduleLTS].testResult = moduleVersionTest[test];
                  }
                }
              }
            }
          }
        }
      }
    }

    let lts_versions = LTS_VERSIONS;
    res.render("index", {
      modules,
      commercial_support,
      lts_versions,
      last_scanned,
      validPlatformsStr,
      app_version,
      arch,
      distro
    });
  });

  router.get('/module/:module_name', async (req, res, next) => {
    let module_name = req.params.module_name;
    let module_versions;
    // This try/catch block is catching an error if module doesn't exist
    try {
      module_versions = await ModuleVersion.find({
        where: {
          module: module_name
        }
      });
    } catch (e) {
      module_versions = [];
      console.log(e);
    }
    // Convert timestamp to a human readable string
    for (let i in module_versions) {
      module_versions[i].date = module_versions[i].timestamp ?
        getDate(new Date(module_versions[i].timestamp)) : "Not Available";
    }
    res.render("module-versions", {
      modules: module_versions,
      module_name,
      last_scanned,
      app_version
    });
  });

  router.get('/api/logs/:log_file', async (req, res, next) => {
    const log_file = req.params.log_file;
    const options = {
      method: 'GET',
      url: 'https://s3-api.us-geo.objectstorage.softlayer.net/module-insights-logs/' + log_file,
      //Takes a read only apikey
      headers: {
        'Cache-Control': 'no-cache',
        apikey: "psWy8RD6svFWlglHOIMVFUhOhfVOg4ZIaP7CwofrIhRt"
      }
    };

    request(options, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        res.send("No log file available")
      } else {
        res.send(body);
      }
    });
  });

  router.get('/logs/:log_file', async (req, res, next) => {
    const log_file = req.params.log_file;
    const options = {
      method: 'GET',
      url: 'https://s3-api.us-geo.objectstorage.softlayer.net/module-insights-logs/' + log_file,
      //Takes a read only apikey
      headers: {
        'Cache-Control': 'no-cache',
        apikey: "psWy8RD6svFWlglHOIMVFUhOhfVOg4ZIaP7CwofrIhRt"
      }
    };

    request(options, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        res.send("No log file available")
      } else {
        res.render("log", {
          body
        });
      }
    });
  });

  router.get('/module/:module_name/module_version/:module_version', async (req, res, next) => {
    let module_name = req.params.module_name;
    let module_version = req.params.module_version;
    let module_version_tests;
    // This try/catch block is catching an error if module or module version doesn't exist
    try {
      module_version_tests = await ModuleVersionTest.find({
        where: {
          module: module_name,
          module_version: module_version
        },
        include: ["OperatingSystem", "Architecture", "Distribution", "NodeVersion"]
      });
    } catch (e) {
      module_version_tests = [];
      console.log(e);
    }
    for (let i in module_version_tests) {
      module_version_tests[i] = module_version_tests[i].toJSON();
      module_version_tests[i].os = module_version_tests[i].OperatingSystem.os;
      module_version_tests[i].arch = module_version_tests[i].Architecture.arch;
      module_version_tests[i].distro = module_version_tests[i].Distribution.distro;
      module_version_tests[i].node_version = module_version_tests[i].NodeVersion.node_version;
    }
    res.render("module-version-tests", {
      modules: module_version_tests,
      module_name,
      module_version,
      last_scanned,
      app_version
    });
  });

  //TODO: Remove setup requests
  async function setupRequests() {
    let architectures, operatingSystems, distributions, validPlatforms;
    architectures = await Architecture.find();
    operatingSystems = await OperatingSystem.find();
    distributions = await Distribution.find();

    architectures.forEach((architecture) => {
      ARCH[architecture.arch] = architecture.id
    });
    operatingSystems.forEach((operatingSystem) => {
      OS[operatingSystem.os] = operatingSystem.id
    });
    distributions.forEach((distribution) => {
      DISTRO[distribution.distro] = distribution.id
    });

    VALIDPLATFORM = await ValidPlatform.find();

    validPlatformsStr = [];
    VALIDPLATFORM.forEach(plat => {
      if (!(plat.arch == ARCH && plat.distro == DISTRO)) {
        validPlatformsStr.push(`${plat.distro} (${plat.arch})`);
      }
    });

    let ltsVersions = await LTSVersion.find();

    for (let lts of ltsVersions) {
      let latestNodeVersion = await NodeVersion.latest(lts.lts_version);
      LTS_VERSIONS.push({
        lts_version: lts.lts_version,
        id: lts.id,
        latestNodeVersion: latestNodeVersion
      });
    }
  }

  setupRequests();
  server.use(router);
}
