"use client"
import Link from 'next/link';


export default function VerificationError({ searchParams }) {
  const code = searchParams?.code || 'unknown_error';

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4">
      <div className="bg-neutral p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-red-500 mx-auto mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h1 className="text-2xl font-bold text-base-100 mb-4">
          Verification Failed
        </h1>
        <p className="text-gray-600 mb-6">
          {code === 'invalid_token'
            ? "The verification link is invalid or expired."
            : "An unknown error occurred."}
        </p>
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
          >
            Return to Portfolio
          </Link>
          <Link
            href="#footer"
            className="text-primary hover:underline"
          >
            Try subscribing again
          </Link>
        </div>
      </div>
    </div>
  );
}