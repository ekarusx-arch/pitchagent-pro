import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white py-20 px-4 md:px-0">
            <div className="max-w-3xl mx-auto space-y-8">
                <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors inline-block mb-4">
                    ← Back to Home
                </Link>
                <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
                <p className="text-gray-400">Last updated: March 6, 2026</p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-100">1. Agreement to Terms</h2>
                    <p className="text-gray-300 leading-relaxed">
                        By accessing or using PitchAgent Pro, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-100">2. Service Description</h2>
                    <p className="text-gray-300 leading-relaxed">
                        PitchAgent Pro provides AI-powered pitch deck generation and business consulting insights. We reserve the right to modify or discontinue the service at any time.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-100">3. User Conduct</h2>
                    <p className="text-gray-300 leading-relaxed">
                        You agree not to use the service for any illegal purposes or to generate harmful content. You are responsible for maintaining the confidentiality of your account.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-100">4. Intellectual Property</h2>
                    <p className="text-gray-300 leading-relaxed">
                        The AI-generated content is provided for your use. However, the underlying platform, technology, and designs are the property of PitchAgent Pro.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-100">5. Limitation of Liability</h2>
                    <p className="text-gray-300 leading-relaxed">
                        PitchAgent Pro shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the service.
                    </p>
                </section>
            </div>
        </div>
    );
}
