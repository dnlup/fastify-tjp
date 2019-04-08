const Fastify = require('fastify')
const body = require('./schema')

const schema = {
  schema: {
    body,
    response: {
      200: {
        type: 'object',
        properties: {
          hello: {
            type: 'string'
          }
        }
      }
    }
  }
}

const instance = Fastify()

instance.post('/', schema, (request, reply) => {
  reply.send({ hello: 'world' })
})

instance.listen(3000, (error, address) => {
  if (error) throw error
})
