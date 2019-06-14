import * as std from '@jkcfg/std';

const params = {
  name: 'mixins',
};

function copy(...filenames) {
  const promises = [];

  for (const filename of filenames) {
    promises.push(
      std.read(`assets/${filename}`, { encoding: std.Encoding.String }).then(
        content => ({ name: filename, content }),
        err => std.write(`[ERROR] ${err.toString()}`),
      ),
    );
  }

  Promise.all(promises).then((files) => {
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      std.write(String.fromCharCode(...file.content), file.name, { format: std.Format.Raw });
    }
  });
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

std.write(eslintrc, '.eslintrc');
std.write(rollup, 'rollup.config.js', { format: std.Format.Raw });
std.write(jkPackage(params.name), 'package.json');
std.write('', `lib/.keep`, { format: std.Format.Raw });
std.write(helloWorld, `src/${params.name}.js`, { format: std.Format.Raw, override: false });
