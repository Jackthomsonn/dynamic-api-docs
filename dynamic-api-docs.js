const { EventEmitter } = require('events')
const fs = require('fs')
const path = require('path')

class DynamicApiDocsPlugin {
  constructor() {
    this.pluginName = 'Swagger Docs'
  }

  install(event) {
    event.emit('Plugin Installed', this.pluginName, this)
  }

  execute(thisParam) {
    let template = `<!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
      <style>
        * {
          font-family: 'Roboto', sans-serif;
        }
        html, body {
          background: #FFF;
        }
        p {
          font-weight: 300;
        }
        .line {
          background: #F2F2F2;
          height: 1px;
        }
      </style>
    </head>`

    thisParam.options.routes.forEach((route, index) => {
      const methods = route.methods

      methods.forEach(method => {
        method.description = `${method.name.toUpperCase()} method for route ${route.uri}`
      })

      template +=
        `
        <body>
          <h1>Route ${route.uri}</h1>
          ${methods.map(method => `<p>Method name <strong>${method.name.toUpperCase()}</strong></p> \
          <strong>Method description </strong>
          <p>${method.description}</p><div class='line'></div>`).join('')}
        </body>
        </html>`

      if (index === thisParam.options.routes.length - 1) {
        if (!fs.existsSync('api-docs')) {
          fs.mkdirSync('api-docs')
        }

        fs.writeFile('./api-docs/api-docs.html', template, () => {
          process.stdout.write(`\nAPI Docs have been created`)
        })
      }
    })
  }
}

module.exports = { DynamicApiDocsPlugin }