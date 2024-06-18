const mongoose = require('mongoose');
const mongoURI = process.env.REACT_APP_DBSTRING;

const connectToMongo = async () =>{
    mongoose.connect(mongoURI);
    console.log('connected to DB');
}

module.exports=connectToMongo;


