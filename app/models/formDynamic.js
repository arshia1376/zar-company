const mongoose = require("mongoose");
const config = require('config');
const jwt = require('jsonwebtoken');

const formDynamic =new mongoose.Schema({
    name: {type: String,required:false},
    label: {type: String,required:false},
    value: {type: String,required:false},
    placeholder: {type: String,required:false},
    type: {type: Number,required:false},
    pattern: {type: String,required:false},
    min: {type: Number,required:false},
    max: {type: Number,required:false},
    fieldOptions: [],
    field: {type: String,required:false},
    arrange: {type: Number,required:false},
    step: {type: Number,required:false},
    required: {type: Boolean,required:false},
    checkExistUrl: {type: String,required:false},
});

const model = mongoose.model("formDynamic", formDynamic);
module.exports = model;