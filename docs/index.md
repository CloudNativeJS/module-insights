# What is a Recommended Version?

We recommend a module major version (e.g `3.x`) per Node.js LTS version. We also show the latest module version for that major version in the brackets (e.g `(3.19.2)`).

# What is a Latest Version Status?

Shows information such as license and code coverage, for the latest module version and latest Node.js version.

# Highlighting

Highlighting is depending on `OS-ARCH-DISTRO` filter:

![filter](/pics/filter.png){:class="img-responsive"}

Highlighting of the a module version indicates `PASS/FAIL` results for the latest Node.js version per LTS and selected `OS-ARCH-DISTRO`.
 - `PASS:` green
 - `FAIL:` red

![loopback](/pics/loopback.png){:class="img-responsive"}

For example, from the picture above we can see that `loopback@3.19.2` is passing on the latest Node 6 (v6.14.2) and Node 8 (v8.11.2). We can also see that the latest version of loopback is `3.19.2` and it is passing on the latest Node.js version.

**NOTE:** if you are seeing a grey cell, this means that we have not yet got the results.

# How do we run tests?

We utilise [CITGM](https://www.npmjs.com/package/citgm):
> citgm is a simple tool for pulling down an arbitrary module from npm and testing it using a specific version of the node runtime.

CITGM is using `npm test` command and checks for the exit code (non-zero exit code means `npm test` has failed).

To get code coverage results we utilise [NYC](https://www.npmjs.com/package/nyc):
> Istanbul's state of the art command line interface

We get code coverage results by running [CITGM](https://www.npmjs.com/package/citgm) with a custom test that runs `nyc npm test` instead of the default `npm test`.
