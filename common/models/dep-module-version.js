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

module.exports = function(DepModuleVersion) {

  const app = require('../../server/server');
  const _ = require('lodash');

  /* Validate uniqueness of module_version per module */
  DepModuleVersion.validatesUniquenessOf('module_version', { scopedTo: ['module'] });

  DepModuleVersion.add = async (obj) => {
    let ids = [], license_obj = {};
    const keys = Object.keys(obj);

    /* - add each dependency to the DepModuleVersion table if it doesn't exist
       - save dependency id's
       - create an object with all unique_licenses and count */
    for (let key of keys) {
      key = key.split('@');
      const module_version = key.pop();
      const module = key.join('@');
      const license = obj[`${module}@${module_version}`];
      try {
        let dep_module = await DepModuleVersion.findOrCreate({ module, module_version, license });
        ids.push(dep_module[0].id);
        license_obj[license] = (license_obj[license] || 0) + 1;
      } catch (e) { throw e; }
    }

    // create an array of objects
    const unique_licenses = Object.keys(license_obj);
    let unique_licenses_array = [];
    for (let lic of unique_licenses) {
      unique_licenses_array.push({license: lic, count: license_obj[lic]});
    }

    // sort array by count
    unique_licenses_array = _.orderBy(unique_licenses_array, ['count'], ['desc']);
    const license_count = unique_licenses_array.length;

    // add licenses
    let licenses = [];
    for (let i in unique_licenses_array) {
      licenses.push(`${unique_licenses_array[i].license} [${unique_licenses_array[i].count}]`)
    }

    return {
      "ids": ids.join(', '),
      "licenses": licenses.join(', '),
      "licenses_count": license_count
    };
  }

  DepModuleVersion.remoteMethod('add', {
    http: {path: '/add', verb: 'post'},
    accepts: [{arg: 'obj', type: 'object'}],
    returns: {type: 'object', root: true}
  });

};
