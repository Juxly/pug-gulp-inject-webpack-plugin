const fs = require('fs')
const _ = require('lodash')
class PugInjectPlugin {
  constructor (options = {}) {
    this.template = options.template
    this.output = options.output
  }

  apply (compiler) {
    const bundles = _.keys(compiler.options.entry)
    compiler.hooks.emit.tapAsync('PugInjectPlugin', (compilation, callback) => {
      const css = _.filter(_.keys(compilation.assets), f => {
        const name = f.substr(0, f.indexOf('.'))
        return _.includes(bundles, name) && f.substr(f.lastIndexOf('.') + 1) === 'css'
      })
      const js = _.filter(_.keys(compilation.assets), f => {
        const name = f.substr(0, f.indexOf('.'))
        return _.includes(bundles, name) && f.substr(f.lastIndexOf('.') + 1) === 'js' && !_.includes('vendor', name)
      })

      const vendor = _.filter(_.keys(compilation.assets), f => {
        const name = f.substr(0, f.indexOf('.'))
        return f.substr(f.lastIndexOf('.') + 1) === 'js' && _.includes('vendor', name)
      })

      let template = fs.readFileSync(this.template, 'utf8')
      template = _injectVendor(_injectJs(_injectCss(template, css), js), vendor)

      fs.writeFileSync(this.output, template)
      callback()
    })
  }
}

function _injectCss (template, css) {
  const injectCssIndexStr = '//- inject:css'
  const cssIndex = template.indexOf(injectCssIndexStr)
  const cssEndIndex = template.indexOf('//- endinject', cssIndex)
  return template.substr(0, cssIndex + injectCssIndexStr.length) + '\n' + _.map(css, file => `    link(rel='stylesheet', href="/${file}")`).join('\n') +
    '\n' + '    ' + template.substr(cssEndIndex)
}

function _injectJs (template, js) {
  const injectIndexStr = '//- inject:js'
  const jsIndex = template.indexOf(injectIndexStr)
  const jsEndIndex = template.indexOf('//- endinject', jsIndex)
  return template.substr(0, jsIndex + injectIndexStr.length) + '\n' + _.map(js, file => `    script(src="/${file}")`).join('\n') +
  '\n' + '    ' + template.substr(jsEndIndex)
}

function _injectVendor (template, vendor) {
  const injectVendorIndexStr = '//- inject:vendor'
  const vendorIndex = template.indexOf(injectVendorIndexStr)
  const vendorEndIndex = template.indexOf('//- endinject', vendorIndex)
  return template.substr(0, vendorIndex + injectVendorIndexStr.length) + '\n' + _.map(vendor, file => `    script(src="/${file}")`).join('\n') +
  '\n' + '    ' + template.substr(vendorEndIndex)
}

module.exports = PugInjectPlugin
