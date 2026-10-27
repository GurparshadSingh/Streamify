import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getRecommendedFriends,
    getOutgoingRequestsIds,
    sendFriendRequest
} from "../api";


import FriendCard from "../components/FriendCard";
import toast from "react-hot-toast";


const HomePage = () => {
    const queryClient = useQueryClient();


    const { data: recommendedFriends = [], isLoading: isLoadingRecommendedFriends, isError: recommendationsError } = useQuery({
        queryKey: ["users"],
        queryFn: getRecommendedFriends,
        select: (response) => response.data.recommended,
    });

    const { data: outgoingFriendRequests = [], isPending: outgoingRequestsLoading, isError: outgoingRequestsError } = useQuery({
        queryKey: ["outgoingFriendRequests"],
        queryFn: getOutgoingRequestsIds,
    });

    const { mutate: sendFriendRequestMutation, isPending, variables: sendingUserId } = useMutation({
        mutationFn: sendFriendRequest,
        onSuccess: (data) => {
            console.log("Connection request sent successfully:", data);

            return queryClient.invalidateQueries({
                queryKey: ["outgoingFriendRequests"],
            });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Could not send connection request. Please try again.");
        },
    });

    const outgoingRequestsIds = new Set(
        outgoingFriendRequests.map((friendRequest) => friendRequest.receiver?._id ?? friendRequest.receiver)
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto space-y-10">
                <section>
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet Engineers</h2>
                                <p className="opacity-70">
                                    Connect with students and professionals across engineering domains
                                </p>
                            </div>
                        </div>
                    </div>
                    {outgoingRequestsError && (
                        <p role="alert">Could not load sent requests. Please refresh before sending a request.</p>
                    )}
                    {isLoadingRecommendedFriends ? (
                        <div className="flex justify-center py-12">
                            <span className="loading loading-spinner loading-lg" />
                        </div>
                    ) : recommendationsError ? (
                        <p role="alert">Could not load recommendations. Please refresh to try again.</p>
                    ) : recommendedFriends.length === 0 ? (
                        <div className="card bg-base-200 p-6 text-center">
                            <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
                            <p className="text-base-content opacity-70">
                                Check back later for more engineers to connect with!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {recommendedFriends.map((user) => (
                                <FriendCard
                                    key={user._id}
                                    friend={user}
                                    onConnect={sendFriendRequestMutation}
                                    hasSentRequest={outgoingRequestsIds.has(user._id)}
                                    isSending={isPending && sendingUserId === user._id}
                                    disabled={isPending || outgoingRequestsLoading || outgoingRequestsError}
                                />
                            ))}
                        </div>
                    )
                    }
                </section>
            </div >
        </div >
    );
};

export default HomePage;
