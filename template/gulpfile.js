var args = require('yargs').argv
var clear = require('cli-clear')

if (args.env && ['staging', 'production'].indexOf(args.env) > -1) {
  process.env.NODE_ENV = args.env
} else {
  process.env.NODE_ENV = 'development'
}

var config = require('./config')
var gulp = require('gulp')
var webpack = require('webpack')
var webpackStagingConfig = require('./webpack.staging.config.js')
var webpackProductionConfig = require('./webpack.production.config.js')
var gutil = require('gulp-util')
var gbabel = require('gulp-babel')
var spawn = require('child_process').spawn
var port = 3000
var open = require('open')
var git = require('gulp-git')
var chalk = require('chalk')
var figlet = require('figlet')
var clean = require('gulp-clean')
var standard = require('gulp-standard')
var rename = require('gulp-rename')
var Moment = require('moment')

function getDistributionDir () {
  var dir = process.env.NODE_ENV === 'production' ? 'dist/production' : 'dist/staging'
  return dir
}

gulp.task('html', function () {
  // TODO: The node server provides the index output by default
  // but probably best to generate the html from the ejs template for non nodejs web server users
  // return gulp
  //        .src('src/index.html')
  //        .pipe(gulp.dest(getDistributionDir()))
})

gulp.task('images', function () {
  // TODO: there's an issue when handling the images in webpack
  // it's related with the helper loadImage, because node_modules are ignored
  // would be nice if this is handled by webpack instead
  return gulp
         .src('src/images/**/*')
         .pipe(gulp.dest(getDistributionDir() + '/images'))
})

gulp.task('copy-files', function () {
  var list = ['./webpack-assets.json', './config.js', './src/index.ejs']
  list.forEach(function (v) {
    gulp.src(v)
        .pipe(gulp.dest(getDistributionDir()))
  })
})

gulp.task('build', ['clean', 'server-script-transpiler', 'create-library', 'copy-files'], function () {
  switch (process.env.NODE_ENV) {
    case 'production':
      gulp.start('_build-production')
      break
    case 'staging':
      gulp.start('_build-staging')
      break
    default:
      console.log('Please provide the environment argument!')
  }
})

gulp.task('_build-staging', ['test', 'html', 'images'], function (cb) {
  // run webpack
  webpack(webpackStagingConfig, function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err)
    }
    gutil.log('[webpack:errors]', stats.compilation.errors.toString({
      colors: true
    }))
    gutil.log('[webpack:warnings]', stats.compilation.warnings.toString({
      colors: true
    }))
    console.log('webpack compile success.')
    cb(err)
  })
})

gulp.task('_build-production', ['test', 'html', 'images'], function (cb) {
  // run webpack
  webpack(webpackProductionConfig, function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err)
    }
    gutil.log('[webpack:errors]', stats.compilation.errors.toString({
      colors: true
    }))
    gutil.log('[webpack:warnings]', stats.compilation.warnings.toString({
      colors: true
    }))
    console.log('webpack compile success.')
    cb(err)
  })
})

// todo: decide if called push or remote
// so far I decided to call it deploy (because the boilerplate, hopes the dev
// sitcks with a PaaS / Heroku kind of)
gulp.task('deploy', function () {
  config.git.remoteList.forEach(function (v, k) {
    git.push(v, ['master'], null, function (err) {
      if (err) {
        throw err
      }
    })
  })
})

gulp.task('test', ['unit_test'])

gulp.task('unit_test', function (cb) {
  var cmd = spawn('npm', ['test'], { stdio: 'inherit' })
  cmd.on('close', function (code) {
    // console.log('Mocha tests completed!')
    cb(code)
  })
})

gulp.task('openBrowser', function () {
  open('http://localhost:' + port, function (err) {
    if (err) {
      throw err
    }
  })
})

gulp.task('watch', function () {
  // gulp.watch('./src/index.html', ['html'])
  gulp.watch('./src/js/**/*.js', ['test'])
  gulp.watch('./src/js/**/*.js')
    .on('change', function (ev) {
      return gulp.src('./src/js' + ev.path.split('src/js')[1])
        .pipe(standard())
        .pipe(standard.reporter('default', {
          breakOnError: true,
          quiet: true
        }))
    })
  gulp.watch('./src/images/**/*', ['images'])
})

gulp.task('node-server', function (cb) {
  var cmd = spawn('node', ['server.js'], { stdio: 'inherit' })
  cmd.on('close', function (code) {
    console.log('my-task exited with code ' + code)
    cb(code)
  })
})

gulp.task('preview', function (cb) {
  var cmd = spawn('node', [getDistributionDir() + '/' + 'server.js'], { stdio: 'inherit' })

  cmd.on('close', function (code) {
    console.log('my-task exited with code ' + code)
    cb(code)
  })

  setTimeout(function () {
    open('http://localhost:' + port, function (err) {
      if (err) throw err
    })
  }, 1800)
})

gulp.task('banner', function () {
  clear()
  console.log(
    chalk.magenta(
      figlet.textSync('Reactatouille', { horizontalLayout: 'full' })
    ),
    chalk.yellow.bold('\n' + ' ' + 'Boilerplate'),
    chalk.yellow('by Punkbit'),
    '\n',
    '\n'
  )
})

gulp.task('clean', function () {
  return gulp.src(getDistributionDir(), { read: false })
      .pipe(clean({force: true}))
})

gulp.task('standardjs', function () {
  return gulp.src(['./src/js/**/*.js'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
})

gulp.task('server-script-transpiler', function () {
  return gulp.src('./server.prod.js')
        .pipe(gbabel({
          presets: ['es2015']
        }))
        .pipe(rename({
          basename: 'server',
          suffix: '',
          extname: '.js'
        }))
        .pipe(gulp.dest(getDistributionDir()))
})

gulp.task('create-library', function (cb) {
  var now = new Moment()
  var cmd = spawn('babel', ['src/js', '--out-dir', getDistributionDir() + '/lib'], { stdio: 'ignore' })
  cmd.on('close', function (code) {
    console.log('[' + now.format('HH:mm:ss') + '] Transpiled the source code into the distribution lib directory')
    cb(code)
  })
})

gulp.doneCallback = function (err) {
  process.exit(err ? 1 : 0)
}

gulp.task('default', ['banner', 'node-server', 'watch'])
