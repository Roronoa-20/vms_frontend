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
    <div className="h-screen w-full flex overflow-y-hidden">
      <div className="hidden md:flex">
      <Sidebar />
      </div>
      <div className="w-full overflow-y-scroll">
        <Navbar />
        {children}
      </div>
    </div>
    </AuthProvider>
  );
}
