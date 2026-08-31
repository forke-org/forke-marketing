'use client'

import React, { useState, useEffect } from 'react'
import { Maximize2, X } from 'lucide-react'

interface ImageLightboxProps {
  src: string
  alt: string
  className?: string
}

export default function ImageLightbox({ src, alt, className = '' }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <div 
        className={`relative group rounded-xl overflow-hidden border border-white/[0.08] bg-[#0c0c0e] cursor-pointer shadow-[0_12px_32px_rgba(0,0,0,0.5)] ${className}`}
        onClick={() => setIsOpen(true)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-auto max-h-[460px] object-cover transition-transform duration-500 group-hover:scale-[1.01]" 
          loading="lazy"
        />

        {/* ENLARGE button badge on bottom right matching Supermemory/Linear */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/70 hover:bg-black/90 border border-white/20 text-[10px] font-mono font-bold tracking-widest text-white/90 uppercase backdrop-blur-md transition-all shadow-md">
          <Maximize2 className="w-2.5 h-2.5 text-accent" />
          <span>ENLARGE</span>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button on top right */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 right-0 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold text-white tracking-wider uppercase transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>CLOSE</span>
            </button>

            {/* Lightbox image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={src} 
              alt={alt} 
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.9)]"
            />
          </div>
        </div>
      )}
    </>
  )
}
