import { Link } from "react-router-dom";
import {
    ShipWheel,
    ArrowRight,
    Code2,
    Users,
    MessageCircle,
    GraduationCap,
    BriefcaseBusiness,
} from "lucide-react";
import ThemeSelector from "../components/ThemeSelector";

const profiles = [
    {
        name: "Aarav Sharma",
        stage: "Student",
        domain: "Web Development",
        seed: "aarav",
    },
    {
        name: "Priya Mehta",
        stage: "Professional",
        domain: "AI / Machine Learning",
        seed: "priya",
    },
    {
        name: "Kabir Singh",
        stage: "Student",
        domain: "Mechanical Engineering",
        seed: "kabir",
    },
];

const features = [
    {
        icon: Users,
        title: "Find your community",
        description: "Discover engineers across domains.",
    },
    {
        icon: Code2,
        title: "Make connections",
        description: "Meet students and professionals.",
    },
    {
        icon: MessageCircle,
        title: "Keep the conversation going",
        description: "Chat, call, and share ideas.",
    },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-base-100 text-base-content transition-colors">
            {/* Navbar */}
            <header className=" relative z-50 mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-xl font-bold sm:text-2xl"
                >
                    <ShipWheel className="size-8 shrink-0 text-primary" />
                    Streamify
                </Link>

                <nav className="flex items-center gap-2 sm:gap-5">
                    {/* <a
                        href="#community"
                        className="hidden text-sm text-base-content/70 transition hover:text-primary md:block"
                    >
                        Community
                    </a> */}

                    <ThemeSelector />

                    <Link
                        to="/login"
                        className="btn btn-outline btn-primary btn-sm"
                    >
                        Log In
                    </Link>
                </nav>
            </header>

            <main className="mx-auto max-w-7xl px-4 sm:px-6">
                {/* Hero */}
                <section className="grid items-center gap-14 py-14 lg:grid-cols-2 lg:py-24">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
                            <Users className="size-4 shrink-0" />
                            For students & professionals
                        </div>

                        <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            Connect with engineers.
                            <span className="mt-2 block text-primary">
                                Build something great.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-lg text-lg leading-relaxed text-base-content/70">
                            Meet people across engineering domains. Share ideas,
                            discuss projects, and grow together.
                        </p>

                        <div className="mt-9 flex flex-wrap items-center gap-4">
                            <Link
                                to="/signup"
                                className="btn btn-primary gap-3"
                            >
                                Get Started
                                <ArrowRight className="size-5" />
                            </Link>

                            {/* <a
                                href="#community"
                                className="btn btn-ghost gap-2"
                            >
                                Explore Community
                                <ArrowRight className="size-4" />
                            </a> */}
                        </div>
                    </div>

                    {/* Example community profiles */}
                    <div
                        id="community"
                        className="relative scroll-mt-8"
                    >
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-8 rounded-full bg-primary/10 blur-3xl"
                        />

                        <div className="relative space-y-5">
                            {profiles.map((profile, index) => {
                                const StageIcon =
                                    profile.stage === "Professional"
                                        ? BriefcaseBusiness
                                        : GraduationCap;

                                return (
                                    <article
                                        key={profile.seed}
                                        className={`
                                            flex items-center gap-4 rounded-2xl
                                            border border-primary/20 bg-base-200
                                            p-5 shadow-sm transition
                                            hover:border-primary/50 hover:shadow-md
                                            sm:gap-5 sm:p-6
                                            ${
                                                index === 1
                                                    ? "lg:ml-12"
                                                    : "lg:mr-12"
                                            }
                                        `}
                                    >
                                        <img
                                            src={`https://api.dicebear.com/10.x/lorelei/svg?seed=${profile.seed}`}
                                            alt={profile.name}
                                            className="
                                                size-16 shrink-0 rounded-full
                                                border border-primary/20
                                                bg-primary/10 sm:size-20
                                            "
                                        />

                                        <div className="min-w-0">
                                            <h2 className="break-words text-lg font-semibold">
                                                {profile.name}
                                            </h2>

                                            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                                <StageIcon className="size-3.5" />
                                                {profile.stage}
                                            </span>

                                            <p className="mt-3 flex items-start gap-2 text-sm text-base-content/70">
                                                <Code2 className="mt-0.5 size-4 shrink-0" />
                                                <span className="break-words">
                                                    {profile.domain}
                                                </span>
                                            </p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section
                    aria-label="What you can do on Streamify"
                    className="grid gap-8 border-t border-base-300 py-12 md:grid-cols-3"
                >
                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="flex items-start gap-4"
                            >
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                                    <Icon className="size-6" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {feature.title}
                                    </h2>

                                    <p className="mt-2 leading-relaxed text-base-content/60">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </section>
            </main>

            {/* Footer */}
            <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-base-300 px-4 py-6 sm:px-6">
                <Link
                    to="/"
                    className="flex items-center gap-2 font-semibold"
                >
                    <ShipWheel className="size-6 text-primary" />
                    Streamify
                </Link>

                <p className="text-sm text-base-content/60">
                    Connect. Share. Build.
                </p>
            </footer>
        </div>
    );
}