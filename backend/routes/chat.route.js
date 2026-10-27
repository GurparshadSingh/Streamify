import express from "express";
const router = express.Router();
import { protectRoute } from "../src/middleware.js";

import { getStreamToken } from "../controllers/chat.controller.js";
router.get("/", protectRoute, getStreamToken);


export default router;