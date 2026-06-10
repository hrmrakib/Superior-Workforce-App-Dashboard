import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/redux/features/Providers";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Superior Workforce — Admin Dashboard",
  description:
    "Manage users, jobs, notifications and more from the Superior Workforce admin panel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${inter.variable} h-full`}>
      <body className='h-full antialiased'>
        <Providers>
          <Toaster position='top-right' />
          {children}
        </Providers>
      </body>
    </html>
  );
}
