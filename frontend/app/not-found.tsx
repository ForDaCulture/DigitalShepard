import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">404 - Page Not Found</h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link 
          href="/" 
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
} 