import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white py-20 px-4 md:px-0">
            <div className="max-w-3xl mx-auto space-y-8">
                <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors inline-block mb-4">
                    ← Back to Home
                </Link>
                <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                <p className="text-gray-400">Last updated: March 6, 2026</p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-100">1. Information We Collect</h2>
                    <p className="text-gray-300 leading-relaxed">
                        We collect information you provide directly, such as your email address and business details, to provide our AI services. We also collect usage data to improve user experience.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-100">2. How We Use Information</h2>
                    <p className="text-gray-300 leading-relaxed">
                        Your information is used to personalize your AI pitch generation, process payments via Paddle, and communicate service updates. We do not sell your personal data.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-100">3. Data Security</h2>
                    <p className="text-gray-300 leading-relaxed">
                        We implement standard security measures to protect your data. Payment processing is handled securely by Paddle, and we do not store your credit card information.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-100">4. Third-Party Services</h2>
                    <p className="text-gray-300 leading-relaxed">
                        We use Google AI for pitch generation and Supabase for database management. These services have their own privacy policies.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-100">5. Your Rights</h2>
                    <p className="text-gray-300 leading-relaxed">
                        You can request access to or deletion of your personal data at any time by contacting our support.
                    </p>
                </section>
            </div>
        </div>
    );
}
