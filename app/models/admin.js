const mongoose = require("mongoose");
const config = require('config');
const jwt = require('jsonwebtoken');
const schema =new mongoose.Schema({
    name: {type: String, required: true},
    lastName: {type: String, required: true},
    code: {type: String, required: true,unique: true},
    phoneNumber: {type: String, required: true,unique: true},
    email: {type: String,unique: true},
    adminUsername: {type: String, required: true,unique: true},
    adminPassword: {type: String, required: true,unique: true},
    accessLevel: {type: String, required: true},
    date: {type: String, required: true},

});

schema.methods.generateAuthToken = function () {
    const data = {
        _id: this._id,
        username: this.adminUsername,
        role: "zarAdmin"
    }
    return jwt.sign(data, config.get('jwtPrivateKey'));
}

const model = mongoose.model("zarAdmin", schema);
module.exports = model;