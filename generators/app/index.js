'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

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

          // todo: check if the folder exists

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
    // todo: install node modules
    // this.installDependencies();
  }
};
