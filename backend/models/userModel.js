const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const bcrypt    = require('bcrypt');
const validator = require('validator');

const userSchema = new Schema({
    username : {type:String,required:true},
    email    : {type:String,required:true},
    password : {type:String,required:true}
},{timestamps:true});

module.exports = mongoose.model('User',userSchema);