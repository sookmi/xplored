export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-96 mb-6" />

        <div className="flex gap-4 mb-8">
          <div className="h-10 bg-gray-100 rounded-full w-20" />
          <div className="h-10 bg-gray-100 rounded-full w-32" />
          <div className="h-10 bg-gray-100 rounded-full w-28" />
          <div className="h-10 bg-gray-100 rounded-full w-24" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-64" />
          ))}
        </div>
      </div>
    </div>
  );
}
