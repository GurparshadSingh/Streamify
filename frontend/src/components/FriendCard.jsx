import { useState } from "react";
import { Link } from "react-router";
import { MapPin, Code2, GraduationCap, BriefcaseBusiness, UserPlus, CheckCircle2, LoaderCircle, Terminal, MessageCircle, UserRound } from "lucide-react";

const actionClass = "flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary bg-primary/5 px-3 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary/5 disabled:hover:text-primary";

export default function FriendCard({ friend, onConnect, hasSentRequest = false, isSending = false, disabled = false }) {
    const [failedAvatar, setFailedAvatar] = useState(null);
    const StageIcon = friend.careerStage === "Professional" ? BriefcaseBusiness : GraduationCap;

    return (
        <article className="relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-200 text-base-content shadow-lg transition hover:border-primary/50">
            <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-primary" />
            <div className="flex items-center justify-between gap-3 border-b border-base-300 bg-base-300/40 px-5 py-4">
                <div aria-hidden="true" className="flex gap-2">
                    <span className="size-3 rounded-full bg-error" />
                    <span className="size-3 rounded-full bg-warning" />
                    <span className="size-3 rounded-full bg-success" />
                </div>
                <div className="flex min-w-0 items-center gap-2 text-xs text-base-content/60">
                    <span className="truncate font-mono">engineer.profile</span>
                    <Terminal aria-hidden="true" className="size-4 shrink-0 text-primary" />
                </div>
            </div>
            <div className="flex flex-1 flex-col p-5 pl-6">
                <div className="flex items-center gap-4 border-b border-base-300 pb-5">
                    <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-base-300 bg-base-300">
                        {friend.profilePic && failedAvatar !== friend.profilePic ? (
                            <img src={friend.profilePic} alt={friend.fullName} onError={() => setFailedAvatar(friend.profilePic)} className="size-full object-cover" />
                        ) : <UserRound aria-label="Profile avatar" className="size-8 text-primary" />}
                    </div>
                    <div className="min-w-0">
                        <h3 className="break-words text-xl font-bold tracking-tight">{friend.fullName}</h3>
                        {friend.location && <p className="mt-2 flex items-start gap-1.5 text-sm text-base-content/60"><MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" /><span className="break-words">{friend.location}</span></p>}
                    </div>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-[1.3fr_1fr]">
                    <div className="min-w-0 rounded-xl border border-base-300 bg-base-100/40 p-3">
                        <p className="font-mono text-xs text-primary">{"< domain >"}</p>
                        <div className="mt-3 flex items-center gap-2">
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Code2 aria-hidden="true" className="size-5" /></span>
                            <span className="min-w-0 break-words text-sm font-semibold">{friend.engineeringDomain || "Not set"}</span>
                        </div>
                    </div>
                    <div className="min-w-0 rounded-xl border border-base-300 bg-base-100/40 p-3">
                        <p className="font-mono text-xs text-primary">{"< stage >"}</p>
                        <div className="mt-3 flex items-center gap-2">
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><StageIcon aria-hidden="true" className="size-5" /></span>
                            <span className="min-w-0 break-words text-sm font-semibold">{friend.careerStage || "Not set"}</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 py-5">
                    <p className="font-mono text-xs text-primary">{"< about >"}</p>
                    <p className="mt-2 break-words text-sm leading-relaxed text-base-content/80">{friend.bio || "Ready to connect and share ideas."}</p>
                </div>
                <div className="border-t border-base-300 pt-4">
                    {onConnect ? (
                        <button type="button" onClick={() => onConnect(friend._id)} disabled={hasSentRequest || isSending || disabled} aria-label={`${hasSentRequest ? "Request sent to" : "Connect with"} ${friend.fullName}`} aria-busy={isSending} className={actionClass}>
                            {isSending ? <><LoaderCircle aria-hidden="true" className="size-5 animate-spin" />Sending...</> : hasSentRequest ? <><CheckCircle2 aria-hidden="true" className="size-5" />Request Sent</> : <><UserPlus aria-hidden="true" className="size-5" />Connect</>}
                        </button>
                    ) : (
                        <Link to={`/chat/${friend._id}`} aria-label={`Message ${friend.fullName}`} className={actionClass}><MessageCircle aria-hidden="true" className="size-5" />Message</Link>
                    )}
                </div>
            </div>
        </article>
    );
}
