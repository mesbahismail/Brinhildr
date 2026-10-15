"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import {
  BadgePercent,
  CalendarDays,
  Check,
  Copy,
  DollarSign,
  MoreVertical,
  Plus,
  Ticket,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState, panelCard, SectionTitle, StatCard, Switch } from "@/components/dashboard/page-kit";

export const promotionStatuses = ["Active", "Scheduled", "Paused", "Expired", "Draft"] as const;
type PromotionStatus = (typeof promotionStatuses)[number];

type Promotion = {
  name: string;
  description: string;
  code: string;
  offer: string;
  status: PromotionStatus;
  dates: string;
  used: number;
  limit: number;
  revenue: string;
};

const initialPromotions: Promotion[] = [
  { name: "Summer Clearance", description: "Storewide markdown on summer collections.", code: "SUMMER25", offer: "25% OFF", status: "Active", dates: "Oct 1 – Oct 31", used: 642, limit: 1000, revenue: "$12.4K" },
  { name: "New Client Welcome", description: "First-order discount for new sign-ups.", code: "WELCOME10", offer: "10% OFF", status: "Active", dates: "Always on", used: 1284, limit: 2000, revenue: "$18.9K" },
  { name: "Free Shipping Weekend", description: "Free delivery on every order this weekend.", code: "FREESHIP", offer: "FREE SHIP", status: "Active", dates: "Oct 17 – Oct 19", used: 218, limit: 500, revenue: "$6.1K" },
  { name: "Leather Bags Bundle", description: "Buy two leather bags and save on both.", code: "BAGS2X", offer: "15% OFF", status: "Active", dates: "Oct 10 – Nov 10", used: 96, limit: 300, revenue: "$4.7K" },
  { name: "Black Friday Early Access", description: "VIP clients shop the sale a week early.", code: "BF30VIP", offer: "30% OFF", status: "Scheduled", dates: "Nov 20 – Nov 30", used: 0, limit: 1500, revenue: "$0" },
  { name: "Autumn Knitwear", description: "Cardigans and knits for cooler days.", code: "KNIT20", offer: "20% OFF", status: "Paused", dates: "Oct 5 – Nov 5", used: 157, limit: 600, revenue: "$3.2K" },
  { name: "Back to School", description: "Backpacks and essentials for the new term.", code: "SCHOOL15", offer: "15% OFF", status: "Expired", dates: "Aug 15 – Sep 15", used: 1500, limit: 1500, revenue: "$21.6K" },
  { name: "Holiday Gift Cards", description: "$20 off every gift card over $100.", code: "GIFT20", offer: "$20 OFF", status: "Draft", dates: "Dec 1 – Dec 24", used: 0, limit: 800, revenue: "$0" },
];

const statusStyles: Record<PromotionStatus, string> = {
  Active: "border-[#2fe4c0]/30 bg-[#2fe4c0]/15 text-[#2fe4c0]",
  Scheduled: "border-[#398df7]/30 bg-[#398df7]/15 text-[#70b0ff]",
  Paused: "border-[#ffc04c]/30 bg-[#ffc04c]/15 text-[#ffc04c]",
  Expired: "border-white/15 bg-white/[.06] text-white/50",
  Draft: "border-white/20 bg-white/10 text-white/70",
};

