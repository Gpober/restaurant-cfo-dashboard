import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'I AM CFO Dashboard',
  description: 'Live financial insights for property operators',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Load the manually compiled Tailwind CSS */}
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body className={inter.className}>
        <nav className="bg-white shadow px-6 py-4 flex space-x-4">
          <Link href="/">Dashboard</Link>
          <Link href="/inventory">Inventory</Link>
          <Link href="/financials">Financials</Link>
          <Link href="/payroll">Payroll</Link>
          <Link href="/statements">Statements</Link>
        </nav>
        <main className="px-6 py-4">{children}</main>
      </body>
    </html>
  );
}
