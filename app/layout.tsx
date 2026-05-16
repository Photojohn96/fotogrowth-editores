import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Editores RE · FotoGrowth — Encuentra editores de video inmobiliario',
  description: 'Directorio curado de editores de video para fotografía inmobiliaria. Filtrá por idioma, precio y tipo de servicio. Por FotoGrowth.',
  openGraph: {
    title: 'Editores RE · FotoGrowth',
    description: 'Directorio curado de editores de video inmobiliario en español.',
    type: 'website'
  },
  twitter: { card: 'summary_large_image' }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
