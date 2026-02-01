import mongoose from "mongoose";

const coupanSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique:true,
    },
    discountPercentage:{
        type:Number,
        required:true,
        min:0,
        max:100,
    },
    expirationDate:{
        type:Number,
        required:true,

    },
    isActive:{
        type:Boolean,
        default:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

}, {
    timestamps: true
})

const Coupan = mongoose.model("Coupan", coupanSchema);

export default Coupan;