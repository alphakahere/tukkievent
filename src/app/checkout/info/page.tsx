"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/features/hooks";
import { updateBuyerInfo } from "@/store/features/cart.slice";
import { selectBuyerInfo, selectCartIsEmpty } from "@/store/selectors/cart.selectors";

export default function InfoPage() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const buyer = useAppSelector(selectBuyerInfo);
	const isEmpty = useAppSelector(selectCartIsEmpty);

	const [form, setForm] = useState({
		buyerFirstName: buyer.buyerFirstName ?? "",
		buyerLastName: buyer.buyerLastName ?? "",
		buyerEmail: buyer.buyerEmail ?? "",
		buyerPhone: buyer.buyerPhone ?? "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	if (isEmpty) {
		if (typeof window !== "undefined") {
			router.replace("/");
		}
		return null;
	}

	const validate = () => {
		const e: Record<string, string> = {};
		if (!form.buyerFirstName.trim()) e.buyerFirstName = "Le prénom est requis";
		if (!form.buyerLastName.trim()) e.buyerLastName = "Le nom est requis";
		if (!form.buyerEmail.trim()) e.buyerEmail = "L'email est requis";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.buyerEmail)) e.buyerEmail = "Email invalide";
		setErrors(e);
		return Object.keys(e).length === 0;
	};

	const onSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (!validate()) return;
		dispatch(updateBuyerInfo(form));
		router.push("/checkout/payment");
	};

	return (
		<main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Informations participant</h1>
			</div>

			<form className="bg-white rounded-xl shadow-sm p-6" onSubmit={onSubmit}>
				<div className="grid sm:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
						<input
							className="w-full border rounded-lg px-3 py-2"
							placeholder="Awa"
							value={form.buyerFirstName}
							onChange={(e) => setForm({ ...form, buyerFirstName: e.target.value })}
						/>
						{errors.buyerFirstName && <p className="text-red-500 text-xs mt-1">{errors.buyerFirstName}</p>}
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
						<input
							className="w-full border rounded-lg px-3 py-2"
							placeholder="Diop"
							value={form.buyerLastName}
							onChange={(e) => setForm({ ...form, buyerLastName: e.target.value })}
						/>
						{errors.buyerLastName && <p className="text-red-500 text-xs mt-1">{errors.buyerLastName}</p>}
					</div>
					<div className="sm:col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
						<input
							className="w-full border rounded-lg px-3 py-2"
							placeholder="awa@example.com"
							value={form.buyerEmail}
							onChange={(e) => setForm({ ...form, buyerEmail: e.target.value })}
						/>
						{errors.buyerEmail && <p className="text-red-500 text-xs mt-1">{errors.buyerEmail}</p>}
					</div>
					<div className="sm:col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
						<input
							className="w-full border rounded-lg px-3 py-2"
							placeholder="+221 77 123 45 67"
							value={form.buyerPhone}
							onChange={(e) => setForm({ ...form, buyerPhone: e.target.value })}
						/>
					</div>
				</div>

				<div className="flex items-center justify-between mt-8">
					<Link href="/checkout/summary" className="text-sm text-gray-600 hover:text-gray-800">
						← Retour
					</Link>
					<button type="submit" className="px-5 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold">
						Continuer
					</button>
				</div>
			</form>
		</main>
	);
}
