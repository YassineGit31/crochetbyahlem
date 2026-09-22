"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Order } from "@/types";
import { formatDZD } from "@/lib/utils";

export function RevenueChart({ orders }: { orders: Order[] }) {
  const days: { date: string; label: string; revenue: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({
      date: key,
      label: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
      revenue: 0,
    });
  }
  for (const order of orders) {
    if (order.status === "annulee") continue;
    const key = order.created_at.slice(0, 10);
    const day = days.find((d) => d.date === key);
    if (day) day.revenue += order.total;
  }

  return (
    <div className="h-64 -ml-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={days} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#BE6274" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#BE6274" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#F0C4C9" strokeDasharray="4 4" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6F5E5A" }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: "#6F5E5A" }}
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={(v) => `${v / 1000}k`}
          />
          <Tooltip
            formatter={(value) => formatDZD(Number(value) || 0)}
            contentStyle={{ borderRadius: 12, border: "1px solid #F0C4C9", fontSize: 13 }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#BE6274" strokeWidth={2} fill="url(#revenueFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
