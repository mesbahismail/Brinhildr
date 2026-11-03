"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import {
  CircleHelp,
  Clock3,
  FileText,
  MapPin,
  MoreVertical,
  Plus,
  Settings,
  ShoppingBag,
  Store,
  Tag,
  Users,
  Warehouse,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageTitleBar } from "@/components/dashboard/page-kit";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const inventory = [
  { name: "Chic Blouse", category: "Women, Tops", price: "$24.90", quantity: "1,039 Units", status: "Published", sales: "11,423", revenue: "$34,398" },
  { name: "Casual Tunic", category: "Men, Jackets", price: "$24.90", quantity: "1,039 Units", status: "Draft", sales: "11,423", revenue: "$34,398" },
  { name: "Sophisticated Blazer", category: "Women, Tops", price: "$48.00", quantity: "682 Units", status: "Draft", sales: "9,830", revenue: "$29,840" },
  { name: "Classic Leather Biker Jacket", category: "Men, Jackets", price: "$89.90", quantity: "315 Units", status: "Published", sales: "8,940", revenue: "$28,240" },
  { name: "Elegant Silk Top", category: "Women, Tops", price: "$38.50", quantity: "726 Units", status: "Published", sales: "7,412", revenue: "$24,180" },
  { name: "Lightweight Utility Jacket", category: "Men, Jackets", price: "$64.00", quantity: "0 Units", status: "Deleted", sales: "5,980", revenue: "$21,700" },
  { name: "Chic Wrap Blouse", category: "Women, Tops", price: "$29.90", quantity: "524 Units", status: "Published", sales: "5,412", revenue: "$19,870" },
  { name: "Cozy Knit Cardigan", category: "Women, Knitwear", price: "$54.00", quantity: "280 Units", status: "Draft", sales: "4,130", revenue: "$18,230" },
  { name: "Stylish Peplum Top", category: "Women, Tops", price: "$32.00", quantity: "814 Units", status: "Published", sales: "3,984", revenue: "$17,620" },
  { name: "Casual Denim Jacket", category: "Men, Jackets", price: "$72.00", quantity: "190 Units", status: "Published", sales: "3,212", revenue: "$15,410" },
  { name: "Trendy Off-Shoulder Blouse", category: "Women, Tops", price: "$28.00", quantity: "435 Units", status: "Published", sales: "2,903", revenue: "$13,790" },
];

const manufacturers = [
  { name: "Urban Threads Co.", city: "Macao", category: "Footwear & Fashion", revenue: "$26.3M", products: "395", clients: "127", growth: "+23%" },
  { name: "Wardrobe Wizards", city: "Shanghai", category: "Chic Footwear", revenue: "$18.8M", products: "286", clients: "104", growth: "+18%" },
  { name: "Accessory Artisans", city: "Tokyo", category: "Apparel & Accessories", revenue: "$15.2M", products: "241", clients: "88", growth: "+16%" },
  { name: "Trendy Tailors", city: "Bangkok", category: "Trendy Footwear", revenue: "$12.9M", products: "194", clients: "76", growth: "+23%" },
  { name: "StyleCraft Industries", city: "Singapore", category: "Fashion & Gear", revenue: "$11.4M", products: "172", clients: "65", growth: "+14%" },
  { name: "Chic Fabricators", city: "Taipei", category: "Clothing & Accessories", revenue: "$9.7M", products: "149", clients: "58", growth: "+12%" },
  { name: "Couture Creators", city: "Kuala Lumpur", category: "Fashion Items", revenue: "$8.5M", products: "132", clients: "49", growth: "+11%" },
  { name: "Glamour Garment Makers", city: "Osaka", category: "Fashion & Footwear", revenue: "$7.2M", products: "118", clients: "43", growth: "+9%" },
  { name: "Fashion Forge", city: "Seoul", category: "Style & Accessories", revenue: "$6.8M", products: "106", clients: "38", growth: "+8%" },
];

const inventoryStatus: Record<string, string> = {
  Published: "border-[#2fe4c0]/30 bg-[#2fe4c0]/15 text-[#2fe4c0]",
  Draft: "border-white/20 bg-white/10 text-white/65",
  Deleted: "border-[#f35177]/30 bg-[#f35177]/15 text-[#ff8da3]",
};

function ImagePlaceholder({ index }: { index: number }) {
  const backgrounds = [
    "from-[#6d8262] to-[#283c2d]",
    "from-[#53677b] to-[#293541]",
    "from-[#967b68] to-[#4b3933]",
    "from-[#847552] to-[#413c2d]",
  ];
  return (
    <span className={`flex size-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${backgrounds[index % backgrounds.length]}`}>
      <ShoppingBag className="size-4 text-white/70" />
    </span>
  );
}

