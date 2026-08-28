"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useInView } from "motion/react";

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
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      ref={sectionRef}
      className="sell-cinematic-hero relative flex items-end text-white bg-[var(--navy-deep)] h-auto min-h-0 md:h-full md:min-h-[calc(100svh-7.5rem)] overflow-hidden"
    >
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        loop
        autoPlay
        muted
        playsInline
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
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
            transition={{ duration: 0.3, ease: "easeInOut", delay: 0.2 }}
            className="flex sm:flex-row flex-col items-start lg:items-baseline gap-4"
          >
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
          </motion.div>
          {children}
        </div>
      </div>
    </section>
  );
}
