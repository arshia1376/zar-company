const mongoose = require("mongoose");

const recipeMaterial = new mongoose.Schema({
    SAP:{type: String},
    material:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "materials"
        },
    weight: {type: String, required: true},

});

const recipeBox = new mongoose.Schema({
    name: {type: String, required: true},
    boxTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "box"
    },
    recipeMaterials: [recipeMaterial]

});

const recipe = new mongoose.Schema({
    name: {type: String, required: true},
    recipeBoxs: [recipeBox]
});


const model = mongoose.model("recipe", recipe);
module.exports = model;