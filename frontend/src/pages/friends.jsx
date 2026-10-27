
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../api";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const Friends = () => {
    const {
        data: friends = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["friends"],
        queryFn: getUserFriends,
        select: (response) => response.data.friends,
    });

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight py-4">
                Your Connections
            </h2>
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg" />
                </div>
            ) : isError ? (
                <p role="alert">
                    Could not load connections. Please try again.
                </p>
            ) : friends.length === 0 ? (
                <NoFriendsFound />
            ) : (
                <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {friends.map((friend) => (
                        <FriendCard key={friend._id} friend={friend} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Friends;
