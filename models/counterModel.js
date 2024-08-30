const { Schema, model } = require('mongoose');

const counterSchema = new Schema({
    name: String,
    seq: Number
});

const Counter = model('Counter', counterSchema);


module.exports = Counter;