let mongoose = require('mongoose');

let schema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
        unique:true
    },
    isDelete:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

module.exports = new mongoose.model('category',schema)


