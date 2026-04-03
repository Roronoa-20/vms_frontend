// import type { Metadata } from "next";
// import "./globals.css";

// export const metadata: Metadata = {
//   title: "VMS",
//   description: "Vendor Management System",
//   generator: "v0.dev",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Suspense } from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VMS",
  description: "Vendor Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <Suspense>
        <ClientLayout>{children}</ClientLayout>
        </Suspense>
      </body>
    </html>
  );
}
