"use client";

import { motion } from "motion/react";
import {
  Users,
  Building2,
  CalendarDays,
  ShoppingBag,
  TrendingUp,
  Clock,
  Flag,
  UserPlus,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { useAdmin } from "@/contexts/AdminContext";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

function ActivityIcon({ type }: { type: string }) {
  const map: Record<string, { icon: React.ReactNode; bg: string }> = {
		USER_REGISTERED: {
			icon: <UserPlus size={14} />,
			bg: "bg-blue-100 text-blue-600",
		},
		EVENT_CREATED: {
			icon: <CalendarDays size={14} />,
			bg: "bg-amber-100 text-amber-600",
		},
		ORDER_PLACED: {
			icon: <ShoppingBag size={14} />,
			bg: "bg-emerald-100 text-emerald-600",
		},
		REPORT_SUBMITTED: {
			icon: <Flag size={14} />,
			bg: "bg-red-100 text-rose-600",
		},
		EVENT_APPROVED: {
			icon: <CheckCircle size={14} />,
			bg: "bg-primary/10 text-primary",
		},
  };
  const item = map[type] ?? { icon: <Clock size={14} />, bg: "bg-gray-100 text-gray-500" };
  return (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${item.bg}`}>
      {item.icon}
    </div>
  );
}

export default function AdminDashboard() {
  const { kpis, activity, events, orders } = useAdmin();

  const kpiCards = [
		{
			label: "Utilisateurs",
			value: kpis.totalUsers.toLocaleString(),
			icon: Users,
			color: "bg-blue-50 text-blue-600",
			sub: `+${kpis.newUsersThisMonth} ce mois`,
		},
		{
			label: "Organisateurs",
			value: kpis.totalOrganizers.toLocaleString(),
			icon: Building2,
			color: "bg-violet-50 text-violet-600",
			sub: "inscrits",
		},
		{
			label: "Événements",
			value: kpis.totalEvents.toLocaleString(),
			icon: CalendarDays,
			color: "bg-amber-50 text-amber-600",
			sub: `${kpis.pendingEvents} en attente`,
		},
		{
			label: "Commandes",
			value: kpis.totalOrders.toLocaleString(),
			icon: ShoppingBag,
			color: "bg-emerald-50 text-emerald-600",
			sub: "au total",
		},
		{
			label: "Revenus",
			value: `${(kpis.totalRevenue / 1000000).toFixed(1)}M`,
			icon: TrendingUp,
			color: "bg-primary/10 text-primary",
			sub: "FCFA générés",
		},
		{
			label: "Signalements",
			value: kpis.openReports.toString(),
			icon: Flag,
			color: "bg-red-50 text-rose-600",
			sub: "ouverts",
			alert: true,
		},
  ];

  const pendingEvents = events.filter((e) => e.status === "PENDING");
  const recentOrders = orders.slice(0, 5);

  return (
		<div className="p-4 lg:p-6 space-y-6">
			{/* Header */}
			<motion.div initial="hidden" animate="show" variants={fadeUp}>
				<p className="text-2xl font-bold text-gray-900">
					Tableau de bord
				</p>
				<p className="text-sm text-gray-500 mt-0.5">
					{format(new Date(), "EEEE d MMMM yyyy", {
						locale: fr,
					})}
				</p>
			</motion.div>

			{/* KPI Cards */}
			<motion.div
				initial="hidden"
				animate="show"
				variants={stagger}
				className="grid grid-cols-2 lg:grid-cols-3 gap-3"
			>
				{kpiCards.map(
					({
						label,
						value,
						icon: Icon,
						color,
						sub,
						alert,
					}) => (
						<motion.div
							key={label}
							variants={fadeUp}
							className={`bg-white rounded-2xl border p-4 ${alert ? "border-rose-200" : "border-gray-100"}`}
						>
							<div className="flex items-start justify-between mb-3">
								<div
									className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
								>
									<Icon size={20} />
								</div>
								{alert &&
									kpis.openReports > 0 && (
										<AlertCircle
											size={16}
											className="text-rose-500"
										/>
									)}
							</div>
							<p className="text-2xl font-bold text-gray-900 leading-none mb-1">
								{value}
							</p>
							<p className="text-xs font-semibold text-gray-700">
								{label}
							</p>
							<p className="text-xs text-gray-400 mt-0.5">
								{sub}
							</p>
						</motion.div>
					),
				)}
			</motion.div>

			<div className="grid lg:grid-cols-2 gap-4">
				{/* Pending events */}
				<motion.div
					initial="hidden"
					animate="show"
					variants={fadeUp}
					className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
				>
					<div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
						<p className="text-base font-semibold text-gray-900">
							Événements en attente
						</p>
						<Link
							href="/admin/events"
							className="text-xs font-semibold text-primary hover:opacity-80"
						>
							Voir tout
						</Link>
					</div>
					<div className="divide-y divide-gray-100">
						{pendingEvents.length === 0 ? (
							<p className="px-5 py-6 text-sm text-gray-400 text-center">
								Aucun événement en attente
							</p>
						) : (
							pendingEvents.map((ev) => (
								<div
									key={ev.id}
									className="px-5 py-3.5 flex items-center gap-3"
								>
									<div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-gray-100 relative">
										<Image
											src={
												ev.coverImageUrl
											}
											alt={ev.title}
											fill
											className="object-cover"
											sizes="40px"
										/>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-semibold text-gray-900 truncate">
											{ev.title}
										</p>
										<p className="text-xs text-gray-400">
											{
												ev.organizerName
											}{" "}
											· {ev.city}
										</p>
									</div>
									<Link
										href="/admin/events"
										className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full shrink-0"
									>
										Examiner
									</Link>
								</div>
							))
						)}
					</div>
				</motion.div>

				{/* Recent orders */}
				<motion.div
					initial="hidden"
					animate="show"
					variants={fadeUp}
					className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
				>
					<div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
						<p className="text-base font-semibold text-gray-900">
							Commandes récentes
						</p>
						<Link
							href="/admin/orders"
							className="text-xs font-semibold text-primary hover:opacity-80"
						>
							Voir tout
						</Link>
					</div>
					<div className="divide-y divide-gray-100">
						{recentOrders.map((order) => (
							<div
								key={order.id}
								className="px-5 py-3.5 flex items-center gap-3"
							>
								<div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
									<ShoppingBag
										size={14}
										className="text-gray-400"
									/>
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-semibold text-gray-900 truncate">
										{order.buyerName}
									</p>
									<p className="text-xs text-gray-400 truncate">
										{order.eventTitle}
									</p>
								</div>
								<div className="text-right shrink-0">
									<p className="text-sm font-bold text-gray-900">
										{order.total.toLocaleString()}{" "}
										F
									</p>
									<span
										className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
											order.status ===
											"COMPLETED"
												? "bg-emerald-50 text-emerald-600"
												: order.status ===
													  "REFUNDED"
													? "bg-red-50 text-rose-600"
													: "bg-amber-50 text-amber-600"
										}`}
									>
										{order.status ===
										"COMPLETED"
											? "Complété"
											: order.status ===
												  "REFUNDED"
												? "Remboursé"
												: "En attente"}
									</span>
								</div>
							</div>
						))}
					</div>
				</motion.div>
			</div>

			{/* Activity feed */}
			<motion.div
				initial="hidden"
				animate="show"
				variants={fadeUp}
				className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
			>
				<div className="px-5 py-4 border-b border-gray-100">
					<p className="text-base font-semibold text-gray-900">
						Activité récente
					</p>
				</div>
				<div className="p-5 space-y-4">
					{activity.map((item) => (
						<div
							key={item.id}
							className="flex items-start gap-3"
						>
							<ActivityIcon type={item.type} />
							<div className="flex-1 min-w-0">
								<p className="text-sm text-gray-700">
									{item.description}
								</p>
								<p className="text-xs text-gray-400 mt-0.5">
									{formatDistanceToNow(
										new Date(
											item.createdAt,
										),
										{
											locale: fr,
											addSuffix: true,
										},
									)}
								</p>
							</div>
						</div>
					))}
				</div>
			</motion.div>
		</div>
  );
}
