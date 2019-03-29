const fp = require('fastify-plugin')
const compile = require('turbo-json-parse')

const compilers = new Map()

function plugin (fastify, options, next) {
  fastify.addHook('onRoute', (routeOptions) => {
    const { url } = routeOptions
    const { body } = routeOptions.schema || {}
    if (body) {
      if (!compilers.has(url)) {
        compilers.set(url, compile(body, options))
      }
    }
  })

  fastify.addContentTypeParser('application/json', { parseAs: 'string' },
    (request, body, done) => {
      try {
        const { url, body } = request
        const parse = compilers.get(url)
        const json = parse(body)
        done(null, json)
      } catch (error) {
        error.statusCode = 400
        done(error, undefined)
      }
    })
  next()
}

module.exports = fp(plugin, {
  fastify: '^2.0.0',
  name: 'fastify-tjp'
})
