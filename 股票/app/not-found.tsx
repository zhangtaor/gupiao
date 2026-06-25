import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-terminal-bg px-6 text-slate-100">
      <div className="rounded-md border border-terminal-border bg-terminal-panel p-6 text-center">
        <h1 className="text-2xl font-semibold">Stock not found</h1>
        <p className="mt-2 text-sm text-terminal-muted">This ticker is not available in the mock universe.</p>
        <Link
          href="/ideas"
          className="mt-5 inline-flex rounded-md border border-terminal-border px-4 py-2 text-sm hover:border-terminal-cyan hover:text-terminal-cyan"
        >
          Back to ideas
        </Link>
      </div>
    </main>
  );
}
