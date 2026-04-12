import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-4">
      <div className="text-center max-w-sm w-full">
        <div className="w-20 h-20 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Search size={32} className="text-gray-300" />
        </div>
        <p className="text-6xl font-bold text-gray-900 mb-2">404</p>
        <p className="text-xl font-semibold text-gray-900 mb-2">Page introuvable</p>
        <p className="text-sm text-gray-500 mb-8">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-white py-3 px-8 rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
