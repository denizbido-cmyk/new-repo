import { useRef } from 'react';
import FadeIn from '../components/FadeIn';
import InteractiveAvatar from '../components/InteractiveAvatar';
import ContactButton from '../components/ContactButton';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Price', href: '#price' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex flex-col"
      style={{ overflowX: 'clip' }}
    >
      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        className="flex justify-between px-6 md:px-10 pt-6 md:pt-8"
      >
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
          >
            {link.label}
          </a>
        ))}
      </FadeIn>

      <div className="overflow-hidden mt-6 sm:mt-4 md:-mt-5">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]">
            Hi, i&apos;m deniz
          </h1>
        </FadeIn>
      </div>

      <div
        className="absolute left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]"
        style={{ perspective: '1100px' }}
      >
        <FadeIn delay={0.6} y={30}>
          <InteractiveAvatar
            trackRef={heroRef}
            src="/deniz-avatar.jpg"
            alt="Deniz portrait"
          />
        </FadeIn>
      </div>

      <div id="contact" className="flex justify-between items-end pb-7 sm:pb-8 md:pb-10 px-6 md:px-10 mt-auto gap-6">
        <FadeIn delay={0.35} y={20} className="max-w-[230px] sm:max-w-[300px] md:max-w-[360px]">
          <div className="flex flex-col gap-2 sm:gap-3">
            <span className="text-[#D7E2EA]/70 font-medium uppercase tracking-[0.2em] text-[10px] sm:text-xs">
              — What I Deliver
            </span>
            <p className="italic font-semibold text-[#D7E2EA] text-base sm:text-xl md:text-2xl">
              on time. on brief.
            </p>
            <p className="text-[#D7E2EA]/70 font-light leading-relaxed text-[11px] sm:text-sm">
              Independent-minded Project Manager specialised in large-scale programme &amp; fund
              delivery — high-density civic and cultural work for municipalities, festivals, and
              private-sector partners alike. Based in Istanbul, working across Europe.
            </p>
            <div className="flex flex-col gap-1 text-[#D7E2EA] font-medium text-[11px] sm:text-sm">
              <span>Istanbul, Turkey</span>
              <a href="tel:+905387725027" className="hover:opacity-70 transition-opacity duration-200 w-fit">
                +90 538 772 50 27
              </a>
              <a
                href="mailto:denizbido@gmail.com"
                className="hover:opacity-70 transition-opacity duration-200 w-fit"
              >
                denizbido@gmail.com
              </a>
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
