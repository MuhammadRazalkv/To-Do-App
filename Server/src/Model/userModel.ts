import { Schema,model } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilePicture: { // Add the profilePicture field
        type: String,
        required: false // Change to true if you want to make it required
    }
})

export default  model('User',userSchema)