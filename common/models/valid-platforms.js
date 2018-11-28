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

module.exports = function(ValidPlatform) {

  const app = require('../../server/server');
  const helper = require('../../server/helper');
  const throw_err = helper.throw_err;

  /* Validate uniqueness of distro per os-arch */
  ValidPlatform.validatesUniquenessOf('distro',
    { scopedTo: ['os', 'arch'] });

  ValidPlatform.observe('before save', async (ctx, next) => {

    const OperatingSystem = app.models.OperatingSystem;
    const Architecture = app.models.Architecture;
    const Distribution = app.models.Distribution;

    let queryCtx;
    if (ctx.instance) {
      queryCtx = ctx.instance;
    } else if (ctx.data) {
      queryCtx = ctx.data;
    }

    let obj = {};
    obj.os = await OperatingSystem.findOne({where: {os: queryCtx.os }})
    obj.arch = await Architecture.findOne({where: {arch: queryCtx.arch }})
    obj.distro = await Distribution.findOne({where: {distro: queryCtx.distro }})

    // Validate parameters
    Object.keys(obj).forEach(key => {
      if (obj[key] === null) throw_err(`'${key}' is not valid`, 422);
    });

  });

};
