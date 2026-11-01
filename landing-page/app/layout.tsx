import type { Metadata, Viewport } from 'next'
import { schibstedGrotesk, newsreader, ibmPlexMono } from '@/app/fonts'
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#FF7A00',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.forke.space'),
  title: {
    default: 'Forke — Ship Real Work, Get Paid',
    template: '%s | Forke',
  },
  description: 'The micro-task marketplace for developers. Join the movement, complete bounties, level up, and earn rewards for shipping high-quality code.',
  keywords: ['developer marketplace', 'bounties', 'micro-tasks', 'programming', 'software engineering', 'earn money coding', 'forke'],
  openGraph: {
    title: 'Forke — Ship Real Work, Get Paid',
    description: 'The micro-task marketplace for developers. Complete bounties and level up your engineering career.',
    url: 'https://www.forke.space',
    siteName: 'Forke',
    images: [
      {
        url: '/forke-assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Forke — The Developer Marketplace',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forke — Ship Real Work, Get Paid',
    description: 'The micro-task marketplace for developers. Complete bounties and level up your engineering career.',
    creator: '@forkedotdev',
    images: ['/forke-assets/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${schibstedGrotesk.variable} ${newsreader.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased bg-[#050505] text-[#FFFFFF] font-sans selection:bg-[#FF7A00] selection:text-black min-h-screen">
        {children}
      </body>
    </html>
  )
}
