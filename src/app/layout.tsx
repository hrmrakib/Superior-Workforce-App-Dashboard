import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/redux/features/Providers";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import AppInitializer from "@/components/AppInitializer/AppInitializer";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
    <html
      lang='en'
      className={cn("h-full", inter.variable, "font-sans", geist.variable)}
    >
      <body className='h-full antialiased'>
        <Providers>
          <AppInitializer>
            <Toaster position='top-right' />
            {children}
          </AppInitializer>
        </Providers>
      </body>
    </html>
  );
}
