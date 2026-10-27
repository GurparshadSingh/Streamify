import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { createstreamUser} from "../lib/stream.js";
export async function signup(req, res) {
    const { email, password, fullName } = req.body;
    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be atleast 6 characters"
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists please use another email" });
        }
        const idx = Math.floor(Math.random() * 100) + 1;
        const avatar = `https://api.dicebear.com/10.x/lorelei/svg?seed=${idx}`;

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: avatar
        });
        await createstreamUser({ id: newUser._id, fullName: newUser.fullName, email: newUser.email });

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("jwt", token, { maxAge: 7 * 14 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production" });
        res.status(201).json({ success: true, user: newUser });

    } catch (error) {
        console.log("error occured in signup controller", error);
        res.status(500).json({ msg: "internal server error" });
    }
}
export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "email or password is incorrect"
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "user not found"
            });
        }
        const isPassCorrect = await user.comparePassword(password);
        if (!isPassCorrect) {
            return res.status(400).json({
                message: "email or password is incorrect"
            });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("jwt", token, { maxAge: 7 * 14 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production" });
        res.status(200).json({ success: true, user });

    } catch (error) {

    }
}
export async function logout(req, res) {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log("error occured in logout controller", error);
        res.status(500).json({ msg: "internal server error" });
    }
}


export async function onboarding(req, res) {
    try {
        // console.log(req.user);
        const userId = req.user._id;
        const { fullName, bio, engineeringDomain, careerStage, location } = req.body;
        if (!fullName || !bio || !engineeringDomain || !careerStage || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingfields: {
                    fullName: !fullName,
                    bio: !bio,
                    engineeringDomain: !engineeringDomain,
                    careerStage: !careerStage,
                    location: !location
                }
            });
        }
        const domains = ["Software Engineering", "Web Development", "Mobile Development", "AI / Machine Learning", "Data Science", "Cybersecurity", "Cloud / DevOps", "Electronics / Embedded Systems", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Robotics", "Other Engineering"];
        if (!domains.includes(engineeringDomain) || !["Student", "Professional"].includes(careerStage)) {
            return res.status(400).json({ message: "Select a valid engineering domain and career stage" });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, {
            fullName, bio, engineeringDomain, careerStage, location,
            ...(typeof req.body.profilePic === "string" ? { profilePic: req.body.profilePic } : {}),
            isOnboarded: true
        }, { new: true, runValidators: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        try {
            await createstreamUser({ id: updatedUser._id, fullName: updatedUser.fullName, email: updatedUser.email, bio: updatedUser.bio, engineeringDomain: updatedUser.engineeringDomain, careerStage: updatedUser.careerStage, location: updatedUser.location, profilePic: updatedUser.profilePic });
            console.log("stream user updated successfully");
        } catch (error) {
            console.log("error occured in createStreamUser", error);
        }


        res.status(200).json({ success: true, user: updatedUser });

    } catch (error) {
        console.log("error occured in onboarding controller", error);
        res.status(500).json({ msg: "internal server error" });
    }
}
