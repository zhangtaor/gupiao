import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function IdeasLoading() {
  return (
    <main className="min-h-screen bg-terminal-bg px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 h-10 w-80 animate-pulse rounded bg-slate-800" />
        <LoadingSkeleton />
      </div>
    </main>
  );
}
