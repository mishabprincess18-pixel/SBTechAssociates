import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/section";
import { ServiceCard } from "@/components/service-card";
import { PeopleCard } from "@/components/people-card";
import { ErrorTestPanel } from "@/components/error-test-panel";

export default function Home() {
  return (
    <div>
      <Section className="bg-gradient-to-br from-[#c2d6e8] to-white dark:from-[#0a1a24] dark:to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Image src="/logo.png" alt="SB Tech Associates" width={96} height={96} className="rounded-xl mb-6" />
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight">India’s First Technology Law Firm</h1>
            <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-300">
              At SB Tech Associates, we bridge law with innovation, offering cutting-edge legal solutions for fintech, AI, data protection, and digital-first ventures.
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="/contact"><Button className="h-12 px-6">Book a Free Consultation</Button></Link>
              <Link href="#services" className="text-sm underline underline-offset-4 self-center">Explore Services</Link>
            </div>
          </div>
          <div className="md:justify-self-end">
            <div className="w-full h-64 md:h-80 rounded-2xl bg-white/50 dark:bg-neutral-900/40 backdrop-blur border flex items-center justify-center">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Premium, minimalist design inspired by leading law firms</span>
            </div>
          </div>
        </div>
      </Section>

      <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="services">
        <h2 className="text-3xl font-serif mb-8">Practice Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard title="Fintech Law & RBI Regulations" desc="Compliance, licensing, and regulatory strategy for fintech products." />
          <ServiceCard title="Data Privacy & DPDP Act" desc="Privacy programs, audits, and DPDP compliance for Indian and global ops." />
          <ServiceCard title="AI & Emerging Tech Law" desc="Risk frameworks, governance, and policies for AI-driven businesses." />
          <ServiceCard title="Intellectual Property Rights (IPR)" desc="Trademarks, copyrights, patents, and IP commercialization." />
          <ServiceCard title="Gaming & Cyber Law" desc="Advisory on online gaming, cybercrime, and IT Act matters." />
          <ServiceCard title="Startup Legal & Funding Support" desc="Entity setup, ESOPs, investors, and deal documentation." />
          <ServiceCard title="Tech Contracts (SaaS, NDAs, Platform Terms)" desc="End-to-end contracting for modern digital products." />
        </div>
      </Section>

      <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="people">
        <h2 className="text-3xl font-serif mb-8">Our People</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <PeopleCard name="Shweta Bansal" role="Founder" expertise="Tech law, fintech, AI" img="/people/shweta.jpg" />
          <PeopleCard name="Loveleen Arora" role="Advisor — Placement Head" expertise="Strategy, operations" img="/people/loveleen.jpg" />
          <PeopleCard name="Mr. O.P. Midha" role="Advisor — Director" expertise="Leadership, governance" img="/people/midha.jpg" />
        </div>
      </Section>

      <Section className="text-center py-16">
        <h3 className="text-2xl font-serif">Ready to build with confidence?</h3>
        <p className="mt-2">Let’s secure your innovation with clear, modern legal strategy.</p>
        <div className="mt-6"><Link href="/contact"><Button>Book a Free Consultation</Button></Link></div>
      </Section>
      
      <ErrorTestPanel />
    </div>
  );
}
