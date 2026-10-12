"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { CardMenu } from "@/components/dashboard/card-menu";
import "./dashboard.css";

const countries = [
  { name: "United states", flag: "🇺🇸", sales: 23234, progress: 76 },
  { name: "United Kingdom", flag: "🇬🇧", sales: 20546, progress: 59 },
  { name: "Japan", flag: "🇯🇵", sales: 17647, progress: 46 },
  { name: "Germany", flag: "🇩🇪", sales: 13284, progress: 25 },
];

export function CountrySales() {
  return (
    <Card className="dark dashboard-tertiary-card min-w-0 gap-0 border-white/[.06] bg-gradient-to-br from-[#292929] to-[#222] p-0 shadow-[0_14px_35px_rgba(0,0,0,.13)]">
      <div className="dashboard-card-header flex items-center justify-between">
        <CardTitle className="dashboard-card-title font-medium">Countries</CardTitle>
        <CardMenu
          filename="brinhildr-country-sales.csv"
          headers={["Country", "Sales"]}
          rows={countries.map(({ name, sales }) => [name, sales])}
        />
      </div>
      <div className="dashboard-country-content">
        {countries.map((country) => (
          <div key={country.name} className="dashboard-country-row border-b border-white/[.07] last:border-0">
            <div className="h-[2px] w-full bg-white/[.06]">
              <div
                className="h-full bg-gradient-to-r from-[#f35177] to-[#ff865d]"
                style={{ width: `${country.progress}%` }}
              />
            </div>
            <div className="dashboard-country-row-content flex items-center justify-between gap-2">
              <div className="dashboard-country-name flex min-w-0 items-center gap-[clamp(6px,.8vw,9px)] text-white/90">
                <span className="text-[clamp(15px,1.8vw,21px)] leading-none" aria-hidden="true">
                  {country.flag}
                </span>
                <span className="truncate">{country.name}</span>
              </div>
              <span className="dashboard-country-sales shrink-0 text-white/90">
                {country.sales.toLocaleString("en-US")} Sales
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
