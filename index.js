const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0dn1k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const taskCollection = client.db('todoList').collection('task');

        //task GET API All Items
        app.get('/task', async (req, res)=>{
            const cursor = taskCollection.find({});
            const task = await cursor.toArray();
            res.send(task);
        });
        //task POST API
        app.post('/task', async (req, res)=>{
            const newTask = req.body;
            const task = await taskCollection.insertOne(newTask);
            res.send(task);
        });
        //task DELETE API
        app.delete('/task/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const task = await taskCollection.deleteOne(query);
            res.send(task);
        });
    }
    finally{

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Server is running swiftly.");
});

app.listen(port, ()=>{
    console.log("Port no: ", port);
});