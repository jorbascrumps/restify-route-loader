export function middleware (req, res, next) {
    return next();
}

export default function controller (req, res) {
    return res.send('Verbs');
}
