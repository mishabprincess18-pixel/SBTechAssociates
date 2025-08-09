# SB Tech Associates Website

Modern, premium website for SB Tech Associates — India’s first technology law firm.

## Tech Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS (dark mode)
- shadcn-style UI (lightweight)
- Framer Motion
- Zustand
- TanStack Query
- Recharts
- NextAuth.js (Credentials + optional Google/GitHub)
- Resend (contact form email)
- Jest + React Testing Library

## Getting Started
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Configure environment:
   Create `.env.local` with:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=dev_secret
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GITHUB_ID=
   GITHUB_SECRET=
   RESEND_API_KEY=
   CONTACT_TO_EMAIL=
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
3. Run the dev server:
   ```bash
   pnpm dev
   ```

## Scripts
- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm start` — serve production build
- `pnpm test` — run tests

## Deploy
- Optimized for Vercel. Set environment variables in the Vercel dashboard.

## Accessibility & SEO
- Semantic HTML, color-contrast aware theme
- `robots.ts`, `sitemap.ts`, Open Graph metadata
