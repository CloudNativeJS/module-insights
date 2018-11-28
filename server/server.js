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

const loopback = require("loopback");
const boot = require("loopback-boot");
const path = require("path");
const url = require("url");

const app = module.exports = loopback();
app.set("view engine", "ejs"); // LoopBack comes with EJS out-of-box
app.set("views", path.resolve(__dirname, "views"));

app.enable("trust proxy");

app.use(function (req, res, next) {
  if (req.url.indexOf("/api/") > -1 && req.url.indexOf("?") > -1 ) {
    res.redirect(307, url.parse(req.url).pathname);
  }
  if (req.secure || process.env.BLUEMIX_REGION === undefined) {
    next();
  } else {
    res.redirect(307, "https://" + req.headers.host + req.url);
  }
});

// Prevent SSL Caching
app.use(function (req, res, next) {
    res.header("Cache-Control", "no-store");
    res.header("Pragma", "no-cache");
    next();
});

app.start = function() {
  // Start the web server
  return app.listen(function() {
    app.emit("started");
    let baseUrl = app.get("url").replace(/\/$/, "");
    console.log("Web server listening at: %s", baseUrl);
    if (app.get("loopback-component-explorer")) {
      let explorerPath = app.get("loopback-component-explorer").mountPath;
      console.log("Browse your REST API at %s%s", baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // Start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
