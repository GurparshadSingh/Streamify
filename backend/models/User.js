import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    location: { type: String, default: "" },
    bio: {
        type: String,
        default: ""
    },
    profilePic: {
        type: String,
        default: ""
    },
    engineeringDomain: {
        type: String,
        default: ""
    },
    careerStage: {
        type: String,
        enum: ["", "Student", "Professional"],
        default: ""
    }, isOnboarded: {
        type: Boolean,
        default: false
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, { timestamps: true });
//* preHook
userSchema.pre("save", async function (next) {

    try {
        //! Password change nahi hua to dobara hash mat karo kya pta sirf username change hua aho
        if (!this.isModified("password")) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})

userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
}

// function name(params) {

// }
const User = mongoose.model("User", userSchema);


export default User