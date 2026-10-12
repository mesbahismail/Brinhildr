"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { CardMenu } from "@/components/dashboard/card-menu";
import "./dashboard.css";

const categories = [
  { name: "Dresses", color: "#f35177", value: 27 },
  { name: "Shoes", color: "#2fe4c0", value: 16 },
  { name: "Accessories", color: "#398df7", value: 29 },
  { name: "Tops", color: "#8748f5", value: 28 },
];

const chartRows = categories.map(({ name, value }) => [name, value]);

export function CategoryBreakdown() {
  return (
    <Card className="dark dashboard-tertiary-card min-w-0 gap-0 border-white/[.06] bg-gradient-to-br from-[#292929] to-[#222] p-0 shadow-[0_14px_35px_rgba(0,0,0,.13)]">
      <div className="dashboard-card-header flex items-center justify-between">
        <CardTitle className="dashboard-card-title font-medium">Top categories</CardTitle>
        <CardMenu
          filename="brinhildr-categories.csv"
          headers={["Category", "Share"]}
          rows={chartRows}
        />
      </div>
      <div className="dashboard-category-content flex items-center justify-around gap-[clamp(16px,2vw,23px)]">
        <div
          className="dashboard-category-donut relative shrink-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, #2fe4c0 0 16%, #398df7 16% 45%, #8748f5 45% 73%, #f35177 73% 100%)",
          }}
          role="img"
          aria-label="Category sales share: Dresses 27%, Shoes 16%, Accessories 29%, Tops 28%"
        >
          <div className="dashboard-category-hole absolute rounded-full bg-[#222] shadow-[inset_0_2px_7px_rgba(0,0,0,.6)]" />
        </div>
        <div className="min-w-0 flex-1">
          {categories.map((category) => (
            <div
              key={category.name}
              className="dashboard-category-legend-item flex items-center border-b border-white/[.07] last:border-0"
            >
              <span
                className="size-[10px] shrink-0 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="dashboard-category-label truncate text-white/90">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
