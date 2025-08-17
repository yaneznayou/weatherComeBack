import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.scss";
import ClientProviders from "@/components/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weather Forecast",
  description: "Weather application for viewing weather in selected cities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ClientProviders>
          <div suppressHydrationWarning={true}>
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
