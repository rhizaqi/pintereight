const { MongoClient } = require("mongodb")
const uri = process.env.URI_MONGODB

const client = new MongoClient(uri)

async function connect(){
    try {
        client.db("Pintereight")
    } catch (error) {
        await client.close()
    }
}

async function getDB(){
    return client.db("Pintereight")
}

module.exports = {
    connect, getDB
}