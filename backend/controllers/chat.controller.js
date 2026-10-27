import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
    try {
        const userId = req.user._id;
        const token = await generateStreamToken(userId);
        res.status(200).json({
            status: "success",
            data: {
                token,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}
