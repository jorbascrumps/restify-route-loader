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
