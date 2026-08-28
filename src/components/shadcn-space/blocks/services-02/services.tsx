"use client";
import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { aboutServicesData, type AboutServiceItem } from "@/content/about-services";

export type ServiceItem = AboutServiceItem;

export interface ServicesProps {
    data?: ServiceItem[];
}

export const servicesData = aboutServicesData;

function Services({ data = servicesData }: ServicesProps) {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const handleMouseEnter = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <section className="bg-[var(--navy)] text-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 lg:py-20 sm:py-16 py-8">
                <div className="flex flex-col sm:gap-16 gap-8">
                    <div className="flex md:flex-row flex-col justify-between md:items-end items-start gap-4">
                        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-10 duration-1000 delay-200 ease-in-out fill-mode-both">
                            <Badge variant="outline" className="py-1 px-3 h-auto text-sm font-normal border-0 outline outline-white/25 bg-transparent text-[#9cc4ff] uppercase tracking-[0.12em]">
                                What we provide
                            </Badge>
                            <h2 className="sm:text-5xl text-3xl text-white font-semibold font-[family-name:var(--font-display)] tracking-[-0.03em]">Full Service Real Estate Brokerage.</h2>
                            <p className="max-w-2xl text-white/75 sm:text-lg text-base">
                                Our team of talented Realtors provide you with the critical elements of success; local experience, dedication to customer service and real-time property listings.
                            </p>
                        </div>
                        <Link
                            href="/contact/"
                            className="group p-1 bg-[var(--red)] hover:bg-[var(--red)]/80 text-white font-medium flex gap-2 lg:gap-3 justify-between items-center rounded-full w-fit ps-5 h-auto border-0 animate-in fade-in slide-in-from-right-10 duration-1000 delay-200 ease-in-out fill-mode-both"
                        >
                            <span className="flex items-center gap-3 text-white text-sm font-medium">
                                Contact a Realtor
                                <span className="p-2 bg-white rounded-full group-hover:rotate-45 transition-transform duration-300 ease-in-out">
                                    <Icon
                                        className="text-[var(--navy)]"
                                        icon="lucide:arrow-up-right"
                                        width={16}
                                        height={16}
                                    />
                                </span>
                            </span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-12 relative gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 ease-in-out fill-mode-both">
                        <div className="w-full lg:col-span-4 col-span-12 lg:sticky lg:top-28 self-start">
                            <div className="transition-all duration-300 z-10 h-80 overflow-hidden rounded-2xl">
                                {data?.[activeIndex]?.image && (
                                    <img
                                        src={data[activeIndex].image}
                                        alt={data[activeIndex].heading}
                                        width={400}
                                        height={250}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="lg:col-span-1" />
                        <div className="w-full flex flex-col gap-16 lg:col-span-7 col-span-12">
                            <div>
                                {data?.map((value, index) => (
                                    <div
                                        key={index}
                                        onMouseEnter={() => handleMouseEnter(index)}
                                        onClick={() => handleMouseEnter(index)}
                                        className="group py-6 xl:py-10 border-t border-white/15 cursor-pointer flex xl:flex-row flex-col xl:items-center items-start justify-between xl:gap-10 gap-1 relative">
                                        <h3 className={cn("group-hover:text-[#9cc4ff] py-1 text-2xl md:text-3xl font-semibold text-white max-w-sm w-full font-[family-name:var(--font-display)] tracking-[-0.02em]", activeIndex === index ? "text-[#9cc4ff]" : "")}>
                                            {value.heading}
                                        </h3>
                                        {activeIndex === index && (
                                            <p className="text-white/70 text-base transition-all duration-300 flex-1">
                                                {value.descp}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Services;
