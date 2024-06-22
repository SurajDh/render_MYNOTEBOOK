const mongoose = require('mongoose');
const mongoURI = mongodb+srv://supermanncps:0BkzLzVeLj2nwjpE@notebook.jcfxb6a.mongodb.net/?retryWrites=true&w=majority&appName=notebook;

const connectToMongo = async () =>{
    mongoose.connect(mongoURI);
    console.log('connected to DB');
}

module.exports=connectToMongo;


