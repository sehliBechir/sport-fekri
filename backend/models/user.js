//import mongoose module:
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


//creation de la structure du modéle
const userSchema = mongoose.Schema({
    firstName: String,
    lastName:String,
    email: {type:String, unique:true},
    password:String,
    role: String,
    avatar: String,
});
//creat match model
const user = mongoose.model("User",userSchema);

userSchema.plugin(uniqueValidator);
//make match exportable
module.exports=user;