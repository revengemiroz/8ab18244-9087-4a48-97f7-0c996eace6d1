import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// utils/api.js

export async function getCallDetails(callId: { callId: string }) {
  const BASE_URL = "https://aircall-backend.onrender.com";
  const url = `${BASE_URL}/activities/${callId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to retrieve call details. Status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log({ data });
    return data;
  } catch (error) {
    console.error("Error retrieving call details:", error);
    throw error;
  }
}

export async function resetAllCalls() {
  const BASE_URL = "https://aircall-backend.onrender.com";
  const url = `${BASE_URL}/reset`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to reset calls. Status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error("Error resetting calls:", error);
    throw error;
  }
}
