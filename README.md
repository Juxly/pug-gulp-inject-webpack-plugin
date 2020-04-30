# Pug Gulp Inject Webpack Plugin

A very naive and focused webpack plugin which mimics gulp-inject functionality
in webpack for pug/jade templates.

Allows you to inject js, css, or vendor.js into a jade/pug file

The source was written for a specific use-case, if you find it helpful or need
different functionality, fork it.

This plugin looks for the following inject points:

```
\\- inject:js
\\- inject:css
\\- inject:vendor
```

This will inject vendor.js and app.js bundles in inject:js and inject:vendor
injections. It will inject app.css into inject:css

```
entry: {
  vendor: path.join(__dirname, 'public/vendor.js'),
  app: path.join(__dirname, '/public/app.js')
},
plugins: [
  new InjectPlugin({template: 'views/includes/head.jade', output: path.join(process.cwd(), 'views/includes/head.jade')})
]
```

### Install

```
npm install pug-gulp-inject-webpack-plugin -D

const InjectPlugin = require('pug-gulp-inject-webpack-plugin')

```
