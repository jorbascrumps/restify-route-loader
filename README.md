# restify-route-loader
A module to automate route loading for [Restify](https://github.com/restify/node-restify).

## Installation
```
npm i restify-route-loader -S
```

## Usage
```js
import restify from 'restify';
import routeLoader from 'restify-route-loader';

const server = restify.createServer();

server.use(routeLoader(server));

server.listen(port, () => {});
```
## Folder Structure

```
-/routes
--get.js
--/aboutus
---get.js
---post.js
```

```
-/routes
--get-1.0.0.js
--get-1.1.0.js
--/aboutus
---get.js
---post.js
```

## File Setup
If the file is just the verb without the version, include the version within the file
```
exports.default = [
  {
    version: "1.0.0",
    controller: function(req, res, next) {
      return res.send('Hello World)
    }
  }
]
```


## Configuration
The module accepts a configuration object as an optional second parameter.

```js
server.use(routeLoader(server, {
    routes: path.join(__dirname, 'routes')
}));
```

### Options
__routes__ &mdash; Change the folder to look for routes
- Defaults to `routes/` inside the current working directory

__verbs__ &mdash; Enable loading of additional HTTP methods
- Must be supported by Restify
- Defaults to `get`, `post`, `del`, `put`

## TODO
- [x] Update (create) documentation  
- [x] Add build process
