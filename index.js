const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port =process.env.PORT || 5000;



//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ddlqajr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db('productDB').collection('product')

    app.get('/products', async(req, res)=>{
        const cursor = productCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    //get specific product on brand
    app.get('/products/:name', async(req, res)=>{
        const name = req.params.name;
        console.log(name)
        const query = {name: name};
        const cursor =  productCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    })

    //update- get specific data to id
    app.get('/product/:id', async(req, res)=>{
        const id = req.params.id;
        console.log(id)
        const query= {_id: new ObjectId(id)};
        const result = await productCollection.findOne(query);
        res.send(result);
    })

    app.post('/products', async(req, res)=>{
        const productInfo = req.body;
        console.log(productInfo)
        const result = await productCollection.insertOne(productInfo)
        res.send(result);
    })

    app.put('/brands/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const options = {upset: true};
      const updateProductInfo = req.body;
      const updateProduct = {
        $set: {
          image_url: updateProductInfo.image_url , name: updateProductInfo.name, product: updateProductInfo.product, rating: updateProductInfo.rating, description: updateProductInfo.description, price: updateProductInfo.price, type: updateProductInfo.type
        }
      }
      const result = await productCollection.updateOne(query, updateProduct, options);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('Electronics website server is running')
})

app.listen(port, ()=>{
    console.log(`Electronics server is running port: ${port}`)
})
