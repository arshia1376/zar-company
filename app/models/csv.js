var mongoose  =  require('mongoose');

var empSchema = new mongoose.Schema({
    name:{
        type:String
    }
});

module.exports = mongoose.model('empModel', empSchema);