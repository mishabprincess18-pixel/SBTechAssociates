import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { inter, playfair } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "SB Tech Associates — India’s First Technology Law Firm",
  description:
    "We bridge law with innovation. Legal solutions for fintech, AI, data protection, and digital-first ventures.",
  openGraph: {
    title: "SB Tech Associates",
    description:
      "Legal solutions for fintech, AI, data protection, and digital-first ventures.",
    url: "https://sbtech.example",
    siteName: "SB Tech Associates",
  },
  metadataBase: new URL("https://sbtech.example"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
