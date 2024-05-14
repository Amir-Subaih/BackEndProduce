const e = require('express');
const mongoose = require('mongoose');

async function connectOfDB(){
    try{
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log('Connected to MongoDB...');

    }catch(err){
        console.log("Could not connect to MongoDB...",err);
    }
}


module.exports = connectOfDB;