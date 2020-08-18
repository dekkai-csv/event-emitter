'use strict';
const path = require('path');
const typescript = require('rollup-plugin-typescript2');
const globby = require('globby');

const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

function generateConfig(type) {
    const input = {};
    const plugins = [];
    const external = [];
    let buildDir;

    switch(type) {
        case 'lib':
            buildDir = path.resolve(__dirname, 'build/lib');

            globby.sync([
                path.join('src/', '/**/*.ts'),
                `!${path.join('src/', '/**/*.d.ts')}`,
                `!${path.join('src/', '/**/types.ts')}`,
            ]).forEach(file => {
                const parsed = path.parse(file);
                input[path.join(parsed.dir.substr('src/'.length), parsed.name)] = file;
            });
            break;

        case 'dist':
        default:
            buildDir = path.resolve(__dirname, 'build/dist');
            input['mod'] = path.resolve(__dirname, 'src/mod.ts');
            break;
    }

    return {
        input,
        treeshake: true,
        output: {
            dir: buildDir,
            format: 'esm',
            sourcemap: true,
        },
        plugins: [
            ...plugins,
            typescript({
                typescript: require('typescript'),
                cacheRoot: path.resolve(__dirname, '.rts2_cache'),
            }),
        ],
        watch: {
            clearScreen: false
        },
        external,
    };;
}

module.exports = function generator(args) {
    const config = [];
    config.push(generateConfig('lib'));
    config.push(generateConfig('dist'));

    return config;
};
