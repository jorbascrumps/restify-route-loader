export default [
    function namedController (req, res) {
        return res.send('Controller One');
    },
    function (req, res) {
        return res.send('Controller Two');
    }
];
