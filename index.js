const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

//midlleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rozc6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const fruitsCollection = client.db("fruitShop").collection("fruits");

    app.get("/fruits", async (req, res) => {
      const query = {};
      const cursor = fruitsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/fruit/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await fruitsCollection.findOne(query);
      res.send(result);
    });
      console.log(uri);
      app.delete("/fruit/:id", async (req, res) => {
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result =await fruitsCollection.deleteOne(query);
        res.send(result)
      });
      app.get('/myFruit',async(req,res)=>{
        const email =req.query.email;
        const query = {email:email};
        const cursor = fruitsCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      })

   
    app.post('/fruits',async(req,res)=>{
      const newFruit = req.body;
      const result = await fruitsCollection.insertOne(newFruit)
      res.send(result)
    })
    app.put('/fruit/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id);
    })

  } finally {
  }
}
run().catch(console.log());

app.get("/", (req, res) => {
  res.send("Bismillahir rahmanir rahim");
});
app.listen(port, (req, res) => {
  console.log("fruit shop server is running on port", port);
});
