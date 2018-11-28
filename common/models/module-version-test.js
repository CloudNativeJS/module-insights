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

module.exports = function(ModuleVersionTest) {

  const app = require('../../server/server');
  const helper = require('../../server/helper');
  const throw_err = helper.throw_err;

  // Validate uniqueness of pass result per module_version/node_version/os/arch/distro
  ModuleVersionTest.validatesUniquenessOf('module_version_id',
   { scopedTo: ['arch_id', 'distro_id', 'os_id', 'node_version_id'] });

  ModuleVersionTest.observe('access', async (ctx, next) => {

    const Module = app.models.Module;
    const ModuleVersion = app.models.ModuleVersion;
    const Architecture = app.models.Architecture;
    const Distribution = app.models.Distribution;
    const OperatingSystem = app.models.OperatingSystem;
    const NodeVersion = app.models.NodeVersion;
    let obj = {};

    if (ctx.query && ctx.query.where) {

      if (ctx.query.where.module && ctx.query.where.module_version) {
        obj.module = await Module.findOne({where: { name: ctx.query.where.module }})
        obj.module_version = await ModuleVersion.findOne({where: {
          module: ctx.query.where.module,
          module_version: ctx.query.where.module_version
        }});
      }

      if (ctx.query.where.node_version) {
        obj.node_version = await NodeVersion.findOne({where: { node_version: ctx.query.where.node_version }});
      }

      if(ctx.query.where.os) {
       obj.os = await OperatingSystem.findOne({where: {os: ctx.query.where.os}})
      }
      if(ctx.query.where.arch) {
        obj.arch = await Architecture.findOne({where: {arch: ctx.query.where.arch}})
      }
      if(ctx.query.where.distro) {
        obj.distro = await Distribution.findOne({where: {distro: ctx.query.where.distro}})
      }

      // Validate parameters
      Object.keys(obj).forEach(key => {
       if (obj[key] === null) throw_err(`'${key}' is not valid`, 422) //Unprocessable Entity
     });

     if(obj.os) ctx.query.where.os_id = obj.os.id;
     if(obj.arch) ctx.query.where.arch_id = obj.arch.id;
     if(obj.distro) ctx.query.where.distro_id = obj.distro.id;
     if (obj.module && obj.module_version) {
      ctx.query.where.module_version_id = obj.module_version.id;
     }
     if(obj.node_version) ctx.query.where.node_version_id = obj.node_version.id;

    }

  });

  /* ModuleVersionTest checks */
  ModuleVersionTest.observe('before save', async (ctx, next) => {

    let obj = {};
    const Module = app.models.Module;
    const NodeVersion = app.models.NodeVersion;
    const ModuleVersion = app.models.ModuleVersion;
    const Architecture = app.models.Architecture;
    const Distribution = app.models.Distribution;
    const OperatingSystem = app.models.OperatingSystem;
    const ValidPlatform = app.models.ValidPlatform;

    let queryCtx;
    if (ctx.instance) {
      queryCtx = ctx.instance;
    } else if (ctx.data) {
      queryCtx = ctx.data;
    }

    if (queryCtx.arch) {
      obj.arch = await Architecture.findOne({where: {arch: queryCtx.arch}});
    } else if (queryCtx.arch_id) {
      obj.arch = await Architecture.findOne({where: {id: queryCtx.arch_id}});
    } else {
      throw_err("Please provide 'arch' or 'arch_id'", 422) //Unprocessable Entity
    }

    if (queryCtx.distro) {
      obj.distro = await Distribution.findOne({where: {distro: queryCtx.distro}});
    } else if (queryCtx.distro_id) {
      obj.distro = await Distribution.findOne({where: {id: queryCtx.distro_id}});
    } else {
      throw_err("Please provide 'distro' or 'distro_id'", 422) //Unprocessable Entity
    }

    if (queryCtx.os) {
      obj.os = await OperatingSystem.findOne({where: {os: queryCtx.os}});
    } else if (queryCtx.os_id) {
      obj.os = await OperatingSystem.findOne({where: {id: queryCtx.os_id}});
    } else {
      throw_err("Please provide 'os' or 'os_id'", 422) //Unprocessable Entity
    }

    if (queryCtx.node_version) {
      obj.node_version = await NodeVersion.findOne({where: {node_version: queryCtx.node_version}});
    } else if (queryCtx.node_version_id) {
      obj.node_version = await NodeVersion.findOne({where: {id: queryCtx.node_version_id}});
    } else {
      throw_err("Please provide 'node_version' or 'node_version_id'", 422) //Unprocessable Entity
    }

    if (queryCtx.module && queryCtx.module_version) {
      obj.module = await Module.findOne({where: { name: queryCtx.module }})
      obj.module_version = await ModuleVersion.findOne({where: {
        module: queryCtx.module,
        module_version: queryCtx.module_version
      }});
    } else if (queryCtx.module_version_id) {
      obj.module_version = await ModuleVersion.findOne({where: {id: queryCtx.module_version_id}});
    } else {
      throw_err("Please provide 'module_version_id' or 'module' and 'module_version'", 422) //Unprocessable Entity
    }

    // Validate parameters
    Object.keys(obj).forEach(key => {
      if (obj[key] === null) throw_err(`'${key}' is not valid`, 422) //Unprocessable Entity
    });

    queryCtx.arch_id = obj.arch.id;
    queryCtx.distro_id = obj.distro.id;
    queryCtx.os_id = obj.os.id;
    queryCtx.node_version_id = obj.node_version.id;
    queryCtx.module_version_id = obj.module_version.id;

    const validPlatforms = await ValidPlatform.findOne({where: {
      os: obj.os.os, arch: obj.arch.arch, distro: obj.distro.distro
    }});
    if (validPlatforms === null) throw_err(`This is not a valid platform.`, 422) //Unprocessable Entity

  });

};
