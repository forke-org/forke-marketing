'use client'

/**
 * @fileoverview Forke Platform - Supported Stacks 3D Showcase Section
 * Replicates the exact Aside website 3D perspective app grid, spacing, and styling,
 * with exact 135x74 rendered dimensions, 400px base cell projection, radial contact
 * shadows, and 24 modern developer stacks supported by Forke bounties.
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 */

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

interface TechStack {
  name: string
  category: string
  bg: string
  border?: string
  isLight?: boolean
  icon: React.ReactNode
}

// 24 Supported Tech Stacks (8 columns × 3 rows in 3D perspective)
const TECH_STACKS: TechStack[] = [
  // ROW 1: Flagship Languages & Frameworks
  {
    name: 'Next.js',
    category: 'Framework',
    bg: '#000000',
    border: 'rgba(255, 255, 255, 0.14)',
    icon: (
      <svg viewBox="0 0 180 180" className="size-full fill-white">
        <mask height="180" width="180" x="0" y="0" id="m_next">
          <circle cx="90" cy="90" fill="#fff" r="90" />
        </mask>
        <g mask="url(#m_next)">
          <path d="M149.508 157.086L69.838 54.498H54.498V125.5H66.838V70.825L138.835 163.665C142.613 161.71 146.185 159.506 149.508 157.086Z" fill="#fff" />
          <rect fill="#fff" height="71" width="12.34" x="115.66" y="54.498" />
        </g>
      </svg>
    ),
  },
  {
    name: 'TypeScript',
    category: 'Language',
    bg: '#3178C6',
    border: 'rgba(255, 255, 255, 0.18)',
    icon: (
      <svg viewBox="0 0 128 128" className="size-full fill-white">
        <path d="M42.2 41.2v67.1H29.1V41.2H4.8V29.7h61.7v11.5H42.2z" />
        <path d="M70.1 76.5c1.8 3.5 4.6 6.3 8.3 8.3 3.8 2 8 3 12.8 3 4 0 7.4-.7 10.3-2.1 2.9-1.4 5.2-3.4 6.8-6 1.6-2.6 2.4-5.6 2.4-9 0-3.3-.8-6.1-2.4-8.5-1.6-2.4-3.8-4.3-6.7-5.8-2.9-1.5-6.8-2.9-11.7-4.3-5.2-1.5-9.3-3.1-12.4-4.7-3.1-1.6-5.4-3.7-6.9-6.3-1.5-2.6-2.3-5.7-2.3-9.4 0-3.9 1-7.4 3.1-10.4s5.1-5.4 9.1-7.2c4-1.8 8.8-2.7 14.4-2.7 5.4 0 10.2.9 14.5 2.7 4.3 1.8 7.7 4.5 10.2 8.1l-10.7 8.9c-1.8-2.4-4-4.2-6.5-5.4-2.5-1.2-5.3-1.8-8.4-1.8-3.4 0-6.2.7-8.4 2.1-2.2 1.4-3.3 3.4-3.3 6.1 0 2.2.7 4 2.1 5.4 1.4 1.4 3.4 2.6 6.1 3.6 2.7 1 6.5 2.2 11.4 3.6 5.8 1.6 10.4 3.4 13.9 5.2 3.5 1.8 6.1 4.2 7.8 7.2 1.7 3 2.6 6.7 2.6 11.1 0 4.6-1.2 8.7-3.6 12.3s-5.9 6.4-10.5 8.4c-4.6 2-10 3-16.2 3-7 0-13.1-1.3-18.3-4-5.2-2.7-9.3-6.6-12.2-11.8l10.9-8.8z" />
      </svg>
    ),
  },
  {
    name: 'React',
    category: 'Library',
    bg: '#1A1C23',
    border: 'rgba(97, 218, 251, 0.25)',
    icon: (
      <svg viewBox="-11.5 -10.23174 23 20.46348" className="size-full">
        <circle cx="0" cy="0" r="2.1" fill="#61dafb" />
        <g stroke="#61dafb" strokeWidth="1.15" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    name: 'Python',
    category: 'Language',
    bg: '#1E293B',
    border: 'rgba(255, 255, 255, 0.12)',
    icon: (
      <svg viewBox="0 0 110 110" className="size-full">
        <path d="M54.4 2C39.2 2 40 8.6 40 8.6l.01 9h14.7v4.3H26.3S11 20.1 11 35.5s13.4 14.8 13.4 14.8h4.5v-6.5c0-7.4 6.4-7.4 6.4-7.4h14.5s6.1.1 6.1-5.9V9.7S57.1 2 54.4 2zm-8.2 5.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" fill="#3776AB" />
        <path d="M55.6 108c15.2 0 14.4-6.6 14.4-6.6l-.01-9H55.3V88.1h28.4s15.3 1.8 15.3-13.6-13.4-14.8-13.4-14.8h-4.5v6.5c0 7.4-6.4 7.4-6.4 7.4H54.7s-6.1-.1-6.1 5.9v20.8s-1.2 7.7 7 7.7zm8.2-5.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" fill="#FFD43B" />
      </svg>
    ),
  },
  {
    name: 'Rust',
    category: 'Systems',
    bg: '#141414',
    border: 'rgba(255, 255, 255, 0.12)',
    icon: (
      <svg viewBox="0 0 106 106" className="size-full fill-white">
        <path d="M53 2C24.8 2 2 24.8 2 53s22.8 51 51 51 51-22.8 51-51S81.2 2 53 2zm18.3 75.8L63.5 61H51.8v16.8H40V28.2h24.8c13.2 0 20.1 7.4 20.1 16.7 0 7.5-4.4 13.2-12.1 15.1l8.5 17.8h-10zM51.8 51.5h11.2c5.8 0 9.2-2.8 9.2-7.2s-3.4-7.2-9.2-7.2H51.8v14.4z" />
      </svg>
    ),
  },
  {
    name: 'Go',
    category: 'Backend',
    bg: '#00ADD8',
    border: 'rgba(255, 255, 255, 0.2)',
    icon: (
      <svg viewBox="0 0 120 70" className="size-full fill-white">
        <path d="M36.2 34.6c0 9.6-7.3 17.4-17.6 17.4S1 44.2 1 34.6 8.3 17.2 18.6 17.2c6.2 0 11.2 2.8 14.4 7.4l-7.3 4.2c-1.8-2.6-4.2-4.1-7.1-4.1-5.2 0-9.4 4.3-9.4 9.9s4.2 9.9 9.4 9.9c4.3 0 7.6-2.6 8.8-6.4H18.6v-6.7h17.6v3.2zm38.1 0c0 9.6-7.8 17.4-18.1 17.4s-18.1-7.8-18.1-17.4 7.8-17.4 18.1-17.4 18.1 7.8 18.1 17.4zm-8.2 0c0-5.6-4.2-9.9-9.9-9.9s-9.9 4.3-9.9 9.9 4.2 9.9 9.9 9.9 9.9-4.3 9.9-9.9z" />
      </svg>
    ),
  },
  {
    name: 'PostgreSQL',
    category: 'Database',
    bg: '#336791',
    border: 'rgba(255, 255, 255, 0.18)',
    icon: (
      <svg viewBox="0 0 128 128" className="size-full fill-white">
        <path d="M64 12C35.3 12 12 35.3 12 64s23.3 52 52 52 52-23.3 52-52S92.7 12 64 12zm23.8 62.4c-1.8 9.3-8.8 15.6-18.4 15.6H50.8v-36h18.6c9.6 0 16.6 6.3 18.4 15.6v4.8z" opacity="0.9" />
        <path d="M50.8 54h18.6c5.8 0 10.2 3.8 11.4 9.6v4.8c-1.2 5.8-5.6 9.6-11.4 9.6H50.8V54z" fill="#336791" />
      </svg>
    ),
  },
  {
    name: 'Node.js',
    category: 'Runtime',
    bg: '#1E293B',
    border: 'rgba(95, 160, 78, 0.25)',
    icon: (
      <svg viewBox="0 0 128 128" className="size-full fill-[#5FA04E]">
        <path d="M64 10.5L16.2 38.1v55.2L64 121l47.8-27.6V38.1L64 10.5zm33.1 73.6L64 103 30.9 84.1V46.3L64 27.4l33.1 18.9v37.8z" />
      </svg>
    ),
  },

  // ROW 2: Cloud, DevOps & Full Stack
  {
    name: 'Supabase',
    category: 'Backend',
    bg: '#171B19',
    border: 'rgba(62, 207, 142, 0.25)',
    icon: (
      <svg viewBox="0 0 109 113" className="size-full">
        <path d="M63.7 110.2c-2.4 3-7.2 1.8-7.9-2.1L45.4 51.9h47.2c4.4 0 6.8 5.1 4 8.5L63.7 110.2z" fill="#3ECF8E" />
        <path d="M45.3 2.8c2.4-3 7.2-1.8 7.9 2.1l10.4 56.2H16.4c-4.4 0-6.8-5.1-4-8.5L45.3 2.8z" fill="#249361" />
      </svg>
    ),
  },
  {
    name: 'Docker',
    category: 'DevOps',
    bg: '#1D63ED',
    border: 'rgba(255, 255, 255, 0.18)',
    icon: (
      <svg viewBox="0 0 24 24" className="size-full fill-white">
        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.12a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.184.185" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    category: 'VCS & CI',
    bg: '#FFFFFF',
    border: 'rgba(0, 0, 0, 0.1)',
    isLight: true,
    icon: (
      <svg viewBox="0 0 24 24" className="size-full fill-[#18181B]">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    name: 'Tailwind CSS',
    category: 'Styling',
    bg: '#0F172A',
    border: 'rgba(56, 189, 248, 0.25)',
    icon: (
      <svg viewBox="0 0 24 24" className="size-full fill-[#38BDF8]">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
      </svg>
    ),
  },
  {
    name: 'GraphQL',
    category: 'API',
    bg: '#E535AB',
    border: 'rgba(255, 255, 255, 0.2)',
    icon: (
      <svg viewBox="0 0 100 100" className="size-full fill-white">
        <path d="M50 10L84.6 30v40L50 90 15.4 70V30L50 10zm0 11.5L23.4 34.2v31.6L50 78.5l26.6-12.7V34.2L50 21.5z" />
        <circle cx="50" cy="10" r="8" fill="#fff" />
        <circle cx="84.6" cy="30" r="8" fill="#fff" />
        <circle cx="84.6" cy="70" r="8" fill="#fff" />
        <circle cx="50" cy="90" r="8" fill="#fff" />
        <circle cx="15.4" cy="70" r="8" fill="#fff" />
        <circle cx="15.4" cy="30" r="8" fill="#fff" />
      </svg>
    ),
  },
  {
    name: 'Redis',
    category: 'Cache',
    bg: '#DC382D',
    border: 'rgba(255, 255, 255, 0.2)',
    icon: (
      <svg viewBox="0 0 100 100" className="size-full fill-white">
        <path d="M50 18L15 36l35 18 35-18-35-18z" />
        <path d="M15 48l35 18 35-18v12l-35 18-35-18V48z" opacity="0.8" />
        <path d="M15 66l35 18 35-18v12l-35 18-35-18V66z" opacity="0.6" />
      </svg>
    ),
  },
  {
    name: 'Bun',
    category: 'Runtime',
    bg: '#FBF0DF',
    border: 'rgba(0, 0, 0, 0.08)',
    isLight: true,
    icon: (
      <svg viewBox="0 0 100 100" className="size-full">
        <circle cx="50" cy="50" r="40" fill="#E8B87D" />
        <ellipse cx="40" cy="46" rx="4" ry="7" fill="#2E1C0C" />
        <ellipse cx="60" cy="46" rx="4" ry="7" fill="#2E1C0C" />
        <path d="M43 60c4 4 10 4 14 0" stroke="#2E1C0C" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    name: 'Prisma',
    category: 'ORM',
    bg: '#1A202C',
    border: 'rgba(90, 103, 216, 0.25)',
    icon: (
      <svg viewBox="0 0 100 100" className="size-full fill-[#5A67D8]">
        <path d="M48 10L18 80l64-15L48 10zm4 18l19 39-41 10 22-49z" />
      </svg>
    ),
  },

  // ROW 3: Emerging & Modern Platforms
  {
    name: 'Svelte',
    category: 'Framework',
    bg: '#FF3E00',
    border: 'rgba(255, 255, 255, 0.2)',
    icon: (
      <svg viewBox="0 0 100 100" className="size-full fill-white">
        <path d="M78 28c-4-8-14-13-25-11-13 2-24 13-22 26 1 8 7 14 13 18l12 7c6 4 9 9 8 15-1 8-9 13-17 12-7-1-12-6-14-13l-13 4c3 13 13 22 27 23 16 1 29-10 31-25 1-9-4-17-12-22l-12-7c-5-3-8-8-7-13 1-6 6-10 12-10 5 0 9 3 11 7l11-4z" />
      </svg>
    ),
  },
  {
    name: 'Vue.js',
    category: 'Framework',
    bg: '#1A2332',
    border: 'rgba(66, 184, 131, 0.25)',
    icon: (
      <svg viewBox="0 0 256 221" className="size-full">
        <path d="M204.8 0H256L128 220.8 0 0h97.92L128 51.2 157.44 0h47.36z" fill="#42B883" />
        <path d="M0 0l128 220.8L256 0h-51.2L128 132.48 49.92 0H0z" fill="#35495E" />
      </svg>
    ),
  },
  {
    name: 'FastAPI',
    category: 'Backend',
    bg: '#05998B',
    border: 'rgba(255, 255, 255, 0.2)',
    icon: (
      <svg viewBox="0 0 100 100" className="size-full fill-white">
        <path d="M54 10L24 55h22L40 90l36-48H52l12-32h-10z" />
      </svg>
    ),
  },
  {
    name: 'Kubernetes',
    category: 'Cloud',
    bg: '#326CE5',
    border: 'rgba(255, 255, 255, 0.2)',
    icon: (
      <svg viewBox="0 0 100 100" className="size-full fill-white">
        <circle cx="50" cy="50" r="14" fill="#326CE5" stroke="#fff" strokeWidth="6" />
        <path d="M50 14v18M50 68v18M18 36l16 9M66 63l16 9M18 64l16-9M66 37l16-9" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'AWS',
    category: 'Cloud',
    bg: '#232F3E',
    border: 'rgba(255, 255, 255, 0.12)',
    icon: (
      <svg viewBox="0 0 100 100" className="size-full">
        <text x="50%" y="45%" textAnchor="middle" fontSize="32" fontWeight="900" fill="#fff" fontFamily="sans-serif">aws</text>
        <path d="M25 60c15 12 35 12 50 0" stroke="#FF9900" strokeWidth="6" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    name: 'Linux',
    category: 'OS',
    bg: '#18181B',
    border: 'rgba(255, 255, 255, 0.12)',
    icon: (
      <svg viewBox="0 0 100 100" className="size-full fill-white">
        <circle cx="50" cy="38" r="18" fill="#FEE135" />
        <ellipse cx="44" cy="36" rx="3" ry="5" fill="#000" />
        <ellipse cx="56" cy="36" rx="3" ry="5" fill="#000" />
        <ellipse cx="50" cy="44" rx="7" ry="4" fill="#E95420" />
        <path d="M30 65c0-12 9-20 20-20s20 8 20 20v18H30V65z" fill="#fff" />
      </svg>
    ),
  },
  {
    name: 'MongoDB',
    category: 'Database',
    bg: '#001E2B',
    border: 'rgba(0, 237, 100, 0.25)',
    icon: (
      <svg viewBox="0 0 100 100" className="size-full">
        <path d="M50 12c-4 12-16 26-16 44 0 16 10 28 20 32v-76h-4zm0 0c4 12 16 26 16 44 0 16-10 28-20 32v-76h4z" fill="#00ED64" />
      </svg>
    ),
  },
  {
    name: 'C++',
    category: 'Systems',
    bg: '#00599C',
    border: 'rgba(255, 255, 255, 0.2)',
    icon: (
      <svg viewBox="0 0 100 100" className="size-full fill-white">
        <text x="50%" y="65%" textAnchor="middle" fontSize="42" fontWeight="900" fontFamily="sans-serif">C++</text>
      </svg>
    ),
  },
]

// Aside Scaling Constants for 3760x1360 3D Icon Grid
const L_BASE = 3856
const S_BASE = 1432 * Math.cos((48 * Math.PI) / 180) // 958.23

export default function SupportedStacksSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.3375) // Default to standard desktop scale
  const [mounted, setMounted] = useState(false)

  useIsomorphicLayoutEffect(() => {
    const el = scrollerRef.current || containerRef.current
    if (!el) return

    const update = (w: number, h: number) => {
      let n = Math.max(0, w) / L_BASE
      const factor = w < 640 ? 1.8 : w < 1024 ? 1.35 : 1
      const s = Math.min(
        Math.max(n, Math.min((Math.max(0, h) / S_BASE) * 0.88, n * factor)),
        1
      )
      setScale(s)
      setMounted(true)
    }

    update(el.clientWidth, el.clientHeight)

    const observer = new ResizeObserver(([entry]) => {
      update(entry.contentRect.width, entry.contentRect.height)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="stacks" className="mx-auto w-full border-b border-black/[0.08] bg-white overflow-hidden">
      <div className="mx-auto w-full max-w-[1536px] px-4 sm:px-6 lg:px-12 xl:px-24">
        {/* Soft Background Gradient like Aside */}
        <div className="to-background bg-gradient-to-b from-neutral-50/70">
          {/* Header Block with Aside vertical border-x */}
          <div className="border-x border-black/[0.08] px-6 py-12 sm:px-8 sm:py-16 md:px-14 md:py-24 xl:px-36 !pb-4">
            <div className="text-center max-w-3xl mx-auto">
              <p className="mb-2 lg:mb-4">
                <a
                  className="text-accent inline-flex items-center gap-1 text-sm font-medium decoration-accent/50 decoration-dotted decoration-2 underline-offset-4 hover:underline md:text-base group"
                  href="#stacks"
                >
                  <span>Supported tech stacks</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </p>
              <h2 className="font-display text-[#0a0a0a] font-bold text-3xl leading-tight sm:text-4xl sm:leading-tight xl:text-5xl xl:leading-tight">
                Any stack you ship code in,<br />
                Forke supports your work.
              </h2>
            </div>
          </div>

          {/* 3D Tilted Icons Perspective Wall (Exact Aside perspective, mask, and dimensions) */}
          <div className="border-x border-black/[0.08] px-6 py-12 sm:px-8 sm:py-16 md:px-14 md:py-24 xl:px-36 !p-0">
            <div
              ref={containerRef}
              className="landing-icons-mask relative -mt-8 sm:-mt-12 md:-mt-16 h-[380px] sm:h-[420px] md:h-[450px] w-full overflow-hidden select-none"
              role="img"
              aria-label="Supported tech stack icons that Forke supports"
            >
              <div
                ref={scrollerRef}
                className="absolute inset-y-0 right-0 left-0 flex h-[380px] sm:h-[420px] md:h-[450px] items-end justify-center overflow-hidden lg:right-10 lg:left-10 xl:right-12 xl:left-12"
                style={{
                  perspective: '1200px',
                  perspectiveOrigin: 'calc(50% + 12px) 100%',
                }}
              >
                {/* 3D Perspective Plane (3760x1360 grid with 400px items that scale down to 135x74 on screen) */}
                <div
                  className="grid origin-bottom overflow-visible"
                  style={{
                    width: 3760,
                    height: 1360,
                    gridTemplateColumns: 'repeat(8, 400px)',
                    gap: 80,
                    transformOrigin: 'calc(50% + 12px) bottom',
                    transform: `rotateX(48deg) scale(${scale})`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {TECH_STACKS.map((stack, index) => {
                    const row = Math.floor(index / 8)
                    return (
                      <motion.div
                        key={stack.name}
                        className="relative shrink-0 cursor-default hover:z-10 group"
                        style={{
                          width: 400,
                          height: 400,
                          transformStyle: 'flat',
                          transformOrigin: '200px 200px',
                        }}
                        initial={{ opacity: 0, y: 48, scale: 0.92 }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: {
                            duration: 0.45,
                            delay: 0.05 + 0.06 * row,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        }}
                        viewport={{ once: true, amount: 0.05 }}
                      >
                        {/* Radial Contact Shadow Beneath Each Icon */}
                        <motion.div
                          className="pointer-events-none absolute z-0 rounded-full"
                          aria-hidden="true"
                          style={{
                            left: 200,
                            bottom: 6,
                            width: 312,
                            height: 88,
                            x: '-50%',
                            background:
                              'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.28) 28%, rgba(0,0,0,0.1) 54%, transparent 76%)',
                            transformOrigin: 'center center',
                            filter: 'blur(10px)',
                          }}
                          whileHover={{
                            opacity: 0.38,
                            scaleX: 1.32,
                            scaleY: 1.24,
                            filter: 'blur(24px)',
                            transition: { duration: 0.2, ease: 'easeOut' },
                          }}
                        />

                        {/* Interactive Squircle App Card (Matches div.absolute with 0px padding, z-10, 135x74 rendered) */}
                        <motion.div
                          className="absolute inset-0 z-10 rounded-[80px] flex items-center justify-center border shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden"
                          style={{
                            backgroundColor: stack.bg,
                            borderColor: stack.border || 'rgba(0, 0, 0, 0.08)',
                            backfaceVisibility: 'hidden',
                            padding: 0,
                          }}
                          whileHover={{
                            y: -40,
                            scale: 1.1,
                            boxShadow: '0 24px 48px -12px rgba(0,0,0,0.28)',
                            transition: { duration: 0.2, ease: 'easeOut' },
                          }}
                          whileTap={{ scale: 0.96 }}
                        >
                          {/* Glossy top-light reflection like Aside & iOS app icons */}
                          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none rounded-t-[80px]" />

                          {/* Center Stack Icon (Pre-scaled Y to compensate for 48deg 3D tilt compression) */}
                          <div
                            className="size-[240px] flex items-center justify-center relative z-10 drop-shadow-sm p-2"
                            style={{
                              transform: 'scaleY(1.38)',
                              transformOrigin: 'center center',
                            }}
                          >
                            {stack.icon}
                          </div>

                          {/* Tooltip on Hover */}
                          <div className="absolute inset-x-0 bottom-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <span
                              className={`text-[26px] font-sans font-semibold tracking-tight px-4 py-1.5 rounded-full ${
                                stack.isLight
                                  ? 'text-[#2E1C0C] bg-white/90 shadow'
                                  : 'text-white/95 bg-black/50 backdrop-blur-sm'
                              } drop-shadow`}
                            >
                              {stack.name}
                            </span>
                          </div>
                        </motion.div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Paragraph with Aside Border-X Alignment */}
        <div className="border-x border-black/[0.08] px-6 py-12 sm:px-8 md:py-16 xl:px-64 lg:px-48 text-left sm:text-center">
          <p className="font-display text-[#0a0a0a] text-base xl:text-lg font-normal leading-relaxed max-w-3xl mx-auto">
            Unlike other freelancing platforms that force you into bidding wars and take 20% platform fees, Forke lets you write code in any stack with automated CI verification. That means you can build with the exact frameworks and tools you master. From UI fixes in Next.js to high-throughput backend services in Go and Rust—every merged PR is rewarded.
          </p>
        </div>
      </div>
    </section>
  )
}
