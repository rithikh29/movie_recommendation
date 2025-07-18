import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

// ✅ Correct metadata export
export const metadata: Metadata = {
  title: "CineMatch - Movie Recommendations System",
  description: "Discover your next favorite movie with AI-powered recommendations",
  manifest: "/manifest.json",
  icons: {
    icon: "/android-icon-192x192.png",
    apple: "/android-icon-192x192.png",
  },
}

// ✅ themeColor moved to viewport
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark" storageKey="cinematch-theme">
          {children}
        </ThemeProvider>

        {/* ✅ Register service worker in body via useEffect or script tag if really needed */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function (registration) {
                      console.log('ServiceWorker registration successful:', registration);
                    })
                    .catch(function (error) {
                      console.log('ServiceWorker registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
