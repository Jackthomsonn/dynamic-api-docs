const fs = require('fs')

class DynamicApiDocsPlugin {
  static install(event) {
    event.emit('Plugin Installed', this)
  }

  apply(routeGenerator) {
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
          <h2>Model for ${route.uri}</h2>
          `

      for (let key in route.model.schema.paths) {
        template += `
        <p><strong>${route.model.schema.paths[key].path}</strong></p>
        <p>Type: ${route.model.schema.paths[key].instance}</p>
        <p>Required: ${route.model.schema.paths[key].options.required ? true : false}</p>
        <div class='line'></div>
        `
      }

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
