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
            default: routeCollection,
            middleware: routeMiddleware = [],
            version,
            ...routeMethods
        } = require(requirePath);

        if (typeof routeCollection === 'undefined' && Object.keys(routeMethods).length === 0) {
            return console.log(`Route file skipped! No export was found at ${requirePath}`.yellow);
        }

        const mount = mountResourceForHttpVerb({
            server,
            file: parsedFile
        });

        const routeMiddlewares = Array.isArray(routeMiddleware)
            ?   routeMiddleware
            :   [ routeMiddleware ];
        let globalMiddlewares = Array.isArray(globalMiddleware)
            ?   globalMiddleware
            :   [ globalMiddleware ];

        if (typeof routeCollection === 'function' || Array.isArray(routeCollection)) {
            return mount({
                controller: routeCollection,
                middleware: [ ...globalMiddlewares, ...routeMiddlewares ],
                version
            });
        }

        return mount(routeCollection || routeMethods);
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

        server[httpVerb](
            {
                path: `/${mountPath}`,
                version: semver.valid(fileVersionOverride)
                    ?   fileVersionOverride
                    :   version
            },
            middleware,
            controller
        );
    };
}

function requiredParam (name) {
    throw new Error(`${name} is a required option`);
}
