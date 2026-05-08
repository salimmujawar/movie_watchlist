"use client";

import { useState } from "react";

export default function DataDeletion() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">User Data Deletion</h1>
        <p className="text-white/40 text-sm mb-10">Last updated: May 8, 2026</p>

        <div className="space-y-8 text-white/70 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Data Deletion Policy</h2>
            <p>
              At CineCircle, we respect your right to control your personal data. You can request
              the deletion of all data associated with your account at any time. This includes your
              profile information, watchlists, ratings, preferences, and any other data we have collected.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">How to Delete Your Data</h2>
            <p className="mb-4">You can delete your data using any of the following methods:</p>

            <div className="space-y-4">
              <div
                className="p-4 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <h3 className="text-white font-medium mb-1">Option 1: In-App Deletion</h3>
                <p className="text-sm">
                  Go to your Profile &rarr; Settings &rarr; Delete Account. This will permanently
                  remove all your data from our systems.
                </p>
              </div>

              <div
                className="p-4 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <h3 className="text-white font-medium mb-1">Option 2: Facebook Settings</h3>
                <p className="text-sm">
                  Remove CineCircle from your Facebook account settings: Facebook Settings &rarr;
                  Apps and Websites &rarr; CineCircle &rarr; Remove. This will revoke our access
                  and trigger data deletion.
                </p>
              </div>

              <div
                className="p-4 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <h3 className="text-white font-medium mb-1">Option 3: Email Request</h3>
                <p className="text-sm">
                  Send an email to{" "}
                  <a href="mailto:privacy@cinecircle.app" className="text-red-400 hover:text-red-300 underline">
                    privacy@cinecircle.app
                  </a>{" "}
                  with the subject line &quot;Data Deletion Request&quot; and we will process your
                  request within 30 days.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Request Data Deletion</h2>
            <p className="mb-4">
              Use the form below to submit a data deletion request. We will process your request
              and confirm deletion via email within 30 days.
            </p>

            {submitted ? (
              <div
                className="p-6 rounded-xl text-center"
                style={{
                  background: "rgba(74, 222, 128, 0.1)",
                  border: "1px solid rgba(74, 222, 128, 0.3)",
                }}
              >
                <div className="text-3xl mb-3">&#10003;</div>
                <h3 className="text-green-400 font-semibold text-lg mb-1">Request Submitted</h3>
                <p className="text-white/60 text-sm">
                  We have received your data deletion request. You will receive a confirmation email
                  within 30 days once your data has been permanently deleted.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">Email address associated with your account</label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-red-500/50"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">Reason (optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us why you want to delete your data..."
                    className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all hover:brightness-110"
                  style={{
                    background: "linear-gradient(135deg, #e50914 0%, #b20710 100%)",
                  }}
                >
                  Submit Deletion Request
                </button>
              </form>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">What Gets Deleted</h2>
            <p className="mb-3">When you request data deletion, we permanently remove:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Your account profile and personal information</li>
              <li>Your movie and TV show watchlists</li>
              <li>Your ratings and preferences</li>
              <li>Your social connections within CineCircle</li>
              <li>Any other data associated with your account</li>
            </ul>
            <p className="mt-3">
              Please note that this action is irreversible. Once your data is deleted, it cannot be
              recovered.
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
