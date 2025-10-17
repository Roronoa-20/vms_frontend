import Logo from "../atoms/VmsLoginLogo";
import LoginForm from "../templates/login-form";
import Slider from "../molecules/slider";
import Image from "next/image";
import { AuthProvider } from "@/src/context/AuthContext";
export default function LoginPage() {
  return (
    <AuthProvider>

    <div className="flex min-h-screen">
      {/* banner section */}
      <div className="md:w-[60%]  relative">
        <Slider />
      </div>
      {/* login form */}
      <div className="flex flex-col py-20 md:w-[40%] w-full">
        {/* logo */}
        <div className="w-full flex justify-center">
          <Logo />
        </div>
        <h1 className="pt-5 text-center text-[#5291CD] text-[20px] leading-5">
          Welcome to
        </h1>
        <h1 className="text-[#5291CD] leading-[40px] text-[26px] font-semibold text-center pt-4">
          Vendor Management System (VMS)
        </h1>
        <LoginForm />
      </div>
    </div>
    </AuthProvider>
  );
}
