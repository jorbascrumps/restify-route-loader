const should = require('should');
const restify = require('restify');
const path = require('path');

const module = require('../index').default;

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

describe('Route Options', () => {
    beforeEach(() => server = restify.createServer());

    describe('Defaults', () => {
        let defaultRoute;
        const options = {
            routes: path.join(__dirname, 'routes', 'defaults')
        };
        beforeEach(done =>
            server.use(module(server, options, (err, server) => {
                defaultRoute = server.router.getRoutes().get;
                done();
            }))
        );

        it('should be v1.0.0', () => {
            should.equal(defaultRoute.spec.version, '1.0.0');
        });
    });

    describe('Overrides', () => {
        let verbsRoute;
        const options = {
            routes: path.join(__dirname, 'routes', 'verbs'),
            verbs: [ 'patch' ]
        };
        beforeEach(done =>
            server.use(module(server, options, (err, server) => {
                verbsRoute = server.router.getRoutes().patch;
                done();
            }))
        );

        it('should accept additional HTTP verbs', () => {
            should.equal(verbsRoute.spec.method, 'PATCH');
        });
    });
});
