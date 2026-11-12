import type { Metadata } from 'next'
import LegalPage, { Clause, List, Note } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the Terms of Service for using the Forke platform. Understand our rules for task posting, completion, and community conduct.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <LegalPage
      path="/terms"
      eyebrow="Legal"
      title="Terms of"
      accent="Service"
      contact="For questions about these terms or any legal enquiry, write to us."
      intro={
        <>
          <p>
            Welcome to Forke. Forke is a developer-focused micro-task marketplace where users can post tasks, complete
            bounties, collaborate on software work, and earn rewards or payments.
          </p>
          <p className="mt-3 text-[15px] text-white/40">
            By accessing or using Forke, you agree to these Terms of Service. If you do not agree with these Terms, please
            do not use the platform.
          </p>
        </>
      }
      sections={[
        {
          id: 'acceptance',
          title: 'Acceptance of terms',
          body: (
            <>
              <p>By creating an account, accessing the platform, or using any Forke services, you confirm that:</p>
              <List
                items={[
                  'You can legally enter into binding agreements.',
                  'You will comply with these Terms, our Privacy Policy, and all applicable local, national, and international laws.',
                  'All registration and profile details you provide are accurate, current, and truthful.',
                ]}
              />
              <p className="text-[14px] text-white/40">
                Forke may update these Terms from time to time. We will notify you of any material updates by updating
                the date at the top of this page. Continued use of the platform after changes means you accept the
                updated Terms.
              </p>
            </>
          ),
        },
        {
          id: 'platform',
          title: 'What Forke is',
          body: (
            <>
              <p>Forke is a marketplace platform that facilitates connections between:</p>
              <List
                items={[
                  'Developers (Contributors) looking to build experience and earn through technical micro-tasks or bounties.',
                  'Individuals or organizations (Task Posters) seeking to hire independent talent for software development, debugging, design, or documentation tasks.',
                ]}
              />
              <Note label="Independent contractors">
                Forke acts strictly as an intermediary platform. Contributors are independent contractors, not employees,
                partners, agents, or joint venturers of Forke or the Task Poster. Forke is not responsible for the tax
                filings, labor compliance, or benefits of any contributor.
              </Note>
            </>
          ),
        },
        {
          id: 'eligibility',
          title: 'Eligibility & minors',
          body: (
            <>
              <p>You must be at least 13 years old to use Forke. If you are under the age of 18 (a &ldquo;Minor&rdquo;):</p>
              <List
                items={[
                  'You must have permission from your parent or legal guardian to create an account and participate in tasks.',
                  'Your parent or legal guardian must review and agree to these Terms on your behalf.',
                  'Any payouts, payment registrations, or banking details linked to your account must belong to, or be authorized by, your parent or legal guardian.',
                ]}
              />
              <p className="text-[14px] italic text-white/40">
                Forke reserves the right to suspend accounts if we detect they are operated by minors without guardian
                consent.
              </p>
            </>
          ),
        },
        {
          id: 'accounts',
          title: 'Accounts & security',
          body: (
            <>
              <p>
                To participate in bounties or post tasks, you must create an account, which can be linked to your GitHub
                or Google credentials. You are responsible for keeping your login credentials confidential and for all
                activities that occur under your account.
              </p>
              <Note label="Strictly prohibited" tone="warn">
                Account sharing, creating duplicate accounts to bypass bans, impersonation of other developers or
                organizations, using fraudulent payment methods, or using automated scripts to claim tasks.
              </Note>
            </>
          ),
        },
        {
          id: 'payments',
          title: 'Bounties, tasks & payments',
          body: (
            <div className="space-y-5">
              <Clause n="5.1" title="Task posting & payout deposits">
                Task Posters must provide clear, complete descriptions and code guidelines. When posting a paid task, the
                required bounty amount is deposited in advance. These funds are held by our payment partner and released
                according to platform rules once the task is successfully completed, verified, and approved, or until a
                dispute is settled.
              </Clause>
              <Clause n="5.2" title="Claiming & time limits">
                Contributors may claim open tasks suited to their level. Once claimed, tasks must be submitted within the
                specified timeframe. If the deadline expires without submission, the task is released back to the
                marketplace, and the claim is terminated.
              </Clause>
              <Clause n="5.3" title="Payments, commissions & taxes">
                Bounty payouts are made via Razorpay or direct UPI links upon the Task Poster&rsquo;s approval of the
                deliverable. Forke may deduct a platform fee or transaction commission, which will be disclosed prior to
                payment. Contributors are solely responsible for paying any applicable direct or indirect taxes (including
                GST/income tax) on their earnings.
              </Clause>
            </div>
          ),
        },
        {
          id: 'ai-code',
          title: 'Task completion & AI code',
          body: (
            <>
              <p>
                Contributors must submit original work. Submitting plagiarized work, malware, or low-effort spam will
                result in a permanent ban.
              </p>
              <Note label="AI-generated code policy">
                While we encourage the helper use of AI developer tools (e.g., GitHub Copilot, ChatGPT), Contributors must
                disclose submissions where AI-generated code constitutes a substantial portion of the final deliverable.
                Developers warrant that any AI-assisted code submitted does not infringe upon any third-party intellectual
                property rights or open-source copyleft licenses (e.g., GPL licenses requiring open derivation).
              </Note>
            </>
          ),
        },
        {
          id: 'ip',
          title: 'Intellectual property',
          body: (
            <>
              <p>This section governs who owns the code and files produced through Forke:</p>
              <div className="space-y-5">
                <Clause n="7.1" title="Ownership transfer upon payment">
                  Upon successful approval of a submission and release of the payment bounty, all intellectual property
                  rights, copyright, title, and interest in the submitted code and assets transfer entirely to the{' '}
                  <strong>Task Poster</strong>. The Contributor relinquishes all ownership claims to the completed work.
                </Clause>
                <Clause n="7.2" title="Developer portfolio license">
                  Notwithstanding the transfer of ownership, the Contributor is granted a non-exclusive, royalty-free,
                  perpetual, worldwide, non-transferable license to show the work in public repositories (e.g., GitHub) and
                  personal portfolios for educational and employment showcase purposes, <strong>unless</strong> the Task
                  Poster and Contributor have signed a separate Non-Disclosure Agreement (NDA) or confidentiality contract
                  that forbids such public disclosure.
                </Clause>
              </div>
            </>
          ),
        },
        {
          id: 'confidentiality',
          title: 'Confidentiality',
          body: (
            <>
              <p>
                While completing tasks, Contributors may receive access to private source repositories, database samples,
                API credentials, business roadmaps, or customer data belonging to the Task Poster.
              </p>
              <p>
                Contributors agree to hold all such information in strict confidence and shall not disclose, replicate,
                distribute, or use it for any purpose outside the scope of completing the designated task. This obligation
                survives the termination of any task or account.
              </p>
              <p>
                Task Posters are responsible for ensuring they have the legal right to share any materials, code, assets,
                or data provided to Contributors.
              </p>
            </>
          ),
        },
        {
          id: 'disputes',
          title: 'Disputes & arbitration',
          body: (
            <>
              <p>
                If a dispute arises (e.g., a Task Poster asserts a submission does not meet requirements, or a Contributor
                claims their completed work was unfairly rejected), the following protocol applies:
              </p>
              <div className="space-y-5">
                <Clause n="9.1" title="Review window">
                  Users may flag a task for dispute within 5 calendar days of submission.
                </Clause>
                <Clause n="9.2" title="Forke arbitration">
                  Forke administrators will review the task description, submission code, activity logs, and chat
                  messages. By using Forke, you agree that{' '}
                  <strong>
                    Forke&rsquo;s decision regarding platform-held funds shall be final for purposes of platform
                    operations and payout distribution
                  </strong>
                  .
                </Clause>
                <Clause n="9.3" title="External disputes">
                  Forke only resolves the release or return of deposited task funds on the platform. Forke shall not be
                  responsible for disputes arising directly between users outside of platform-managed escrow transactions.
                </Clause>
              </div>
            </>
          ),
        },
        {
          id: 'xp',
          title: 'XP, reputation & levels',
          body: (
            <>
              <p>Forke includes XP systems, streaks, levels, and leaderboards designed for engagement and reputation purposes.</p>
              <Note label="No monetary value" tone="accent">
                XP, virtual titles, and rewards are promotional badges. They have no real-world monetary value, are
                non-transferable, and may not be sold or traded outside the platform. Forke reserves the right to
                recalculate or revoke XP in cases of profile gaming or abuse.
              </Note>
            </>
          ),
        },
        {
          id: 'prohibited',
          title: 'Prohibited activities',
          body: (
            <p>
              You agree not to exploit bugs, use automated bots to claim tasks, scrape user data, upload malicious
              files/worms, bypass verification barriers, or manipulate task ratings. Forke reserves the right to
              investigate and suspend/ban accounts immediately for violations.
            </p>
          ),
        },
        {
          id: 'liability',
          title: 'Disclaimers & liability',
          body: (
            <>
              <p>
                THE FORKE PLATFORM IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS. WE DISCLAIM
                ALL WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
              </p>
              <p>
                IN NO EVENT SHALL FORKE, ITS FOUNDERS, OR OFFICERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, USE, GOODWILL, OR PROJECT FAILURES,
                ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.
              </p>
            </>
          ),
        },
        {
          id: 'law',
          title: 'Governing law',
          body: (
            <>
              <p>
                Forke is available globally where legally permitted, but these Terms shall be governed by and interpreted
                in accordance with the laws of India.
              </p>
              <div className="space-y-5">
                <Clause n="13.1" title="Informal resolution">
                  Users agree to first attempt to resolve disputes through good-faith discussions with Forke support.
                </Clause>
                <Clause n="13.2" title="Exclusive jurisdiction">
                  If a dispute cannot be resolved informally, any legal actions, claims, or controversies arising out of or
                  relating to these Terms or the use of the Forke platform shall be subject to the exclusive jurisdiction
                  of the competent courts of India.
                </Clause>
              </div>
            </>
          ),
        },
      ]}
    />
  )
}
