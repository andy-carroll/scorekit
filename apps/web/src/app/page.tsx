import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
            Build your AI business case
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What&apos;s AI Inaction Costing Your Business?
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Articulate your pain, quantify the cost, and build a compelling case 
            for AI transformation—ready to share with your board.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg rounded-lg transition-colors shadow-lg shadow-indigo-200"
          >
            Start Your Business Case
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
          <p className="mt-6 text-sm text-gray-500">
            15–20 minutes • Personalised report • Worth sharing with colleagues
          </p>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quantify the Cost</h3>
            <p className="text-gray-600 text-sm">See exactly what AI inaction is costing your business in pounds and hours.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Build Your Case</h3>
            <p className="text-gray-600 text-sm">Generate a compelling business case document ready for leadership review.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Share with Your Team</h3>
            <p className="text-gray-600 text-sm">A report worth discussing—designed to spark internal conversations.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
