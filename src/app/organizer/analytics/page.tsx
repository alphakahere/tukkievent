"use client";

import { motion } from "motion/react";
import { TrendingUp, Ticket, Award, ArrowUpRight } from "lucide-react";
import { useOrganizer } from "@/contexts/OrganizerContext";

// Simple bar chart component (no external dependency)
function BarChart({ data }: { data: { label: string; value: number; max: number }[] }) {
  return (
    <div className="space-y-3">
      {data.map((item) => {
        const pct = item.max > 0 ? (item.value / item.max) * 100 : 0;
        return (
          <div key={item.label}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-semibold text-foreground">{item.value.toLocaleString()} F</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let cumulative = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32 shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {segments.map((seg) => {
            const pct = total > 0 ? (seg.value / total) * 100 : 0;
            const dashArray = `${pct} ${100 - pct}`;
            const dashOffset = 100 - cumulative;
            cumulative += pct;
            return (
              <circle
                key={seg.label}
                cx="18"
                cy="18"
                r="15.5"
                fill="transparent"
                stroke={seg.color}
                strokeWidth="4"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{total}</p>
            <p className="text-[10px] text-muted-foreground">vendus</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-sm text-muted-foreground">{seg.label}</span>
            <span className="text-sm font-semibold text-foreground ml-auto">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { events, totalRevenue, totalTicketsSold } = useOrganizer();

  // Revenue by event
  const maxRevenue = Math.max(...events.map((e) => e.totalRevenue), 1);
  const revenueData = events
    .filter((e) => e.totalRevenue > 0)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .map((e) => ({
      label: e.event.title,
      value: e.totalRevenue,
      max: maxRevenue,
    }));

  // Tickets by type
  const ticketColors = ["#FF6B35", "#004E89", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"];
  const ticketSegments: { label: string; value: number; color: string }[] = [];
  events.forEach((oe) => {
    oe.ticketSales.forEach((ts) => {
      const existing = ticketSegments.find((s) => s.label === ts.name);
      if (existing) {
        existing.value += ts.sold;
      } else {
        ticketSegments.push({ label: ts.name, value: ts.sold, color: ticketColors[ticketSegments.length % ticketColors.length] });
      }
    });
  });

  // Top events by revenue
  const topEvents = [...events]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Analytiques</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-green-500" />
            </div>
            <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
              <ArrowUpRight size={14} /> +12%
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalRevenue.toLocaleString()} F</p>
          <p className="text-xs text-muted-foreground">Revenu total</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-2xl border border-border p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Ticket size={20} className="text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalTicketsSold}</p>
          <p className="text-xs text-muted-foreground">Billets vendus</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Award size={20} className="text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {totalTicketsSold > 0 ? Math.round(totalRevenue / totalTicketsSold).toLocaleString() : 0} F
          </p>
          <p className="text-xs text-muted-foreground">Prix moyen / billet</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by event */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl border border-border shadow-sm p-5"
        >
          <h2 className="font-bold text-foreground mb-4">Revenu par événement</h2>
          <BarChart data={revenueData} />
        </motion.div>

        {/* Tickets by type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border shadow-sm p-5"
        >
          <h2 className="font-bold text-foreground mb-4">Billets vendus par type</h2>
          <DonutChart segments={ticketSegments} />
        </motion.div>
      </div>

      {/* Top events table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
      >
        <div className="p-5 border-b border-border">
          <h2 className="font-bold text-foreground">Top événements par revenu</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground">#</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Événement</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Ville</th>
                <th className="text-right px-5 py-3 font-semibold text-muted-foreground">Vendus</th>
                <th className="text-right px-5 py-3 font-semibold text-muted-foreground">Revenu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topEvents.map((oe, i) => (
                <tr key={oe.event.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-5 py-3 font-medium text-foreground">{oe.event.title}</td>
                  <td className="px-5 py-3 text-muted-foreground">{oe.event.city}</td>
                  <td className="px-5 py-3 text-right text-foreground">{oe.totalSold}</td>
                  <td className="px-5 py-3 text-right font-semibold text-primary">{oe.totalRevenue.toLocaleString()} F</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
