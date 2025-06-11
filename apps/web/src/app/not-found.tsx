import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-6xl font-bold text-gray-800">404</h1>
        <h2 className="mb-4 text-2xl font-medium text-gray-600">Page Not Found</h2>
        <p className="text-gray-500">
          Oops! The page you are looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <div className="flex gap-4">
        <Link 
          href="/" 
          className="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-800 hover:bg-gray-300"
        >
          Go Home
        </Link>
        <Link 
          href="/dashboard" 
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
} 