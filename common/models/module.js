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

module.exports = function(Module) {

  const app = require('../../server/server');

  Module.validatesUniquenessOf('name');

  // This custom methods allow 'test' role to patch `deps_ids` & `deps_licenses` fields
  Module.latestModuleVersion = async () => {
    const ModuleVersion = app.models.ModuleVersion;
    let modules = await Module.find({
      include: {
        'ModuleRecommendedLTS': 'LTSVersion'
      },
      order: 'name ASC'
    });

    for (let module in modules) {
      let currentModule = modules[module].toJSON();
      let latest_module_version = await ModuleVersion.latest(currentModule.name);
      currentModule.latestModuleVersion = (latest_module_version) ? latest_module_version : null;
      modules[module] = currentModule;
    }
    return modules;
  }
  Module.remoteMethod('latestModuleVersion', {
    http: {path: '/latestModuleVersion', verb: 'get'},
    returns: {type: [], root: true}
  });

};
