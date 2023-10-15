const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

app = express();
const PORT = 3001;
uri = 'mongodb+srv://chiphamthilan:peppy1720@cluster0.qh02ino.mongodb.net/?retryWrites=true&w=majority'
const predictionRouter = require('./prediction')

// Mongo DB Setup
mongoose.set('strictQuery', false)
console.log('connecting to', uri)

mongoose.connect(uri, {dbName: "curd"})
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use('/', predictionRouter)

app.listen(PORT, function (){ 
    console.log('Listening on Port 3001');
});  