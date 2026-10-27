import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthUser from "../hooks/useAuthUser.js";
import ChatLoader from "../components/ChatLoader.jsx";

import {
    Channel,
    ChannelHeader,
    Chat,
    MessageComposer,
    MessageList,
    Thread,
    Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";

import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../api.js";

const ChatPage = () => {
    const { id: targetUserId } = useParams();
    // console.log(id);
    const [chatClient, setChatClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);

    const { authUser } = useAuthUser();
    const userId = authUser?._id;

    const { data: tokenData } = useQuery({
        queryKey: ["streamToken", userId],
        queryFn: getStreamToken,
        enabled: !!userId, // Only request a token once the user is available.
    });
    const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
    useEffect(() => {
        const initChat = async () => {
            if (!tokenData?.data?.token || !userId || !targetUserId) return;
            try {
                console.log("stream is running");
                const client = StreamChat.getInstance(STREAM_API_KEY);
                await client.connectUser(
                    { id: userId, name: authUser.fullName, image: authUser.profilePic },
                    tokenData.data.token,
                );
                const channelId = [userId, targetUserId].sort().join("-");
                const currChannel = client.channel("messaging", channelId, { members: [userId, targetUserId] });
                await currChannel.watch();
                setChatClient(client);
                setChannel(currChannel);

            } catch (error) {
                console.error("Error initializing chat:", error);
                toast.error("Error initializing chat");
            } finally {
                setLoading(false);
                console.log("channel is running");
            }
        }
        initChat();
    }, [tokenData, authUser, userId, targetUserId, STREAM_API_KEY]);
    if (loading || !chatClient || !channel) {
        return <ChatLoader />
    }
    return (
        <div className="h-[93vh]">
            <Chat client={chatClient}>
                <Channel channel={channel}>
                    <div className="w-full relative">
                        <Window>
                            <ChannelHeader />
                            <MessageList />
                            <MessageComposer focus />
                        </Window>
                    </div>
                    <Thread />
                </Channel>
            </Chat>
        </div>
    )
}

export default ChatPage
