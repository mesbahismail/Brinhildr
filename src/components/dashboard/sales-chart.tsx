"use client";

import {
  Area,
  AreaChart,
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

// Chart values are in hundreds of dollars; profits are earnings minus expenses.
const sales = [
  { date: "1 APR", earnings: 20, expenses: 12 },
  { date: "4 APR", earnings: 23, expenses: 14 },
  { date: "7 APR", earnings: 25, expenses: 15 },
  { date: "10 APR", earnings: 22, expenses: 14 },
  { date: "14 APR", earnings: 27, expenses: 16 },
  { date: "17 APR", earnings: 28, expenses: 17 },
  { date: "21 APR", earnings: 26, expenses: 15 },
  { date: "24 APR", earnings: 30, expenses: 18 },
  { date: "28 APR", earnings: 27, expenses: 16 },
];

const metrics = [
  { key: "earnings", label: "Earnings", color: "#2fe4c0", total: 31221 },
  { key: "expenses", label: "Expenses", color: "#ffc04c", total: 18540 },
  { key: "profits", label: "Profits", color: "#f35177", total: 12681 },
] as const;

const ticks = ["$3k", "$2.5k", "$2k", "$1.5k", "$1k", "$500", "$0"];

function formatDollars(value: number) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export function SalesChart({ period }: { period: string }) {
  const multiplier = periodMultiplier(period);
  const chartData = sales.map((point) => {
    const earnings = Math.round(point.earnings * multiplier);
    const expenses = Math.round(point.expenses * multiplier);
    return { date: point.date, earnings, expenses, profits: earnings - expenses };
  });

  return (
    <Card className="dark dashboard-sales-card min-w-0 gap-0 border-white/[.06] bg-gradient-to-br from-[#292929] to-[#222] p-0 shadow-[0_14px_35px_rgba(0,0,0,.13)]">
      <div className="dashboard-card-header flex items-center justify-between">
        <CardTitle className="dashboard-card-title font-medium">Sales</CardTitle>
        <CardMenu
          filename="brinhildr-sales.csv"
          headers={["Date", "Earnings", "Expenses", "Profits"]}
          rows={chartData.map(({ date, earnings, expenses, profits }) => [
            date,
            earnings * 100,
            expenses * 100,
            profits * 100,
          ])}
        />
      </div>
      <div className="dashboard-sales-content flex items-stretch">
        <div className="dashboard-sales-metrics flex shrink-0 flex-col justify-center">
          {metrics.map((metric, index) => (
            <div
              key={metric.key}
              className={`dashboard-sales-metric flex min-w-0 flex-col justify-center ${
                index < metrics.length - 1 ? "border-b border-white/10" : ""
              }`}
            >
              <div className="dashboard-sales-metric-head flex items-center">
                <span
                  className="dashboard-sales-dot shrink-0 rounded-full"
                  style={{ borderColor: metric.color }}
                />
                <span className="dashboard-sales-value truncate font-semibold tabular-nums text-white">
                  {formatDollars(metric.total * multiplier)}
                </span>
              </div>
              <span className="dashboard-sales-label truncate text-white/45">{metric.label}</span>
            </div>
          ))}
        </div>
        <div className="min-w-0 flex-1 pt-1">
          <ChartFrame>
            {({ width, height }) => (
            <AreaChart width={width} height={height} data={chartData} margin={{ top: 8, right: 10, bottom: 0, left: 0 }}>
              <defs>
                {metrics.map((metric) => (
                  <linearGradient key={metric.key} id={`sales-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={metric.color} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={metric.color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,.09)" vertical />
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(255,255,255,.5)", fontSize: 8, fontWeight: 600 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,.14)" }}
                interval={1}
                tickMargin={5}
              />
              <YAxis
                orientation="left"
                ticks={[0, 5, 10, 15, 20, 25, 30]}
                tickFormatter={(value) => ticks[6 - Math.round(value / 5)]}
                tick={{ fill: "rgba(255,255,255,.5)", fontSize: 10, fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
                width={36}
                tickMargin={4}
              />
              <Tooltip
                contentStyle={{
                  background: "#1b1b1b",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: 8,
                  fontSize: 10,
                }}
                labelStyle={{ color: "#fff" }}
                formatter={(value) => formatDollars(Number(value) * 100)}
              />
              {metrics.map((metric) => (
                <Area
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  name={metric.label}
                  stroke={metric.color}
                  strokeWidth={1.5}
                  fill={`url(#sales-${metric.key})`}
                  animationDuration={650}
                />
              ))}
            </AreaChart>
            )}
          </ChartFrame>
        </div>
      </div>
    </Card>
  );
}
