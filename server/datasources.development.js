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

module.exports = {
  "PostgressqlDS": {
    "url": process.env.DB_URL
      || "postgresql://postgres@localhost:5432/postgres",
    "name": "PostgressqlDS",
    "connector": "postgresql",
    "max": 4
   }
};
