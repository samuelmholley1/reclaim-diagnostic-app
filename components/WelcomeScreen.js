// File: components/WelcomeScreen.js

import Image from 'next/image';

// This is the final, merged component. It accepts all the necessary props from page.js.
export default function WelcomeScreen({ onStart, onInfoChange, clientName, clientEmail, phoneNumber, websiteOrLinkedIn }) {
  return (
    <div className="text-center p-4">
      {/* Your original logo and branding */}
      <Image src="/logo.png" alt="Reclaim by Design Logo" width={150} height={150} className="mx-auto mb-8" />
      <h1 className="text-4xl font-bold mb-4 text-brand-dark">Reclaim Your Story</h1>
      <p className="max-w-xl mx-auto mb-10 text-lg text-brand-text-secondary">
        This is a guided, 3-minute reflection to provide immediate clarity on your relationship with AI. Let's find your starting point.
      </p>

      {/* NEW: The integrated form fields for data collection */}
      <div className="max-w-md mx-auto text-left mb-10">
        {/* Client Name Input (Required) */}
        <div className="mb-4">
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="clientName"
            name="Client Name"
            value={clientName}
            onChange={onInfoChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Jane Doe"
            required
          />
        </div>

        {/* Client Email Input (Required) */}
        <div className="mb-4">
          <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Your Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="clientEmail"
            name="Client Email"
            value={clientEmail}
            onChange={onInfoChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="jane.doe@example.com"
            required
          />
        </div>
        
        {/* Phone Number Input (Required) */}
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="Phone Number"
            value={phoneNumber}
            onChange={onInfoChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="(555) 123-4567"
            required
          />
        </div>

        {/* Website or LinkedIn Input (Optional) */}
        <div className="mb-6">
          <label htmlFor="websiteOrLinkedIn" className="block text-sm font-medium text-gray-700 mb-1">
            Website or LinkedIn (Optional)
          </label>
          <input
            type="url"
            id="websiteOrLinkedIn"
            name="Website or LinkedIn"
            value={websiteOrLinkedIn}
            onChange={onInfoChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://example.com or https://linkedin.com/in/..."
          />
        </div>
      </div>
      
      {/* Your original, styled button */}
      <button
        onClick={onStart}
        className="bg-brand-accent text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
      >
        Start My Assessment
      </button>
    </div>
  );
}
