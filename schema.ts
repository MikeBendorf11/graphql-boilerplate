const { buildSchema } = require('graphql');
const path = require('path')
const fs = require('fs')
const schemaAsString = fs.readFileSync('./schema.graphql', 'utf8')

module.exports.build = buildSchema(schemaAsString)
