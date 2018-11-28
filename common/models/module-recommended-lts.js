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

module.exports = function(ModuleRecommendedLTS) {

  const app = require('../../server/server');
  const helper = require('../../server/helper');
  const throw_err = helper.throw_err;

  /* Validate uniqueness of recommended_version per module/lts */
  ModuleRecommendedLTS.validatesUniquenessOf('recommended_version',
    { scopedTo: ['module_id', 'lts_version_id'] });

  ModuleRecommendedLTS.observe('access', async (ctx) => {
    const Module = app.models.Module;
    const LTSVersion = app.models.LTSVersion;
    if (ctx.query && ctx.query.where) {
      if (ctx.query.where.module) {
        let module = await Module.findOne({where: {name: ctx.query.where.module}});
        if (module === null) throw_err("'module' is not valid", 422); //Unprocessable Entity
        ctx.query.where.module_id = module.id;
      }
      if (ctx.query.where.lts_version) {
        let lts_version = await LTSVersion.findOne({where: {lts_version: ctx.query.where.lts_version}});
        if (lts_version === null) throw_err("'lts_version' is not valid", 422); //Unprocessable Entity
        ctx.query.where.lts_version_id = lts_version.id;
      }
    }
  });

  /* ModuleRecommendedLTS checks */
  ModuleRecommendedLTS.observe('before save', async (ctx, next) => {

    let obj = {};
    const Module = app.models.Module;
    const LTSVersion = app.models.LTSVersion;
    let queryCtx;
    if (ctx.instance) {
      queryCtx = ctx.instance;
    } else if (ctx.data){
      queryCtx = ctx.data;
    }

    if (queryCtx.module) {
      obj.module = await Module.findOne({where: {name: queryCtx.module}});
    } else if (queryCtx.module_id) {
      obj.module = await Module.findOne({where: {id: queryCtx.module_id}});
    } else {
      throw_err("Please provide 'module' or 'module_id'.", 422); //Unprocessable Entity
    }

    if (queryCtx.lts_version) {
      obj.lts_version = await LTSVersion.findOne({where: {lts_version: queryCtx.lts_version}});
    } else if (queryCtx.lts_version_id) {
      obj.lts_version = await LTSVersion.findOne({where: {id: queryCtx.lts_version_id}})
    } else {
      throw_err("Please provide 'lts_version' or 'lts_version_id'.", 422); //Unprocessable Entity
    }

    // Validate parameters
    Object.keys(obj).forEach(key => {
      if (obj[key] === null ) throw_err(`'${key}' is not valid`, 422); //Unprocessable Entity
    });

    queryCtx.module_id = obj.module.id;
    queryCtx.lts_version_id = obj.lts_version.id;
  });

};
