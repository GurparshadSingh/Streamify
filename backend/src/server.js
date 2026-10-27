import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "../routes/auth.route.js";
import userRoutes from "../routes/user.route.js";
import chatRoutes from "../routes/chat.route.js";
import { connectDB } from "../lib/db.js";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
        methods: "GET,PUT,PATCH,POST,DELETE",
        allowedHeaders: "Content-Type, Authorization",
    }
));
app.use(express.urlencoded({ extended: true }));//! ka kaam hai incoming URL-encoded request body ko JavaScript object mein parse karna.
app.use(cookieParser());//! ka kaam hai incoming request ke cookies ko parse karna aur unhe req.cookies object mein store karna.
app.use(express.json());//! ka kaam hai incoming JSON request body ko JavaScript object mein parse karna.
app.use(express.static("public"));//! ka kaam hai incoming request ke public folder ko static file server karna.
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);


app.listen(port, () => {
    connectDB();
    console.log(`App is listening on port ${port}`);
})