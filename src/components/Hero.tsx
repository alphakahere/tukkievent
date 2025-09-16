import React from 'react'

const Hero = () => {
  return (
    <section className="relative">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                        Simplify Event Management
                        <span className="block text-[var(--tukki-sun-yellow)]">
                            Across Africa
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
                        Create, sell, and manage tickets seamlessly — even
                        with limited connectivity
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-[var(--tukki-vibrant-orange)] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg">
                            Create Your Event
                        </button>
                        <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-[var(--tukki-deep-blue)] transition-colors">
                            Explore Events
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-[var(--tukki-sun-yellow)] rounded-full"></div>
                                <span className="text-sm">
                                    Event Dashboard
                                </span>
                            </div>
                            <div className="bg-white/20 rounded-lg p-4">
                                <h3 className="font-semibold text-lg mb-2">
                                    Afro Music Festival 2024
                                </h3>
                                <p className="text-sm text-blue-100 mb-3">
                                    Dakar, Senegal • March 15-17
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">
                                        Tickets Sold: 1,247
                                    </span>
                                    <span className="text-[var(--tukki-sun-yellow)] font-bold">
                                        $12,470
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <div className="bg-[var(--tukki-vibrant-orange)] text-white px-4 py-2 rounded text-sm font-medium">
                                    Scan Tickets
                                </div>
                                <div className="bg-white/20 text-white px-4 py-2 rounded text-sm">
                                    Manage
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Hero