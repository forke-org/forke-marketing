import type { Metadata } from 'next'
import LegalPage, { Clause, List } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy',
  description: 'Understand the terms of task cancellation, bounty refunds, and payout processing timelines on the Forke platform.',
  alternates: { canonical: '/refund' },
}

export default function RefundPage() {
  return (
    <LegalPage
      path="/refund"
      eyebrow="Payments & compliance"
      title="Cancellation &"
      accent="Refunds"
      contact="For cancellation requests or refund disputes, email us and we'll pick it up."
      intro={
        <p>
          Forke connects task posters with developers. When a paid task is posted, the funds are held by our payment
          partner and released according to platform rules. This policy covers bounty cancellations, refund eligibility
          and how long refunds take.
        </p>
      }
      sections={[
        {
          id: 'cancellation',
          title: 'Task cancellation rules',
          body: (
            <div className="space-y-5">
              <Clause n="1.1" title="Unclaimed tasks">
                A task poster may cancel a bounty at any time <em>before</em> a developer claims it. On cancellation, 100%
                of the deposited bounty is refunded to the original payment method.
              </Clause>
              <Clause n="1.2" title="Active claims">
                Once a contributor claims a task, the poster can&rsquo;t cancel it or ask for a refund until the task
                deadline passes. This protects the time and effort the developer puts into the solution.
              </Clause>
              <Clause n="1.3" title="Expired claims">
                If a developer claims a task but doesn&rsquo;t submit before the deadline, the claim ends automatically.
                The poster can then release the task back to the marketplace or ask for a full refund of the deposit.
              </Clause>
            </div>
          ),
        },
        {
          id: 'eligibility',
          title: 'Refund eligibility',
          body: (
            <List
              items={[
                <>
                  <strong>Defective submissions:</strong> if a submission doesn&rsquo;t meet the requirements in the task
                  description, or contains plagiarised or copyrighted code, the poster may reject it. If the developer
                  doesn&rsquo;t fix it within the revision period, the poster can ask for a refund of the deposit.
                </>,
                <>
                  <strong>Approved submissions:</strong> once the poster approves a submission and the bounty is paid
                  out, the transaction is final. <strong>Refunds are never issued after a payout has been released.</strong>
                </>,
              ]}
            />
          ),
        },
        {
          id: 'disputes',
          title: 'Disputes & arbitration',
          body: (
            <p>
              If a task poster and contributor disagree on the quality or completion of a deliverable, either side can
              raise a dispute. Forke support reviews the code, requirements and logs. Forke&rsquo;s decision on how
              platform-held funds are allocated or refunded is final for platform operations and payouts.
            </p>
          ),
        },
        {
          id: 'timelines',
          title: 'Processing times',
          body: (
            <>
              <p>Once a refund is approved by our team or through arbitration:</p>
              <List
                items={[
                  'It is processed through our payment partner, Razorpay.',
                  'Funds go back to the original payment method (UPI, bank account or card).',
                  <>
                    It usually takes <strong>5 to 7 business days</strong>, depending on your bank.
                  </>,
                ]}
              />
            </>
          ),
        },
        {
          id: 'fees',
          title: 'Gateway fees',
          body: (
            <p>
              Fees charged by the payment gateway (Razorpay) or banking network for the original deposit and the reverse
              transfer may not be refundable. Any such fees are deducted from the refund, and the remaining balance is
              credited to you.
            </p>
          ),
        },
      ]}
    />
  )
}
