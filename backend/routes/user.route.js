import express from "express";
import { protectRoute } from "../src/middleware.js";
const router = express.Router();

import { getRecommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendrequests,getOutgoingFriendRequests } from "../controllers/user.controller.js";

router.use(protectRoute);
router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.get("/friend-request", getFriendrequests)
router.get("/outgoing-friend-requests", getOutgoingFriendRequests)
export default router