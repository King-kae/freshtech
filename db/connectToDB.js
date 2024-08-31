const mongoose = require('mongoose')
const Grid = require('gridfs-stream');
require('dotenv').config()


const MONGODB_URL = process.env.MONGODB_URL

let gfs;
function connectToMongoDB() {
    mongoose.connect(MONGODB_URL)


    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB successfully')
        // Initialize GridFS stream once connected
        gfs = Grid(connection.connection.db, mongoose.mongo);
        gfs.collection('uploads'); // Set the collection name for GridFS
    })

    mongoose.connection.on('error', (err) => {
        console.log(`Error connecting to Mongo ${err.message}`)
    });
}

function getGFS() {
    if (!gfs) {
        throw new Error('GridFS is not initialized. Ensure MongoDB is connected first.');
    }
    return gfs;
}

module.exports = { connectToMongoDB, getGFS } 