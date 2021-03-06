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

    it('should load static route before a dynamic route', done => {
        const options = {
            routes: path.join(__dirname, 'routes', 'controller')
        };

        server.use(module(server, options, (err, server) => {
            const routes = Object.keys(server.router.getRoutes());

            const staticRoute = 'getteststatic';
            const dynamicRoute = 'gettestdynamic';
            const dynamicRouteLevelTwo = 'gettestdynamicdynamicnestedtwo';
            const staticRouteLevelTwo = 'gettestdynamicstaticnestedtwo';

            should.equal(routes.indexOf(staticRoute) < routes.indexOf(dynamicRoute), true);
            should.equal(routes.indexOf(staticRouteLevelTwo) < routes.indexOf(dynamicRouteLevelTwo),true)

            done();
        }));
    });

    it('should require the routes folder to exist');

    it('should parse route parameters');
});

describe('Controller Types', () => {
    beforeEach(() => server = restify.createServer());

    const options = {
        routes: path.join(__dirname, 'routes', 'controller')
    };

    it('should load a single controller', done => {
        server.use(module(server, options, (err, server) => {
            const defaultControllerRoute = server.router.getRoutes().get;
            const namedControllerRoute = server.router.getRoutes().delete;

            should.equal(defaultControllerRoute.chain.count(), 1);
            should.equal(namedControllerRoute.chain.count(), 1);
            done();
        }));
    });

    it('should load multiple controllers', done => {
        server.use(module(server, options, (err, server) => {
            const [
                handlerOne,
                handlerTwo
            ] = server.router.getRoutes().post.chain.getHandlers();

            should.equal(handlerOne._name, 'namedController', 'Named controller');
            should.equal(handlerTwo._name, 'handler-1', 'Unnamed controller');
            done();
        }));
    });
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
        describe('Verbs', () => {
            const options = {
                routes: path.join(__dirname, 'routes', 'verbs'),
                verbs: [ 'patch' ]
            };

            it('should accept additional HTTP verbs', done => {
                server.use(module(server, options, (err, server) => {
                    const verbsRoute = server.router.getRoutes().patch;

                    should.equal(verbsRoute.spec.method, 'PATCH');
                    done();
                }))
            });
        });

        describe('Middleware', () => {
            const options = {
                routes: path.join(__dirname, 'routes', 'middleware')
            };

            it('should accept single route-level middleware', done => {
                server.use(module(server, options, (err, server) => {
                    const routeChain =  server.router.getRoutes().get.chain;

                    should.equal(routeChain.getHandlers()[0]._name, 'middleware');
                    should.equal(routeChain.getHandlers()[1]._name, 'controller');
                    done();
                }));
            });

            it('should accept multiple route-level middlewares', done => {
                server.use(module(server, options, (err, server) => {
                    const routeChain =  server.router.getRoutes().post.chain;

                    should.equal(routeChain.getHandlers()[0]._name, 'middlewareOne');
                    should.equal(routeChain.getHandlers()[1]._name, 'middlewareTwo');
                    should.equal(routeChain.getHandlers()[2]._name, 'controller');
                    done();
                }));
            });

            it('should accept single global middleware', done => {
                const middlewareOptions = {
                    ...options,
                    globalMiddleware: function globalMiddleware () {}
                };

                server.use(module(server, middlewareOptions, (err, server) => {
                    const routeChain =  server.router.getRoutes().get.chain;

                    should.equal(routeChain.getHandlers()[0]._name, 'globalMiddleware');
                    should.equal(routeChain.count(), 3);
                    done();
                }));
            });

            it('should accept multiple global middleware', done => {
                const middlewareOptions = {
                    ...options,
                    globalMiddleware: [ function globalOne () {}, function globalTwo () {} ]
                };

                server.use(module(server, middlewareOptions, (err, server) => {
                    const routeChain =  server.router.getRoutes().get.chain;

                    should.equal(routeChain.getHandlers()[0]._name, 'globalOne');
                    should.equal(routeChain.getHandlers()[1]._name, 'globalTwo');
                    should.equal(routeChain.count(), 4);
                    done();
                }));
            });
        });
    });
});
