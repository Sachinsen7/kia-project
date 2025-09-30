const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String },
    title: {type: String, required: true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    region: { type: String, required: true },
    country: { type: String, required: true },
    nationality: { type: String, required: true },
    isActive: { type: Boolean, default: false },
},{timestamps: true});

module.exports=mongoose.model("User", userSchema);