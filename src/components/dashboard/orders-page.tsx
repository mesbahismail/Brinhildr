"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowDownToLine,
  Bell,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  MoreVertical,
  Package,
  Pencil,
  Plus,
  Search,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type OrderStatus = "Ordered" | "Confirmed" | "Shipped" | "Delivered";

type Order = {
  id: string;
  customer: string;
  address: string;
  status: OrderStatus;
  date: string;
  total: string;
};

const orders: Order[] = [
  { id: "624", customer: "Daniel Di Santo", address: "477 Maple Street, Anaheim", status: "Confirmed", date: "24/12/2017", total: "$343.90" },
  { id: "968", customer: "Alex Ludwig", address: "477 Maple Street, Anaheim", status: "Ordered", date: "24/12/2017", total: "$43.99" },
  { id: "967", customer: "Maya Johnson", address: "28 Pine Avenue, Portland", status: "Confirmed", date: "23/12/2017", total: "$129.50" },
  { id: "966", customer: "Noah Williams", address: "16 Lake Road, Austin", status: "Shipped", date: "22/12/2017", total: "$78.25" },
  { id: "965", customer: "Sophia Martinez", address: "920 Cedar Lane, Denver", status: "Delivered", date: "21/12/2017", total: "$204.00" },
  { id: "964", customer: "Ethan Brown", address: "31 Ocean Drive, Miami", status: "Ordered", date: "20/12/2017", total: "$59.95" },
  { id: "963", customer: "Olivia Davis", address: "80 Market Street, Seattle", status: "Shipped", date: "19/12/2017", total: "$91.00" },
  { id: "962", customer: "Liam Wilson", address: "12 Hillcrest, Boston", status: "Delivered", date: "18/12/2017", total: "$149.99" },
  { id: "961", customer: "Ava Taylor", address: "56 Birch Court, Chicago", status: "Confirmed", date: "17/12/2017", total: "$67.40" },
  { id: "960", customer: "Lucas Thomas", address: "95 Park Avenue, Phoenix", status: "Ordered", date: "16/12/2017", total: "$118.00" },
];

const statusStyles: Record<OrderStatus, string> = {
  Ordered: "border-white/20 bg-white/10 text-white/75",
  Confirmed: "border-[#ffc04c]/30 bg-[#ffc04c]/15 text-[#ffc04c]",
  Shipped: "border-[#398df7]/30 bg-[#398df7]/15 text-[#70b0ff]",
  Delivered: "border-[#2fe4c0]/30 bg-[#2fe4c0]/15 text-[#2fe4c0]",
};

