const { keys } = require('./settings')

function buildSchema () {
  const schema = {
    type: 'object',
    properties: {}
  }

  for (let i = 0; i < keys; i++) {
    schema.properties[`key_${i}`] = { type: 'string' }
  }

  return schema
}

const schema = buildSchema()

module.exports = schema
