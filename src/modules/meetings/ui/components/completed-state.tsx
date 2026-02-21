import { EmptyState } from "@/components/empty-state";
import { CircleCheckIcon } from "lucide-react";

export const CompletedState = () => {
  return (
    <div className="glass border border-blue-500/30 rounded-2xl px-6 py-8 flex flex-col gap-y-8 items-center">
      <div className="flex items-center gap-x-2 mb-2">
        <CircleCheckIcon className="size-3 text-blue-500" />
        <span className="text-blue-400 font-semibold text-sm uppercase tracking-wide">
          Completed
        </span>
      </div>
      <EmptyState
        image="/processing.svg"
        title="Meeting Completed"
        description="This meeting has ended and is now available for review. Check the transcript and summary below."
      />
    </div>
  );
};
