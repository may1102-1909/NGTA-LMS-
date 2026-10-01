import React from "react";
import Link from "next/link";
import { ArrowLeft, Cookie, ShieldCheck, Mail, MapPin } from "lucide-react";

export const metadata = {
  title: "Cookie Policy — NextGen Testing Academy",
  description: "Cookie Policy for NextGen Testing Academy (NGTA) LMS detailing our use of essential cookies, session storage, and analytics.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#EFFF4F] selection:text-black">
      {/* Top Breadcrumb Header */}
      <header className="border-b border-zinc-800 bg-black/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#EFFF4F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to LMS</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded">
            <Cookie className="w-3.5 h-3.5 text-[#EFFF4F]" />
            <span>Cookies & Tracking</span>
          </div>
        </div>
      </header>

      {/* Main Document Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Title & Metadata Card */}
        <div className="mb-10 pb-8 border-b border-zinc-800">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#EFFF4F] bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 px-2.5 py-1 rounded inline-block mb-3">
            Platform Policy
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-4">
            Cookie Policy
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
            This Cookie Policy explains how NextGen Testing Academy uses cookies and similar client-side storage technologies to deliver, secure, and personalize the NGTA LMS experience.
          </p>

          {/* Metadata Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono bg-zinc-950 border border-zinc-800 p-4 rounded-lg">
            <div>
              <span className="text-zinc-400 block mb-0.5">Policy Version</span>
              <span className="text-white font-bold">1.0</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-0.5">Effective Date</span>
              <span className="text-white font-bold">01 October 2026</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-0.5">Last Updated</span>
              <span className="text-white font-bold">01 October 2026</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-0.5">Legal Entity</span>
              <span className="text-white font-bold">NextGen Testing Academy (NGTA)</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-0.5">Registered Location</span>
              <span className="text-white font-bold">Bengaluru, Karnataka, India</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-0.5">Contact Email</span>
              <a href="mailto:privacy@ngtalms.com" className="text-[#EFFF4F] hover:underline font-bold">
                privacy@ngtalms.com
              </a>
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-10 text-sm sm:text-base text-zinc-300 leading-relaxed">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. What Are Cookies?</h2>
            <p>
              Cookies are small data files placed on your browser or device when you visit an online service. Similar technologies include HTML5 local storage, session storage, tracking pixels, and software development kits (SDKs). These technologies enable NGTA LMS to maintain authenticated sessions, remember learning configurations, and optimize performance. In this Policy, &quot;cookies&quot; encompasses all these technologies collectively.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Why We Use Cookies</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To securely authenticate and preserve your logged-in student session and protect against Cross-Site Request Forgery (CSRF).</li>
              <li>To remember interface preferences, such as selected theme, audio/video playback settings, and notification preferences.</li>
              <li>To remember lesson video playback position and quiz timestamps so you can resume effortlessly across devices.</li>
              <li>To process course enrolments and recurring subscription checkouts safely via Razorpay.</li>
              <li>To track affiliate referrals and measure the conversion efficacy of training campaigns.</li>
              <li>To record your preferences regarding cookie collection.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Categories of Cookies</h2>
            <div className="overflow-x-auto border border-zinc-800 rounded-lg">
              <table className="w-full text-left text-xs sm:text-sm font-sans">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-white font-mono uppercase text-[11px]">
                  <tr>
                    <th className="p-3">Category</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Consent Needed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">Strictly Necessary</td>
                    <td className="p-3">Essential for core platform operations: authentication, security, checkout, and cookie consent tracking. The platform cannot function without them.</td>
                    <td className="p-3 font-mono text-[#EFFF4F]">No (Mandatory)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Preferences</td>
                    <td className="p-3">Stores learner settings, video streaming quality, and sidebar navigation state.</td>
                    <td className="p-3 font-mono text-zinc-400">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Analytics & Performance</td>
                    <td className="p-3">Aggregated metrics on lesson completion, video retention, and crash diagnostics to enhance curriculum delivery.</td>
                    <td className="p-3 font-mono text-zinc-400">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Marketing & Referral</td>
                    <td className="p-3">Tracks affiliate referral tags and campaign origins for partner attribution.</td>
                    <td className="p-3 font-mono text-zinc-400">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Cookies We Use</h2>
            <div className="overflow-x-auto border border-zinc-800 rounded-lg">
              <table className="w-full text-left text-xs sm:text-sm font-sans">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-white font-mono uppercase text-[11px]">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Provider</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  <tr>
                    <td className="p-3 font-mono font-semibold text-white">sb-access-token</td>
                    <td className="p-3">NGTA / Supabase</td>
                    <td className="p-3">Keeps you securely authenticated in your student/instructor account</td>
                    <td className="p-3 font-mono text-xs">Strictly Necessary</td>
                    <td className="p-3 font-mono text-xs">Session / 30 Days</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold text-white">ngta_csrf</td>
                    <td className="p-3">NGTA</td>
                    <td className="p-3">Prevents cross-site request forgery vulnerabilities on forms and APIs</td>
                    <td className="p-3 font-mono text-xs">Strictly Necessary</td>
                    <td className="p-3 font-mono text-xs">Session</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold text-white">ngta_consent</td>
                    <td className="p-3">NGTA</td>
                    <td className="p-3">Preserves your cookie consent preference choices</td>
                    <td className="p-3 font-mono text-xs">Strictly Necessary</td>
                    <td className="p-3 font-mono text-xs">12 Months</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold text-white">ngta_prefs</td>
                    <td className="p-3">NGTA</td>
                    <td className="p-3">Saves player settings and sidebar navigation toggle status</td>
                    <td className="p-3 font-mono text-xs">Preferences</td>
                    <td className="p-3 font-mono text-xs">12 Months</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold text-white">ngta_ref</td>
                    <td className="p-3">NGTA</td>
                    <td className="p-3">Logs partner and affiliate referral tokens for attribution</td>
                    <td className="p-3 font-mono text-xs">Marketing</td>
                    <td className="p-3 font-mono text-xs">30 Days</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold text-white">rzp_checkout</td>
                    <td className="p-3">Razorpay</td>
                    <td className="p-3">Handles secure PCI-DSS tokenized payment and UPI checkout flow</td>
                    <td className="p-3 font-mono text-xs">Strictly Necessary</td>
                    <td className="p-3 font-mono text-xs">Session</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold text-white">video_state</td>
                    <td className="p-3">NGTA</td>
                    <td className="p-3">Saves playback timestamp to resume video lessons seamlessly</td>
                    <td className="p-3 font-mono text-xs">Preferences</td>
                    <td className="p-3 font-mono text-xs">Persistent</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Local Storage and Client Storage</h2>
            <p>
              We utilize browser local storage (`localStorage`) and session storage (`sessionStorage`) to preserve transient UI states, such as active tab selection, draft responses, and video playback milestones. This data resides solely on your client device and is never shared across third-party websites.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Third-Party Integrations</h2>
            <p>
              Select trusted third-party partners (such as Razorpay for checkout and Supabase for session management) set cookies necessary to execute payment and security operations. We encourage learners to review Razorpay&apos;s privacy and security statements for additional context.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Managing Cookie Preferences</h2>
            <p className="mb-3">
              You retain granular control over how cookies are utilized on your machine:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You may update or withdraw consent via browser settings at any time.</li>
              <li>All major modern browsers (Chrome, Edge, Firefox, Safari) enable you to inspect, block, or delete cookies through their privacy settings.</li>
              <li>Please note: disabling strictly necessary cookies will disrupt authentication and course access.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Do Not Track & Privacy Signals</h2>
            <p>
              NGTA LMS respects automated privacy preference signals, such as the Global Privacy Control (GPC), adhering to best practices in digital learner privacy.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Policy Updates</h2>
            <p>
              We may periodically revise this Cookie Policy to reflect technical infrastructure updates or evolving regulatory requirements. The latest version is always reflected with the timestamp at the top of this document.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Contact Us</h2>
            <p>
              If you have any questions regarding our use of cookies or client storage, reach out to our privacy team at <a href="mailto:privacy@ngtalms.com" className="text-[#EFFF4F] underline font-mono">privacy@ngtalms.com</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
