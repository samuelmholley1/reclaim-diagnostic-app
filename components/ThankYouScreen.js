export default function ThankYouScreen() {
    // We will add the logic for personalized insights in v2.0
    const insight = "Your responses are the first step toward building a more intentional relationship with AI. The next step is our conversation.";

    return (
    <div className="text-center p-4">
        <h1 className="text-4xl font-bold mb-4 text-brand-dark">Thank you. The foundation is set.</h1>
        <p className="max-w-xl mx-auto mb-10 text-lg text-brand-text-secondary">{insight}</p>
        <a
            href="YOUR_CALENDLY_LINK_HERE" // <-- IMPORTANT: Replace this!
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-accent text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
        >
            Book Your Complimentary Clarity Call
        </a>
    </div>
    );
}