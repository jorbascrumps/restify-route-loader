import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'index.js',
    output: {
        file: 'dist.js',
        format: 'cjs'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        commonjs()
    ]
}
