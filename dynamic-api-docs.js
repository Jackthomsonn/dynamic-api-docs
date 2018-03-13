const { EventEmitter } = require('events')
const fs = require('fs')
const path = require('path')

class DynamicApiDocsPlugin {
  static pluginInformation() {
    return {
      name: 'Dynamic Api Docs'
    }
  }

  static install(event) {
    event.emit('Plugin Installed', this.pluginInformation(), this)
  }

  static apply(routeGenerator) {
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

    routeGenerator.routes.forEach((route, index) => {
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

      if (index === routeGenerator.routes.length - 1) {
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
