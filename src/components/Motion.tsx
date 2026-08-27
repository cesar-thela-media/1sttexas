'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
gsap.registerPlugin(useGSAP)
export function Motion({children,className=''}:{children:React.ReactNode;className?:string}){const ref=useRef<HTMLDivElement>(null);useGSAP(()=>{if(ref.current)gsap.fromTo(ref.current,{opacity:0,y:24},{opacity:1,y:0,duration:.7,ease:'power2.out'})},{scope:ref});return <div ref={ref} className={className}>{children}</div>}
export function ScrollReveals(){
  useEffect(()=>{
    const items=document.querySelectorAll('.reveal')
    if(!('IntersectionObserver' in window)){items.forEach(el=>el.classList.add('visible'));return}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el=entry.target as HTMLElement
        el.classList.add('visible')
        // stagger direct children for a layered reveal (60ms apart)
        const kids=Array.from(el.children).filter(c=>(c as HTMLElement).classList.contains('reveal-item')) as HTMLElement[]
        kids.forEach((kid,i)=>{kid.style.transitionDelay=`${i*60}ms`})
        observer.unobserve(el)
      }
    }),{threshold:0,rootMargin:'0px 0px -5% 0px'})
    items.forEach(item=>observer.observe(item))
    return()=>observer.disconnect()
  },[])
  return null
}
