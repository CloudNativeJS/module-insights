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

let server = require('../../server/server'); //require `server.js` as in any node.js app

module.exports = function(LtsVersion) {

  LtsVersion.validatesUniquenessOf('lts_version');

  LtsVersion.latest = async () => {
    const _ = require('lodash');
    const latest_lts = _.orderBy(await LtsVersion.find(), 'lts_version', 'asc').pop();
    return latest_lts;
  }

  LtsVersion.remoteMethod('latest', {
    http: {path: '/latest', verb: 'get'},
    returns: {arg: 'latest', type: 'Object'}
  });


  LtsVersion.latestNodeVersion = async () => {
    const _ = require('lodash');
    const NodeVersion = server.models.NodeVersion;
    const lts_versions = _.orderBy(await LtsVersion.find(), 'lts_version', 'asc');
    for (let i in lts_versions) {
      let latest_node_version = await NodeVersion.latest(lts_versions[i].lts_version);
      if (latest_node_version) {
        lts_versions[i].latestNodeVersion = latest_node_version.node_version;
      } else {
        lts_versions[i].latestNodeVersion = null;
      }
    }
    return lts_versions;
  }

  LtsVersion.remoteMethod('latestNodeVersion', {
    http: {path: '/latestNodeVersion', verb: 'get'},
    returns: {type: [],  root: true}
  });

};
