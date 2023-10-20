const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000

// middleWhare
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.riywk8u.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();

        // collections
        const brandCollections = client.db('brandsDB').collection('brands');
        const carCollections = client.db('brandsDB').collection('cars');
        const cartCollections = client.db('brandsDB').collection('cart');

        // Brands releted apis
        app.get('/brands', async (req, res) => {
            const cursor = brandCollections.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/brands', async (req, res) => {
            const newBrands = req.body;
            const result = await brandCollections.insertOne(newBrands)
            res.send(result)
        })

        // Cars apis
        app.get('/cars/:brand_name', async (req, res) => {
            const brandName = req.params.brand_name;
            const query = { brand_name: brandName };
            const cursor = carCollections.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/cars', async (req, res) => {
            const newCars = req.body;
            const result = await carCollections.insertOne(newCars)
            res.send(result)
        })

        app.get('/cars', async (req, res) => {
            const cursor = carCollections.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/car/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await carCollections.findOne(query);
            res.send(result)
        })

        app.put('/car/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const updatedCar = req.body;

            const car = {
                $set: {
                    ImageURL: updatedCar.ImageURL, 
                    Name: updatedCar.Name, 
                    type: updatedCar.type, 
                    price: updatedCar.price, 
                    rating: updatedCar.rating, 
                    short_description: updatedCar.short_description
                }
            }
            const result = await carCollections.updateOne(filter, car, options)
            res.send(result);
        })

        // Cart apis
        app.post('/carts', async (req, res) => {
            const data = req.body;
            const result = await cartCollections.insertOne(data)
            res.send(result)
        })

        app.get('/carts/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email)
            const query = { email: email };
            const cursor = cartCollections.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

         // Delete One from database
         app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartCollections.deleteOne(query);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('AutoMotive Server is running')
})

app.listen(port, () => {
    console.log(`Auto server is running on PORT: ${port}`);
})