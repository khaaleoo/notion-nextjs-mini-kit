import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@components/templates/Layouts/LayoutWrapper";
import { rootDomain } from "@helpers/config";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Notion NextJs",
  description: "Notion NextJs is a starter template for Notion API with NextJs",
  icons: [
    {
      url: rootDomain + "/favicon.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
