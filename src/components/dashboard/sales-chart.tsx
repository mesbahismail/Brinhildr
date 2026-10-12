"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./dashboard.css";
import { Card, CardTitle } from "@/components/ui/card";
import { CardMenu } from "@/components/dashboard/card-menu";

const sales = [
  { date: "1 APR", earning: 20, orders: 14, visitors: 9 },
  { date: "4 APR", earning: 23, orders: 16, visitors: 12 },
  { date: "7 APR", earning: 25, orders: 19, visitors: 13 },
  { date: "10 APR", earning: 22, orders: 17, visitors: 10 },
  { date: "14 APR", earning: 27, orders: 20, visitors: 14 },
  { date: "17 APR", earning: 28, orders: 20, visitors: 16 },
  { date: "21 APR", earning: 26, orders: 22, visitors: 11 },
  { date: "24 APR", earning: 30, orders: 25, visitors: 18 },
  { date: "28 APR", earning: 27, orders: 21, visitors: 15 },
];

const metrics = [
  { label: "Earnings", color: "#2fe4c0", value: "$31.221" },
  { label: "Earnings", color: "#ffc04c", value: "$31.221" },
  { label: "Earnings", color: "#f35177", value: "$31.221" },
];

const ticks = ["$3k", "$2.5k", "$2k", "$1.5k", "$1k", "$500", "$0"];

export function SalesChart({ period }: { period: string }) {
  const multiplier =
    period === "Last 7 days" ? 0.48 : period === "This month" ? 1.08 : period === "Last year" ? 1.24 : 1;
  const chartData = sales.map((point) => ({
    ...point,
    earning: Math.round(point.earning * multiplier),
    orders: Math.round(point.orders * multiplier),
    visitors: Math.round(point.visitors * multiplier),
  }));

  return (
    <Card className="dark dashboard-sales-card min-w-0 gap-0 border-white/[.06] bg-gradient-to-br from-[#292929] to-[#222] p-0 shadow-[0_14px_35px_rgba(0,0,0,.13)]">
      <div className="dashboard-card-header flex items-center justify-between">
        <CardTitle className="dashboard-card-title font-medium">Sales</CardTitle>
        <CardMenu
          filename="brinhildr-sales.csv"
          headers={["Date", "Earnings", "Orders", "Visitors"]}
          rows={chartData.map(({ date, earning, orders, visitors }) => [
            date,
            earning,
            orders,
            visitors,
          ])}
        />
      </div>
      <div className="dashboard-sales-content flex items-stretch">
        <div className="dashboard-sales-metrics flex shrink-0 flex-col justify-center">
          {metrics.map((metric, index) => (
            <div
              key={metric.color}
              className={`dashboard-sales-metric flex items-center gap-[clamp(6px,.8vw,9px)] ${
                index < metrics.length - 1 ? "border-b border-white/10" : ""
              }`}
            >
              <span
                className="size-3 shrink-0 rounded-full border-2"
                style={{ borderColor: metric.color }}
              />
              <div className="min-w-0">
                <div className="dashboard-sales-value leading-4 text-white">{metric.value}</div>
                <div className="dashboard-sales-label leading-3 text-white/45">{metric.label}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="min-w-0 flex-1 pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="sales-earnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2fe4c0" stopOpacity={0.46} />
                  <stop offset="100%" stopColor="#2fe4c0" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="sales-orders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffc04c" stopOpacity={0.42} />
                  <stop offset="100%" stopColor="#ffc04c" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="sales-visitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f35177" stopOpacity={0.48} />
                  <stop offset="100%" stopColor="#f35177" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,.09)" vertical />
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(255,255,255,.42)", fontSize: 7 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,.14)" }}
                interval={1}
                tickMargin={5}
              />
              <YAxis
                orientation="left"
                ticks={[0, 5, 10, 15, 20, 25, 30]}
                tickFormatter={(value) => ticks[6 - Math.round(value / 5)]}
                tick={{ fill: "rgba(255,255,255,.4)", fontSize: 7 }}
                tickLine={false}
                axisLine={false}
                width={30}
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
              />
              <Area
                type="monotone"
                dataKey="earning"
                stroke="#2fe4c0"
                strokeWidth={1.5}
                fill="url(#sales-earnings)"
                animationDuration={650}
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#ffc04c"
                strokeWidth={1.5}
                fill="url(#sales-orders)"
                animationDuration={650}
              />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#f35177"
                strokeWidth={1.5}
                fill="url(#sales-visitors)"
                animationDuration={650}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
