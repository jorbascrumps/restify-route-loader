import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

export default {
    entry: 'index.js',
    format: 'cjs',
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        commonjs()
    ],
    dest: 'dist.js'
}