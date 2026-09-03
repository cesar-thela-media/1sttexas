"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

function armVideo(video: HTMLVideoElement) {
  video.muted = true
  video.defaultMuted = true
  video.playsInline = true
  video.setAttribute('muted', '')
  video.setAttribute('playsinline', '')
  video.setAttribute('webkit-playsinline', 'true')
}

export default function HeroSection({
  eyebrow = "Home Selling",
  title = "Sell with a plan.",
  lead,
  video = "/videos/hero-bighouse.mp4",
  poster = "/assets/reference/seabrookhomesforsale.jpg",
  ctaHref = "/contact/",
  ctaLabel = "Contact a Realtor",
  children,
}: {
  eyebrow?: string
  title?: string
  lead?: string
  video?: string
  poster?: string
  ctaHref?: string
  ctaLabel?: string
  children?: ReactNode
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    armVideo(el)
    const play = () => {
      armVideo(el)
      el.play().catch(() => {})
    }
    play()
    el.addEventListener('loadeddata', play)
    el.addEventListener('canplay', play)
    window.addEventListener('pointerdown', play, { once: true })
    window.addEventListener('scroll', play, { once: true, passive: true })
    return () => {
      el.removeEventListener('loadeddata', play)
      el.removeEventListener('canplay', play)
      window.removeEventListener('pointerdown', play)
      window.removeEventListener('scroll', play)
    }
  }, [video])

  return (
    <section
      className="sell-cinematic-hero relative flex items-end text-white bg-[var(--navy-deep)] h-auto min-h-0 md:h-full md:min-h-[calc(100svh-7.5rem)] overflow-hidden"
    >
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        loop
        autoPlay
        muted
        playsInline
        preload="metadata"
        poster={poster}
      >
        <source src={video} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[var(--navy-deep)]/55"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 xl:px-16 w-full">
        <div className="flex flex-col gap-4 sm:gap-6 py-10 sm:py-16">
          <div className="flex items-start gap-2.5 md:gap-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 grid place-items-center">
              <motion.div
                className="w-full h-full rounded-full border-2 border-[#9cc4ff] grid place-items-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                aria-hidden="true"
              >
                <span className="block w-2 h-2 rounded-full bg-[#9cc4ff]" />
              </motion.div>
            </div>
            <p className="sm:text-base text-sm sm:leading-6 leading-5 font-normal text-white sm:max-w-xl">
              <span className="text-[#9cc4ff] uppercase tracking-[0.12em] text-xs font-semibold block mb-1">{eyebrow}</span>
              {lead ? (
                lead
              ) : (
                <>
                  We create <span className="text-[#9cc4ff]">high-performing</span> digital designs that elevate brands and enhance conversions.
                </>
              )}
            </p>
          </div>
          <div className="flex sm:flex-row flex-col items-start lg:items-baseline gap-4">
            <h1 className="text-[1.7rem] leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-[family-name:var(--font-display)] tracking-[-0.04em] max-w-full break-words">
              {title}
            </h1>
            <div>
              <Link
                href={ctaHref}
                aria-label={ctaLabel}
                className="bg-[var(--red)] rounded-full p-1 pl-8 inline-flex group"
              >
                <span className="lg:p-3 p-2 bg-white text-[var(--navy)] rounded-full group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight size={24} />
                </span>
              </Link>
            </div>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
