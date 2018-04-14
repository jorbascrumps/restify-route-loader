const should = require('should');
const restify = require('restify');

const module = require('./index').default;

let server;
describe('Route Loader', () => {
    beforeEach(() => server = restify.createServer());

    it('should require a server', () => {
        should.throws(
            () => server.use(module()),
            /^Error: server is a required option$/
        );
    })
});
