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

module.exports = function(ModuleVersion) {

  const app = require('../../server/server');
  const helper = require('../../server/helper');
  const throw_err = helper.throw_err;

  /* Validate uniqueness of module_version per module */
  ModuleVersion.validatesUniquenessOf('module_version',
    { scopedTo: ['module_id'] });

  /* ModuleVersion checks */
  ModuleVersion.observe('access', async (ctx) => {
   const Module = app.models.Module;
   if (ctx.query && ctx.query.where) {
     if (ctx.query.where.module) {
       const module = await Module.findOne({where: {name: ctx.query.where.module}});
       if (module !== null) {
         ctx.query.where.module_id = module.id;
       } else {
         throw_err("'module' is not valid", 422) //Unprocessable Entity
       }
    }
   }
  });

  /* ModuleVersion checks */
  ModuleVersion.observe('before save', async(ctx, next) => {
    const Module = app.models.Module;
    let queryCtx;
    if (ctx.instance) {
      queryCtx = ctx.instance;
    } else if (ctx.data) {
      queryCtx = ctx.data;
    }

    let module;
    if (queryCtx.module) {
      module = await Module.findOne({where: {name: queryCtx.module}});
    } else if (queryCtx.module_id) {
      module = await Module.findOne({where: {id: queryCtx.module_id}});
    } else {
      throw_err("Please provide 'module' or 'module_id'.", 422) //Unprocessable Entity
    }

    if (module !== null) {
      queryCtx.module_id = module.id;
    } else {
      throw_err("'module' is not valid", 422) //Unprocessable Entity
    }
    // TODO (alk) : validate major version
    if (!queryCtx.module_major_version) {
      queryCtx.module_major_version = queryCtx.module_version.split('.')[0] + '.x';
    }
  });

  // Custom Method that returns latest ModuleVersion
  ModuleVersion.latest = async (module_name, module_major_version) => {
    const Module = app.models.Module;
    let module_versions;
    if(!module_major_version) {
      module_versions = await ModuleVersion.find({where:{module: module_name}});
    } else {
      module_versions = await ModuleVersion.find({where:{module: module_name, module_major_version: module_major_version}});
    }
    // TODO (alk) : improve acuracy
    let latest_module_version = {module_version: ''};
    for (let module_version of module_versions) {
      if (module_version.module_version > latest_module_version.module_version) {
        latest_module_version = module_version;
      }
    }
    if (latest_module_version.module_version === '') {
      latest_module_version = null;
    }
    return latest_module_version;
  }

  ModuleVersion.remoteMethod('latest', {
    http: {path: '/:module_name/latest', verb: 'get'},
    accepts: [
      {arg: 'module_name', type: 'string'},
      {arg: 'module_major_version', type: 'string', http: {source: 'header'}}
    ],
    returns: {arg: 'latest', type: 'Object'}
  });

};
