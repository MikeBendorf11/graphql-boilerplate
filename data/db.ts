const { MongoClient } = require("mongodb");
const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri)

async function connect(){
  await client.connect()
  let db = await client.db('test')
  db.command({ping:1})
  console.log('Connected to MongoDB')
  return db
}

module.exports = {connect}