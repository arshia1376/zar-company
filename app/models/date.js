// user.js
const mongoose = require('mongoose');

const DateSchema = new mongoose.Schema({
    name: String,
    email: String,
    date: [Date],
});

const User = mongoose.model('Date', DateSchema);

module.exports = User;
