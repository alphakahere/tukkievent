"use client";

import { motion } from "motion/react";
import { TrendingUp, Ticket, Award, ArrowUpRight } from "lucide-react";
import { useOrganizer } from "@/contexts/OrganizerContext";

// Simple bar chart component (no external dependency)
function BarChart({ data }: { data: { label: string; value: number; max: number }[] }) {
  return (
    <div className="space-y-4">
      {data.map((item) => {
        const pct = item.max > 0 ? (item.value / item.max) * 100 : 0;
        return (
          <div key={item.label}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-gray-500 truncate mr-4">{item.label}</span>
              <span className="font-semibold text-gray-900 shrink-0">{item.value.toLocaleString()} F</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
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
            <p className="text-lg font-bold text-gray-900">{total}</p>
            <p className="text-[10px] text-gray-400">vendus</p>
          </div>
        </div>
      </div>
      <div className="space-y-2.5">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-sm text-gray-500">{seg.label}</span>
            <span className="text-sm font-semibold text-gray-900 ml-auto">{seg.value}</span>
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
    <div className="p-5 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytiques</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp size={20} className="text-emerald-600" />
            </div>
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} /> +12%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString()} F</p>
          <p className="text-xs font-medium text-gray-500 mt-0.5">Revenu total</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Ticket size={20} className="text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalTicketsSold}</p>
          <p className="text-xs font-medium text-gray-500 mt-0.5">Billets vendus</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Award size={20} className="text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {totalTicketsSold > 0 ? Math.round(totalRevenue / totalTicketsSold).toLocaleString() : 0} F
          </p>
          <p className="text-xs font-medium text-gray-500 mt-0.5">Prix moyen / billet</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by event */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 p-6"
        >
          <h2 className="text-base font-semibold text-gray-900 mb-5">Revenu par événement</h2>
          <BarChart data={revenueData} />
        </motion.div>

        {/* Tickets by type */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 p-6"
        >
          <h2 className="text-base font-semibold text-gray-900 mb-5">Billets vendus par type</h2>
          <DonutChart segments={ticketSegments} />
        </motion.div>
      </div>

      {/* Top events table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Top événements par revenu</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-semibold text-gray-400 text-xs uppercase tracking-wide">#</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-400 text-xs uppercase tracking-wide">Événement</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-400 text-xs uppercase tracking-wide">Ville</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-400 text-xs uppercase tracking-wide">Vendus</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-400 text-xs uppercase tracking-wide">Revenu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topEvents.map((oe, i) => (
                <tr key={oe.event.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{oe.event.title}</td>
                  <td className="px-6 py-4 text-gray-500">{oe.event.city}</td>
                  <td className="px-6 py-4 text-right text-gray-700">{oe.totalSold}</td>
                  <td className="px-6 py-4 text-right font-semibold text-primary">{oe.totalRevenue.toLocaleString()} F</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
