import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ToastContainer } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "VYBE — Find your people. Share your world.",
  description:
    "A next-generation social ecosystem designed for creators, students, photographers, coders, video editors, and passionate communities.",
  keywords: [
    "social platform",
    "creators",
    "communities",
    "vybes",
    "video editing",
    "photography",
    "coding",
    "AI studio",
  ],
  authors: [{ name: "VYBE Team" }],
  openGraph: {
    title: "VYBE — Find your people. Share your world.",
    description: "Next-generation community-first social platform for creators and thinkers.",
    siteName: "VYBE",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#090a0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('vybe_theme');
                if (saved === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased selection:bg-violet-600 selection:text-white">
        <AuthProvider>
          {children}
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
