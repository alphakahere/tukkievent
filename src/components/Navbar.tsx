import Link from "next/link";

export default function Navbar() {
	return <div className="flex justify-between items-center p-4">
        <div>
           <h1>TukkiEvent</h1>
        </div>
        <div>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
        </div>
    </div>;
}