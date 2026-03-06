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

                <p className="text-gray-300 leading-relaxed">
                    PitchAgent Pro is operated by <strong>Daehyun Yoon</strong>.
                </p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-100">1. 14-Day Refund Policy</h2>
                    <p className="text-gray-300 leading-relaxed">
                        We offer a <strong>14-day money-back guarantee</strong>. If you are not satisfied with our service for any reason, you can request a full refund within 14 days of your initial purchase or subscription date.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-100">2. Refund Request Process</h2>
                    <p className="text-gray-300 leading-relaxed">
                        To request a refund, please contact us at our support email with your account information. We will process your refund within 5-10 business days.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-100">3. Subscription Cancellation</h2>
                    <p className="text-gray-300 leading-relaxed">
                        You can cancel your subscription at any time. If you cancel after the 14-day refund window, your access will continue until the end of the current billing cycle, and no partial refunds will be provided.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-100">4. Contact Us</h2>
                    <p className="text-gray-300 leading-relaxed">
                        If you have any questions about our Refund Policy or encounter technical issues, please reach out to us. We are here to help.
                    </p>
                </section>
            </div>
        </div>
    );
}
