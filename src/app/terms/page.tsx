import React from "react";
import Link from "next/link";
import { ArrowLeft, Scale, ShieldCheck, Mail, MapPin } from "lucide-react";

export const metadata = {
  title: "Terms of Service — NextGen Testing Academy",
  description: "Terms and conditions governing the use of NextGen Testing Academy (NGTA) LMS, courses, memberships, and certifications.",
};

export default function TermsOfServicePage() {
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
            <Scale className="w-3.5 h-3.5 text-[#EFFF4F]" />
            <span>Legal Agreement</span>
          </div>
        </div>
      </header>

      {/* Main Document Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Title & Metadata Card */}
        <div className="mb-10 pb-8 border-b border-zinc-800">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#EFFF4F] bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 px-2.5 py-1 rounded inline-block mb-3">
            Terms of Use
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
            These Terms of Service govern your access to and use of NGTA LMS, courses, live masterclasses, digital certifications, recurring memberships, and interactive learning communities.
          </p>

          {/* Metadata Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono bg-zinc-950 border border-zinc-800 p-4 rounded-lg">
            <div>
              <span className="text-zinc-400 block mb-0.5">Agreement Version</span>
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
              <span className="text-zinc-400 block mb-0.5">Governing Jurisdiction</span>
              <span className="text-white font-bold">Bengaluru, Karnataka, India</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-0.5">Support Inquiries</span>
              <a href="mailto:support@ngtalms.com" className="text-[#EFFF4F] hover:underline font-bold">
                support@ngtalms.com
              </a>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-10 text-sm sm:text-base text-zinc-300 leading-relaxed">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of These Terms</h2>
            <p className="mb-3">
              These Terms of Service (&quot;Terms&quot;) are a legally binding agreement between you and NextGen Testing Academy (&quot;NGTA&quot;, &quot;we&quot;, &quot;us&quot;) governing your use of NGTA LMS, including our website, storefront, courses, live classes, communities, memberships, mentorship consultations, and related services (the &quot;Platform&quot;).
            </p>
            <p>
              By registering, purchasing, or otherwise using the Platform, you agree to these Terms, our <Link href="/privacy" className="text-[#EFFF4F] underline">Privacy Policy</Link>, and our <Link href="/cookies" className="text-[#EFFF4F] underline">Cookie Policy</Link>. If you do not agree, do not use the Platform.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Eligibility</h2>
            <p>
              You must be at least 18 years old and capable of entering into a binding contract under Indian law. A person under 18 may use the Platform only with the express consent and supervision of a parent or legal guardian, who accepts these Terms on their behalf.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Accounts and Security</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must provide accurate, current, and verifiable information during registration, including a valid email address and phone number.</li>
              <li>You are solely responsible for all activity conducted through your account and for maintaining password confidentiality.</li>
              <li>Account sharing or transferring course access to unauthorized parties is strictly prohibited.</li>
              <li>We reserve the right to limit concurrent sessions or active devices per account to safeguard proprietary learning media.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Platform User Roles</h2>
            <p>
              NGTA LMS operates on a role-based access matrix comprising Learners, Instructors, Content Managers, Support Staff, Administrators, and Super Administrators. Each role possesses strictly scoped access permissions. Guests may explore public course catalogs, preview syllabi, and purchase available learning products.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Courses and Learning Content License</h2>
            <p className="mb-3">
              When you purchase or enroll in an NGTA course, we grant you a personal, non-exclusive, non-transferable, revocable license to access and view the course materials through the Platform for your personal, non-commercial technical training.
            </p>
            <p>
              Course content includes high-definition video lessons, code repositories, downloadable automation frameworks, quizzes, assignments, and architectural diagrams. Course descriptions, curriculum outlines, and projected outcomes are provided in good faith, but we do not guarantee specific employment offers, promotions, or salary figures.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Acceptable Use Policy</h2>
            <p className="mb-3 font-semibold text-white">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Record, screen-capture, rip, redistribute, or resell course video streams or live webinar sessions.</li>
              <li>Attempt to circumvent digital rights management (DRM), watermarks, token authentication, or rate limits.</li>
              <li>Use web scrapers, crawlers, or automated scripts to harvest content or student information.</li>
              <li>Upload malicious code, exploits, or viruses to assignments or community forums.</li>
              <li>Harass, threaten, or defame other learners or instructors in community spaces or chats.</li>
              <li>Engage in academic dishonesty, plagiarism, or tampering with quiz submissions and XP leaderboards.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Prices, Orders and Payments</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All prices are displayed in Indian Rupees (INR) and include statutory taxes (GST) unless indicated otherwise.</li>
              <li>Transactions are processed via third-party gateways (Razorpay) supporting UPI, credit cards, debit cards, and net banking.</li>
              <li>An order is confirmed only upon successful gateway webhook verification (`order.paid`). If a transaction debits funds but fails to enroll, the amount is automatically refunded by the gateway or our team within 7 working days.</li>
              <li>We reserve the right to cancel an order and issue a full refund in cases of pricing anomalies, gateway failure, or suspected fraud.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Promotional Coupons and Offers</h2>
            <p>
              Promotional codes, early-bird discounts, and coupons are valid strictly within specified date ranges, quota caps, and product categories. Coupons hold zero cash redemption value, cannot be stacked unless explicitly authorized, and will be invalidated if acquired fraudulently.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Recurring Memberships and Subscriptions</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Memberships are offered on monthly or annual billing cycles across tiers: Free, Basic, Pro, and Premium.</li>
              <li>Plans may feature introductory trial periods. Unless cancelled prior to trial expiration, recurring renewal charges will be automatically billed.</li>
              <li>Subscriptions renew automatically at the prevailing tier price until explicitly cancelled by the student via their dashboard.</li>
              <li>Where recurring mandates are executed via UPI AutoPay or credit card e-mandates, you authorize automated debits in full compliance with Reserve Bank of India (RBI) regulations.</li>
              <li>Membership states comprise Active, Trial, Past Due, Cancelled, and Expired. Access to member-exclusive courses and live sessions requires an Active or Trial status.</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Refunds and Cancellation Policy</h2>
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg space-y-2 text-xs sm:text-sm">
              <p><strong>Course Purchases:</strong> Refund requests are honored within <strong>7 days</strong> of purchase, provided the student has completed less than <strong>10%</strong> of course curriculum and has not downloaded proprietary framework bundles or obtained a completion certificate.</p>
              <p><strong>Recurring Memberships:</strong> Subscription billing fees for cycles already initiated are non-refundable. Students may cancel anytime to prevent future billing cycles.</p>
              <p><strong>Live Sessions & Consultations:</strong> If NGTA cancels a scheduled masterclass, full refunds or alternative dates are provided. 1-on-1 consultations cancelled by the student at least 24 hours prior are eligible for rescheduling or refund.</p>
              <p><strong>Processing Time:</strong> Approved refunds are credited back to the original source payment method within 5 to 10 business days.</p>
            </div>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Live Classes, Webinars and Mentorship</h2>
            <p>
              Live masterclasses and mentorship sessions are conducted via secure live streaming rooms. Meeting links, session recordings, and interactive Q&A are restricted to enrolled learners. Advice offered in mentorship calls is educational in nature and does not constitute a legal or contractual employment guarantee.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">12. Assessments, Grading and Verifiable Certificates</h2>
            <p className="mb-3">
              Certificates of Completion are generated automatically upon satisfying all graduation criteria: 100% lesson completion, passing score in all module quizzes, and approved project assignments.
            </p>
            <p>
              Each certificate is cryptographically assigned a unique ID and public verification URL. NGTA reserves the right to revoke any certificate obtained through cheating, payment chargebacks, or code plagiarism.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">13. Community Code of Conduct and Moderation</h2>
            <p>
              Community forums, discussion channels, and direct messaging are provided to foster collaborative engineering growth. Content that is offensive, unlawful, defamatory, or promotional spam will be removed immediately. Community moderation complies with the Information Technology Act, 2000 and the Intermediary Guidelines. Unlawful content can be reported to <a href="mailto:abuse@ngtalms.com" className="text-[#EFFF4F] underline">abuse@ngtalms.com</a>.
            </p>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">14. Gamification, XP Points and Leaderboards</h2>
            <p>
              Experience points (XP), learning badges, streak counters, and leaderboard rankings are engagement features designed for student motivation. They hold zero monetary value, cannot be traded or redeemed for cash, and may be recalculated if system anomalies or script manipulation occur.
            </p>
          </section>

          {/* Section 15 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">15. Affiliate and Referral Programme</h2>
            <p>
              Approved affiliates may earn commissions on qualifying course enrolments driven via personalized referral links. Self-referrals, misleading advertisements, and trademark bidding are strictly prohibited and will result in immediate termination of affiliate status and forfeiture of unverified commissions.
            </p>
          </section>

          {/* Section 16 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">16. Instructor Terms and Intellectual Property</h2>
            <p>
              Instructors warrant that curriculum submitted is original, lawful, and free of copyright infringements. Course materials progress through a quality approval lifecycle (Draft, Review, Approved, Published) managed by Content Managers and Super Admins.
            </p>
          </section>

          {/* Section 17 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">17. Intellectual Property Rights</h2>
            <p>
              All software, source code, visual designs, trademarks, logos, video curricula, and certificate templates associated with NGTA LMS are the exclusive intellectual property of NextGen Testing Academy. Copyright claims may be addressed to <a href="mailto:copyright@ngtalms.com" className="text-[#EFFF4F] underline">copyright@ngtalms.com</a>.
            </p>
          </section>

          {/* Section 18 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">18. Third-Party Integrations</h2>
            <p>
              The platform interfaces with reputable third-party services including Razorpay, Supabase, and Web Push notifications. Use of these integrations is governed by their respective operating terms.
            </p>
          </section>

          {/* Section 19 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">19. Privacy and Cookies</h2>
            <p>
              Our handling of your personal data and tracking cookies is detailed in our <Link href="/privacy" className="text-[#EFFF4F] underline">Privacy Policy</Link> and <Link href="/cookies" className="text-[#EFFF4F] underline">Cookie Policy</Link>, which are incorporated by reference into these Terms.
            </p>
          </section>

          {/* Section 20 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">20. Account Suspension and Termination</h2>
            <p>
              You may terminate your account at any time via Settings. NGTA reserves the right to suspend or terminate accounts that breach these Terms, engage in fraud, or infringe intellectual property.
            </p>
          </section>

          {/* Section 21 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">21. Service Availability and Maintenance</h2>
            <p>
              We strive for continuous high-availability platform operation. Routine maintenance windows and system upgrades are executed with advance notice whenever feasible.
            </p>
          </section>

          {/* Section 22 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">22. Disclaimers</h2>
            <p>
              The platform and all course curricula are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind. Engineering content represents professional educational guidance and does not substitute for corporate technical audits.
            </p>
          </section>

          {/* Section 23 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">23. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by Indian law, NGTA&apos;s aggregate liability arising out of or related to your use of the Platform shall not exceed the total fees paid by you to NGTA in the twelve (12) months preceding the claim.
            </p>
          </section>

          {/* Section 24 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">24. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless NGTA, its directors, instructors, and personnel from any claims, damages, or legal expenses resulting from your breach of these Terms or unauthorized use of the platform.
            </p>
          </section>

          {/* Section 25 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">25. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of India. Any disputes shall first be subjected to good-faith informal resolution for thirty (30) days. Unresolved disputes shall fall under the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka, India.
            </p>
          </section>

          {/* Section 26 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">26. Modifications to Terms</h2>
            <p>
              We may revise these Terms as our platform evolves. Substantial amendments will be posted on the Platform. Continued use constitutes acceptance of updated terms.
            </p>
          </section>

          {/* Section 27 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">27. Severability and Entire Agreement</h2>
            <p>
              If any provision of these Terms is deemed unenforceable, the remaining provisions remain in full force. These Terms constitute the entire agreement between you and NGTA.
            </p>
          </section>

          {/* Section 28 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">28. Contact Inquiries</h2>
            <p>
              For legal and contractual questions, contact NextGen Testing Academy at <a href="mailto:support@ngtalms.com" className="text-[#EFFF4F] underline font-mono">support@ngtalms.com</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
