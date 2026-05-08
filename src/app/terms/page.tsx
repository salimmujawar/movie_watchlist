export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-white/40 text-sm mb-10">Last updated: May 8, 2026</p>

        <div className="space-y-8 text-white/70 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using CineCircle (&quot;the Service&quot;), you agree to be bound by
              these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p>
              CineCircle is a social movie and TV watchlist platform that provides personalized
              recommendations powered by AI. The Service allows users to discover, track, and share
              movies and TV shows with friends.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>You must authenticate via Facebook to use the Service</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must be at least 13 years of age to use the Service</li>
              <li>You agree to provide accurate information during registration</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Acceptable Use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Interfere with or disrupt the Service or its servers</li>
              <li>Upload or transmit malicious code or content</li>
              <li>Impersonate any person or entity</li>
              <li>Scrape, harvest, or collect user data without consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Content and Data</h2>
            <p>
              Movie and TV show data is provided by The Movie Database (TMDB). CineCircle uses the
              TMDB API but is not endorsed or certified by TMDB. All movie posters, descriptions,
              and metadata are the property of their respective owners.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Intellectual Property</h2>
            <p>
              The CineCircle name, logo, and application design are our intellectual property. You
              may not copy, modify, or distribute any part of the Service without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Limitation of Liability</h2>
            <p>
              The Service is provided &quot;as is&quot; without warranties of any kind. We shall not
              be liable for any indirect, incidental, special, or consequential damages arising from
              your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at any time for violation of
              these terms. You may delete your account at any time through the application settings
              or by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Changes to Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Continued use of the Service
              after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:support@cinecircle.app" className="text-red-400 hover:text-red-300 underline">
                support@cinecircle.app
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