export function OrdersPage({
  searchTerm,
  onCreate,
}: {
  searchTerm: string;
  onCreate: () => void;
}) {
  const filteredOrders = orders.filter((order) =>
    `${order.id} ${order.customer} ${order.address} ${order.status}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <section className="dashboard-orders-page">
      <div className="mb-5 flex flex-wrap items-center justify-end gap-4">
        <div className="flex items-center gap-2">
          <Button
            className="h-8 rounded-full bg-gradient-to-r from-[#f04479] to-[#ff8866] px-3 text-xs text-white hover:brightness-110"
            onClick={onCreate}
          >
            <Plus className="size-3.5" />
            New
          </Button>
        </div>
      </div>

      <Card className="dashboard-orders-table gap-0 overflow-hidden border-white/[.08] bg-gradient-to-br from-[#292929] to-[#222] p-0">
        <div className="dashboard-orders-table-scroll overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="grid h-10 grid-cols-[44px_1fr_1.2fr_0.8fr_0.8fr_0.75fr_36px] items-center border-b border-white/[.08] bg-white/[.025] px-3 text-[10px] font-medium text-white/45">
              <span className="flex justify-center">
                <input aria-label="Select all orders" type="checkbox" className="size-4 accent-[#f35177]" />
              </span>
              <span>Order</span>
              <span>Ship to</span>
              <span>Status</span>
              <span>Date</span>
              <span>Total</span>
              <span />
            </div>
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="grid min-h-[47px] grid-cols-[44px_1fr_1.2fr_0.8fr_0.8fr_0.75fr_36px] items-center border-b border-white/[.07] px-3 text-[10px] last:border-b-0 hover:bg-white/[.035]"
              >
                <span className="flex justify-center">
                  <input
                    aria-label={`Select order ${order.id}`}
                    type="checkbox"
                    className="size-4 accent-[#f35177]"
                  />
                </span>
                <Link href={`/orders/${order.id}`} className="group min-w-0 py-2">
                  <span className="block font-semibold text-white group-hover:text-[#ff9aa9]">
                    #{order.id}
                  </span>
                  <span className="block truncate text-[9px] text-white/45">
                    By {order.customer}
                  </span>
                </Link>
                <span className="min-w-0 pr-2 font-medium text-white/80">
                  <span className="block truncate">{order.address.split(",")[0]}</span>
                  <span className="block truncate text-white/55">
                    {order.address.split(",").slice(1).join(",").trim()}
                  </span>
                </span>
                <span>
                  <Badge
                    variant="outline"
                    className={`h-5 border px-2 text-[9px] font-medium ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </Badge>
                </span>
                <span className="text-white/75">{order.date}</span>
                <span>
                  <span className="block font-semibold text-white/85">{order.total}</span>
                  <span className="block text-[9px] text-white/45">Via PayPal</span>
                </span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="text-white/40 hover:text-white"
                  aria-label={`More options for order ${order.id}`}
                >
                  <MoreVertical className="size-4" />
                </Button>
              </div>
            ))}
            {filteredOrders.length === 0 && (
              <div className="flex min-h-32 flex-col items-center justify-center gap-2 text-sm text-white/50">
                <Search className="size-4" />
                No orders match your search.
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/[.08] px-4 py-3 text-[10px] text-white/50">
          <span>
            {filteredOrders.length ? `1 — ${filteredOrders.length}` : "0 orders"}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-xs" className="rounded-full border-white/15 text-white/60" aria-label="Previous page">
              ‹
            </Button>
            <Button size="icon-xs" className="rounded-full bg-white/10 text-white">1</Button>
            <Button variant="ghost" size="icon-xs" className="text-white/60">2</Button>
            <Button variant="ghost" size="icon-xs" className="text-white/60">3</Button>
            <span className="px-1">…</span>
            <Button variant="outline" size="icon-xs" className="rounded-full border-white/15 text-white/60" aria-label="Next page">
              ›
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Bell;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3 border-b border-white/[.08] py-4 last:border-b-0 last:pb-0">
      <Icon className="mt-0.5 size-4 shrink-0 text-white/45" />
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-white/90">{title}</h3>
        <div className="mt-1 text-xs leading-relaxed text-white/50">{children}</div>
      </div>
    </div>
  );
}

