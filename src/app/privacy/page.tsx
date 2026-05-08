export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-10">Last updated: May 8, 2026</p>

        <div className="space-y-8 text-white/70 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              CineCircle (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is a social movie and TV
              watchlist platform. This Privacy Policy explains how we collect, use, and protect your
              information when you use our application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
            <p className="mb-3">When you sign in with Facebook, we receive the following information from your Facebook account:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Your name</li>
              <li>Your email address</li>
              <li>Your profile picture</li>
            </ul>
            <p className="mt-3">We also collect information about your activity within CineCircle, including:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Movies and TV shows you add to your watchlist</li>
              <li>Your movie preferences and ratings</li>
              <li>Interactions with friends&apos; recommendations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>To create and manage your CineCircle account</li>
              <li>To provide personalized movie and TV show recommendations</li>
              <li>To enable social features such as sharing watchlists with friends</li>
              <li>To improve our service and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Data Sharing</h2>
            <p>
              We do not sell your personal information to third parties. We may share anonymized,
              aggregated data for analytics purposes. Your watchlist and preferences may be visible
              to friends within your CineCircle network, based on your privacy settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Data Storage and Security</h2>
            <p>
              Your data is stored securely using industry-standard encryption and security practices.
              We retain your data for as long as your account is active. You may request deletion of
              your data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for data processing</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Cookies and Tracking</h2>
            <p>
              We use essential cookies to maintain your login session. We do not use third-party
              tracking cookies or advertising trackers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify users of any
              material changes through the application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@cinecircle.app" className="text-red-400 hover:text-red-300 underline">
                privacy@cinecircle.app
              </a>
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <a href="/" className="text-white/40 hover:text-white text-sm transition-colors">
            &larr; Back to CineCircle
          </a>
        </div>
      </div>
    </div>
  );
}
