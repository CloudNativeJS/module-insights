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
require("events").EventEmitter.defaultMaxListeners = 100;
let app = require("./server");

let datasources = Object.keys(app.dataSources);

console.log(`DataSources: ${datasources}`);

async function migrate() {
  for (let dsName of datasources) {
    let ds = app.dataSources[dsName];
    try {
      await ds.automigrate();
      await ds.disconnect();
      console.log(`'${dsName}' is migrated.\n`);
      process.exit(0);
    } catch (e) {
      throw e;
    }
  }
}

migrate();
