import Layout from '@/layouts/Layout'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode } ) => {
	return (
		<Layout>
			<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
				{children}
			</div>
		</Layout>
	);
}

export default layout