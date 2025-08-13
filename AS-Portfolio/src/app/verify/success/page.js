import Link from 'next/link';

export default function VerificationSuccess() {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4">
      <div className="bg-neutral p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-primary mx-auto mb-6 border-2 rounded-full border-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h1 className="text-2xl font-bold text-base-100 mb-4">
          Email Verified Successfully!
        </h1>
        <p className="text-gray-400 mb-6">
          You're now subscribed to updates from AS Portfolio. We'll notify you
          about new projects and articles.
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
        >
          Return to Portfolio
        </Link>
      </div>
    </div>
  );
}