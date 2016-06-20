import glob from 'glob';
import { join, basename, parse } from 'path';

let config = {
    supportedVerbs: [ 'get', 'post' ]
};
export default function (options) {
    if (typeof options.server === 'undefined') {
        throw 'You must provide a reference to your Restify server';
    }

    Object.assign(config, options);

    const supportedVerbs = config.supportedVerbs.join('|');
    glob(`**/+(${supportedVerbs}).js`, { cwd: config.rootDir }, (err, files) => {
        files.forEach(mountRouteFromFileLocation);
    });
}

function mountRouteFromFileLocation (file) {
    const parsedFile = parse(file);
    const httpMethod = parsedFile.name;
    const routeMethods = require(join(config.rootDir, file)).default;

    routeMethods.forEach(mountResourceForHttpVerb(parsedFile));
}

function mountResourceForHttpVerb (routerFile) {
    return (method) => {
        const httpVerb = routerFile.name;
        const resourceVersion = method.version;
        const mountPath = routerFile.dir.replace('_', ':') || '/';

        config.server[httpVerb](
            {
                path: mountPath,
                version: resourceVersion
            },
            method.controller
        );
    }
}
