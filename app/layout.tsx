import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Credential Chain - Blockchain Certificate Verification',
  description: 'Secure, verifiable digital credentials powered by blockchain and AI-driven fraud detection',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} bg-background text-foreground`}>
        {children}
      </body>
    </html>
  )
}
