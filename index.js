const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

//midlleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rozc6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
console.log(uri);

async function run() {
  try {
      await client.connect();
      const fruitsCollection =client.db('fruitShop').collection('fruits');
      
app.get('/fruits',async(req,res)=>{
    const query = {};
      const cursor=fruitsCollection.find(query);
      const result = await cursor.toArray()
      res.send(result)
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