export function PromotionsPage({
  searchTerm,
  statusFilter,
}: {
  searchTerm: string;
  statusFilter: string;
}) {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filtered = promotions.filter(
    (promotion) =>
      (statusFilter === "All" || promotion.status === statusFilter) &&
      `${promotion.name} ${promotion.code} ${promotion.status}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );
  const activeCount = promotions.filter((promotion) => promotion.status === "Active").length;

  function createPromotion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const code = `${name.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase() || "PROMO"}10`;
    setPromotions((current) => [
      { name, description: "New promotion, not published yet.", code, offer: "10% OFF", status: "Draft", dates: "Not scheduled", used: 0, limit: 500, revenue: "$0" },
      ...current,
    ]);
    setNewName("");
    setCreateOpen(false);
  }

  function setEnabled(code: string, enabled: boolean) {
    setPromotions((current) =>
      current.map((promotion) =>
        promotion.code === code ? { ...promotion, status: enabled ? "Active" : "Paused" } : promotion,
      ),
    );
  }

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      window.setTimeout(() => setCopiedCode((current) => (current === code ? null : current)), 1600);
    } catch {
      setCopiedCode(null);
    }
  }

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-center justify-end gap-4">
        <Button
          onClick={() => setCreateOpen((open) => !open)}
          className="h-8 rounded-full bg-gradient-to-r from-[#f04479] to-[#ff8866] px-3 text-xs text-white"
        >
          <Plus className="size-3.5" /> New
        </Button>
      </div>
      {createOpen && (
        <form onSubmit={createPromotion} className="mb-4 flex items-center gap-2 rounded-xl border border-white/[.08] bg-[#222] p-3">
          <Input aria-label="New promotion name" autoFocus value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="Promotion name" className="h-9 max-w-sm border-white/[.12] bg-[#191919] text-sm" />
          <Button type="submit" size="sm" disabled={!newName.trim()}>Add promotion</Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
        </form>
      )}

      <div className="mb-[clamp(20px,calc(2vw+4px),28px)] grid grid-cols-2 gap-[clamp(12px,1.6vw,20px)] min-[1100px]:grid-cols-4">
        <StatCard label="Active promotions" value={String(activeCount)} change={33} icon={BadgePercent} />
        <StatCard label="Promo revenue" value="$48.2K" change={12.4} icon={DollarSign} />
        <StatCard label="Redemptions" value="3,897" change={8.1} icon={Ticket} />
        <StatCard label="Avg. discount" value="18%" change={-2.3} icon={TrendingUp} />
      </div>

      <SectionTitle title={statusFilter === "All" ? "All promotions" : `${statusFilter} promotions`}>
        <span className="text-[11px] text-white/45">{filtered.length} shown</span>
      </SectionTitle>

      {filtered.length ? (
        <div className="grid grid-cols-1 gap-5 min-[720px]:grid-cols-2 min-[1100px]:grid-cols-3">
          {filtered.map((promotion) => {
            const progress = Math.min(100, Math.round((promotion.used / promotion.limit) * 100));
            const toggleable = promotion.status === "Active" || promotion.status === "Paused";
            return (
              <Card key={promotion.code} className={`${panelCard} gap-4 p-4 sm:p-5`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="bg-gradient-to-r from-[#f04479] to-[#ff8866] bg-clip-text text-[clamp(20px,2vw,26px)] font-semibold leading-none tracking-[-.02em] text-transparent">
                      {promotion.offer}
                    </p>
                    <h3 className="mt-2.5 truncate text-sm font-semibold text-white/90">{promotion.name}</h3>
                    <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-white/45">{promotion.description}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Badge variant="outline" className={`h-5 border px-2 text-[9px] ${statusStyles[promotion.status]}`}>
                      {promotion.status}
                    </Badge>
                    <Button variant="ghost" size="icon-xs" className="text-white/40" aria-label={`More options for ${promotion.name}`}>
                      <MoreVertical className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-white/20 bg-white/[.03] py-1.5 pl-3 pr-1.5">
                  <span className="font-mono text-xs font-semibold tracking-[.12em] text-white/85">{promotion.code}</span>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="rounded-lg text-[10px] text-white/60 hover:text-white"
                    onClick={() => copyCode(promotion.code)}
                    aria-label={`Copy code ${promotion.code}`}
                  >
                    {copiedCode === promotion.code ? (
                      <>
                        <Check className="size-3 text-[#2fe4c0]" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" /> Copy
                      </>
                    )}
                  </Button>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between text-[10px]">
                    <span className="text-white/45">Redemptions</span>
                    <span className="font-medium text-white/80">
                      {promotion.used.toLocaleString("en-US")} / {promotion.limit.toLocaleString("en-US")}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[.07]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#f35177] to-[#ff865d]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-white/[.08] pt-3 text-[10px]">
                  <span className="flex items-center gap-1.5 text-white/55">
                    <CalendarDays className="size-3.5" />
                    {promotion.dates}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="text-white/45">
                      <span className="font-semibold text-white/85">{promotion.revenue}</span> revenue
                    </span>
                    {toggleable && (
                      <Switch
                        checked={promotion.status === "Active"}
                        onChange={(enabled) => setEnabled(promotion.code, enabled)}
                        label={`${promotion.status === "Active" ? "Pause" : "Resume"} ${promotion.name}`}
                      />
                    )}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState>No promotions match your filters.</EmptyState>
      )}
    </section>
  );
}
