import { Section } from "@/components/section";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
      <Section>
        <h1 className="text-3xl md:text-4xl font-serif">About Us</h1>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          At SB Tech Associates, we pioneered India’s legal-tech movement, bridging the precision of law with the pace of innovation.
        </p>
      </Section>
      <Section>
        <h2 className="text-2xl font-serif">Our Story</h2>
        <p className="mt-3">
          Born from the need for agile, technology-first legal counsel, SB Tech Associates has evolved into a trusted partner for startups and enterprises navigating fintech, AI, and data-driven businesses.
        </p>
      </Section>
      <Section>
        <h2 className="text-2xl font-serif">Founder</h2>
        <p className="mt-3">
          <strong>Shweta Bansal</strong> — 28, tech-savvy lawyer, leading India’s legal-tech wave.
        </p>
      </Section>
      <Section>
        <h2 className="text-2xl font-serif">Advisors</h2>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>Loveleen Arora — Placement Head</li>
          <li>Mr. O.P. Midha — Director</li>
        </ul>
      </Section>
      <Section>
        <h2 className="text-2xl font-serif">Mission</h2>
        <p className="mt-3">To empower startups and innovators with legally sound digital transformations.</p>
      </Section>
    </div>
  );
}