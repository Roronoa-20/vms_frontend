"use client"
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { Tlogin } from "@/src/types/types";
import { AxiosResponse } from "axios";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormEvent } from "react";
import Cookies from "js-cookie";
import EmailDialog from "../molecules/forgotPassword/EmailDialog";
import OtpDialog from "../molecules/forgotPassword/OtpDialog";
import PasswordDialog from "../molecules/forgotPassword/PasswordDialog";
import { AuthProvider, useAuth } from "../../context/AuthContext";
import { TMultipleVendorCode, useMultipleVendorCodeStore } from "@/src/store/MultipleVendorCodeStore";
export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState<Tlogin>();
  const [isEmailIdDialog, setIsEmailIdDialog] = useState<boolean>(false);
  const [isOtpDialog, setIsOtpDialog] = useState<boolean>(false);
  const [email, setEmail] = useState<string | "">("")
  const [isPasswordDialog, setIsPasswordDialog] = useState<boolean>(false);
  const [authorization, setAuthorization] = useState<string | "">("")
  const { setAuthData } = useAuth();
  const { MultipleVendorCode, addMultipleVendorCode, reset, resetVendorCode } = useMultipleVendorCodeStore();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = API_END_POINTS?.login;
    // const response: AxiosResponse = await requestWrapper({
    //   url: url,
    //   method: "POST",
    //   headers:{"Content-Type":"application/json"},
    //   data: { data: form },
    // });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data: form }),
      credentials: "include"
    });

    if (response.status == 401) {
      alert("username or password is incorrect");
      return;
    }

    if (response.status == 200) {
      const data = await response.json();
      const savedRole = Cookies.get("role");
      const savedName = Cookies.get("full_name");
      const savedid = Cookies.get("user_id");
      // const designation = response?.data?.message?.employee?.designation;
      const designation = data?.message?.employee?.designation as string;
      const designationVendor = data?.message?.designation as string;
      if (designationVendor) {
        reset();
        resetVendorCode();
        data?.message?.vendor_codes?.map((item: TMultipleVendorCode) => (
          addMultipleVendorCode(item)
        ))
      }
      Cookies.set("designation", designation || designationVendor);
      setAuthData(savedRole, savedName, savedid, designation || designationVendor);
      if (designationVendor) {
        router.push("/vendor-dashboard");
        return
      }
      router.push("/dashboard");
    }
  };

  const handlefieldChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }) as Tlogin);
  };

  const handlePasswordEye = () => {
    const pwd = document.getElementById("password") as HTMLInputElement | null;
    if (pwd) {
      pwd.type = pwd.type == "password" ? "test" : "password";
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="space-y-6 px-[50px] pt-4">
          <div>
            <input
              id="email"
              name="usr"
              type="email"
              autoComplete="email"
              placeholder="Username"
              onChange={(e) => {
                handlefieldChange(e);
              }}
              required
              className="rounded-[8px] border border-[#D9D9D9] shadow-sm placeholder: p-3 text-[14px] text-[#03111F] font-normal leading-[19.36px] pl-3 outline-blue-500 w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between"></div>
            <div className="relative mt-2">
              <input
                id="password"
                name="pwd"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                onChange={(e) => {
                  handlefieldChange(e);
                }}
                required
                className="rounded-[8px] border border-[#D9D9D9] shadow-sm placeholder: p-3 text-[14px] text-[#03111F] font-normal leading-[19.36px] pl-3 outline-blue-500 w-full"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"
                aria-label="Toggle password visibility"
              >
                <Eye className="h-5 w-5" onClick={() => handlePasswordEye()} />
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#5291CD] text-[#FFFFFF] text-[18px] font-semibold px-8 py-2 rounded-[10px]"
            >
              Login
            </button>
          </div>
          <div className="flex justify-center">
            <h1
              onClick={() => { setIsEmailIdDialog(prev => !prev) }}
              className="text-sm font-medium hover:text-blue-500 text-[#5291CD] cursor-pointer"
            >
              Forgot Password?
            </h1>
          </div>
        </div>
      </form>
      {
        isEmailIdDialog &&
        <EmailDialog setIsEmailDialog={setIsEmailIdDialog} setIsOtpDialog={setIsOtpDialog} setUsr={setEmail} setAuthorization={setAuthorization} />
      }
      {
        isOtpDialog &&
        <OtpDialog setIsPasswordDialog={setIsPasswordDialog} setIsOtpDialog={setIsOtpDialog} authorization={authorization} user={email} />
      }
      {
        isPasswordDialog &&
        <PasswordDialog setIsPasswordDialog={setIsPasswordDialog} email={email} authorization={authorization} />
      }
    </>
  );
}
