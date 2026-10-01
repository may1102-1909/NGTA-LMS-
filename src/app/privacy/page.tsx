import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail, MapPin, Calendar, FileText } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — NextGen Testing Academy",
  description: "NextGen Testing Academy (NGTA) LMS Privacy Policy complying with the Digital Personal Data Protection Act, 2023 (DPDP Act).",
};

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5 text-[#EFFF4F]" />
            <span>DPDP Act 2023 Compliant</span>
          </div>
        </div>
      </header>

      {/* Main Document Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Title & Metadata Card */}
        <div className="mb-10 pb-8 border-b border-zinc-800">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#EFFF4F] bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 px-2.5 py-1 rounded inline-block mb-3">
            Legal Document
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
            NextGen Testing Academy (&quot;NGTA&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to transparently protecting your personal data and privacy rights across the NGTA LMS platform.
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
              <span className="text-zinc-400 block mb-0.5">Support & Privacy Email</span>
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
            <h2 className="text-xl font-bold text-white mb-3">1. Introduction and Scope</h2>
            <p className="mb-3">
              NextGen Testing Academy (&quot;NGTA&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates NGTA LMS, an online learning platform available through our website and any future mobile applications (the &quot;Platform&quot;). This Privacy Policy explains what personal data we collect, why we collect it, how we use and protect it, and the choices and rights you have.
            </p>
            <p>
              It applies to everyone who uses the Platform, including guests, learners, instructors, content managers, support staff, administrators, and affiliates. By creating an account, making a purchase, or otherwise using the Platform, you confirm that you have read this Policy. Where the law requires your consent, we will ask for it separately.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Who Is Responsible for Your Data</h2>
            <p>
              For the purposes of the Digital Personal Data Protection Act, 2023 (&quot;DPDP Act&quot;), NextGen Testing Academy is the Data Fiduciary for personal data processed through the Platform. Our contact details and the details of our Grievance Officer are set out in Sections 18 and 20.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Personal Data We Collect</h2>
            <p className="mb-4">The data we collect depends on how you use the Platform:</p>

            <div className="overflow-x-auto border border-zinc-800 rounded-lg mb-4">
              <table className="w-full text-left text-xs sm:text-sm font-sans border-collapse">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-white font-mono uppercase text-[11px]">
                  <tr>
                    <th className="p-3">Category</th>
                    <th className="p-3">Examples</th>
                    <th className="p-3">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">Account and profile</td>
                    <td className="p-3">Name, email address, password (stored only as a salted cryptographic hash), phone number, profile photo, time zone, notification preferences, role</td>
                    <td className="p-3 font-mono text-zinc-400">You</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Learning activity</td>
                    <td className="p-3">Enrolments, module and lesson progress, video playback position and completion, quiz attempts and scores, assignment submissions and uploaded files, instructor feedback and marks, last accessed lesson, completion dates</td>
                    <td className="p-3 font-mono text-zinc-400">You & Platform</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Certificates</td>
                    <td className="p-3">Learner name, course name, completion date, certificate ID, digital verification status</td>
                    <td className="p-3 font-mono text-zinc-400">You & Platform</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Purchases and payments</td>
                    <td className="p-3">Order details, course/plan purchased, amount, currency, payment method type, transaction ID, payment status, refund records, coupon used, gateway response</td>
                    <td className="p-3 font-mono text-zinc-400">You & Gateway</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Memberships & consultations</td>
                    <td className="p-3">Plan tier (Free, Basic, Pro, Premium), trial and renewal status, appointment bookings, availability, meeting links</td>
                    <td className="p-3 font-mono text-zinc-400">You & Platform</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Live sessions</td>
                    <td className="p-3">Registration, attendance records, questions or chat messages, and audio, video, or screen content shared during live webinars</td>
                    <td className="p-3 font-mono text-zinc-400">You & Provider</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Community & messaging</td>
                    <td className="p-3">Posts, comments, replies, reactions, direct and group messages, announcements</td>
                    <td className="p-3 font-mono text-zinc-400">You</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Gamification</td>
                    <td className="p-3">Points, badges, streaks, leaderboard rank, 30-day challenge participation</td>
                    <td className="p-3 font-mono text-zinc-400">Platform</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Affiliate data</td>
                    <td className="p-3">Registration details, referral links, referral clicks and conversions, commission and payout status</td>
                    <td className="p-3 font-mono text-zinc-400">You & Platform</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Technical data</td>
                    <td className="p-3">IP address, device and browser type, operating system, pages viewed, referring URL, session identifiers, error logs, security audit logs</td>
                    <td className="p-3 font-mono text-zinc-400">Your device</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Communications</td>
                    <td className="p-3">Support requests, feedback submissions, and records of email or push notifications sent</td>
                    <td className="p-3 font-mono text-zinc-400">You & Platform</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mb-2 text-xs font-mono text-zinc-400">
              * We do not store full card numbers, CVV codes, UPI PINs or net-banking credentials. These are processed directly and securely by Razorpay.
            </p>
            <p className="text-xs font-mono text-zinc-400">
              * We do not intentionally collect sensitive categories of personal data. Please do not post sensitive personal data in assignments, community posts, or chat messages.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-2 text-zinc-300">
              <li>To create and manage your account, authenticate credentials, and keep sessions secure.</li>
              <li>To deliver courses, track progress, resume video playback, grade quizzes and assignments, and issue verifiable digital certificates.</li>
              <li>To process payments, orders, refunds, coupons, memberships, and subscription renewals.</li>
              <li>To operate live classes, webinars, workshops, consultations, attendance records, and recording access.</li>
              <li>To operate learning communities and messaging, and moderate them according to our Terms of Service.</li>
              <li>To power XP points, badges, streaks, challenges, and competitive leaderboards.</li>
              <li>To send service notifications by email, web push, and, where opted in, messaging channels.</li>
              <li>To provide academy analytics such as enrolments, completion, revenue, and platform improvement metrics.</li>
              <li>To run automated learning workflows, such as welcome sequences after enrolment and streak reminders.</li>
              <li>To prevent fraud, abuse, and security incidents, maintain audit trails, and comply with statutory obligations.</li>
              <li>To provide support and respond to student inquiries, grievances, and refund requests.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Consent and Other Lawful Grounds</h2>
            <p className="mb-3">We process your personal data on the basis of:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Your consent, which you provide when registering or opting in to specific features, and which you may withdraw at any time.</li>
              <li>Legitimate uses permitted under the DPDP Act, including performing contracted services, statutory compliance, and incident prevention.</li>
            </ul>
            <p className="text-xs text-zinc-400">
              Withdrawing consent may prevent us from providing certain features. Withdrawal does not affect processing carried out prior to withdrawal.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Payments</h2>
            <p>
              Payments for courses, recurring memberships, and mentorship consultations are processed through PCI-DSS compliant third-party payment gateways, primarily Razorpay, supporting UPI, credit/debit cards, net banking, and wallets. Payment credentials are submitted directly to the payment gateway and are governed by Razorpay&apos;s privacy policy and security protocols.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Who We Share Data With</h2>
            <p className="mb-3 font-semibold text-white">We never sell your personal data. We share it only as follows:</p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-300">
              <li><strong>Service Providers:</strong> Cloud infrastructure (Supabase, Vercel), payment gateways (Razorpay), video streaming, push messaging, and logging tools.</li>
              <li><strong>Instructors:</strong> Instructors see progress, quiz results, submissions, and messages for learners enrolled in their courses.</li>
              <li><strong>Other Users:</strong> Community interactions and public leaderboard ranks as described in Section 8.</li>
              <li><strong>Affiliates:</strong> Aggregate conversion data required to calculate commission payouts.</li>
              <li><strong>Legal Authorities:</strong> Where compelled by applicable Indian law, court order, or to protect security and rights.</li>
              <li><strong>Corporate Successors:</strong> In the event of a merger, acquisition, or restructuring, subject to this Policy.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Public and Community Information</h2>
            <p className="mb-3">
              Posts, comments, and replies in community spaces are visible to other members of that space. Your display name, avatar, XP points, badges, and leaderboard rankings are visible to peers in the academy.
            </p>
            <p>
              Certificates feature a public verification URL and QR code. Anyone with the certificate ID can confirm learner name, course name, issue date, and validity.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Live Sessions and Recordings</h2>
            <p>
              Live classes, webinars, and masterclasses may be recorded and made available to enrolled learners within the course or membership tier. If you turn on your camera or microphone, share screen, or post in chat, this content may be recorded. If you do not wish to be recorded, please keep your camera and microphone muted.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Communications & Notifications</h2>
            <p>
              We send transactional communications including enrolment confirmations, payment receipts, password resets, class reminders, certificate issuances, and renewal notifications. These are essential for operating the platform. Marketing communications are sent only with your explicit consent, and you can opt out at any time by updating your account settings.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Affiliates</h2>
            <p>
              If you join our affiliate programme, we process registration details, referral activity, and payout details to calculate commissions. Referral links utilize cookies as detailed in our Cookie Policy.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">12. Cookies and Similar Technologies</h2>
            <p>
              We use cookies and browser storage to keep you authenticated, remember preferences, track video playback position, and measure platform health. For full details, please refer to our <Link href="/cookies" className="text-[#EFFF4F] underline">Cookie Policy</Link>.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">13. How Long We Keep Your Data</h2>
            <p className="mb-3">We retain data only as long as necessary for platform operations or statutory compliance:</p>
            <div className="overflow-x-auto border border-zinc-800 rounded-lg">
              <table className="w-full text-left text-xs sm:text-sm font-sans">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-white font-mono uppercase text-[11px]">
                  <tr>
                    <th className="p-3">Data Type</th>
                    <th className="p-3">Retention Period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">Account and profile</td>
                    <td className="p-3">While account is active, and up to 12 months post-closure</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Learning progress & certificates</td>
                    <td className="p-3">While account is active; certificate records kept for 7 years for public verification</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Orders, invoices, payments</td>
                    <td className="p-3">8 years in compliance with statutory Indian tax and accounting laws</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Support requests</td>
                    <td className="p-3">24 months after ticket resolution</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Audit & security logs</td>
                    <td className="p-3">24 months for forensic and security investigations</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Backups</td>
                    <td className="p-3">Rolling encrypted backups kept for 30 days and overwritten</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">14. Security Safeguards</h2>
            <p>
              We implement industry-standard security safeguards including salted password hashing, HTTPS encryption in transit, TLS encrypted databases, least-privilege role-based access control, session timeouts, and rate limiting against brute-force attacks. In the unlikely event of a security incident affecting your personal data, we will notify you and the Data Protection Board of India in accordance with legal requirements.
            </p>
          </section>

          {/* Section 15 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">15. Your Rights Under DPDP Act</h2>
            <p className="mb-2">Under the DPDP Act, 2023, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access a summary of personal data processed about you and the entities it has been shared with.</li>
              <li>Correct inaccurate or outdated personal data.</li>
              <li>Request erasure of personal data, subject to statutory retention obligations.</li>
              <li>Withdraw consent to optional data processing.</li>
              <li>Nominate a representative in case of death or incapacity.</li>
              <li>Lodge a grievance with our Grievance Officer and escalate to the Data Protection Board of India.</li>
            </ul>
          </section>

          {/* Section 16 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">16. Children&apos;s Privacy</h2>
            <p>
              The Platform is engineered for professionals and students aged 18 and older. If an individual under 18 enrolls, verifiable parent or guardian consent is mandatory, and we do not track or target advertising to minors.
            </p>
          </section>

          {/* Section 17 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">17. Cross-Border Data Transfers</h2>
            <p>
              Primary servers are located within Indian cloud regions. When global CDN or delivery services are used, transfers comply with Government of India regulations and enforce strict contractual safeguards.
            </p>
          </section>

          {/* Section 18 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">18. Grievance Officer</h2>
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg text-xs font-mono space-y-1.5">
              <div><strong className="text-white">Designation:</strong> Data Protection & Grievance Redressal Officer</div>
              <div><strong className="text-white">Entity:</strong> NextGen Testing Academy</div>
              <div><strong className="text-white">Email:</strong> <a href="mailto:grievance@ngtalms.com" className="text-[#EFFF4F] underline">grievance@ngtalms.com</a></div>
              <div><strong className="text-white">Address:</strong> NextGen Testing Academy, Bengaluru, Karnataka, India</div>
              <div><strong className="text-white">Response Timelines:</strong> Acknowledged within 48 hours; resolved within 15 days</div>
            </div>
          </section>

          {/* Section 19 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">19. Changes to This Policy</h2>
            <p>
              We may revise this Privacy Policy periodically. Significant updates will be highlighted on the Platform or communicated via email before taking effect.
            </p>
          </section>

          {/* Section 20 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">20. Contact Information</h2>
            <p>
              For privacy inquiries, write to NextGen Testing Academy at <a href="mailto:privacy@ngtalms.com" className="text-[#EFFF4F] underline font-mono">privacy@ngtalms.com</a> or <a href="mailto:support@ngtalms.com" className="text-[#EFFF4F] underline font-mono">support@ngtalms.com</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
