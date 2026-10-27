import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import mongoose from "mongoose";
export async function getRecommendedUsers(req, res) {
    try {
        const currUserId = req.user._id;
        const currUser = req.user;
        const recommended = await User.find({
            $and: [
                { _id: { $ne: currUserId } },// exclude the current user
                { _id: { $nin: currUser.friends } }, // exclude the current user's friends
            ],
            isOnboarded: true,
            engineeringDomain: { $exists: true, $ne: "" },
            careerStage: { $in: ["Student", "Professional"] },
        }).select("-password");
        res.status(200).json({
            status: "success",
            data: {
                recommended,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}

export async function getMyFriends(req, res) {
    try {
        const friends = await User.find({ _id: { $in: req.user.friends } }).select("-password").populate("friends", "fullName  profilePic  engineeringDomain careerStage");
        res.status(200).json({
            status: "success",
            data: {
                friends,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user._id;
        const { id: receiverId } = req.params;
        if (!mongoose.isObjectIdOrHexString(receiverId)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid receiver ID.",
            });
        }
        //prevent sending connection request to self
        if (myId.toString() === receiverId.toString()) {
            return res.status(400).json({
                status: "error",
                message: "You cannot send a connection request to yourself.",
            });
        }
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({
                status: "error",
                message: "Receiver not found.",
            });
        }
        // check if im already connected with the receiver
        if (req.user.friends.includes(receiverId)) {
            return res.status(400).json({
                status: "error",
                message: "You are already connected with this user.",
            });
        }

        //check if a connection request has already been sent
        const existingRequest = await FriendRequest.findOne({
            sender: myId,
            receiver: receiverId,
            status: "pending",
        });
        if (existingRequest) {
            return res.status(400).json({
                status: "error",
                message: "Connection request already sent.",
            });
        }

        const friendRequest = new FriendRequest({
            sender: myId,
            receiver: receiverId,
        });

        await friendRequest.save();

        res.status(200).json({
            status: "success",
            message: "Connection request sent successfully.",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}


// Accept the request and retain it for the sender's connection notification.

export async function acceptFriendRequest(req, res) {
    try {
        const { id } = req.params; // connection request ID basically id of the connection request document in the friendRequest collection
        const friendRequest = await FriendRequest.findById(id);
        if (!friendRequest) {
            return res.status(404).json({
                status: "error",
                message: "Connection request not found.",
            });
        }

        const receiverId = friendRequest.receiver.toString();
        const senderId = friendRequest.sender.toString();
        const myId = req.user._id.toString();

        // Check if the current user is the receiver of the connection request
        if (myId !== receiverId) {
            return res.status(403).json({
                status: "error",
                message: "You are not authorized to accept this connection request.",
            });
        }
        if (friendRequest.status !== "pending") {
            return res.status(400).json({
                status: "error",
                message: "This connection request has already been processed.",
            });
        }

        // Add each other to their friends list
        await User.findByIdAndUpdate(receiverId, { $addToSet: { friends: senderId } });//add to set is used to add the senderId to the friends array of the receiverId if it doesn't already exist
        await User.findByIdAndUpdate(senderId, { $addToSet: { friends: receiverId } });

        friendRequest.status = "accepted";
        await friendRequest.save();

        res.status(200).json({
            status: "success",
            message: "Connection request accepted successfully.",
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}

export async function getFriendrequests(req, res) {
    try {
        //incoming req are the requests that are sent to me and I have to accept or reject them
        const incomingFriendRequests = await FriendRequest.find({ receiver: req.user._id, status: "pending" }).populate("sender", "fullName profilePic engineeringDomain careerStage");

        //outgoing req are the requests that I have sent to others and they have to accept or reject them
        const outgoingFriendRequests = await FriendRequest.find({ sender: req.user._id, status: "pending" }).populate("receiver", "fullName profilePic engineeringDomain careerStage");
        // so it is outgoing wala ispopulating the receiver field of the friendRequest document with the fullName, profilePic, engineeringDomain and careerStage fields of the user document of the receiver and incoming wala is populating the sender field of the friendRequest document with the fullName, profilePic, engineeringDomain and careerStage fields of the user document of the sender
        const acceptedRequests = await FriendRequest.find({
            sender: req.user._id,
            status: "accepted",
        }).populate(
            "receiver",
            "fullName profilePic engineeringDomain careerStage"
        );

        res.status(200).json({
            status: "success",
            data: {
                incomingFriendRequests,
                outgoingFriendRequests,
                acceptedRequests,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}


export async function getOutgoingFriendRequests(req, res) {
    try {
        const outgoingFriendRequests = await FriendRequest.find({ sender: req.user._id, status: "pending" }).populate("receiver", "fullName profilePic engineeringDomain careerStage");
        res.status(200).json({
            status: "success",
            data: {
                outgoingFriendRequests,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}
