"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { CardMenu } from "@/components/dashboard/card-menu";
import "./dashboard.css";

const products = [
  {
    name: "Summer Dress",
    price: "$25.50",
    purchases: "45,678",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=120&q=80",
  },
  {
    name: "Elegant T-shirt",
    price: "$25.50",
    purchases: "45,678",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=120&q=80",
  },
  {
    name: "Oversized Hoodie",
    price: "$25.50",
    purchases: "45,678",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
  },
  {
    name: "Summer Dress",
    price: "$25.50",
    purchases: "45,678",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=120&q=80",
  },
];

export function TopProducts({ searchTerm }: { searchTerm: string }) {
  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Card className="dark dashboard-secondary-card min-w-0 gap-0 overflow-hidden border-white/[.06] bg-gradient-to-br from-[#292929] to-[#222] p-0 shadow-[0_14px_35px_rgba(0,0,0,.13)]">
      <div className="dashboard-card-header flex items-center justify-between">
        <CardTitle className="dashboard-card-title font-medium">Top Products</CardTitle>
        <CardMenu
          filename="brinhildr-products.csv"
          headers={["Product", "Price", "Purchases"]}
          rows={filtered.map(({ name, price, purchases }) => [name, price, purchases])}
        />
      </div>
      <div className="dashboard-products-content">
        {filtered.length ? (
          filtered.map((product, index) => (
            <div
              key={`${product.name}-${index}`}
              className="dashboard-product-row flex items-center border-b border-white/[.07] last:border-0"
            >
              <div
                className="dashboard-product-image relative shrink-0 rounded-[8px] bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, transparent 45%, rgba(0,0,0,.25)), url("${product.image}")`,
                  backgroundColor: ["#9b726e", "#637278", "#75535a", "#806e56"][index],
                }}
                aria-hidden="true"
              >
                <span className="absolute -bottom-1 -left-1 flex size-[15px] items-center justify-center rounded-full border border-[#292929] bg-[#f35177] text-[8px] font-semibold text-white">
                  {index + 1}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="dashboard-product-name truncate text-white/90">
                  {product.name}
                </div>
                <div className="dashboard-product-detail leading-3 text-white/45">{product.price}</div>
              </div>
              <div className="dashboard-product-purchases shrink-0 text-right text-white/90">
                {product.purchases} Purchases
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-[128px] items-center justify-center text-[clamp(11px,1.2vw,14px)] text-white/45">
            No products match “{searchTerm}”
          </div>
        )}
      </div>
    </Card>
  );
}
