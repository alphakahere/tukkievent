import React from 'react'

const Features = () => {
  return (
    <div>
        {/* Value Proposition Section */}
			<section id="features" className="py-20 bg-[var(--tukki-gray-50)]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-[var(--tukki-gray-900)] mb-4">
							Built for African Event Organizers
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							We understand the unique challenges of organizing events
							across Africa and have built solutions specifically for
							you.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
							<div className="text-4xl mb-4">🌐</div>
							<h3 className="text-xl font-semibold text-[var(--tukki-gray-900)] mb-3">
								Connectivity Flexibility
							</h3>
							<p className="text-gray-600">
								Work online or offline — TukkiEvent adapts to your
								connection. Sync when you&apos;re back online.
							</p>
						</div>

						<div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
							<div className="text-4xl mb-4">💰</div>
							<h3 className="text-xl font-semibold text-[var(--tukki-gray-900)] mb-3">
								Local Payment Solutions
							</h3>
							<p className="text-gray-600">
								Accept mobile money, bank transfers, and cash
								collections with ease. No complex integrations
								needed.
							</p>
						</div>

						<div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
							<div className="text-4xl mb-4">⚡</div>
							<h3 className="text-xl font-semibold text-[var(--tukki-gray-900)] mb-3">
								Simple Setup
							</h3>
							<p className="text-gray-600">
								Launch your event page in minutes, no technical
								skills required. Just add details and go live.
							</p>
						</div>

						<div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
							<div className="text-4xl mb-4">📱</div>
							<h3 className="text-xl font-semibold text-[var(--tukki-gray-900)] mb-3">
								Mobile-First Experience
							</h3>
							<p className="text-gray-600">
								Perfect for organizers and attendees on smartphones.
								Optimized for all screen sizes.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section id="how-it-works" className="py-20 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-[var(--tukki-gray-900)] mb-4">
							How It Works
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Get your event up and running in just four simple steps
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div className="text-center">
							<div className="bg-[var(--tukki-deep-blue)] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
								1
							</div>
							<h3 className="text-xl font-semibold text-[var(--tukki-gray-900)] mb-3">
								Create
							</h3>
							<p className="text-gray-600">
								Add your event details, date, location, and
								description. Upload photos to make it attractive.
							</p>
						</div>

						<div className="text-center">
							<div className="bg-[var(--tukki-vibrant-orange)] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
								2
							</div>
							<h3 className="text-xl font-semibold text-[var(--tukki-gray-900)] mb-3">
								Customize
							</h3>
							<p className="text-gray-600">
								Set up your tickets, pricing options, and payment
								methods. Choose what works for your audience.
							</p>
						</div>

						<div className="text-center">
							<div className="bg-[var(--tukki-sun-yellow)] text-[var(--tukki-gray-900)] w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
								3
							</div>
							<h3 className="text-xl font-semibold text-[var(--tukki-gray-900)] mb-3">
								Promote
							</h3>
							<p className="text-gray-600">
								Share across all your channels. We provide easy
								sharing tools for social media and messaging apps.
							</p>
						</div>

						<div className="text-center">
							<div className="bg-[var(--tukki-light-blue)] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
								4
							</div>
							<h3 className="text-xl font-semibold text-[var(--tukki-gray-900)] mb-3">
								Manage
							</h3>
							<p className="text-gray-600">
								Scan tickets and manage attendees on event day.
								Real-time updates and easy check-in process.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="py-20 bg-[var(--tukki-gray-50)]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-[var(--tukki-gray-900)] mb-4">
							Trusted by Event Organizers
						</h2>
						<p className="text-xl text-gray-600">
							See what African event organizers are saying about
							TukkiEvent
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						<div className="bg-white rounded-xl p-8 shadow-sm">
							<div className="flex items-center mb-4">
								<div className="w-12 h-12 bg-[var(--tukki-deep-blue)] rounded-full flex items-center justify-center text-white font-bold">
									A
								</div>
								<div className="ml-4">
									<h4 className="font-semibold text-[var(--tukki-gray-900)]">
										Aminata Diallo
									</h4>
									<p className="text-sm text-gray-600">
										Music Festival Organizer, Senegal
									</p>
								</div>
							</div>
							<p className="text-gray-600 italic">
								&ldquo;TukkiEvent made our festival ticket sales so
								much easier. The offline mode saved us when the
								internet was unstable during peak sales.&rdquo;
							</p>
						</div>

						<div className="bg-white rounded-xl p-8 shadow-sm">
							<div className="flex items-center mb-4">
								<div className="w-12 h-12 bg-[var(--tukki-vibrant-orange)] rounded-full flex items-center justify-center text-white font-bold">
									K
								</div>
								<div className="ml-4">
									<h4 className="font-semibold text-[var(--tukki-gray-900)]">
										Kouassi Jean
									</h4>
									<p className="text-sm text-gray-600">
										Business Conference, Ivory Coast
									</p>
								</div>
							</div>
							<p className="text-gray-600 italic">
								&ldquo;The mobile money integration was perfect for
								our business conference. Attendees could pay easily
								and we got instant notifications.&rdquo;
							</p>
						</div>

						<div className="bg-white rounded-xl p-8 shadow-sm">
							<div className="flex items-center mb-4">
								<div className="w-12 h-12 bg-[var(--tukki-sun-yellow)] rounded-full flex items-center justify-center text-[var(--tukki-gray-900)] font-bold">
									F
								</div>
								<div className="ml-4">
									<h4 className="font-semibold text-[var(--tukki-gray-900)]">
										Fatoumata Traoré
									</h4>
									<p className="text-sm text-gray-600">
										Cultural Festival, Mali
									</p>
								</div>
							</div>
							<p className="text-gray-600 italic">
								&ldquo;Setting up our cultural festival was
								incredibly simple. The team loved how easy it was to
								scan tickets on event day.&rdquo;
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Featured Events Section */}
			<section className="py-20 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-[var(--tukki-gray-900)] mb-4">
							Featured Events
						</h2>
						<p className="text-xl text-gray-600">
							Discover amazing events created with TukkiEvent
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						<div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200">
							<div className="h-48 bg-gradient-to-br from-[var(--tukki-deep-blue)] to-[var(--tukki-light-blue)] flex items-center justify-center">
								<span className="text-white text-2xl font-bold">
									🎵
								</span>
							</div>
							<div className="p-6">
								<h3 className="text-xl font-semibold text-[var(--tukki-gray-900)] mb-2">
									Afro Music Festival
								</h3>
								<p className="text-gray-600 mb-3">
									Dakar, Senegal • March 15-17, 2024
								</p>
								<div className="flex justify-between items-center">
									<span className="text-[var(--tukki-vibrant-orange)] font-bold">
										$25 - $150
									</span>
									<span className="text-sm text-gray-500">
										1,247 sold
									</span>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200">
							<div className="h-48 bg-gradient-to-br from-[var(--tukki-vibrant-orange)] to-[var(--tukki-sun-yellow)] flex items-center justify-center">
								<span className="text-white text-2xl font-bold">
									💼
								</span>
							</div>
							<div className="p-6">
								<h3 className="text-xl font-semibold text-[var(--tukki-gray-900)] mb-2">
									West Africa Tech Summit
								</h3>
								<p className="text-gray-600 mb-3">
									Abidjan, Ivory Coast • April 20-22, 2024
								</p>
								<div className="flex justify-between items-center">
									<span className="text-[var(--tukki-vibrant-orange)] font-bold">
										$50 - $200
									</span>
									<span className="text-sm text-gray-500">
										856 sold
									</span>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200">
							<div className="h-48 bg-gradient-to-br from-[var(--tukki-sun-yellow)] to-[var(--tukki-vibrant-orange)] flex items-center justify-center">
								<span className="text-white text-2xl font-bold">
									🎭
								</span>
							</div>
							<div className="p-6">
								<h3 className="text-xl font-semibold text-[var(--tukki-gray-900)] mb-2">
									Bamako Cultural Week
								</h3>
								<p className="text-gray-600 mb-3">
									Bamako, Mali • May 10-15, 2024
								</p>
								<div className="flex justify-between items-center">
									<span className="text-[var(--tukki-vibrant-orange)] font-bold">
										$10 - $75
									</span>
									<span className="text-sm text-gray-500">
										2,103 sold
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section id="pricing" className="py-20 bg-[var(--tukki-gray-50)]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-[var(--tukki-gray-900)] mb-4">
							Transparent Pricing
						</h2>
						<p className="text-xl text-gray-600">
							Simple, fair pricing with no hidden fees
						</p>
					</div>

					<div className="max-w-4xl mx-auto">
						<div className="bg-white rounded-2xl p-8 shadow-sm">
							<div className="text-center mb-8">
								<h3 className="text-2xl font-bold text-[var(--tukki-gray-900)] mb-4">
									Commission-Based Pricing
								</h3>
								<p className="text-lg text-gray-600">
									We only make money when you make money
								</p>
							</div>

							<div className="grid md:grid-cols-3 gap-8 mb-8">
								<div className="text-center p-6 bg-[var(--tukki-gray-50)] rounded-xl">
									<div className="text-3xl font-bold text-[var(--tukki-deep-blue)] mb-2">
										2.9%
									</div>
									<h4 className="font-semibold text-[var(--tukki-gray-900)] mb-2">
										Standard Events
									</h4>
									<p className="text-sm text-gray-600">
										Conferences, workshops, meetups
									</p>
								</div>

								<div className="text-center p-6 bg-[var(--tukki-gray-50)] rounded-xl">
									<div className="text-3xl font-bold text-[var(--tukki-vibrant-orange)] mb-2">
										3.5%
									</div>
									<h4 className="font-semibold text-[var(--tukki-gray-900)] mb-2">
										Entertainment
									</h4>
									<p className="text-sm text-gray-600">
										Concerts, festivals, shows
									</p>
								</div>

								<div className="text-center p-6 bg-[var(--tukki-sun-yellow)] rounded-xl">
									<div className="text-3xl font-bold text-[var(--tukki-gray-900)] mb-2">
										FREE
									</div>
									<h4 className="font-semibold text-[var(--tukki-gray-900)] mb-2">
										Community & Charity
									</h4>
									<p className="text-sm text-gray-600">
										Non-profit events, fundraisers
									</p>
								</div>
							</div>

							<div className="bg-[var(--tukki-deep-blue)] text-white rounded-xl p-6">
								<h4 className="text-xl font-semibold mb-4">
									Example Calculation
								</h4>
								<div className="space-y-2">
									<div className="flex justify-between">
										<span>Event Revenue:</span>
										<span>$10,000</span>
									</div>
									<div className="flex justify-between">
										<span>Our Commission (3.5%):</span>
										<span>$350</span>
									</div>
									<div className="flex justify-between text-[var(--tukki-sun-yellow)] font-semibold text-lg border-t border-white/20 pt-2">
										<span>You Keep:</span>
										<span>$9,650</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Final CTA Section */}
			<section className="py-20 bg-gradient-to-r from-[var(--tukki-deep-blue)] to-[var(--tukki-light-blue)] text-white">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl md:text-4xl font-bold mb-6">
						Ready to Transform Your Event Management?
					</h2>
					<p className="text-xl text-blue-100 mb-8">
						Join organizers across Africa creating successful events with
						TukkiEvent
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button className="bg-[var(--tukki-vibrant-orange)] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg">
							Get Started Now
						</button>
						<button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-[var(--tukki-deep-blue)] transition-colors">
							Schedule a Demo
						</button>
					</div>
				</div>
			</section>
    </div>
  )
}

export default Features