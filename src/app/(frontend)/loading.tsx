export default function Loading() {
  return (
    <div className="pt-16 pb-24">
      <div className="animate-pulse">
        {/* Hero skeleton */}
        <div className="mb-12">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-64 bg-gray-200 rounded mt-8"></div>
        </div>
      </div>
    </div>
  )
}
