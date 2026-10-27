import useAuthUser from "../hooks/useAuthUser.js"
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOnboarding } from "../api.js";
import { CameraIcon, ShuffleIcon, MapPinIcon, ShipWheelIcon, LoaderIcon } from "lucide-react";
import { ENGINEERING_DOMAINS, CAREER_STAGES } from "../constants/constants-index.js";

const OnBoardingPage = () => {
    const { authUser } = useAuthUser();
    const queryClient = useQueryClient();
    const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
    const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
    const [formState, setFormState] = useState({
        fullName: authUser?.fullName || "",
        bio: authUser?.bio || "",
        engineeringDomain: authUser?.engineeringDomain || "",
        careerStage: authUser?.careerStage || "",
        location: authUser?.location || "",
        profilePic: authUser?.profilePic || "",
    });

    const { mutate: completeOnboardingMutation, isPending } = useMutation({
        mutationFn: completeOnboarding,
        onSuccess: (data) => {
            console.log("Onboarding completed successfully:", data);
            toast.success("Onboarding completed successfully!");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (error) => {
            console.error("Error completing onboarding:", error);
            toast.error(error.response?.data?.message || "Error completing onboarding.");
        }
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("dsadsadad",formState);
        completeOnboardingMutation(formState);
    }
    const handleRandomAvatar = () => {
        setIsGeneratingAvatar(true);
        const randomAvatar = `https://api.dicebear.com/10.x/lorelei/svg?seed=${crypto.randomUUID()}`;
        const image = new Image();
        image.onload = () => {
            setFormState((previous) => ({ ...previous, profilePic: randomAvatar }));
            setAvatarLoadFailed(false);
            setIsGeneratingAvatar(false);
            toast.success("Random profile picture generated!");
        };
        image.onerror = () => {
            setIsGeneratingAvatar(false);
            toast.error("Could not load a new avatar. Please try again.");
        };
        image.src = randomAvatar;
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="card  bg-base-200 w-full max-w-xl shadow-xl">
                <div className="card-body p-6 sm:p-8 ">
                    <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Onboarding</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">


                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                                {formState.profilePic && !avatarLoadFailed ? (
                                    <img
                                        src={formState.profilePic}
                                        alt="Profile Preview"
                                        onError={() => setAvatarLoadFailed(true)}
                                        className="w-full h-full object-cover"
                                    />
                                )
                                    : (
                                        <div className="flex items-center justify-center h-full">
                                            <CameraIcon className="size-12 text-base-content opacity-40" />
                                        </div>
                                    )}
                            </div>
                            {/* Generate Random Avatar BTN */}
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={handleRandomAvatar} disabled={isGeneratingAvatar || isPending} className="btn btn-accent">
                                    {isGeneratingAvatar ? <LoaderIcon className="size-4 mr-2 animate-spin" /> : <ShuffleIcon className="size-4 mr-2" />}
                                    {isGeneratingAvatar ? "Generating Avatar..." : "Generate Random Avatar"}
                                </button>
                            </div>



                        </div>
                        {/* FULL NAME */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Full Name</span>
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formState.fullName}
                                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                                className="input input-bordered w-full"
                                placeholder="Your full name"
                            />
                        </div>

                        {/* BIO */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Bio</span>
                            </label>
                            <textarea
                                name="bio"
                                value={formState.bio}
                                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                                className="textarea textarea-bordered h-24"
                                placeholder="Tell others about your engineering interests, projects, and goals"
                            />
                        </div>


                        {/* ENGINEERING PROFILE */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* ENGINEERING DOMAIN */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Engineering Domain</span>
                                </label>
                                <select
                                    name="engineeringDomain"
                                    value={formState.engineeringDomain}
                                    onChange={(e) => setFormState({ ...formState, engineeringDomain: e.target.value })}
                                    required
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Select your engineering domain</option>
                                    {ENGINEERING_DOMAINS.map((lang) => (
                                        <option key={`domain-${lang}`} value={lang}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* CAREER STAGE */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Career Stage</span>
                                </label>
                                <select
                                    name="careerStage"
                                    value={formState.careerStage}
                                    onChange={(e) => setFormState({ ...formState, careerStage: e.target.value })}
                                    required
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Select student or professional</option>
                                    {CAREER_STAGES.map((lang) => (
                                        <option key={`stage-${lang}`} value={lang}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>


                        {/* LOCATION */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Location</span>
                            </label>
                            <div className="relative">
                                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                                <input
                                    type="text"
                                    name="location"
                                    value={formState.location}
                                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                                    className="input input-bordered w-full pl-10"
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>


                        {/* SUBMIT BUTTON */}

                        <button className="btn btn-primary w-full" disabled={isPending || isGeneratingAvatar} type="submit">
                            {!isPending ? (
                                <>
                                    <ShipWheelIcon className="size-5 mr-2" />
                                    Complete Onboarding
                                </>
                            ) : (
                                <>
                                    <LoaderIcon className="animate-spin size-5 mr-2" />
                                    Onboarding...
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div >
        </div >
    )
}

export default OnBoardingPage
