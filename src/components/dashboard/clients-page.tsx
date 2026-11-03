"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import {
  ChevronRight,
  DollarSign,
  Mail,
  MapPin,
  MoreVertical,
  Plus,
  Repeat,
  Search,
  UserPlus,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { PagePagination } from "@/components/dashboard/extra-pages";
import { PageTitleBar, panelCard, StatCard } from "@/components/dashboard/page-kit";

export const clientStatuses = ["VIP", "Active", "New", "Inactive"] as const;
type ClientStatus = (typeof clientStatuses)[number];

type Client = {
  name: string;
  email: string;
  location: string;
  orders: number;
  spent: string;
  lastOrder: string;
  status: ClientStatus;
  recentOrders: { id: string; date: string; total: string }[];
};

function emailFor(name: string) {
  return `${name.toLowerCase().replaceAll(" ", ".")}@email.com`;
}

const initialClients: Client[] = [
  { name: "Daniel Di Santo", location: "Anaheim, CA", orders: 42, spent: "$6,420", lastOrder: "24/12/2017", status: "VIP", recentOrders: [{ id: "624", date: "24/12/2017", total: "$343.90" }, { id: "968", date: "24/12/2017", total: "$43.99" }] },
  { name: "Maya Johnson", location: "Portland, OR", orders: 28, spent: "$3,870", lastOrder: "23/12/2017", status: "VIP", recentOrders: [{ id: "967", date: "23/12/2017", total: "$129.50" }] },
  { name: "Noah Williams", location: "Austin, TX", orders: 17, spent: "$1,925", lastOrder: "22/12/2017", status: "Active", recentOrders: [{ id: "966", date: "22/12/2017", total: "$78.25" }] },
  { name: "Sophia Martinez", location: "Denver, CO", orders: 15, spent: "$2,310", lastOrder: "21/12/2017", status: "Active", recentOrders: [{ id: "965", date: "21/12/2017", total: "$204.00" }] },
  { name: "Ethan Brown", location: "Miami, FL", orders: 3, spent: "$184", lastOrder: "20/12/2017", status: "New", recentOrders: [{ id: "964", date: "20/12/2017", total: "$59.95" }] },
  { name: "Olivia Davis", location: "Seattle, WA", orders: 11, spent: "$1,040", lastOrder: "19/12/2017", status: "Active", recentOrders: [{ id: "963", date: "19/12/2017", total: "$91.00" }] },
  { name: "Liam Wilson", location: "Boston, MA", orders: 9, spent: "$1,215", lastOrder: "18/12/2017", status: "Active", recentOrders: [{ id: "962", date: "18/12/2017", total: "$149.99" }] },
  { name: "Ava Taylor", location: "Chicago, IL", orders: 2, spent: "$96", lastOrder: "17/12/2017", status: "New", recentOrders: [{ id: "961", date: "17/12/2017", total: "$67.40" }] },
  { name: "Lucas Thomas", location: "Phoenix, AZ", orders: 6, spent: "$540", lastOrder: "16/12/2017", status: "Inactive", recentOrders: [{ id: "960", date: "16/12/2017", total: "$118.00" }] },
  { name: "Alex Ludwig", location: "San Diego, CA", orders: 1, spent: "$44", lastOrder: "24/12/2017", status: "New", recentOrders: [{ id: "968", date: "24/12/2017", total: "$43.99" }] },
].map((client) => ({ ...client, email: emailFor(client.name) }) as Client);

const statusStyles: Record<ClientStatus, string> = {
  VIP: "border-[#f35177]/30 bg-[#f35177]/15 text-[#ff8da3]",
  Active: "border-[#2fe4c0]/30 bg-[#2fe4c0]/15 text-[#2fe4c0]",
  New: "border-[#398df7]/30 bg-[#398df7]/15 text-[#70b0ff]",
  Inactive: "border-white/15 bg-white/[.06] text-white/50",
};

