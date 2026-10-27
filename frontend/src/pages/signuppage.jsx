import ThemeSelector from "../components/ThemeSelector";
import { ShipWheel } from 'lucide-react';
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
// import { axiosInstance } from '../axios.js'
import { queryClient } from '../queryClient'
import { signupfxn } from '../api'
import { useNavigate } from 'react-router-dom';
// import React from 'react'


const SignUpPage = () => {
    const [signUpData, setSignUpData] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const { mutate, isPending, error } = useMutation({
        mutationFn: signupfxn,
        onSuccess: (data) => {
            console.log('Success! Saved data:', data);
            // Automatically refetch any query matching ['authUser'] to show the new item
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
            navigate("/home");
        },
        onError: (err) => {
            console.error('Mutation error:', err.message);
        },
    })

    const handleSignup = (e) => {
        e.preventDefault();
        console.log("FORM SUBMITTED");
        console.log(signUpData);
        mutate(signUpData);
    };
    return (
        <div className="min-h-screen flex justify-center items-center p-4 sm:p-6 md:p-8 bg-base-200 text-base-content transition-colors">
            <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg">

                {/* signup form left side */}
                <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
                    <div className="mb-4 flex items-center justify-start gap-2">
                        <ShipWheel className="size-9 text-primary" />
                        <span className="text-2xl sm:text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                            Streamify
                        </span>
                        <div className="ml-auto shrink-0">
                            <ThemeSelector />
                        </div>
                    </div>
                    {error && (
                        <div className="alert alert-error shadow-lg mb-4">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{error.response?.data?.message || error.message}</span>
                            </div>
                        </div>
                    )}

                    <div className='w-full'>
                        <form onSubmit={handleSignup}>
                            <div className="space-y-4">
                                <div>
                                    <h2>Create an account</h2>
                                    <p>Join Streamify and connect with engineering students and professionals</p>
                                </div>
                                <div className="space-y-3">

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Full Name</span>
                                        </label>
                                        <input type="text"
                                            placeholder="Full Name"
                                            className="input input-bordered w-full"
                                            value={signUpData.fullName}
                                            onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                                        />
                                    </div>



                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input type="text"
                                            placeholder="Email"
                                            className="input input-bordered w-full"
                                            value={signUpData.email}
                                            onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                                        />
                                    </div>



                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Password</span>
                                        </label>
                                        <input type="text"
                                            placeholder="Password"
                                            className="input input-bordered w-full"
                                            value={signUpData.password}
                                            onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                                            required
                                        />
                                        <p className="text-xs opacity-70 mt-1">Password must be at least 8 characters long</p>

                                    </div>
                                    <div className="form-control">
                                        <label className="label cursor-pointer justify-start gap-2">
                                            <input type="checkbox" className="checkbox checkbox-sm" required />
                                            <span className="text-xs leading-tight">
                                                I agree to the{" "}
                                                <span className="text-primary hover:underline">terms of service</span> and{" "}
                                                <span className="text-primary hover:underline">privacy policy</span>
                                            </span>
                                        </label>
                                    </div>

                                </div>
                                <button className="btn btn-primary w-full" type="submit">
                                    {isPending ? "Signing up..." : "create account"}
                                </button>
                                <div className="text-center mt-4">
                                    <p className="text-sm">
                                        Already have an account?{" "}
                                        <Link to="/login" className="text-primary hover:underline">
                                            Sign in here
                                        </Link>
                                    </p>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>


                {/* SIGNUP FORM - RIGHT SIDE */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 rounded-r-xl items-center justify-center">
                    <div className="max-w-md p-8">
                        {/* Illustration */}
                        <div className="relative aspect-square max-w-sm mx-auto">
                            <img src="/i.png" alt="Engineering community illustration" className="w-full h-full" />
                        </div>

                        <div className="text-center space-y-3 mt-6">
                            <h2 className="text-xl font-semibold">Connect with engineers worldwide</h2>
                            <p className="opacity-70">
                                Share ideas, discuss projects, and grow with students and professionals
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SignUpPage
