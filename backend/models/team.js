//import mongoose module:
const mongoose = require("mongoose");

//creation de la structure du modéle
const teamSchema = mongoose.Schema({
    name: String,
    stadium:String,
    owner: String,
    fondation:Number,
});
//creat player model
const team = mongoose.model("Team",teamSchema);

//make player exportable
module.exports=team;