// import path from 'path';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    entry: 'index.js',
    format: 'cjs',
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        // resolve({
        //     jsnext: true,
        //     main: true
        // }),
        commonjs()
    ],
    dest: 'dist.js'
}