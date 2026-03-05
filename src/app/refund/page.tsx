import Link from "next/link";

export default function RefundPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white py-20 px-4 md:px-0">
            <div className="max-w-3xl mx-auto space-y-8">
                <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors inline-block mb-4">
                    ← Back to Home
                </Link>
                <h1 className="text-4xl font-bold tracking-tight">Refund Policy</h1>
                <p className="text-gray-400">Last updated: March 6, 2026</p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-100">1. Refund Eligibility</h2>
                    <p className="text-gray-300 leading-relaxed">
                        Due to the nature of AI-generated content and the immediate costs associated with AI processing, refunds are generally not provided once a generation has been completed.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-100">2. Subscription Cancellation</h2>
                    <p className="text-gray-300 leading-relaxed">
                        You can cancel your subscription at any time. Your access will continue until the end of the current billing cycle. No partial refunds are provided for unused time.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-100">3. Technical Issues</h2>
                    <p className="text-gray-300 leading-relaxed">
                        If you experience a technical failure that prevents you from receiving your pitch deck, please contact us within 7 days for a credit adjustment or refund consideration.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-100">4. How to Request</h2>
                    <p className="text-gray-300 leading-relaxed">
                        All refund requests must be sent to our support email with your account details and reasoning.
                    </p>
                </section>
            </div>
        </div>
    );
}
