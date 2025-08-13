import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4 mt-16">
      <div className="max-w-2xl w-full text-center ">
        <div className="animate-bounce">
          <Image
            src="/imgs/not-found.png"
            alt="404 illustration"
            width={400}
            height={300}
            className="mx-auto"
            priority
          />
        </div>

        {/* Content */}
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-2xl text-neutral">Oops! Page not found</p>
        <p className="text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Back to Home Button */}
        <Link
          href="/"
          className="inline-block mt-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}