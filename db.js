const mongoose = require('mongoose');
const mongoURI = Your_DB_URL;

const connectToMongo = async () =>{
    mongoose.connect(mongoURI);
    console.log('connected to DB');
}

module.exports=connectToMongo;


