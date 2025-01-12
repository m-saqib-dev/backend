const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const saltRounds = 10
const userSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
    },
    last_name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
userSchema.pre("save",async function(next){
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next()
})
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}
const User = mongoose.model('User',userSchema)
module.exports = User