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
