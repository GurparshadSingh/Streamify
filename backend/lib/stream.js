import { StreamChat } from 'stream-chat';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    throw new Error("STREAM_API_KEY and STREAM_API_SECRET must be set in environment variables");
}

const client = StreamChat.getInstance(apiKey, apiSecret);
export const createstreamUser = async (userData) => {
    try {
        const { id, fullName, email } = userData;
        const streamUser = {
            id: id.toString(),
            name: fullName,
            email: email,
            ...(userData.engineeringDomain ? { engineeringDomain: userData.engineeringDomain, careerStage: userData.careerStage, image: userData.profilePic } : {}),
        };
        console.log("Creating/upserting Stream user:", streamUser);

        const response = await client.upsertUser(streamUser);
        console.log("Stream user created/upserted successfully:", response);

        return response;
    } catch (error) {
        console.error("Error creating/upserting Stream user:", error);
        throw error;
    }
}

export const generateStreamToken = async (userId) => {
    try {
        const token = client.createToken(userId.toString());
        return token;
    } catch (error) {
        console.error("Error generating Stream token:", error);
        throw error;
    }
}