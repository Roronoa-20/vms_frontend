import Navbar from "@/src/components/molecules/navbar";
import Sidebar from "@/src/components/molecules/sidebar";
import { AuthProvider } from "../../context/AuthContext";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <div className="fixed inset-0 w-full flex overflow-hidden bg-[#F4F4F6]">
        <div className="hidden md:flex h-full">
          <Sidebar />
        </div>
        <div className="w-full h-full overflow-y-auto overflow-x-hidden">
          <Navbar />
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
