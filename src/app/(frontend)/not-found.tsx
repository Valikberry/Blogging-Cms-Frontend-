import Link from 'next/link'
import { Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      {/* Large 404 with magnifying glass */}
      <div className="relative mb-6">
        <h1 className="text-[150px] sm:text-[180px] font-bold text-gray-200 leading-none select-none">
          404
        </h1>
        <div className="absolute bottom-4 right-8 sm:bottom-6 sm:right-12">
          <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 -rotate-12" strokeWidth={1.5} />
        </div>
      </div>

      {/* Error message */}
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 text-center">
        Whoops! Something went wrong.
      </h2>
      <p className="text-gray-500 text-center max-w-md mb-8 text-[15px]">
        The resource you attempted to reach could not be retrieved. It seems this link is either
        broken or the page was removed.
      </p>

      {/* Back to Home button */}
      <Link
        href="/"
        className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        Back To Home
      </Link>
    </div>
  )
}