export function InventoryPage({
  searchTerm,
}: {
  searchTerm: string;
}) {
  const [products, setProducts] = useState(inventory);
  const [createOpen, setCreateOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const filtered = products.filter((product) =>
    `${product.name} ${product.category} ${product.status}`.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newProductName.trim();
    if (!name) return;
    setProducts((current) => [
      { name, category: "New product", price: "$0.00", quantity: "0 Units", status: "Draft", sales: "0", revenue: "$0" },
      ...current,
    ]);
    setNewProductName("");
    setCreateOpen(false);
  }

  return (
    <section>
      <PageTitleBar>
        <div className="flex items-center gap-2">
          <Button onClick={() => setCreateOpen((open) => !open)} className="h-8 rounded-full bg-gradient-to-r from-[#f04479] to-[#ff8866] px-3 text-xs text-white">
            <Plus className="size-3.5" /> New
          </Button>
        </div>
      </PageTitleBar>
      {createOpen && (
        <form onSubmit={createProduct} className="mb-4 flex items-center gap-2 rounded-xl border border-white/[.08] bg-[#222] p-3">
          <Input aria-label="New product name" autoFocus value={newProductName} onChange={(event) => setNewProductName(event.target.value)} placeholder="Product name" className="h-9 max-w-sm border-white/[.12] bg-[#191919] text-sm" />
          <Button type="submit" size="sm" disabled={!newProductName.trim()}>Add product</Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
        </form>
      )}
      <Card className="dashboard-panel-card gap-0 overflow-hidden border-white/[.08] bg-gradient-to-br from-[#292929] to-[#222] p-0">
        <div className="overflow-x-auto">
          <div className="min-w-[920px]">
            <div className="grid h-10 grid-cols-[44px_minmax(190px,1.5fr)_0.8fr_0.9fr_0.8fr_0.8fr_0.8fr_0.9fr_36px] items-center border-b border-white/[.08] bg-white/[.025] px-3 text-[10px] font-medium text-white/45">
              <span className="flex justify-center"><input type="checkbox" aria-label="Select all products" className="size-4 accent-[#f35177]" /></span>
              <span>Product</span><span>Price</span><span>Quantity</span><span>Status</span><span>Date added</span><span>Sales</span><span>Revenue</span><span />
            </div>
            {filtered.map((product, index) => (
              <div key={product.name} className="grid min-h-11 grid-cols-[44px_minmax(190px,1.5fr)_0.8fr_0.9fr_0.8fr_0.8fr_0.8fr_0.9fr_36px] items-center border-b border-white/[.07] px-3 text-[10px] last:border-0 hover:bg-white/[.035]">
                <span className="flex justify-center"><input type="checkbox" aria-label={`Select ${product.name}`} className="size-4 accent-[#f35177]" /></span>
                <div className="flex min-w-0 items-center gap-2 py-1.5">
                  <ImagePlaceholder index={index} />
                  <span className="min-w-0"><span className="block truncate font-semibold text-white/85">{product.name}</span><span className="block truncate text-[9px] text-white/45">{product.category}</span></span>
                </div>
                <span className="text-white/80">{product.price}</span>
                <span className="text-white/75">{product.quantity}</span>
                <Badge variant="outline" className={`h-5 w-fit border px-2 text-[9px] ${inventoryStatus[product.status]}`}>{product.status}</Badge>
                <span className="text-white/65">11/02/2025</span>
                <span className="text-white/75">{product.sales}</span>
                <span className="text-white/75">{product.revenue}</span>
                <Button variant="ghost" size="icon-xs" className="text-white/40" aria-label={`More options for ${product.name}`}><MoreVertical className="size-4" /></Button>
              </div>
            ))}
            {!filtered.length && <p className="p-8 text-center text-sm text-white/50">No products match your search.</p>}
          </div>
        </div>
        <PagePagination count={filtered.length} />
      </Card>
    </section>
  );
}

export function PagePagination({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-between border-t border-white/[.08] px-4 py-3 text-[10px] text-white/50">
      <span>{count ? `1 — ${count}` : "0 results"}</span>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon-xs" className="rounded-full border-white/15 text-white/60" aria-label="Previous page">‹</Button>
        <Button size="icon-xs" className="rounded-full bg-white/10 text-white">1</Button>
        <Button variant="ghost" size="icon-xs" className="text-white/60">2</Button>
        <Button variant="ghost" size="icon-xs" className="text-white/60">3</Button>
        <span className="px-1">…</span>
        <Button variant="outline" size="icon-xs" className="rounded-full border-white/15 text-white/60" aria-label="Next page">›</Button>
      </div>
    </div>
  );
}

export function SellersPage({
  searchTerm,
}: {
  searchTerm: string;
}) {
  const [sellers, setSellers] = useState(manufacturers);
  const [createOpen, setCreateOpen] = useState(false);
  const [newSellerName, setNewSellerName] = useState("");
  const filtered = sellers.filter((seller) =>
    `${seller.name} ${seller.city} ${seller.category}`.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function createSeller(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newSellerName.trim();
    if (!name) return;
    setSellers((current) => [
      { name, city: "New location", category: "Fashion & Apparel", revenue: "$0", products: "0", clients: "0", growth: "0%" },
      ...current,
    ]);
    setNewSellerName("");
    setCreateOpen(false);
  }

  return (
    <section>
      <PageTitleBar>
        <div className="flex items-center gap-2">
          <Button onClick={() => setCreateOpen((open) => !open)} className="h-8 rounded-full bg-gradient-to-r from-[#f04479] to-[#ff8866] px-3 text-xs text-white"><Plus className="size-3.5" /> New</Button>
        </div>
      </PageTitleBar>
      {createOpen && (
        <form onSubmit={createSeller} className="mb-4 flex items-center gap-2 rounded-xl border border-white/[.08] bg-[#222] p-3">
          <Input aria-label="New manufacturer name" autoFocus value={newSellerName} onChange={(event) => setNewSellerName(event.target.value)} placeholder="Manufacturer name" className="h-9 max-w-sm border-white/[.12] bg-[#191919] text-sm" />
          <Button type="submit" size="sm" disabled={!newSellerName.trim()}>Add manufacturer</Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
        </form>
      )}
      <div className="grid grid-cols-1 gap-5 min-[720px]:grid-cols-2 min-[1100px]:grid-cols-3">
        {filtered.map((seller, index) => (
          <Card key={seller.name} className="dashboard-panel-card gap-4 border-white/[.08] bg-gradient-to-br from-[#292929] to-[#222] p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold text-white/90">{seller.name}</h2>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[10px] text-white/45"><MapPin className="size-3" /> {seller.city}<span>·</span><Store className="size-3" /> {seller.category}</p>
              </div>
              <Button variant="ghost" size="icon-xs" className="shrink-0 text-white/45" aria-label={`More options for ${seller.name}`}><MoreVertical className="size-4" /></Button>
            </div>
            <div className="grid grid-cols-3 border-y border-white/[.08] py-3">
              <div><p className="text-sm font-semibold text-white/90">{seller.revenue}</p><p className="mt-0.5 text-[9px] text-white/45">Revenue</p></div>
              <div className="border-x border-white/[.08] px-3"><p className="text-sm font-semibold text-white/90">{seller.products}</p><p className="mt-0.5 text-[9px] text-white/45">Products</p></div>
              <div className="pl-3"><p className="text-sm font-semibold text-white/90">{seller.clients}</p><p className="mt-0.5 text-[9px] text-white/45">Clients</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5"><span className="text-sm font-semibold text-white/85">{seller.growth}</span><span className="text-[9px] text-white/45">Sales</span></div>
              <div className="flex h-8 flex-1 items-end gap-1" aria-label="Recent sales trend">
                {Array.from({ length: 12 }, (_, barIndex) => (
                  <span key={barIndex} className="flex-1 rounded-t-sm bg-gradient-to-t from-[#f04479] to-[#ff8866]" style={{ height: `${35 + ((barIndex * 19 + index * 11) % 55)}%` }} />
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
      {!filtered.length && <p className="py-12 text-center text-sm text-white/50">No manufacturers match your search.</p>}
    </section>
  );
}

export const globalSearchItems = [
  { title: "White Flex T-Shirt", detail: "Inventory · Women, Tops", href: "/inventory", icon: Warehouse },
  { title: "White Flex T-Shirt", detail: "Recently viewed product", href: "/inventory", icon: Clock3 },
  { title: "White Flex T-Shirt", detail: "Order #968 · Alex Ludwig", href: "/orders/968", icon: FileText },
  { title: "Chic Blouse", detail: "Inventory · Women, Tops", href: "/inventory", icon: Warehouse },
  { title: "Order #624", detail: "Daniel Di Santo · Confirmed", href: "/orders/624", icon: FileText },
  { title: "Urban Threads Co.", detail: "Manufacturer · Macao", href: "/sellers", icon: Store },
  { title: "SUMMER25", detail: "Promotion · Summer Clearance", href: "/promotions", icon: Tag },
  { title: "Maya Johnson", detail: "Client · VIP · Portland", href: "/clients", icon: Users },
  { title: "Notification settings", detail: "Settings · Notifications", href: "/settings", icon: Settings },
  { title: "How do refunds work?", detail: "Help & Support · Orders", href: "/help", icon: CircleHelp },
];
