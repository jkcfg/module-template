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

const jkPackage = module => ({
  name: `@jkcfg/${module.name}`,
  version: `${module.version}`,
  description: `${module.description}`,
  module: `${module.name}.js`,
  scripts: {
    lint: 'eslint {src,tests}/**/*.ts',
    build: 'tsc',
    test: 'jest',
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
  dependencies: {},
  devDependencies: {
    '@jkcfg/std': '^0.2.7',
    'typescript': '^3.4.3',

    // eslint
    "eslint": "^5.12.0",
    "eslint-config-airbnb-base": "^13.1.0",
    "eslint-plugin-import": "^2.17.2",
    "@typescript-eslint/parser": "^1.10.2",
    "@typescript-eslint/eslint-plugin": "^1.7.0",

    // testing with jest
    "jest": "^24.8.0",
    "babel-jest": "^24.8.0",
    "@babel/preset-env": "^7.4.5",
    "eslint-plugin-jest": "^22.4.1",
    '@types/jest': '^24.0.15',
    "ts-jest": "^24.0.2",
  },
  jest: {
    preset: 'ts-jest/presets/js-with-babel',
    globals: {
      'ts-jest': {
        diagnostics: {
          'ignoreCodes': [
            151001,
          ]
        }
      }
    },
    testMatch: [
      '<rootDir>/tests/*.test.js',
      '<rootDir>/tests/*.test.ts',
    ],
    transformIgnorePatterns: [
      '<rootDir>/@jkcfg/',
    ],
    modulePathIgnorePatterns: [
      '<rootDir>/@jkcfg/',
    ],
    moduleDirectories: [
      '<rootDir>/node_modules',
    ]
  },
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

const helloWorld = `
import * as std from '@jkcfg/std';

export default function () {
  std.log('Hello, World!');
}
`.trim();

const Makefile = module => `
.PHONY: dist clean gen test

all: dist

dist:
	npx tsc
	cp README.md LICENSE package.json @jkcfg/${module.name}

clean:
	rm -rf @jkcfg
`.trim();

const travis = module => ({
  language: 'node_js',
  node_js: [
    "node" // always use the latest; we are only using it as a test runner for now
  ],
  cache: 'npm',

  jobs: {
    include: [{
      stage: 'Tests',
      name: 'lint',
      script: 'npm run lint',
    }, {
      name: 'unit tests',
      script: 'npm run test',
    }, {
      name: 'dist',
      script: 'make dist',
    }, {
      stage: 'Deploy',
      script: [
        // build and publish
        'make dist',
        `echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" > @jkcfg/${module.name}/.npmrc`,
        `(cd @jkcfg/${module.name} && npm publish)`,
      ],
      if: 'tag IS present',
    }],
  },
});

const README = module => `
# @jkcfg/${module.name}

${module.description}.
`.trim();

const babelrc = (module) => ({
  presets: [
    '@babel/preset-env'
  ],
})

copy(
  '.editorconfig',
  '.eslintrc',
  '.gitignore',
  'LICENSE',
);

export default [
  { value: tsconfig(module), file: 'tsconfig.json' },
  { value: jkPackage(module), file: 'package.json' },
  { value: helloWorld, file: `src/${module.name}.ts`, overwrite: false },
  { value: Makefile(module), file: 'Makefile' },
  { value: travis(module), file: '.travis.yml' },
  { value: README(module), file: 'README.md' },
  { value: babelrc(module), file: '.babelrc' },
];
