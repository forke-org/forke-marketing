"use client";
import { useEffect, useState } from "react";

type Phase = "idle" | "reserved" | "active" | "ended";
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function ClaimTimer() {
  const [phase, setPhase] = useState<Phase>("idle"), [left, setLeft] = useState(1200), [msg, setMsg] = useState("Available in the feed");
  useEffect(() => {
    if (phase !== "reserved") return;
    const iv = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(iv);
  }, [phase]);
  useEffect(() => {
    if (phase === "reserved" && left <= 0) { setPhase("ended"); setMsg("Reservation ended. The task returned to the queue."); }
  }, [left, phase]);

  const claim = () => { setLeft(1200); setPhase("reserved"); setMsg("Reserved for you. Activate before the timer ends."); };
  const clock = phase === "active" ? "Active" : fmt(Math.max(0, left));
  const color = { idle: "", reserved: "text-accent-text", active: "text-green-500", ended: "text-red-500" }[phase];
  return (
    <div className="w-card">
      <div className="w-head"><b>Claim a task</b><span className="w-tag">Simulation</span></div>
      <div className="w-body">
        <div className="flex items-center justify-between rounded-[10px] border border-line bg-bg px-3.5 py-3">
          <div><b className="block">fix-navbar-overflow</b><small className="text-muted">bug fix · React · about 1h</small></div>
          <strong className="font-mono text-lg font-semibold text-accent-text">₹300</strong>
        </div>
        <div className="flex flex-wrap items-baseline gap-4">
          <span className={`font-mono text-[34px] font-semibold tracking-tight ${color}`}>{phase === "idle" ? "20:00" : clock}</span>
          <span className="min-w-[200px] flex-1 text-sm text-muted">{msg}</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {(phase === "idle" || phase === "ended") && <button className="btn btn-primary" onClick={claim}>Claim task</button>}
          {phase === "reserved" && <>
            <button className="btn btn-primary" onClick={() => { setPhase("active"); setMsg("Branch forke/task-2841 created. Start building."); }}>Activate</button>
            <button className="btn" onClick={() => setLeft(10)}>Skip to last 10 seconds</button>
          </>}
          {(phase === "reserved" || phase === "active") && <button className="btn" onClick={() => { setPhase("idle"); setLeft(1200); setMsg("Forfeited. The task returned to the standby queue and your completion rate is affected."); }}>Forfeit</button>}
        </div>
      </div>
    </div>
  );
}
