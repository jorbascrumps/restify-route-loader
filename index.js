import glob from 'glob';
import {
    join,
    parse
} from 'path';
import semver from 'semver';
import 'colors';

const DEFAULT_ROUTE_VERSION = '1.0.0';
const DEFAULT_SUPPORTED_VERBS = [ 'get', 'post', 'del', 'put' ];

export default (
    server = requiredParam('server'),
    {
        routes = join(process.cwd(), 'routes'),
        verbs = [],
        globalMiddleware = []
    } = {},
    callback = () => {}
) => {
    const acceptedFilenames = [
        ...DEFAULT_SUPPORTED_VERBS,
        ...verbs
    ];

    glob(
        `**/+(${acceptedFilenames.join('|')})*.js`,
        { cwd: routes },
        (err, files) => {
            if (err) {
                return callback(err);
            }

                files
                .sort((a, b)=>Math.sign((a.match(/_/g)||[]).length - (b.match(/_/g)||[]).length))
                .map(mountRouteFromFileLocation({
                    server,
                    folder: routes,
                    globalMiddleware
                }));

            return callback(null, server);
        }
    );

    return (req, res, next) => next();
}

function mountRouteFromFileLocation ({
    server,
    folder,
    globalMiddleware
} = {}) {
    return file => {
        const parsedFile = parse(file);
        const requirePath = join(folder, file);
        const {
            middleware: routeMiddleware = [],
            version,
            controller,
            default: routeCollection = controller,
        } = require(requirePath);

        if (typeof routeCollection === 'undefined') {
            return console.log(`Route file skipped! No export was found at ${requirePath}`.yellow);
        }

        const mount = mountResourceForHttpVerb({
            server,
            file: parsedFile
        });

        const routeControllers = Array.isArray(routeCollection)
            ?   routeCollection
            :   [ routeCollection ];
        const routeMiddlewares = Array.isArray(routeMiddleware)
            ?   routeMiddleware
            :   [ routeMiddleware ];
        const globalMiddlewares = Array.isArray(globalMiddleware)
            ?   globalMiddleware
            :   [ globalMiddleware ];

        return mount({
            controller: routeControllers,
            middleware: [ ...globalMiddlewares, ...routeMiddlewares ],
            version
        });
    };
}

function mountResourceForHttpVerb ({
    server,
    file
} = {}) {
    return ({
        controller,
        middleware = [],
        version = DEFAULT_ROUTE_VERSION
    } = {}) => {
        const [
            httpVerb,
            fileVersionOverride
        ] = file.name.split('-');
        const mountPath = file.dir.replace(new RegExp('/_', 'g'), '/:');
        
        return server[httpVerb](
            {
                path: `/${mountPath}`,
                version: semver.valid(fileVersionOverride)
                    ?   fileVersionOverride
                    :   version
            },
            ...middleware,
            ...controller
        );
    };
}

function requiredParam (name) {
    throw new Error(`${name} is a required option`);
}
