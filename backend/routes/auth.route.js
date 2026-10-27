import express from "express";
const router = express.Router();

import { signup, login, logout, onboarding } from "../controllers/auth.controller.js";
import { protectRoute } from "../src/middleware.js";

router.post("/signup", signup);
router.get("/signup", async (req, res) => {
    res.send("get recieved")
});
router.post("/login", login);
router.post("/logout", logout);

router.post("/onboarding", protectRoute, onboarding);
router.get("/me", protectRoute, async (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            user: req.user,
        },
    });
});


export default router;