export function OrderDetailPage({ orderId }: { orderId: string }) {
  const order = orders.find((item) => item.id === orderId) ?? orders[0];
  const statuses: OrderStatus[] = ["Ordered", "Confirmed", "Shipped", "Delivered"];
  const activeStatus = statuses.indexOf(order.status);
  const products = [
    { name: "Elegant sunny dress", price: "$190.00", original: "$29.90", color: "from-[#517148] to-[#253c2a]" },
    { name: "Elegant sunny dress", price: "$149.00", original: "$29.90", color: "from-[#8d7055] to-[#46372c]" },
  ];

  return (
    <section className="dashboard-order-detail">
      <div className="mb-5 flex flex-wrap items-center justify-end gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-8 rounded-full border-white/20 bg-transparent px-3 text-xs text-white/80">
            <Pencil className="size-3.5" />
            Edit
          </Button>
          <Button variant="outline" className="h-8 rounded-full border-white/20 bg-transparent px-3 text-xs text-white/80">
            <ArrowDownToLine className="size-3.5" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 min-[900px]:grid-cols-2">
        <Card className="flex min-h-[440px] flex-col gap-0 border-white/[.08] bg-gradient-to-br from-[#292929] to-[#222] p-0">
          <div className="border-b border-white/[.08] px-4 py-4">
            <h2 className="text-sm font-semibold text-white/90">Summary</h2>
          </div>
          <div className="flex-1 px-4">
            {products.map((product, index) => (
              <div key={`${product.name}-${index}`} className="flex gap-3 border-b border-white/[.08] py-4 last:border-b-0">
                <div className={`flex size-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${product.color}`}>
                  <Package className="size-7 text-white/65" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-white/40">Brand</span>
                  <h3 className="truncate text-sm font-semibold text-white/90">{product.name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-white/90">{product.price}</span>
                    <span className="text-white/35 line-through">{product.original}</span>
                    <Badge className="h-4 rounded px-1.5 text-[9px]">15% OFF</Badge>
                  </div>
                  <p className="mt-1 text-[10px] leading-relaxed text-white/45">Qty: 1<br />Color: White</p>
                </div>
              </div>
            ))}
            <p className="flex items-center gap-2 py-3 text-xs font-medium text-[#2fe4c0]">
              <CheckCircle2 className="size-4" />
              NEWYEAR Voucher applied
            </p>
          </div>
          <div className="space-y-2 border-t border-white/[.08] px-4 py-4 text-xs">
            <div className="flex justify-between text-white/55"><span>Sub total</span><span>$339.90</span></div>
            <div className="flex justify-between text-[#2fe4c0]"><span>Vouchers</span><span>−$20.00</span></div>
            <div className="flex justify-between text-white/55"><span>Shipping costs</span><span>$24.00</span></div>
            <div className="flex justify-between border-t border-white/[.08] pt-3 text-sm font-semibold text-white/90"><span>Total</span><span>$343.90</span></div>
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          <Card className="gap-5 border-white/[.08] bg-gradient-to-br from-[#292929] to-[#222] p-4">
            <h2 className="text-sm font-semibold text-white/90">Order status</h2>
            <div className="grid grid-cols-4 gap-1">
              {statuses.map((status, index) => {
                const complete = index <= activeStatus;
                return (
                  <div key={status} className="relative flex flex-col items-center gap-2 text-center">
                    {index > 0 && (
                      <span className={`absolute right-1/2 top-4 h-px w-full ${index <= activeStatus ? "bg-[#2fe4c0]" : "bg-white/15"}`} />
                    )}
                    <span className={`relative z-10 flex size-8 items-center justify-center rounded-full border ${
                      complete
                        ? "border-[#2fe4c0] bg-[#2fe4c0]/10 text-[#2fe4c0]"
                        : "border-white/20 text-white/35"
                    }`}>
                      {complete ? <Check className="size-4" /> : <Clock3 className="size-3.5" />}
                    </span>
                    <span className={`text-[9px] ${complete ? "text-white/80" : "text-white/40"}`}>{status}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="gap-0 border-white/[.08] bg-gradient-to-br from-[#292929] to-[#222] px-4 py-4">
            <h2 className="mb-1 text-sm font-semibold text-white/90">Order details</h2>
            <InfoRow icon={Bell} title="Billing details">
              Craig Hafer Walksy 8 Kane Road Morgantown, PA 19543<br />
              United States (US)
            </InfoRow>
            <InfoRow icon={Bell} title="Shipping details">
              {order.customer} · {order.address}<br />
              United States (US)
            </InfoRow>
            <InfoRow icon={CreditCard} title="Payment method">
              PayPal
            </InfoRow>
          </Card>

          <Card className="gap-4 border-white/[.08] bg-gradient-to-br from-[#292929] to-[#222] p-4">
            <h2 className="text-sm font-semibold text-white/90">Client details</h2>
            <div className="flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f35177] to-[#80545e]">
                <UserRound className="size-6 text-white" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white/90">{order.customer}</p>
                <p className="truncate text-[10px] text-white/45">{order.customer.toLowerCase().replaceAll(" ", ".")}@email.com</p>
                <p className="truncate text-[10px] text-white/45">California, United States</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
