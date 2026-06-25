export function LoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-48 animate-pulse rounded-md border border-terminal-border bg-terminal-panel"
        >
          <div className="m-5 h-5 w-20 rounded bg-slate-700/60" />
          <div className="mx-5 mt-8 h-8 w-36 rounded bg-slate-800" />
          <div className="mx-5 mt-8 grid grid-cols-3 gap-3">
            <div className="h-10 rounded bg-slate-800" />
            <div className="h-10 rounded bg-slate-800" />
            <div className="h-10 rounded bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
