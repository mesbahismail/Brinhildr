"use client";

import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export const panelCard =
  "dashboard-panel-card border-white/[.08] bg-gradient-to-br from-[#292929] to-[#222] shadow-[0_14px_35px_rgba(0,0,0,.13)]";

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: number;
  icon: LucideIcon;
}) {
  const up = change >= 0;
  return (
    <Card className={`${panelCard} gap-3 p-4 sm:p-5`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-white/55">{label}</span>
        <span className="flex size-8 items-center justify-center rounded-xl bg-white/[.06]">
          <Icon className="size-4 text-white/70" />
        </span>
      </div>
      <p className="text-[clamp(18px,2vw,24px)] font-semibold tracking-[-.02em] text-white">{value}</p>
      <p className="flex items-center gap-1.5 text-[10px] text-white/40">
        <span
          className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold ${
            up ? "bg-[#2fe4c0]/12 text-[#2fe4c0]" : "bg-[#f35177]/12 text-[#ff8da3]"
          }`}
        >
          {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {Math.abs(change)}%
        </span>
        vs last month
      </p>
    </Card>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors ${
        checked
          ? "border-transparent bg-gradient-to-r from-[#f04479] to-[#ff8866]"
          : "border-white/15 bg-white/[.08]"
      }`}
    >
      <span
        className={`size-3.5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

export function SectionTitle({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-[clamp(14px,1.4vw,17px)] font-medium text-white/90">{title}</h2>
      {children}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl border border-dashed border-white/10 py-12 text-center text-sm text-white/50">{children}</p>;
}
