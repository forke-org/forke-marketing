import Link from "next/link";
import DocFrame from "@/components/DocFrame";
export default function NotFound() {
  return (
    <DocFrame wide>
      <h1 className="text-[34px] font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 text-muted">That docs page doesn’t exist. Press <kbd className="kbd">Ctrl K</kbd> to search, or <Link className="text-accent-text" href="/docs">go to the docs home</Link>.</p>
    </DocFrame>
  );
}
