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

  const isVideo = src?.match(/\.(mp4|webm|mov)$/i)

  return (
    <>
      <div 
        className={`relative group rounded-xl overflow-hidden border border-white/[0.08] bg-[#0c0c0e] cursor-pointer shadow-[0_12px_32px_rgba(0,0,0,0.5)] ${className}`}
        onClick={() => setIsOpen(true)}
      >
        {isVideo ? (
          <video 
            src={src} 
            className="w-full h-auto max-h-[460px] object-cover" 
            muted 
            playsInline 
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-auto max-h-[460px] object-cover transition-transform duration-500 group-hover:scale-[1.01]" 
            loading="lazy"
          />
        )}

        {/* ENLARGE button badge on bottom right: ONLY visible on hover */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/70 hover:bg-black/90 border border-white/20 text-[10px] font-mono font-bold tracking-widest text-white/90 uppercase backdrop-blur-md transition-all shadow-md opacity-0 group-hover:opacity-100 duration-200 pointer-events-none">
          <Maximize2 className="w-2.5 h-2.5 text-accent" />
          <span>ENLARGE</span>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal with translucent blurry background */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/50 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[92vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Media wrapper: close button is on top-right of image/video itself, not outside */}
            <div className="relative inline-block max-w-full max-h-[85vh]">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 z-30 flex items-center justify-center h-8 w-8 rounded-full bg-black/60 hover:bg-black/85 border border-white/25 text-white/80 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-lg"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {isVideo ? (
                <video 
                  src={src} 
                  controls 
                  autoPlay 
                  className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-xl border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.9)] block" 
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img 
                  src={src} 
                  alt={alt} 
                  className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-xl border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.9)] block"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
