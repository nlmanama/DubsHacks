const { request, response } = require('express')
const mongoose = require('mongoose')

const predictionSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: 0
    },
    Happy: {
        type: Number,
        default: 0
    }, 
    Sad: {
        type: Number,
        default: 0
    }, 
    Calm: {
        type: Number,
        default: 0
    }, 
    Energetic: {
        type: Number,
        default: 0
    }, 
})

const Prediction = mongoose.model('myColl', predictionSchema, 'myColl')
const predictionRouter = require('express').Router()

predictionRouter.get('/', async (request, response) => {
    Prediction.find()
    .then(data => response.json(data))
    .catch(error => response.json(error))
});

module.exports = predictionRouter