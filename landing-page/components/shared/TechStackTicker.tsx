'use client'

/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import React from 'react'
import { cn } from '@/lib/utils/cn'

interface TechStackItem {
  name: string;
  path: string;
  themedPath: string;
  hoverFilter?: string;
}

const TECH_STACKS: TechStackItem[] = [
  { name: "React", path: "react/react-original", themedPath: "react/react-original" },
  { name: "Next.js", path: "nextjs/nextjs-original", themedPath: "nextjs/nextjs-plain" },
  { name: "HTML5", path: "html5/html5-original", themedPath: "html5/html5-plain" },
  { name: "CSS3", path: "css3/css3-original", themedPath: "css3/css3-plain" },
  { name: "JavaScript", path: "javascript/javascript-original", themedPath: "javascript/javascript-plain" },
  { name: "TypeScript", path: "typescript/typescript-original", themedPath: "typescript/typescript-plain" },
  { name: "Python", path: "python/python-original", themedPath: "python/python-plain" },
  { name: "PHP", path: "php/php-original", themedPath: "php/php-plain" },
  { name: "Go (Golang)", path: "go/go-original", themedPath: "go/go-plain" },
  { name: "Rust", path: "rust/rust-original", themedPath: "rust/rust-original", hoverFilter: "brightness(0) invert(1)" },
  { name: "Nuxt.js", path: "nuxtjs/nuxtjs-original", themedPath: "nuxtjs/nuxtjs-plain" },
  { name: "Vue.js", path: "vuejs/vuejs-original", themedPath: "vuejs/vuejs-plain" },
  { name: "Vite", path: "vitejs/vitejs-original", themedPath: "vitejs/vitejs-plain" },
  { name: "Svelte", path: "svelte/svelte-original", themedPath: "svelte/svelte-plain" },
  { name: "Spring Boot", path: "spring/spring-original", themedPath: "spring/spring-original" },
  { name: "Ruby", path: "ruby/ruby-original", themedPath: "ruby/ruby-plain" },
  { name: "Laravel v2", path: "laravel/laravel-original", themedPath: "laravel/laravel-original" },
  { name: "NestJS", path: "nestjs/nestjs-original", themedPath: "nestjs/nestjs-original" },
  { name: "Lua", path: "lua/lua-original", themedPath: "lua/lua-plain" },
  { name: "Laravel v1", path: "laravel/laravel-original", themedPath: "laravel/laravel-original" },
  { name: "Astro", path: "astro/astro-original", themedPath: "astro/astro-plain", hoverFilter: "brightness(0) invert(1)" },
  { name: "Flask", path: "flask/flask-original", themedPath: "flask/flask-original", hoverFilter: "brightness(0) invert(1)" },
  { name: "C++", path: "cplusplus/cplusplus-original", themedPath: "cplusplus/cplusplus-plain" },
  { name: "C#", path: "csharp/csharp-original", themedPath: "csharp/csharp-plain" },
  { name: "C", path: "c/c-original", themedPath: "c/c-original" },
  { name: "Angular", path: "angular/angular-original", themedPath: "angular/angular-plain" }
];

function TechStackCard({ item }: { item: TechStackItem }) {
  const imageUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${item.path}.svg`
  const themedImageUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${item.themedPath}.svg`

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer transition-transform duration-200">
      <div className="relative w-5 h-5 transition-transform duration-300 transform group-hover:scale-115">
        {/* Themed Layer: Monochromatic Outline SVG with orange tint */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={themedImageUrl}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-opacity duration-300 opacity-70 group-hover:opacity-0"
          style={{
            filter: 'brightness(0) saturate(100%) invert(52%) sepia(85%) saturate(2318%) hue-rotate(357deg) brightness(101%) contrast(106%)'
          }}
        />
        
        {/* Brand Layer: Original SVG Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={imageUrl}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={item.hoverFilter ? { filter: item.hoverFilter } : undefined}
        />
      </div>
      <span className="text-[13px] font-medium font-mono text-white/50 group-hover:text-white transition-colors duration-300">
        {item.name}
      </span>
    </div>
  )
}

export default function TechStackTicker({ 
  className,
  isHeroEmbedded = false 
}: { 
  className?: string;
  isHeroEmbedded?: boolean 
}) {
  return (
    <div className={cn("w-full bg-transparent flex flex-col items-center select-none", className)}>
      {/* Title above the ticker */}
      <div className="flex items-center justify-center mb-3.5 select-none">
        <span className="text-[11px] sm:text-xs font-mono tracking-wider text-white/50 uppercase">
          supported stacks
        </span>
      </div>

      {/* Seamless horizontal ticker track with edge fade masks */}
      <div 
        className="relative w-full max-w-7xl mx-auto overflow-hidden py-2"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)'
        }}
      >
        <div className="flex w-max animate-ticker whitespace-nowrap select-none">
          {/* First set */}
          <div className="flex shrink-0 items-center gap-10 sm:gap-12 pr-10 sm:pr-12">
            {TECH_STACKS.map((item, index) => (
              <TechStackCard key={`track-1-${item.name}-${index}`} item={item} />
            ))}
          </div>

          {/* Cloned second set for mathematical infinite seamless looping */}
          <div className="flex shrink-0 items-center gap-10 sm:gap-12 pr-10 sm:pr-12" aria-hidden="true">
            {TECH_STACKS.map((item, index) => (
              <TechStackCard key={`track-2-${item.name}-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
