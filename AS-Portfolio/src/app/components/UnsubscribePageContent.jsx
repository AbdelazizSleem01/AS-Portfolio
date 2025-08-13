"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";

export default function UnsubscribePageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Processing your request...");

  useEffect(() => {
    const handleUnsubscribe = async () => {
      const minimumLoadingTime = 2000;
      const startTime = Date.now();

      try {
        const response = await fetch(`/api/unsubscribe?token=${token}`);
        const data = await response.json();

        console.log("API Response:", data);

        const elapsed = Date.now() - startTime;
        if (elapsed < minimumLoadingTime) {
          await new Promise((resolve) =>
            setTimeout(resolve, minimumLoadingTime - elapsed)
          );
        }

        if (data.success) {
          setStatus("success");
          setMessage(data.message || "You have been successfully unsubscribed.");
        } else {
          setStatus("error");
          setMessage(data.error || "Invalid unsubscribe request.");
        }
      } catch (error) {
        console.error("Unsubscribe error:", error);

        const elapsed = Date.now() - startTime;
        if (elapsed < minimumLoadingTime) {
          await new Promise((resolve) =>
            setTimeout(resolve, minimumLoadingTime - elapsed)
          );
        }

        setStatus("error");
        setMessage("Failed to process your request. Please try again.");
      }
    };

    if (token) {
      handleUnsubscribe();
    } else {
      setStatus("error");
      setMessage("Missing token in the URL.");
    }
  }, [token]);

  if (status === "processing") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <svg
            className="animate-spin h-12 w-12 mx-auto text-blue-600 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <h1 className="text-2xl font-bold mb-4">Processing...</h1>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="bg-neutral p-8 rounded-lg shadow-md max-w-md w-full text-center">
        {status === "success" ? (
          <div className="text-green-600">
            <svg
              className="w-16 h-16 mx-auto mb-4 border-2 border-green-600 rounded-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h1 className="text-2xl font-bold mb-4">Unsubscription Successful</h1>
            <p>{message}</p>
          </div>
        ) : (
          <div className="text-red-600">
            <svg
              className="w-16 h-16 mx-auto mb-4 border-2 border-red-600 rounded-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <h1 className="text-2xl font-bold mb-4">Unsubscription Failed</h1>
            <p>{message}</p>
            {token && (
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
              >
                Try Again
              </button>
            )}
          </div>
        )}
        <div className="mt-6">
          <Link href="/">
            <button className="btn btn-primary px-8 text-white rounded-full shadow-lg hover:shadow-xl transition-all gap-2">
              <ArrowBigLeft />
              Return to Home Page
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
