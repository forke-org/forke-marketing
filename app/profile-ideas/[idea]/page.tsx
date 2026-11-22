/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

// TEMPORARY preview of the profile + lanyard ideas. Not for commit.
import { notFound } from 'next/navigation'
import PageShell from '@/components/shared/PageShell'
import { CARD_SETS } from '@/components/profile/ideas/Cards'
import { CARD_SETS_2 } from '@/components/profile/ideas/Cards2'
import { ProfileCover, ProfileDossier, ProfileReadme, type ProfileTab } from '@/components/profile/ideas/Profiles'

export const metadata = { robots: { index: false } }

const PROFILES = { a: ProfileDossier, b: ProfileReadme, c: ProfileCover } as const
const ALL = [...CARD_SETS, ...CARD_SETS_2]

export default async function Page({ params, searchParams }: { params: Promise<{ idea: string }>; searchParams: Promise<{ tab?: string }> }) {
  const { idea } = await params
  const { tab } = await searchParams
  if (idea === 'b')
    return (
      <PageShell>
        <ProfileReadme tab={(['shipped', 'reviews', 'achievements'].includes(tab ?? '') ? tab : 'overview') as ProfileTab} base="/profile-ideas/b" />
      </PageShell>
    )
  const Profile = PROFILES[idea as keyof typeof PROFILES]
  if (Profile)
    return (
      <PageShell>
        <Profile />
      </PageShell>
    )
  const set = ALL.find((s) => s.key === idea)
  if (!set) notFound()
  const { Front, Back } = set
  return (
    <div className="flex min-h-screen items-center justify-center gap-10 bg-[#151414] p-10">
      <Front />
      <Back />
    </div>
  )
}
