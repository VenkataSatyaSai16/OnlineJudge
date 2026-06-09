import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
{
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:true,
        trim:true,
        minlength:[3,"Username must be at least 3 characters"],
        maxlength:[50,"Username cannot exceed 20 characters"],
        match:[
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers and underscores"
        ]
    },

    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        trim:true,
        lowercase:true,
        match:[
            /^\S+@\S+\.\S+$/,
            "Please enter a valid email address"
        ]
    },

    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:[8,"Password must be at least 8 characters long"]
    },

    avatar:{
        type:String,
        default:""
    },

    provider:{
        type:String,
        enum:{
            values:["local","google"],
            message:"Provider must be either local or google"
        },
        default:"local"
    },

    role:{
        type:String,
        enum:{
            values:["user","admin"],
            message:"Role must be either user or admin"
        },
        default:"user"
    }
},
{
    timestamps:true
}
);

const User = mongoose.model("User", UserSchema);

export default User;