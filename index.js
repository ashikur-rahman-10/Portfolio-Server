const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Server is running...........")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a46jnic.mongodb.net/?retryWrites=true&w=majority`;

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
        client.connect();

        const projectsCollection = client.db("portfolio").collection("projects");
        const skillsCollection = client.db("portfolio").collection("skills");
        const aboutCollection = client.db("portfolio").collection("about");

        // Add project
        app.post('/projects', async (req, res) => {
            const project = req.body;
            const result = await projectsCollection.insertOne(project)
            res.send(result)
        })
        // Get projects
        app.get('/projects', async (req, res) => {
            const result = await projectsCollection.find().toArray()
            res.send(result)
        })

        // Get project by ID
        app.get('/projects/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await projectsCollection.findOne(query)
            res.send(result)
        })

        // Delete a project
        app.delete('/projects/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await projectsCollection.deleteOne(query)
            res.send(result)
        })

        // Update a project
        app.patch('/projects/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const update = req.body
            const updateDoc = {
                $set: {
                    backendGit: update.backendGit,
                    details: update.details,
                    frontendGit: update.frontendGit,
                    projectName: update.projectName,
                    technologies: update.technologies,
                    websiteLink: update.websiteLink,
                    features: update.features,
                    completionDate: update.completionDate,
                },
            };
            const result = await projectsCollection.updateOne(query, updateDoc)
            res.send(result)

        })

        // Add Skill
        app.post('/skills', async (req, res) => {
            const skill = req.body;
            console.log(skill);
            const result = await skillsCollection.insertOne(skill)
            res.send(result)
        })

        app.get('/about-me', async (req, res) => {
            const result = await aboutCollection.findOne({ _id: new ObjectId("664da373a402cecf4ecde2df") })
            res.send(result)
        })

        app.patch('/about-me/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {
                _id: new ObjectId(id)
            }
            const about = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: about?.name,
                    email: about?.email,
                    phone: about?.phone,
                    city: about?.city,
                    degree: about?.degree,
                    description: about?.description,
                    image: about?.image,
                },
            };
            const result = await aboutCollection.updateOne(filter, updateDoc, options)
            res.send(result)

        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Server is running at port :${port}`);
})