import Image from 'next/image';

export default function WelcomeScreen({ onStart }) {
  return (
    <div className="text-center p-4">
      <Image src="/logo.png" alt="Reclaim by Design Logo" width={150} height={150} className="mx-auto mb-8" />
      <h1 className="text-4xl font-bold mb-4 text-brand-dark">Reclaim Your Story</h1>
      <p className="max-w-xl mx-auto mb-10 text-lg text-brand-text-secondary">
        This is a guided, 3-minute reflection to provide immediate clarity on your relationship with AI. Let's find your starting point.
      </p>
      <button
        onClick={onStart}
        className="bg-brand-accent text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
      >
        Start My Assessment
      </button>
    </div>
  );
}