const mongoose = require("mongoose");
const schema =new mongoose.Schema({
    name: {type: String, required: true},
    weight: {type: String, required: true},
});

schema.methods.generateAuthToken = function () {
    const data = {
        _id: this._id,
        role: "box",
    };

    return jwt.sign(data, config.get('jwtPrivateKey'));
};

const model = mongoose.model("box", schema);
module.exports = model;