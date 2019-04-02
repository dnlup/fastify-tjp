const { inherits, format } = require('util')
const codes = {}

createError('FST_ERR_CTP_EMPTY_JSON_BODY', `Body cannot be empty when content-type is set to 'application/json'`, 400)

function createError (code, message, statusCode = 500, Base = Error) {
  if (!code) throw new Error('Fastify error code must not be empty')
  if (!message) throw new Error('Fastify error message must not be empty')

  code = code.toUpperCase()

  function FastifyError (a, b, c) {
    Error.captureStackTrace(this, FastifyError)
    this.name = `FastifyError [${code}]`
    this.code = code

    // more performant than spread (...) operator
    if (a && b && c) {
      this.message = format(message, a, b, c)
    } else if (a && b) {
      this.message = format(message, a, b)
    } else if (a) {
      this.message = format(message, a)
    } else {
      this.message = message
    }

    this.message = `${this.code}: ${this.message}`
    this.statusCode = statusCode || undefined
  }

  inherits(FastifyError, Base)

  codes[code] = FastifyError

  return codes[code]
}

module.exports = { codes, createError }
