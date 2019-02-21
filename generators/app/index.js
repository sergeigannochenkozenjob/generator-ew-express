'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const pathExists = require('path-exists');

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`This generator will install ${chalk.red('Eisenwerk Express application')}.`)
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
          if (typeof value !== "string") {
            return 'Must be a string';
          }

          if (!value.match(/^[a-zA-Z0-9-_]+$/)) {
            return 'Should contain only letters, digits, _ and - signs';
          }

          const dst = path.join(process.cwd(), value);
          if (await pathExists(dst)) {
            return `Folder exists: ${dst}`;
          }

          return true;
        }
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
      }
    ]).then(props => {
      this.answers = props;
    });
  }

  copyFiles() {
    this.fs.copyTpl(
      this.templatePath(''),
      this.destinationPath(this.answers.applicationCode),
      this.answers
    );
  }

  install() {
    const deps = [
      '@babel/polyfill',
      'body-parser',
      'express',
      'cors',
      'crypto-random-string',
      'helmet',
      'lodash.clonedeep',
      'lodash.get',
      'lodash.intersection',
      'lodash.isarraylike',
      'lodash.isobject',
      'lodash.isstring',
      'lodash.random',
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
      'ts-loader',
      'typescript',
      'webpack',
      'webpack-cli',
      'webpack-node-externals',
      'webpack-merge',
    ];

    if (deps.length) {
      this.spawnCommand("npm", ["install", ...deps], {cwd: this.answers.applicationCode});
    }
    if (depsDev.length) {
      this.spawnCommand("npm", ["install", ...depsDev, "--save-dev"], {cwd: this.answers.applicationCode});
    }
  }
};
