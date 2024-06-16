const connectToMongo = require('./db');
var cors = require('cors')
const express = require('express')


connectToMongo();
const app = express();
 
app.use(cors())



const port =process.env.PORT || 5000;

app.use(express.json());


app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.listen(port, () => {
  console.log(`MyNoteBook listening on port ${port}`)
})