"use client";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#people", label: "Our People" },
  { href: "/contact", label: "Contact" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/60 dark:bg-neutral-950/40 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="SB Tech Associates" width={36} height={36} className="rounded-md" />
          <span className="font-serif text-lg">SB Tech Associates</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`text-sm hover:underline underline-offset-4 ${pathname === l.href ? "font-semibold" : "text-neutral-600 dark:text-neutral-300"}`}>
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
          <Link href="/contact">
            <Button>Book a Free Consultation</Button>
          </Link>
        </nav>
        <button className="md:hidden p-2" onClick={() => setOpen((v) => !v)} aria-label="Open Menu">
          <Menu size={20} />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white/70 dark:bg-neutral-950/60 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`text-sm ${pathname === l.href ? "font-semibold" : "text-neutral-700 dark:text-neutral-300"}`} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/contact" onClick={() => setOpen(false)}>
                <Button size="sm">Book a Free Consultation</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}