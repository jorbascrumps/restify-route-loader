import glob from 'glob';
import {
    join,
    parse
} from 'path';

const supportedVerbs = [ 'get', 'post', 'del', 'put' ];

export default (
    server = requiredParam('server'),
    {
        routes = join(process.cwd(), 'routes'),
        verbs = []
    } = {}
) => {
    const acceptedFilenames = [
        ...supportedVerbs,
        ...verbs
    ];

    glob(
        `**/+(${acceptedFilenames.join('|')}).js`,
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
        version = '1.0.0'
    } = {}) => {
        const httpVerb = file.name;
        const mountPath = file.dir.replace(new RegExp('/_', 'g'), '/:') || '/';

        server[httpVerb](
            {
                path: mountPath,
                version
            },
            middleware,
            controller
        );
    };
}

function requiredParam (name) {
    throw new Error(`${name} is a required option`);
}
