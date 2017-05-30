[![Build Status](https://travis-ci.org/heldrida/reactatouille-boilerplate.svg?branch=master)](https://travis-ci.org/heldrida/reactatouille-boilerplate)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)

<p align="center" style="margin: 30px 0;">
  <img src="https://raw.githubusercontent.com/heldrida/reactatouille-boilerplate/master/template/src/images/logo-reactatouille-boilerplate.png?201701241142" height="200">
</p>
<p align="center">
	Reactatouille provides a simple boilerplate setup to allow the developer to focus in what matters.
</p>

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
Clone the repository to your local environment, install any dependencies and install the packages. Run the development command to start a local server, run the test command to run unit tests and the build command to create a new version for release.
Use the `config.js` in the root to set any parameters, such as the `repository remote list`, it's recommended to use a PaaS like Heroku or alike to easy deployment.

### Pre-requisities

```
Nodejs & NPM
```

### Installing

```
npm install
```

### Build for distribution

You must run the build commands to generate a bundle js, css, images, fonts, etc, to distribute it into your test, staging or production environments. To so, you can run the commands below, that will generate the files under the `/dist` directory.

```
gulp build --env development
```

*this one in particular is only relevant if you wish to have stylesheets for server-side rendering, when in development. Otherwise, you'll see the components not styled.

Or,

```
gulp build --env staging
```

Or,

```
gulp build --env production
```

### Development

```
gulp
```

### Test runner

```
gulp test
```

### Tests

The tests are split in two different categories, Unit and End-to-end (integration) tests. These are run separately, there are two different tasks for that matter: `gulp unit_test` & `gulp end2end_test`.

### Preview the app for distribution

Run the command below to create a small web server to serve the app that exists for distribution ( remember to run the build command to create the `dist` directory for the desired `environment`).

```
gulp preview --env staging
```

Or

```
gulp preview --env production
```

### Build architecture

Find the source code under the `src` directory for javascript and `sass` for the stylesheets. Before modifying ensure that the development watcher is running by running the development watch command (see development notes). The `dist` directory holds the files ready for distribution.

## Built With

* ReactJS
* React Router 4
* Webpack 2
* SASS
* ES2015
* GULP
* JEST
* ENZYME
* GSAP
* STANDARDJS
* UNIVERSAL / ISOMORPHIC
* REDUX DEVTOOLS (Browser extension support)

### Logo

<div>Icon Transformed from the original made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
