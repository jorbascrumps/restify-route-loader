import glob from 'glob';
import {
    join,
    parse
} from 'path';

const DEFAULT_ROUTE_VERSION = '1.0.0';
const DEFAULT_SUPPORTED_VERBS = [ 'get', 'post', 'del', 'put' ];

export default (
    server = requiredParam('server'),
    {
        routes = join(process.cwd(), 'routes'),
        verbs = []
    } = {}
) => {
    const acceptedFilenames = [
        ...DEFAULT_SUPPORTED_VERBS,
        ...verbs
    ];

    glob(
        `**/+(${acceptedFilenames.join('|')})*.js`,
        { cwd: routes },
        (err, files) => files
            .map(mountRouteFromFileLocation({
                server,
                folder: routes
            }))
    );

    return (req, res, next) => next();
}

function mountRouteFromFileLocation ({
    server,
    folder
} = {}) {
    return file => {
        const parsedFile = parse(file);
        const routeMethods = require(join(folder, file)).default;

        routeMethods
            .forEach(mountResourceForHttpVerb({
                server,
                file: parsedFile
            }));
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
        const mountPath = file.dir.replace(new RegExp('/_', 'g'), '/:') || '/';

        server[httpVerb](
            {
                path: mountPath,
                version: fileVersionOverride || version
            },
            middleware,
            controller
        );
    };
}

function requiredParam (name) {
    throw new Error(`${name} is a required option`);
}
