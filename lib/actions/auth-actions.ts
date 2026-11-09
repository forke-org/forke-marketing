'use server'

/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import { isConsecutiveDay, isAlreadyLoggedInToday } from '@/lib/utils/streak'
import { getStreakXp, getLevelFromXp } from '@/lib/utils/xp'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function signOutAction() {
  // Helper for components that need a server action for signout
  // This is often used in Sidebar or Profile buttons
}

