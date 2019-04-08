const { join } = require('path')
const { writeFileSync } = require('fs')
const { keys } = require('./settings')

function buildPayload () {
  const payload = {}
  const string = Array(150).fill('a').join('')
  for (let i = 0; i < keys; i++) {
    payload[`key_${i}`] = string
  }
  return payload
}

const payload = JSON.stringify(buildPayload(), null, 2)
const file = join(__dirname, 'payload.json')

writeFileSync(file, payload)
