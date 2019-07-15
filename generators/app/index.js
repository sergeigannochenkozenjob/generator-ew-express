'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const pathExists = require('path-exists');
const ejs = require('ejs');
const yaml = require('js-yaml');
const fs = require('fs');

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`This generator will install ${chalk.red('Eisenwerk Express application')}.`),
    );

    return this.prompt([
      {
        type: 'input',
        name: 'applicationName',
        message: 'Application name',
      },
      {
        type: 'input',
        name: 'applicationCode',
        message: 'Application code',
        validate: async (value) => {
          if (typeof value !== 'string') {
            return 'Must be a string';
          }

          if (!value.match(/^[a-zA-Z0-9-_\.]+$/)) {
            return 'Must contain only letters, digits, _, - and . signs';
          }

          const dst = path.join(process.cwd(), value);
          if (await pathExists(dst)) {
            return `Folder exists: ${dst}`;
          }

          return true;
        },
      },
      {
        type: 'input',
        name: 'vendorName',
        message: 'Vendor name (to publish at the DockerHub, etc.)',
      },
      {
        type: 'input',
        name: 'authorName',
        message: 'Author name (to appear in LICENSE, README.md, etc.)',
      },
      {
        type: 'confirm',
        name: 'isMonorepo',
        message: 'Are we inside a monorepo?',
        default: false,
      },
      {
        type: 'input',
        name: 'port',
        message: 'Port number',
        default: 3000,
        validate: async (value) => {
          if (typeof value !== 'string') {
            return true; // the default value will be used
          }

          value = parseInt(value, 10);
          if (isNaN(value) || value < 0 || value > 65535) {
            return `Must be a number between 0 and 65535`;
          }

          return true;
        },
      },
      {
        type: 'confirm',
        name: 'supportTS',
        message: 'Do we support TypeScript?',
        default: false,
      },
    ]).then(props => {
      props.port = props.port || 3000;
      props.debuggerPort = parseInt(props.port, 10) + 1;
      props.applicationFolder = props.isMonorepo ? `app.${props.applicationCode}` : props.applicationCode;
      props.applicationCodeGlobal = props.applicationCode;
      if (props.isMonorepo) {
        props.applicationCodeGlobal = `${path.basename(process.cwd())}_${props.applicationCode}`;
      }
      this.answers = props;
    });
  }

  copyFiles() {
    ['**/.*', ''].forEach((pattern) => {
      this.fs.copyTpl(
        this.templatePath(`codebase/${pattern}`),
        this.destinationPath(this.answers.applicationFolder),
        this.answers,
        {
          dot: true,
        },
      );
    });
  }

  async makeScriptsExecutable() {
    const scriptsPath = path.join(process.cwd(), this.answers.applicationFolder, 'script');
    if (await pathExists(scriptsPath)) {
      this.spawnCommand('chmod', ['+x', path.join(scriptsPath, '*')]);
    }
  }

  async addToComposition() {
    if (this.answers.isMonorepo) {
      const cDevPath = path.join(process.cwd(), 'compose', 'development.yml');
      if (!await pathExists(cDevPath)) {
        return;
      }

      const devPart = path.join(this.templatePath('composition-parts'), 'service.development.yml');
      if (!await pathExists(devPart)) {
        return;
      }

      const part = await new Promise((resolve, reject) => {
        ejs.renderFile(devPart, this.answers, {}, (err, str) => {
          if (err) {
            reject(err);
          } else {
            resolve(str);
          }
        });
      });

      let ymlPart = yaml.safeLoad(part);

      // some hard-coded crap
      ymlPart.depends_on = ymlPart.depends_on || [];

      const ymlWhole = yaml.safeLoad(fs.readFileSync(cDevPath, 'utf8'));
      ymlWhole.services = ymlWhole.services || {};
      ymlWhole.services[this.answers.applicationCode] = ymlPart;

      fs.writeFileSync(cDevPath, yaml.safeDump(ymlWhole));
    }
  }

  install() {
    const deps = [
      // babel
      '@babel/polyfill',

      // express
      'express',
      'body-parser',
      'cors',
      'helmet',

      // graphql
      'graphql',
      'apollo-server-express',
      'merge-graphql-schemas',

      // lodash
      'lodash.isstring',
      'lodash.isobject',
      'lodash.random',
      'lodash.isnumber',
      'lodash.isfunction',
      'lodash.union',
      'lodash.intersection',
      'lodash.difference',
      'lodash.get',
      'lodash.clonedeep',
      'lodash.isequal',

      // aux
      'uuid',
      'debug',
      'ew-internals',
      'deep-freeze-node',

      // database
      'typeorm',
      'pg',

      // microservice intercommunications
      'ioredis',
    ];

    const depsDev = [
      '@babel/core',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-transform-runtime',
      '@babel/preset-env',
      '@babel/preset-stage-0',
      'apollo-server-testing',
      'babel-eslint',
      'babel-loader',
      'babel-plugin-import-graphql',
      'babel-plugin-transform-es2015-modules-commonjs',
      'eslint',
      'eslint-config-airbnb-base',
      'eslint-config-prettier',
      'eslint-plugin-import',
      'eslint-plugin-prettier',
      'graphql-tag',
      'husky',
      'jest',
      'nodemon',
      'nodemon-webpack-plugin',
      'prettier',
      'pretty-quick',
      'supertest',
      'raw-loader',
      'webpack',
      'webpack-cli',
      'webpack-node-externals',
      'webpack-merge',
      'leasot',
    ];

    if (this.answers.supportTS) {
      depsDev.push('fork-ts-checker-webpack-plugin');
      depsDev.push('ts-loader');
      depsDev.push('typescript');
    }

    if (deps.length) {
      console.log(`yarn add ${deps.join(' ')}`);
      this.spawnCommand('yarn', ['add', ...deps], { cwd: this.answers.applicationFolder });
    }
    if (depsDev.length) {
      console.log(`yarn add ${depsDev.join(' ')} --dev`);
      this.spawnCommand('yarn', ['add', ...depsDev, '--dev'], { cwd: this.answers.applicationFolder });
    }
  }
};
