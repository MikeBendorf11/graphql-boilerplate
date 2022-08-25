const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema')
const cors = require('cors');
const mongoDB = require('./data/db')
const sample = require('./data/sample')
const {ObjectId, Db }  = require('mongoDB')
import {Customer, Product, MutationCreateOrderArgs} from './gql-types'
const app = express()

mongoDB.connect().then(async (db: typeof Db)=>{
  let customers = db.collection('customer')
  let products = db.collection('product') 
  let orders = db.collection('orders')
  //load sample collections
  if(!await customers.count()) {
    await customers.insertMany(sample.Customer) 
  }
  if(!await products.count()){
    await products.insertMany(sample.Product)
  }
  app.use(cors())
  app.use('/graphql', graphqlHTTP({ //transforms schema SDL and defines crud methods
      schema: schema.build,
      graphiql:true,
      rootValue: {
        customers: (): Customer[] =>  customers.find({}).toArray(),
        products: (): Product [] =>  products.find({}).toArray(),
        //async needed for detailed mutation
        createOrder: async ({productId, customerId, price}: MutationCreateOrderArgs) => {
          //input is only matching the id
          let {insertedId: orderId} = await orders.insertOne({
            price, 
            customerId: ObjectId(customerId), //type needed for aggr, 
            productId: productId.map(pid=>ObjectId(pid))
          })
          //then lookback doesn't need 3xfind() (faster)
          let agg = await orders.aggregate([
            {
              $match: {
                _id: orderId
              }
            },{
              $lookup: {
                from: 'customer',
                localField: 'customerId',
                foreignField: '_id',
                as: 'customer'
              }
            }, 
            {
              $lookup: {
                from: 'product',
                localField: 'productId',
                foreignField: '_id',
                as: 'products'
              }
            },
            {
              $project: { //grab only marked with 1
                _id:0, products:1, customer:1
              }
            }
          ])
          let result = await agg.toArray()
          //console.log('hi there')
          return { //output need to match order type
            _id: orderId,
            customer: result[0].customer[0],
            products: result[0].products
          }
        }
      }
  }))
  app.listen(4000, () => {
    console.log('Server is running on port 4000..')
  })
})

