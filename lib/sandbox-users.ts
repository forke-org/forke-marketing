/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import { db } from '@/lib/db'
import { sandboxUsers } from '@/lib/db/schema'
import { encryptToken, hashToken } from '@/lib/token-crypto'

/** Insert or update a sandbox user, always storing the token encrypted + hashed. */
export async function upsertSandboxUser(u: { githubId: number; username: string; token: string; role: string }) {
  const values = {
    username: u.username,
    accessToken: encryptToken(u.token),
    accessTokenHash: hashToken(u.token),
    role: u.role,
  }
  await db
    .insert(sandboxUsers)
    .values({ githubId: u.githubId, ...values })
    .onConflictDoUpdate({ target: sandboxUsers.githubId, set: values })
}
