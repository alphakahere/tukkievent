import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	env: {
		NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
	},
	/* config options here */
	images: {
		domains: [
			"images.pexels.com",
			"images.unsplash.com",
			"cloudinary.com",
			"res.cloudinary.com",
		],
	},
};

export default nextConfig;
