const Bourne = require('bourne')
const fp = require('fastify-plugin')
const compile = require('turbo-json-parse')
const {
  codes: {
    FST_ERR_CTP_EMPTY_JSON_BODY
  }
} = require('./errors')

function plugin (fastify, options, next) {
  const config = Object.assign({}, {
    validate: false,
    validateStrings: false,
    prettyPrinted: true
  }, options)
  const { onProtoPoisoning } = fastify.initialConfig
  const defaultParser = (body) => {
    return Bourne.parse(body, { protoAction: onProtoPoisoning })
  }

  fastify.addHook('onRoute', (routeOptions) => {
    const methods = ['POST', 'PUT', 'PATCH']
    const { method } = routeOptions
    const { body } = routeOptions.schema || {}
    if (body && methods.includes(method)) {
      routeOptions.config = routeOptions.config || {}
      routeOptions.config.tjp = compile(body, config)
    }
  })

  fastify.addHook('onRequest', (request, reply, next) => {
    request.raw.tjp = reply.context.config.tjp
    next()
  })

  fastify.addContentTypeParser('application/json', { parseAs: 'string' },
    (request, body, done) => {
      if (body === '' || body == null) {
        return done(new FST_ERR_CTP_EMPTY_JSON_BODY(), undefined)
      }
      try {
        const json = request.tjp ? request.tjp(body) : defaultParser(body)
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
