import { ThemeProvider } from '@/components/theme-provider'
import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import TopBar from '@/components/Shared/Topbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Monoli',
  description: 'All in one application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={['dark', 'light', 'blue', 'orange', 'stone', 'system']}
        >
          <TopBar/>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
