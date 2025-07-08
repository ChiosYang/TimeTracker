import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-center dark:bg-black">
      <div className="max-w-md space-y-4">
        <h1 className="text-9xl font-bold text-gray-900 dark:text-gray-50">404</h1>
        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Page Not Found</p>
        <p className="text-gray-500 dark:text-gray-400">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