const avatarGradients = [
  "from-[#f35177] to-[#80545e]",
  "from-[#ff8866] to-[#a2513f]",
  "from-[#2fe4c0] to-[#1d6f61]",
  "from-[#398df7] to-[#2a4f84]",
  "from-[#ffc04c] to-[#8a6a2b]",
];

function ClientAvatar({ name, index, size = "size-8 text-[10px]" }: { name: string; index: number; size?: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  return (
    <span
      aria-hidden="true"
      className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white ${avatarGradients[index % avatarGradients.length]}`}
    >
      {initials}
    </span>
  );
}

const columns = "grid-cols-[44px_minmax(200px,1.6fr)_1fr_0.6fr_0.8fr_0.8fr_0.7fr_36px]";

export function ClientsPage({
  searchTerm,
  statusFilter,
}: {
  searchTerm: string;
  statusFilter: string;
}) {
  const [clients, setClients] = useState(initialClients);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [selected, setSelected] = useState<Client | null>(null);

  const filtered = clients.filter(
    (client) =>
      (statusFilter === "All" || client.status === statusFilter) &&
      `${client.name} ${client.email} ${client.location} ${client.status}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  function createClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setClients((current) => [
      { name, email: emailFor(name), location: "Not set", orders: 0, spent: "$0", lastOrder: "—", status: "New", recentOrders: [] },
      ...current,
    ]);
    setNewName("");
    setCreateOpen(false);
  }

  const selectedIndex = selected ? clients.findIndex((client) => client.name === selected.name) : 0;

  return (
    <section>
      <PageTitleBar>
        <Button
          onClick={() => setCreateOpen((open) => !open)}
          className="h-8 rounded-full bg-gradient-to-r from-[#f04479] to-[#ff8866] px-3 text-xs text-white"
        >
          <Plus className="size-3.5" /> New
        </Button>
      </PageTitleBar>
      {createOpen && (
        <form onSubmit={createClient} className="mb-4 flex items-center gap-2 rounded-xl border border-white/[.08] bg-[#222] p-3">
          <Input aria-label="New client name" autoFocus value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="Client name" className="h-9 max-w-sm border-white/[.12] bg-[#191919] text-sm" />
          <Button type="submit" size="sm" disabled={!newName.trim()}>Add client</Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
        </form>
      )}

      <div className="mb-[clamp(20px,calc(2vw+4px),28px)] grid grid-cols-2 gap-[clamp(12px,1.6vw,20px)] min-[1100px]:grid-cols-4">
        <StatCard label="Total clients" value="2,845" change={8.2} icon={Users} />
        <StatCard label="New this month" value="214" change={12} icon={UserPlus} />
        <StatCard label="Returning rate" value="64%" change={3.1} icon={Repeat} />
        <StatCard label="Avg. order value" value="$86.40" change={-2.4} icon={DollarSign} />
      </div>

      <Card className={`${panelCard} gap-0 overflow-hidden p-0`}>
        <div className="overflow-x-auto">
          <div className="min-w-[860px]">
            <div className={`grid h-10 ${columns} items-center border-b border-white/[.08] bg-white/[.025] px-3 text-[10px] font-medium text-white/45`}>
              <span className="flex justify-center">
                <input type="checkbox" aria-label="Select all clients" className="size-4 accent-[#f35177]" />
              </span>
              <span>Client</span>
              <span>Location</span>
              <span>Orders</span>
              <span>Total spent</span>
              <span>Last order</span>
              <span>Status</span>
              <span />
            </div>
            {filtered.map((client) => {
              const index = clients.indexOf(client);
              return (
                <div
                  key={client.email}
                  className={`grid min-h-[52px] ${columns} items-center border-b border-white/[.07] px-3 text-[10px] last:border-b-0 hover:bg-white/[.035]`}
                >
                  <span className="flex justify-center">
                    <input type="checkbox" aria-label={`Select ${client.name}`} className="size-4 accent-[#f35177]" />
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelected(client)}
                    className="group flex min-w-0 items-center gap-2.5 py-2 text-left"
                  >
                    <ClientAvatar name={client.name} index={index} />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-white group-hover:text-[#ff9aa9]">{client.name}</span>
                      <span className="block truncate text-[9px] text-white/45">{client.email}</span>
                    </span>
                  </button>
                  <span className="flex min-w-0 items-center gap-1.5 text-white/75">
                    <MapPin className="size-3 shrink-0 text-white/35" />
                    <span className="truncate">{client.location}</span>
                  </span>
                  <span className="text-white/80">{client.orders}</span>
                  <span className="font-semibold text-white/85">{client.spent}</span>
                  <span className="text-white/65">{client.lastOrder}</span>
                  <span>
                    <Badge variant="outline" className={`h-5 border px-2 text-[9px] ${statusStyles[client.status]}`}>
                      {client.status}
                    </Badge>
                  </span>
                  <Button variant="ghost" size="icon-xs" className="text-white/40 hover:text-white" aria-label={`More options for ${client.name}`}>
                    <MoreVertical className="size-4" />
                  </Button>
                </div>
              );
            })}
            {!filtered.length && (
              <div className="flex min-h-32 flex-col items-center justify-center gap-2 text-sm text-white/50">
                <Search className="size-4" />
                No clients match your filters.
              </div>
            )}
          </div>
        </div>
        <PagePagination count={filtered.length} />
      </Card>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent side="right" className="w-[min(380px,100vw)] gap-0 border-white/10 bg-[#1d1d1d] p-0 text-white">
          {selected && (
            <>
              <div className="flex flex-col items-center border-b border-white/[.08] px-6 pb-6 pt-10 text-center">
                <ClientAvatar name={selected.name} index={selectedIndex} size="size-16 text-lg" />
                <SheetTitle className="mt-3 text-lg font-semibold text-white">{selected.name}</SheetTitle>
                <SheetDescription className="mt-1 text-xs text-white/50">{selected.email}</SheetDescription>
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="outline" className={`h-5 border px-2 text-[9px] ${statusStyles[selected.status]}`}>
                    {selected.status}
                  </Badge>
                  <span className="flex items-center gap-1 text-[10px] text-white/50">
                    <MapPin className="size-3" />
                    {selected.location}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 border-b border-white/[.08]">
                {[
                  ["Orders", String(selected.orders)],
                  ["Total spent", selected.spent],
                  ["Last order", selected.lastOrder],
                ].map(([label, value], index) => (
                  <div key={label} className={`px-4 py-4 text-center ${index ? "border-l border-white/[.08]" : ""}`}>
                    <p className="text-sm font-semibold text-white/90">{value}</p>
                    <p className="mt-0.5 text-[9px] text-white/45">{label}</p>
                  </div>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <h3 className="mb-3 text-xs font-semibold text-white/80">Recent orders</h3>
                {selected.recentOrders.length ? (
                  <ul className="space-y-2">
                    {selected.recentOrders.map((order) => (
                      <li key={order.id}>
                        <Link
                          href={`/orders/${order.id}`}
                          className="flex items-center justify-between rounded-xl border border-white/[.08] bg-white/[.03] px-3 py-2.5 transition-colors hover:border-white/20"
                        >
                          <span>
                            <span className="block text-xs font-semibold text-white/90">#{order.id}</span>
                            <span className="block text-[10px] text-white/45">{order.date}</span>
                          </span>
                          <span className="flex items-center gap-2 text-xs font-medium text-white/80">
                            {order.total}
                            <ChevronRight className="size-3.5 text-white/40" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-white/45">No orders yet.</p>
                )}
              </div>
              <div className="border-t border-white/[.08] p-5">
                <a
                  href={`mailto:${selected.email}`}
                  className="flex h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f04479] to-[#ff8866] text-xs font-semibold text-white hover:brightness-110"
                >
                  <Mail className="size-4" />
                  Email {selected.name.split(" ")[0]}
                </a>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
