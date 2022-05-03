const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

//midlleware
app.use(express.json());
app.use(cors());

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).send({message:'Unauthorized access'})
  }
  const token =authHeader.split(' ')[1];
  jwt.verify(token,process.env.ACCESS_TOKEN,(error,decoded)=>{
    if(error){
      return res.status(403).send({message:'Forbidden your access'})
    }
    req.decoded = decoded;
  })
  next()
};

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

    app.put("/fruit/:id", async (req, res) => {
      const id = req.params.id;
      const updateFruit = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: updateFruit.quantity,
        },
      };
      const result = await fruitsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    app.delete("/fruit/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await fruitsCollection.deleteOne(query);
      res.send(result);
    });
 /*    ----------------------------------------------
              My fruit api with jwt
    --------------------------------------------- */
    app.get("/myFruit",verifyJwt, async (req, res) => {
      const decodEmail = req.decoded.email;
      const email = req.query.email;
      if(decodEmail===email){
    const query = { email: email };
    const cursor = fruitsCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);
    // console.log(result);
   }else{
     res.status(403).send({message:'Forbidden Your access'})
   }
    });
    app.get("/myFruit", async (req, res) => {});

    //====================Auth====================
    app.post("/login", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
        expiresIn: "1d",
      });
      res.send( token );
    });

    app.post("/fruits", async (req, res) => {
      const newFruit = req.body;
      const result = await fruitsCollection.insertOne(newFruit);
      res.send(result);
    });
    app.put("/fruit/:id", async (req, res) => {
      const id = req.params.id;
    });
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
