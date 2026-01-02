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
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const url = API_END_POINTS?.login;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: form }),
        credentials: "include"
      });

      if (response.status === 401) {
        alert("username or password is incorrect");
        setIsLoading(false);
        return;
      }

      if (response.status == 200) {
        const data = await response.json();
        const roles = data?.message?.employee?.roles || [];
        Cookies.set("role", JSON.stringify(roles));

        const savedRole = Cookies.get("role");
        const savedName = Cookies.get("full_name");
        const savedid = Cookies.get("user_id");
        const designation = data?.message?.employee?.designation as string;
        const designationVendor = data?.message?.designation as string;
        const VendorASA = data?.message?.asa_reqd as string;
        const VendorRefNo = data?.message?.ref_no as string;
        console.log("Vendor Ref---->", VendorRefNo);
        if (designationVendor) {
          reset();
          resetVendorCode();
          data?.message?.vendor_codes?.map((item: TMultipleVendorCode) => (
            addMultipleVendorCode(item)
          ))
        }
        Cookies.set("designation", designation || designationVendor);
        Cookies.set("VendorRef", VendorRefNo);
        Cookies.set("VendorASA", VendorASA);
        console.log("Checking the saved role----->", savedRole)
        setAuthData(savedRole, savedName, savedid, designation || designationVendor, VendorRefNo, VendorASA);
        if (designationVendor) {
          router.push("/vendor-dashboard");
          return
        }
        if (designation === "QA Team" || designation === "QA Head") {
          router.push("/qa-dashboard");
          return;
        }
        if (designation === "Super Head") {
          router.push("/head-dashboard");
          return;
        }
        if (designation === "Finance" || designation === "Finance Head") {
          router.push("/finance-dashboard");
          return;
        }
        if (designation === "Material User" || designation === "Material CP") {
          router.push("/material-onboarding-dashboard");
          return;
        }
        if (designation === "Security") {
          router.push("/gate-entry-dashboard");
          return;
        }
        if (designation === "Category Master") {
          router.push("/category-master-dashboard");
          return;
        }
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Try again.");
    }finally{
      setIsLoading(false);
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
              disabled={isLoading}
              className={`flex items-center justify-center gap-3 px-8 py-2 rounded-[10px] text-[18px] font-semibold transition-all ${isLoading ? "bg-[#5291CD] cursor-not-allowed text-white" : "bg-[#5291CD] text-white"}`}
            >
              {isLoading && (
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isLoading ? "Logging in…" : "Login"}
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
