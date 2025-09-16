import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-[var(--tukki-gray-900)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-2xl font-bold text-[var(--tukki-sun-yellow)] mb-4">
                        TukkiEvent
                    </h3>
                    <p className="text-gray-300 mb-4">
                        Simplifying event management across Africa with
                        mobile-first solutions.
                    </p>
                    <div className="flex space-x-4">
                        <a
                            href="#"
                            className="text-gray-400 hover:text-white"
                        >
                            Twitter
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-white"
                        >
                            Facebook
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-white"
                        >
                            LinkedIn
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-4">Product</h4>
                    <ul className="space-y-2">
                        <li>
                            <a
                                href="#"
                                className="text-gray-300 hover:text-white"
                            >
                                Features
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-300 hover:text-white"
                            >
                                Pricing
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-300 hover:text-white"
                            >
                                API
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-300 hover:text-white"
                            >
                                Integrations
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-4">Support</h4>
                    <ul className="space-y-2">
                        <li>
                            <a
                                href="#"
                                className="text-gray-300 hover:text-white"
                            >
                                Help Center
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-300 hover:text-white"
                            >
                                Contact Us
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-300 hover:text-white"
                            >
                                Status
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-300 hover:text-white"
                            >
                                Community
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-4">Language</h4>
                    <select className="bg-[var(--tukki-gray-800)] text-white border border-gray-600 rounded-lg px-3 py-2 w-full">
                        <option>English</option>
                        <option>Français</option>
                        <option>العربية</option>
                        <option>Português</option>
                    </select>

                    <div className="mt-6">
                        <h4 className="text-lg font-semibold mb-4">
                            Payment Partners
                        </h4>
                        <div className="flex space-x-4">
                            <div className="bg-white text-[var(--tukki-gray-900)] px-3 py-1 rounded text-sm font-semibold">
                                Orange Money
                            </div>
                            <div className="bg-white text-[var(--tukki-gray-900)] px-3 py-1 rounded text-sm font-semibold">
                                Wave
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
                <p>
                    &copy; 2024 TukkiEvent. All rights reserved. | 500+ events
                    created | Secure & Reliable
                </p>
            </div>
        </div>
    </footer>
  )
}

export default Footer