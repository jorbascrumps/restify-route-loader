const should = require('should');
const restify = require('restify');
const path = require('path');

const module = require('./index').default;

let server;
describe('Route Loader', () => {
    beforeEach(() => server = restify.createServer());

    it('should require a server', () => {
        should.throws(
            () => server.use(module()),
            /^Error: server is a required option$/
        );
    });

    it('should not fail if file doesn\'t export', () => {
        should.ok(
            () => server.use(module(server, {
                routes: path.join(__dirname, 'no-routes')
            }))
        );
    });

    it('should require the routes folder to exist');

    it('should require a controller');
});

describe('Route Defaults', () => {
    let defaultRoute;
    beforeEach(done =>
        server.use(module(server, undefined, (err, server) => {
            defaultRoute = server.router.getRoutes().getdefaults;
            done();
        }))
    );

    it('should be v1.0.0', () => {
        should.equal(defaultRoute.spec.version, '1.0.0');
    });
});
