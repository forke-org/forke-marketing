import type { Metadata } from 'next'
import LegalPage, { Columns, List } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the Forke Privacy Policy to understand how we collect, use, and protect your data.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <LegalPage
      path="/privacy"
      eyebrow="Privacy & data protection"
      title="Privacy"
      accent="Policy"
      contact="To exercise your rights, raise a grievance or request data deletion. We respond within 15 business days."
      intro={
        <p>
          At Forke, your privacy matters. This policy explains how we collect, use, store and protect your information
          when you use the Forke platform, in line with India&rsquo;s Digital Personal Data Protection (DPDP) Act, 2023
          and modern data privacy practice.
        </p>
      }
      sections={[
        {
          id: 'consent',
          title: 'Introduction & consent',
          body: (
            <p>
              Forke operates a developer micro-task and bounty platform that connects independent developers with
              technical projects. By registering an account, linking third-party authentication services, or interacting
              with our platform, you explicitly consent to the collection, processing and storage of your personal data
              as outlined in this policy.
            </p>
          ),
        },
        {
          id: 'collect',
          title: 'Information we collect',
          body: (
            <Columns
              cols={[
                {
                  title: 'Personal data',
                  items: [
                    'Full name and username',
                    'Email address (via OAuth providers)',
                    'GitHub profile information and repository list',
                    'Payout details (UPI ID / VPA, bank account details)',
                    'Profile avatar image and bio',
                  ],
                },
                {
                  title: 'Usage & technical info',
                  items: [
                    'Browser type and operating system',
                    'A one-way hashed IP address and general location, kept on sign-in and sign-up for security and fraud prevention only (we do not store your raw IP), purged after 90 days',
                    'Pages visited, time spent and navigation paths',
                    'Click interactions, transaction logs and claim history',
                    'Referral source: marketing channel, campaign tags (UTM) and referring website at signup',
                  ],
                },
              ]}
            />
          ),
        },
        {
          id: 'processors',
          title: 'Third-party sub-processors',
          body: (
            <>
              <p>
                We integrate with trusted third-party services to deliver key functionality. These providers process data
                under their own privacy protocols:
              </p>
              <List
                items={[
                  <>
                    <strong>Authentication & sessions (NextAuth):</strong> secure credentials-based login and third-party
                    OAuth via GitHub and Google.
                  </>,
                  <>
                    <strong>Database (PostgreSQL & Drizzle ORM):</strong> stores user profiles, task details, active claims
                    and transaction history on our cloud-hosted database infrastructure.
                  </>,
                  <>
                    <strong>Payments & settlements (Razorpay):</strong> processes bounty deposits, payouts and UPI
                    settlements. We never store full card numbers or banking secrets on our servers.
                  </>,
                  <>
                    <strong>Analytics (Google Analytics 4):</strong> helps us understand aggregate traffic, page views and
                    acquisition channels. Google may set its own cookies under its privacy policy; we do not use it for
                    advertising or to sell your data.
                  </>,
                ]}
              />
            </>
          ),
        },
        {
          id: 'storage',
          title: 'Storage, security & location',
          body: (
            <>
              <p>
                Our primary databases are hosted on cloud infrastructure located in <strong>India</strong>, in line with
                server-residency requirements under the DPDP Act 2023.
              </p>
              <p>
                We encrypt all data in transit with SSL/TLS, restrict database access to authenticated administrators and
                run automated security scanners. No internet service is 100% secure, and you are responsible for keeping
                your account credentials private.
              </p>
            </>
          ),
        },
        {
          id: 'retention',
          title: 'Data retention',
          body: (
            <p>
              We keep your personal information for as long as your account is active. If you delete your account, we
              erase or anonymise your personal data within 30 days, except where the law requires us to keep certain
              records (such as tax invoices, payment settlement audits or dispute history) for up to 5 years under
              applicable Indian fiscal regulations.
            </p>
          ),
        },
        {
          id: 'cookies',
          title: 'Cookies & tracking',
          body: (
            <>
              <p>
                Forke uses persistent and session cookies to keep you signed in, remember your interface settings and
                analyse traffic. You can disable cookies in your browser, but you won&rsquo;t be able to claim bounties or
                open private dashboards.
              </p>
              <p>
                When you first arrive through a tagged or referring link, we store a first-party attribution cookie that
                records the marketing channel, campaign tags (UTM parameters) and referring website. It tells us which
                channels bring people to Forke and is linked to your account if you sign up. Google Analytics sets its
                own cookies to measure aggregate traffic. We do <strong>not</strong> use third-party advertising trackers
                or device fingerprinting, and we never sell your data.
              </p>
            </>
          ),
        },
        {
          id: 'rights',
          title: 'Your privacy rights',
          body: (
            <>
              <p>Under India&rsquo;s DPDP Act 2023 and global standards, you have the right to:</p>
              <List
                items={[
                  <>
                    <strong>Access & portability:</strong> request a copy of the personal data we hold about you in a
                    readable format.
                  </>,
                  <>
                    <strong>Rectification:</strong> ask us to correct inaccurate, outdated or incomplete data.
                  </>,
                  <>
                    <strong>Erasure (&ldquo;right to be forgotten&rdquo;):</strong> ask us to delete your account and the
                    personal information tied to it.
                  </>,
                  <>
                    <strong>Withdraw consent:</strong> withdraw consent to processing at any time, which closes your
                    account.
                  </>,
                ]}
              />
            </>
          ),
        },
      ]}
    />
  )
}
