import { axiosInstance } from './axios';


export const signupfxn = async (signUpData) => {
    const response = await axiosInstance.post("/auth/signup", signUpData);
    return response.data;
}
export const login = async (loginData) => {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
}

export const logout = async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
}

export const getAuthUser = async () => {
    try {
        const response = await axiosInstance.get('/auth/me');
        console.log("AUTH RESPONSE:", response.data);
        return response.data
    } catch (error) {
        console.error("Error fetching auth user:", error);
        return null; // or handle the error as needed
    }

}

export const completeOnboarding = async (onboardingData) => {
    const response = await axiosInstance.post('/auth/onboarding', onboardingData);
    console.log("Onboarding RESPONSE:", response.data);
    return response.data;
}

export const getUserFriends = async () => {
    const response = await axiosInstance.get("/users/friends");
    return response.data;
}
export const getRecommendedFriends = async () => {
    const response = await axiosInstance.get("/users");
    return response.data;
}

export const getOutgoingRequestsIds = async () => {
    const response = await axiosInstance.get("/users/outgoing-friend-requests");
    return response.data.data.outgoingFriendRequests;
}

export const sendFriendRequest = async (userId) => {
    const response = await axiosInstance.post(`/users/friend-request/${userId}`);
    return response.data;
}

export const getFriendRequests = async () => {
    const response = await axiosInstance.get("/users/friend-request");
    return response.data.data;
}
export const acceptFriendRequests = async (ReqId) => {
    const response = await axiosInstance.put(`/users/friend-request/${ReqId}/accept`);
    return response.data;
}

export const getStreamToken = async () => {
    const response = await axiosInstance.get('/chats');
    return response.data;
}
