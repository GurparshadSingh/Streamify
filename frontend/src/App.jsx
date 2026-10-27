import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/homepage.jsx"
import SignUp from "./pages/signuppage.jsx"
import Login from "./pages/loginpage.jsx"
import Notifications from "./pages/Notifications.jsx"
import Call from "./pages/callPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import OnBoarding from "./pages/onBoardingpage.jsx";
import Friends from "./pages/friends.jsx";
import { Toaster } from "react-hot-toast";
// import { useQuery } from '@tanstack/react-query'
// import axios from 'axios'
// import { axiosInstance } from "./axios.js"
import PageLoader from "./components/PageLoader.jsx";
// import { getAuthUser } from "./api.js";

import useAuthUser from "./hooks/useAuthUser.js";
// import { Layout } from "lucide-react";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./components/store/useThemeStore.js";
import LandingPage from "./pages/LandingPage.jsx";
const App = () => {
    const { theme } = useThemeStore();
    //tanstack query
    const { isLoading, authUser } = useAuthUser();
    const isAuthenticated = !!authUser; // Convert authUser to a boolean
    const isOnboarded = authUser?.isOnboarded && !!authUser?.engineeringDomain && !!authUser?.careerStage; // Check if the user is onboarded

    if (isLoading) {
        return <PageLoader />
    }

    //why we add a ? after data because data is undefined if isLoading or isError is true so we need to check for that too and return null if that's the case and if not return data
    //what does t.data means here  t is the data from the query

    return (
        <div className="min-h-screen w-full bg-base-100 text-base-content" data-theme={theme}>
            {/* <button onClick={() => useThemeStore.getState().setTheme("dark")}>Dark Theme</button>
            <button onClick={() => useThemeStore.getState().setTheme("light")}>Light Theme</button> */}

            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/home" element={isAuthenticated && isOnboarded ? <Layout showSidebar={true}><HomePage /></Layout> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />} />
                <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/home" />} />
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} />
                <Route path="/notifications" element={isAuthenticated && isOnboarded ? (<Layout showSidebar={true}><Notifications /></Layout>) : (
                    <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                )} />
                <Route
                    path="/connections"
                    element={
                        isAuthenticated && isOnboarded ? (
                            <Layout showSidebar={true}>
                                <Friends />
                            </Layout>
                        ) : (
                            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                        )
                    }
                />
                <Route path="/friends" element={<Navigate to="/connections" replace />} />
                <Route path="/call" element={<Call />} />
                <Route
                    path="/chat/:id"
                    element={
                        isAuthenticated && isOnboarded ? (
                            <Layout showSidebar={false}>
                                <ChatPage />
                            </Layout>
                        ) : (
                            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                        )
                    }
                />
                <Route path="/onboarding" element={isAuthenticated && !isOnboarded ? <OnBoarding /> : <Navigate to="/" />} />
            </Routes>


            <Toaster />
        </div>
    )
}

export default App
