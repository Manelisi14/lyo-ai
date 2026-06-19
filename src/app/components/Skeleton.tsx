export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="skeleton h-7 w-24" />
        <div className="flex gap-3">
          <div className="skeleton h-8 w-24" />
          <div className="skeleton h-8 w-20" />
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="skeleton h-9 w-64 mb-2" />
        <div className="skeleton h-4 w-48 mb-10" />
        <div className="skeleton h-36 w-full rounded-2xl mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-xl" />
          ))}
        </div>
        <div className="skeleton h-6 w-32 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-36 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
      <div className="skeleton h-5 w-32 mb-2" />
      <div className="skeleton h-4 w-48 mb-4" />
      <div className="skeleton h-3 w-full mb-2" />
      <div className="skeleton h-3 w-3/4" />
    </div>
  );
}