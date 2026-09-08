/**
 * @fileoverview Forke Platform - RSS alias
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 */

import { NextResponse } from 'next/server'

export function GET(req: Request) {
  const url = new URL('/feed.xml', req.url)
  return NextResponse.redirect(url, 301)
}
