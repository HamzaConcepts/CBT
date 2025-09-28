import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import { SWRConfig } from 'swr'
import { UserProvider } from "@/components/providers/user-provider"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { AccountButton } from "@/components/account-button"

export const metadata: Metadata = {
  title: "CBT Platform - Computer-Based Testing System",
  description: "Secure and modern computer-based testing platform for teachers and students",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <SWRConfig value={{
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            refreshInterval: 0,
            dedupingInterval: 60000, // 1 minute
            revalidateIfStale: false, // Don't revalidate if data is not stale
            shouldRetryOnError: false, // Don't retry on error to prevent cascading requests
            errorRetryCount: 0, // No automatic retries
            focusThrottleInterval: 60000, // Throttle focus revalidation
          }}>
            <UserProvider>
              <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                {children}
                <AccountButton />
              </ThemeProvider>
            </UserProvider>
          </SWRConfig>
        </Suspense>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
