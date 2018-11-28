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

module.exports = function(NodeVersion) {

  const app = require('../../server/server');
  const helper = require('../../server/helper');
  const throw_err = helper.throw_err;

  /* Validate uniqueness of node_version per lts */
  NodeVersion.validatesUniquenessOf('node_version',
    { scopedTo: ['lts_version_id'] });

  NodeVersion.observe('access', async (ctx) => {
    const LTSVersion = app.models.LTSVersion;
    if (ctx.query.where && ctx.query.where.lts_version) {
      let lts_version = await LTSVersion.findOne({where: {lts_version: ctx.query.where.lts_version}});
      if (lts_version === null) throw_err("'lts_version' is not valid", 422); //Unprocessable Entity
      ctx.query.where.lts_version_id = lts_version.id;
    }
  });

  /* NodeVersion checks */
  NodeVersion.observe('before save', async (ctx, next) => {
    const LTSVersion = app.models.LTSVersion;

    let queryCtx;
    if (ctx.instance) {
      queryCtx = ctx.instance;
    } else if (ctx.data) {
      queryCtx = ctx.data;
    }

    let lts_version;
    if (queryCtx.lts_version) {
      lts_version = await LTSVersion.findOne({where: {lts_version: queryCtx.lts_version}});
    } else if (queryCtx.lts_version_id) {
      lts_version = await LTSVersion.findOne({where: {id: queryCtx.lts_version_id}});
    } else {
      throw_err("Please provide 'lts_version' or 'lts_version_id'.", 422) //Unprocessable Entity
    }
    if (lts_version === null) {
      throw_err("'lts_version' is not valid", 422) //Unprocessable Entity
    }
    queryCtx.lts_version_id = lts_version.id;
  });

  // Custom Method that returns latest NodeVersion per LTS
  NodeVersion.latest = async (lts) => {
    const LTSVersion = app.models.LTSVersion;
    // TODO (alk) : add error checking (check lts is valid + try/catch)
    if (!lts) {
      let latest_lts = await LTSVersion.latest();
      lts = latest_lts.lts_version;
    }
    let lts_versions = await LTSVersion.findOne({
      where: {lts_version: lts},
      include:["NodeVersion"]
    });
    if (lts_versions) {
      lts_versions = lts_versions.toJSON()
      let last_node_version = lts_versions.NodeVersion[0];
      for (let node_version of lts_versions.NodeVersion) {
        if (node_version.node_version > last_node_version.node_version) {
          last_node_version = node_version;
        }
      }
      return last_node_version;
    } else {
      return null;
    }
  }

  NodeVersion.remoteMethod('latest', {
    http: {path: '/latest', verb: 'get'},
    accepts: [{arg: 'lts', type: 'number', http: {source: 'header'}}],
    returns: {arg: 'latest', type: 'Object'}
  });

};
