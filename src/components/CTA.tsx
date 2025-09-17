import React from 'react'

const CTA = () => {
  return (
    <div className="mt-20 bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
    <div className="flex flex-col md:flex-row items-center justify-between">
      <div className="mb-8 md:mb-0 md:mr-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to host your next event?</h3>
        <p className="text-white/90 text-lg">Get started in minutes and reach more attendees across Africa.</p>
      </div>
      <a href="#" className="px-8 py-4 bg-white text-purple-600 font-medium rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap">
        Start Free
      </a>
    </div>
  </div>
  )
}

export default CTA