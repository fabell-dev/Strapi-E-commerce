import type { Metadata } from "next";
import "./globals.css";
import { getPageInfo } from "@/lib/Strapi/Data/page-info";

const { Page_Title, Page_Description, logo } = await getPageInfo();

export const metadata: Metadata = {
  title: `${Page_Title}`,
  description: `${Page_Description}`,
  icons: {
    icon: logo,
    apple: logo, // Para Apple devices
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
