import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";

function formatCallRecordDate(isoDateString: string) {
  const date = new Date(isoDateString);
  const today = new Date();
  const diffTime = Math.abs(today - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "today";
  } else if (diffDays === 1) {
    return "yesterday";
  } else {
    return `${diffDays} days ago`;
  }
}

export async function updateCallIsArchived(details, fetchQuestions) {
  const callId = details.id;
  const isArchived = details.is_archived;
  const BASE_URL = "https://aircall-backend.onrender.com";
  const url = `${BASE_URL}/activities/${callId}`;

  const requestBody = {
    is_archived: !isArchived,
  };

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to update call. Status: ${response.status}`);
    }

    if (response.ok) {
      fetchQuestions();
      isArchived
        ? toast("Call has been unarchived.")
        : toast("Call has been archived.");
    }
  } catch (error) {
    console.error("Error updating call:", error);
    throw error;
  }
}

function PhoneCallIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      <path d="M14.05 2a9 9 0 0 1 8 7.94" />
      <path d="M14.05 6A5 5 0 0 1 18 10" />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  );
}

function EllipsisVerticalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function card({ details, fetchQuestions, setOpenDialog }) {
  return (
    <div
      onClick={() => setOpenDialog(true)}
      className="border shadow-sm w-full cursor-pointer flex items-center justify-center   rounded-md px-4 py-2"
    >
      <div className=" flex items-center justify-between w-full">
        <div className="w-fit flex gap-2 justify-center items-center">
          <UserIcon className="text-red" />

          <div className=" flex flex-col ">
            <span className="text-sm text-gray-500 font-semibold">
              John Doe
              {String(details.is_archived)}
            </span>
            <span className="text-xs text-muted-foreground/100">
              +1 123 456 789
            </span>
          </div>
        </div>
        <div className="w-fit flex flex-row gap-4 items-center">
          <span className="text-xs text-gray-500 font-semibold capitalize">
            {formatCallRecordDate(details.created_at)}
          </span>
          {details.call_type == "answered" ? (
            <PhoneCallIcon className="w-5 h-5 text-green-500" />
          ) : (
            <PhoneCallIcon className="w-5 h-5 text-red-500" />
          )}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              updateCallIsArchived(details, fetchQuestions);
            }}
          >
            {details.is_archived ? "Unarchive" : "Archive"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default card;
