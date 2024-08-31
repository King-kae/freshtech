const mongoose = require('mongoose')
const Grid = require('gridfs-stream');
require('dotenv').config()


const MONGODB_URL = process.env.MONGODB_URL

// let gfs;
// function connectToMongoDB() {
//     mongoose.connect(MONGODB_URL)


//     mongoose.connection.on('connected', (connection) => {
//         console.log('Connected to MongoDB successfully')
//         // Initialize GridFS stream once connected
//         gfs = Grid(connection.connection.db, mongoose.mongo);
//         gfs.collection('uploads'); // Set the collection name for GridFS
//     })

//     mongoose.connection.on('error', (err) => {
//         console.log(`Error connecting to Mongo ${err.message}`)
//     });
// }

// function getGFS() {
//     if (!gfs) {
//         throw new Error('GridFS is not initialized. Ensure MongoDB is connected first.');
//     }
//     return gfs;
// }

// module.exports = { connectToMongoDB, getGFS } 


let gfs; // This will hold the GridFS stream

function connectToMongoDB() {
    if (!MONGODB_URL) {
        console.error('MONGODB_URL is not defined in the environment variables');
        process.exit(1); // Exit process with failure
    }

    mongoose.connect(MONGODB_URL).then((connection) => {
        console.log('Connected to MongoDB successfully');
        
        // Initialize GridFS stream once connected
        gfs = Grid(connection.connection.db, mongoose.mongo);
        gfs.collection('uploads'); // Set the collection name for GridFS
    }).catch((err) => {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1); // Exit process with failure
    });

    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB connection disconnected');
    });

    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed due to application termination');
        process.exit(0); // Exit process with success
    });
}

function getGFS() {
    if (!gfs) {
        throw new Error('GridFS is not initialized. Ensure MongoDB is connected first.');
    }
    return gfs;
}

module.exports = { connectToMongoDB, getGFS };