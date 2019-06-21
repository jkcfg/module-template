import * as std from '@jkcfg/std';
import * as param from '@jkcfg/std/param';

const module = param.Object('module');

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
    'import/no-unresolved': [2, { ignore: ['^std$'] }],
  },
};

const jkPackage = module => ({
  name: `@jkcfg/${module.name}`,
  version: '0.1.0',
  description: `${module.description}`,
  main: `lib/${module.name}.mjs`,
  scripts: {
    lint: 'eslint src',
    build: 'tsc',
    test: 'npm run lint',
  },
  repository: {
    type: 'git',
    url: `git+https://github.com/jkcfg/${module.name}.git`,
  },
  keywords: [
    'configuration',
    'code',
    'generation',
  ],
  author: 'The jk Authors',
  license: 'Apache-2.0',
  bugs: {
    url: `https://github.com/jkcfg/${module.name}/issues`,
  },
  homepage: `https://github.com/jkcfg/${module.name}#readme`,
  devDependencies: {
    '@jkcfg/std': '^0.2.7',
    'eslint': '^5.9.0',
    'eslint-config-airbnb-base': '^13.1.0',
    'eslint-plugin-import': '^2.14.0',
    'typescript': '^3.4.3',
  },
  dependencies: {},
});

const tsconfig = module => ({
  compilerOptions: {
    outDir: `@jkcfg/${module.name}`,
    allowJs: true,
    target: 'es2017',
    module: 'es6',
    moduleResolution: 'node',
    sourceMap: false,
    stripInternal: true,
    experimentalDecorators: true,
    pretty: true,
    noFallthroughCasesInSwitch: true,
    noImplicitAny: false,
    noImplicitReturns: true,
    forceConsistentCasingInFileNames: true,
    strictNullChecks: true,
  },
  include: [
    'src',
  ],
  exclude: [
    'node_modules',
    'example',
  ],
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
  { value: tsconfig(module), file: 'tsconfig.json' },
  { value: jkPackage(module), file: 'package.json' },
  { value: helloWorld, file: `src/${module.name}.ts`, override: false },
];
