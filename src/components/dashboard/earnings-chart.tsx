"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./dashboard.css";
import { Card, CardTitle } from "@/components/ui/card";
import { CardMenu } from "@/components/dashboard/card-menu";
import { ChartFrame } from "@/components/dashboard/chart-frame";
import { periodMultiplier } from "@/lib/dashboard-utils";

const data = [
  { date: "1 APR", amount: 2.4 },
  { date: "7 APR", amount: 1.55 },
  { date: "14 APR", amount: 2.8 },
  { date: "21 APR", amount: 3.15 },
  { date: "28 APR", amount: 2.15 },
];

const ticks = ["$0", "$500", "$1k", "$1.5k", "$2k", "$2.5k", "$3k"];

export function EarningsChart({ period }: { period: string }) {
  const multiplier = periodMultiplier(period);
  const chartData = data.map((point) => ({
    ...point,
    amount: Number((point.amount * multiplier).toFixed(2)),
  }));

  return (
    <Card className="dark dashboard-secondary-card min-w-0 gap-0 border-white/[.06] bg-gradient-to-br from-[#292929] to-[#222] p-0 shadow-[0_14px_35px_rgba(0,0,0,.13)]">
      <div className="dashboard-card-header flex items-center justify-between">
        <CardTitle className="dashboard-card-title font-medium">Earnings</CardTitle>
        <CardMenu
          filename="brinhildr-earnings.csv"
          headers={["Date", "Earnings"]}
          rows={chartData.map(({ date, amount }) => [date, amount])}
        />
      </div>
      <div className="dashboard-earnings-chart">
        <ChartFrame>
          {({ width, height }) => (
          <BarChart width={width} height={height} data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="earnings-bars" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff8a58" />
                <stop offset="100%" stopColor="#ed2676" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,.09)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "rgba(255,255,255,.5)", fontSize: 8, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              tickMargin={5}
            />
            <YAxis
              domain={[0, 3.6]}
              ticks={[0, 0.6, 1.2, 1.8, 2.4, 3, 3.6]}
              tickFormatter={(value) => ticks[Math.round(value / 0.6)]}
              tick={{ fill: "rgba(255,255,255,.5)", fontSize: 10, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,.04)" }}
              contentStyle={{
                background: "#1b1b1b",
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: 8,
                fontSize: 10,
              }}
            />
            <Bar
              dataKey="amount"
              fill="url(#earnings-bars)"
              radius={[1, 1, 1, 1]}
              maxBarSize={30}
              animationDuration={650}
            />
          </BarChart>
          )}
        </ChartFrame>
      </div>
    </Card>
  );
}
