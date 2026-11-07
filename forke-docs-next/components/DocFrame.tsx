import type { ReactNode } from "react";
export default function DocFrame({ children, toc, wide }: { children: ReactNode; toc?: ReactNode; wide?: boolean }) {
  return (
    <div className={`mx-auto min-h-[calc(100vh-20px)] max-w-[1080px] gap-12 rounded-t-[18px] border border-b-0 border-line bg-bg px-7 pb-28 pt-11 max-[860px]:rounded-none max-[860px]:border-0 max-[860px]:px-[18px] max-[860px]:pb-24 max-[860px]:pt-7 ${wide ? "grid grid-cols-1" : "grid grid-cols-[minmax(0,1fr)_210px] max-[1100px]:grid-cols-1"}`}>
      <article className={`mx-auto w-full min-w-0 animate-enter ${wide ? "max-w-[860px]" : "max-w-[720px]"}`}>{children}</article>
      {toc}
    </div>
  );
}
