"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { useState } from "react";

export const MeetingsListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="py-4 px-4 md:px-6 lg:px-8 flex flex-col gap-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              My Meetings
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Create and manage your AI meetings
            </p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-background font-medium transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 shrink-0 w-full sm:w-auto"
          >
            <PlusIcon className="size-4 mr-2" />
            <span className="hidden sm:inline">New Meeting</span>
            <span className="sm:hidden">Create New Meeting</span>
          </Button>
        </div>

        {/* Filters Section */}
        <div className="flex items-center gap-2">{/* TODO: Filters */}</div>
      </div>
    </>
  );
};
