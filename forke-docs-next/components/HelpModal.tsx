"use client";
import Backdrop from "./Backdrop";
import Icon from "./Icon";
import { useDocs } from "./DocsProvider";

const KEYS: [string[], string][] = [
  [["Ctrl", "K"], "Search and commands (or /)"], [["A"], "Ask AI"], [["[", "]"], "Previous / next page"],
  [["T"], "Toggle light and dark"], [["?"], "Show this panel"], [["Esc"], "Close anything open"],
];
export default function HelpModal() {
  const { modal, closeModal, resetProgress } = useDocs();
  if (modal !== "help") return null;
  return (
    <Backdrop>
      <div role="dialog" aria-label="Keyboard shortcuts" className="relative w-[min(460px,calc(100vw-24px))] animate-pop rounded-[18px] border border-line2 bg-panel p-6 shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
        <button onClick={closeModal} aria-label="Close" className="absolute right-4 top-4 grid size-7 place-items-center rounded-full bg-raise text-muted hover:text-fg"><Icon name="close" className="size-3.5" /></button>
        <h2 className="mb-3.5 text-[17px] font-semibold">Keyboard shortcuts</h2>
        <dl>
          {KEYS.map(([k, d]) => (
            <div key={d} className="flex justify-between gap-4 border-t border-line py-[9px] text-sm">
              <dt className="flex items-center gap-1 text-muted">{k.map((x) => <kbd key={x} className="kbd">{x}</kbd>)}</dt><dd>{d}</dd>
            </div>
          ))}
        </dl>
        <button onClick={resetProgress} className="btn mt-4">Reset my docs progress</button>
      </div>
    </Backdrop>
  );
}
