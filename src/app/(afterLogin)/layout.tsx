import Navbar from "@/src/components/molecules/navbar";
import Sidebar from "@/src/components/molecules/sidebar";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-full flex overflow-y-hidden">
      <Sidebar />
      <div className="w-full overflow-y-scroll">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
