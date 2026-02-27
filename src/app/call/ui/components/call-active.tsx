import Link from "next/link";
import Image from "next/image";
import {
    CallControls,
    SpeakerLayout
} from "@stream-io/video-react-sdk";

interface Props {
    onLeave: () => void;
    meetingName: string;
}

export const CallActive = ({ onLeave, meetingName }: Props) => {
    return (
        <div className="flex flex-col justify-between p-4 md:p-6 h-full text-white gap-4">
            {/* Header */}
            <div className="glass-strong border border-primary/30 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
                <Link 
                    href="/dashboard/meetings" 
                    className="flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"
                >
                    <Image src="/logo.svg" alt="Logo" width={24} height={24} />
                </Link>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm md:text-base font-semibold text-white truncate">
                        {meetingName}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-green-400 font-medium">Live</span>
                    </div>
                </div>
            </div>

            {/* Video Grid */}
            <div className="flex-1 rounded-2xl overflow-hidden border border-primary/20">
                <SpeakerLayout />
            </div>

            {/* Controls */}
            <div className="glass-strong border border-primary/30 rounded-2xl px-4 py-2 shadow-lg">
                <CallControls onLeave={onLeave} />
            </div>
        </div>
    )
}