## 2.5.0 (In development)
* Added support for global middleware that run before each route and its' middleware

## 2.4.0 (April 15, 2018)
* Added support for version and middleware declarations for routes with controllers exported as `default`
* Added optional callback parameter that returns the modified server instance
* Added tests :tada:
* Fixed root-level route gets prepended with superfluous forward slash

## 2.3.1 (April 7, 2017)
* Fixed a compatibility issue with Restify@7.0.0 requiring a forward slash on route paths (see [migration guide](http://restify.com/docs/6to7/#path-must-to-start-with-) for details)

## 2.3.0 (April 7, 2018)
* Changed routes can now export a single function as a controller

## 2.2.0 (September 30, 2017)
* Added default route version number (1.0.0)
* Added explicit file version via file name (ie, get-1.0.0.js)
* Added warning when attempting to load empty route file

## 2.1.0 (July 21, 2017)
* Added `npm prepare` build step using [rollup](https://github.com/rollup/rollup)

## 2.0.1 (June 17, 2017)
* Added notice about missing build script and Node v8+ dependency
* Added missing `main` declaration to `package.json`

## 2.0.0 (June 17, 2017)
* Changed API to enable use with Restify's .use()
* Added changelog
* Added `verbs` option to allow additional HTTP methods (**note:** must be supported by Restify)
* Changed `rootDir` option is now called `routes`
* Added `routes` option now defaults to `routes/` inside the current working directory
