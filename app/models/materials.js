const mongoose = require("mongoose");
const config = require('config');
const jwt = require('jsonwebtoken');
const material =new mongoose.Schema({
    name: {type: String, unique: false},
    time: {type: String, unique: false},
    date: {type: String, unique: false},
});

material.methods.generateAuthToken = function () {
    const data = {
        _id: this._id,
        role: "materials",
    };

    return jwt.sign(data, config.get('jwtPrivateKey'));
};

const model = mongoose.model("materials", material);
module.exports = model;