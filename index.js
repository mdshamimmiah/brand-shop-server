const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6ouqbod.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
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

    const productCollection = client.db('productDB').collection('product');
    const cartCollection = client.db('cartDB').collection('cart');


    app.get('/product', async(req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


app.get('/product/:id', async(req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await productCollection.findOne(query);
  res.send(result);
})


app.post('/product', async(req, res) =>{
  const newAddProduct = req.body;
  console.log(newAddProduct);
  const result = await productCollection.insertOne(newAddProduct);
  res.send(result);
})

// product update work first
app.get('/product/:id', async(req, res) => {
const id = req.params.id;
const query = {_id: new ObjectId(id)}
const result = await productCollection.findOne(query);
res.send(result);

})

app.put('/product/:id', async(req, res) => {
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options = { upsert: true };
  const UpdateProduct = req.body;
  const product = {
    $set: {
      name: UpdateProduct.name,
       brandName: UpdateProduct.brandName, 
       category: UpdateProduct.category, 
       price: UpdateProduct.price, 
       ShortDescription: UpdateProduct.ShortDescription,
        rating: UpdateProduct.rating, 
        image: UpdateProduct.image
    }
  }
  const result = await productCollection.updateOne(filter, product, options);
  res.send(result);
})

// Local

// my cart
app.get("/myCard", async (req, res) => {
  const cursor = cartCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});

app.get("/myCard/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await cartCollection.findOne(query);
  res.send(result);
});

app.post("/myCard", async (req, res) => {
  const newProduct = req.body;
  console.log(newProduct);
  const result = await cartCollection.insertOne(newProduct);
  res.send(result);
});
// cart end


// delete operation start
app.delete('/myCard/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await cartCollection.deleteOne(query);
  res.send(result);
})

// delete operation end

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('shop brand server is running  ')
})

app.listen(port, () => {
    console.log(`brand shop is running on port: ${port}`);
})