import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import BootstrapClient from '@/components/BootstrapClient'

export const metadata: Metadata = {
  title: 'InventoryPro ERP - Inventory & Sales Management',
  description: 'Complete ERP solution for inventory, sales, and purchase management',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <BootstrapClient />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
