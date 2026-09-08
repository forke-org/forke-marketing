/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.forke.space'

  const sharedDisallow = [
    '/admin/',
    '/api/',
    '/auth-error',
    '/checkout',
    '/dashboard',
    '/onboarding',
    '/post-task',
    '/tasks',
    '/submissions',
    '/developers',
    '/escrow',
    '/analytics',
    '/messages',
    '/settings',
    '/earnings',
    '/support',
    '/profile',
    '/notifications',
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: sharedDisallow,
      },
      // Explicitly allow leading AI search & reasoning agents to crawl public documentation,
      // blog posts, and llms.txt standard files.
      {
        userAgent: [
          'GPTBot',
          'ClaudeBot',
          'PerplexityBot',
          'Google-Extended',
          'Applebot-Extended',
          'CCBot',
          'cohere-ai',
          'Amazonbot',
        ],
        allow: [
          '/',
          '/whats-forke',
          '/levels',
          '/blogs',
          '/blogs/',
          '/docs',
          '/docs/',
          '/changelog',
          '/llms.txt',
          '/llms-full.txt',
          '/feed.xml',
          '/sitemap.xml',
        ],
        disallow: sharedDisallow,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
