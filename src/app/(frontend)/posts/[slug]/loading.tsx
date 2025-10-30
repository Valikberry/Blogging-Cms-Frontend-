export default function Loading() {
  return (
    <div className="pt-16 pb-24">
      <div className="animate-pulse">
        {/* Post header skeleton */}
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>

        {/* Featured image skeleton */}
        <div className="h-96 bg-gray-200 rounded mb-8"></div>

        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>
    </div>
  )
}
