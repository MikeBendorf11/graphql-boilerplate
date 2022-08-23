const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema')
const cors = require('cors');
const mongoDB = require('./data/db')
const sample = require('./data/sample')
const Resolver = require('./data/resolvers')
const app = express()

mongoDB.connect().then(async db=>{
  let customers = db.collection('customer')
  let products = db.collection('product')
  if(!await customers.count()) {
    await customers.insertMany(sample.Customer)
  }
  if(!await products.count()){
    await products.insertMany(sample.Product)
  }
  app.use(cors())
  //console.log(await customers.find({}).toArray())
  app.use('/graphql', graphqlHTTP({ 
      schema: schema.build,
      graphiql:true,
      rootValue: {
        customers: ()=>  customers.find({}).toArray(),
        products: ()=>  products.find({}).toArray()
      }
  }))
  app.listen(4000, () => {
    console.log('Server is running on port 4000..')
  })
})

