export const middleware = [
    function middlewareOne (req, res, next) {
        return next();
    },
    function middlewareTwo (req, res, next) {
        return next();
    }
];

export default function controller (req, res) {
    return res.send('Verbs');
}
