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
    <html lang="en">
      <body>
        <Suspense>
        <ClientLayout>{children}</ClientLayout>
        </Suspense>
      </body>
    </html>
  );
}
