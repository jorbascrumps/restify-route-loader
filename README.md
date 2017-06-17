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

server.use(routeLoader({
    server
}));

server.listen(port, () => {});
```

## TODO
- [ ] Update (create) documentation  
- [ ] Add build process
