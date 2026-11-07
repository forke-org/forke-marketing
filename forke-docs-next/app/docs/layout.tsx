import type { ReactNode } from "react";
import { DocsProvider } from "@/components/DocsProvider";
import DocsShell from "@/components/DocsShell";
import { NAV, ORDER, buildIndex, getAllMeta } from "@/lib/docs";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsProvider nav={NAV} pages={getAllMeta()} order={ORDER} index={buildIndex()}>
      <DocsShell>{children}</DocsShell>
    </DocsProvider>
  );
}
