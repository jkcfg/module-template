import * as std from '@jkcfg/std';

const params = {
  name: 'mixins',
};

function copy(...filenames) {
  for (const filename of filenames) {
    std.read(`assets/${filename}`, { encoding: std.Encoding.Bytes }).then(
        content => std.write(String.fromCharCode(...content), filename),
        err => std.write(`[ERROR] ${err.toString()}`),
      );
  }
}

const eslintrc = {
  extends: 'airbnb-base',
  rules: {
    'import/no-unresolved': [ 2, { ignore: [ '^std$' ] } ],
  },
};

const rollup = `export default {
  input: './src/${params.name}.js',
  output: {
    format: 'es',
  },
};
`;

const jkPackage = name => ({
  name: `@jkcfg/${name}`,
  version: '0.1.0',
  description: 'jk standard library',
  main: `lib/${name}.mjs`,
  scripts: {
    lint: 'eslint src',
    build: `rollup -c | terser --mangle --module > lib/${name}.mjs`,
    test: 'npm run lint',
  },
  repository: {
    type: 'git',
    url: `git+https://github.com/jkcfg/${name}.git`,
  },
  keywords: [
    'configuration',
    'code',
    'generation',
  ],
  author: 'The jk Authors',
  license: 'Apache-2.0',
  bugs: {
    url: `https://github.com/jkcfg/${name}/issues`,
  },
  homepage: `https://github.com/jkcfg/${name}#readme`,
  devDependencies: {
    eslint: '^5.9.0',
    'eslint-config-airbnb-base': '^13.1.0',
    'eslint-plugin-import': '^2.14.0',
    rollup: '^0.67.0',
    'rollup-plugin-includepaths': '^0.2.3',
    terser: '^3.10.11',
  },
  dependencies: {},
});

const helloWorld = `import * as std from '@jkcfg/std';

export default function () {
  std.log('Hello, World!');
}
`

copy(
  '.editorconfig',
  '.gitignore',
  'LICENSE',
);

export default [
  { value: eslintrc, file: '.eslintrc' },
  { value: rollup, file: 'rollup.config.js' },
  { value: jkPackage(params.name), file: 'package.json' },
  { value: '', file: 'lib/.keep' },
  { value: helloWorld, file: `src/${params.name}.js`, override: false },
];
