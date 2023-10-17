const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000

// middleWhare
app.use(cors());
app.use(express.json());

// autoMotive
// XhuI7VEnksI5ChBr


const uri = "mongodb+srv://autoMotive:XhuI7VEnksI5ChBr@cluster0.riywk8u.mongodb.net/?retryWrites=true&w=majority";

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

    // collections
    const brandCollections = client.db('brandsDB').collection('brands');

    // Brands releted apis
    app.get('/brands', async (req, res) => {
        const cursor = brandCollections.find();
        const result = await cursor.toArray()
        res.send(result)
    })

    app.post('/brands', async(req, res)=> {
        const newBrands = req.body;
        const result = await brandCollections.insertOne(newBrands)
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=> {
    res.send('AutoMotive Server is running')
})

app.listen(port, () => {
    console.log(`Auto server is running on PORT: ${port}`);
})