import mongoose from "mongoose";    

const userSchema = mongoose.Schema(
    {
        rfid: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true, 
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        status: {   
            type: String,   
            enum: ['active', 'inactive', 'suspended'],  
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;