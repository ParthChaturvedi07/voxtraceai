"use client";

import { ErrorState } from "@/components/alert-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, MoreVertical } from "lucide-react";

interface Props {
  meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);

  const { data: meeting } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );

  const { data: agent } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: meeting.agentId }),
  );

  // const removeMeeting = useMutation(
  //   trpc.meetings.remove.mutationOptions({
  //     onSuccess: async () => {
  //       await queryClient.invalidateQueries(
  //         trpc.meetings.getMany.queryOptions({}),
  //       );
  //       toast.success("Meeting deleted successfully");
  //       router.push("/dashboard/meetings");
  //     },
  //     onError: (error) => {
  //       toast.error(error.message);
  //     },
  //   }),
  // );

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Delete Meeting",
    "Are you sure you want to delete this meeting? This action cannot be undone.",
  );

  // const handleRemoveMeeting = async () => {
  //   const confirmed = await confirmRemove();
  //   if (!confirmed) return;
  //   await removeMeeting.mutate({ id: meetingId });
  // };

  return (
    <>
      <RemoveConfirmation />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-white/10"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {meeting.name}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Meeting Details
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/10"
              >
                <MoreVertical className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setUpdateMeetingDialogOpen(true)}
                className="cursor-pointer"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                // onClick={handleRemoveMeeting}
                className="cursor-pointer text-red-400 focus:text-red-400"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Meeting Details Card */}
        <div className="glass border border-primary/20 rounded-2xl overflow-hidden">
          <div className="px-6 py-6 flex flex-col gap-y-6">
            {/* Meeting Info */}
            <div className="flex flex-col gap-y-4">
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">
                  Meeting Information
                </h2>
                <div className="glass border border-primary/20 rounded-xl p-4">
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-400">Meeting Name</dt>
                      <dd className="text-white font-medium">{meeting.name}</dd>
                    </div>
                    <Separator className="bg-primary/20" />
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-400">Created</dt>
                      <dd className="text-white font-medium">
                        {new Date(meeting.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </dd>
                    </div>
                    <Separator className="bg-primary/20" />
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-400">Last Updated</dt>
                      <dd className="text-white font-medium">
                        {new Date(meeting.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <Separator className="bg-primary/20" />

            {/* Agent Section */}
            <div className="flex flex-col gap-y-3">
              <h3 className="text-lg font-semibold text-white">
                Associated Agent
              </h3>
              <div
                className="glass border border-primary/20 rounded-xl p-4 cursor-pointer hover:border-primary/40 transition-colors"
                onClick={() =>
                  router.push(`/dashboard/agents/${meeting.agentId}`)
                }
              >
                <div className="flex items-center gap-x-3">
                  <GeneratedAvatar
                    variant="botttsNeutral"
                    seed={agent.name}
                    className="size-12 border-2 border-primary/30 rounded-full"
                  />
                  <div>
                    <p className="text-white font-medium">{agent.name}</p>
                    <p className="text-xs text-gray-400">Click to view agent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const MeetingIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meeting"
      description="Please wait while we fetch the meeting details..."
    />
  );
};

export const MeetingIdViewError = () => {
  return (
    <ErrorState
      title="Error Loading Meeting"
      description="Failed to load meeting details. Please try again later."
    />
  );
};
