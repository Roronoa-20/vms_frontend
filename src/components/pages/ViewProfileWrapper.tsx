"use client";
import React, { useEffect, useState } from "react";
import ViewProfile from "./ViewProfile";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { VendorCompanyResponse, MultipleCompanyData } from "@/src/types/VendorsViewProfiletypes";
import { useAuth } from "@/src/context/AuthContext";
import { usePathname } from "next/navigation";

const ViewProfileWrapper = () => {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<MultipleCompanyData[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<MultipleCompanyData | null>(null);
  const [vendorOnboardingId, setVendorOnboardingId] = useState<string | null>(null);
  const { user_email } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    localStorage.clear();
    setSelectedCompany(null);
    setVendorOnboardingId(null);
  }, [pathname]);

  useEffect(() => {
    const storedCompany = localStorage.getItem("selectedCompany");
    if (storedCompany) {
      setSelectedCompany(JSON.parse(storedCompany));
    }
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await requestWrapper({
          url: `${API_END_POINTS.getvendorsmerilcompany}?v_primary_mail=${user_email}`,
          method: "GET",
        });
        const res: VendorCompanyResponse = response.data;
        if (res?.message?.success) {
          const data = res.message.data;
          setCompanies(data);

          if (data.length === 1 && !selectedCompany) {
            setSelectedCompany(data[0]);
            localStorage.setItem("selectedCompany", JSON.stringify(data[0]));
          }
        }
      } catch (err) {
        console.error("Error fetching companies", err);
      } finally {
        setLoading(false);
      }
    };

    if (user_email) {
      fetchCompanies();
    }
  }, [user_email]);

  useEffect(() => {
    const fetchOnboardingId = async () => {
      if (!selectedCompany) return;

      try {
        const response = await requestWrapper({
          url: `${API_END_POINTS.getvendorsonboardingidandstatus}?v_id=${selectedCompany.parent}&company=${selectedCompany.company_name}`,
          method: "GET",
        });

        const data = response?.data?.message?.data || [];
        const approved = data.find((item: any) => item.onboarding_form_status === "Approved");

        if (approved) {
          setVendorOnboardingId(approved.name);
        } else {
          setVendorOnboardingId(null);
        }
      } catch (err) {
        console.error("Error fetching onboarding ID", err);
      }
    };

    fetchOnboardingId();
  }, [selectedCompany]);

  const handleCompanySelect = (company: MultipleCompanyData) => {
    setSelectedCompany(company);
    localStorage.setItem("selectedCompany", JSON.stringify(company));
  };

  const handleChangeCompany = () => {
    localStorage.removeItem("selectedCompany");
    setSelectedCompany(null);
    setVendorOnboardingId(null);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500" />
      </div>
    );
  }

  if (!selectedCompany) {
    return (
      <div className="relative h-screen">
        {/* Glassy Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 to-gray-900/70 backdrop-blur-xl z-10" />

        {/* Modal */}
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-[420px] border border-gray-100 text-center
                     opacity-0 translate-y-6 animate-[fadeUp_0.6s_ease-out_forwards]"
          >
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
              Welcome Vendor
            </h2>
            <p className="text-gray-600 mb-8 text-sm">
              Please select your registered company to continue
            </p>

            <ul className="space-y-4">
              {companies.map((company) => (
                <li key={company.name}>
                  <button
                    onClick={() => handleCompanySelect(company)}
                    className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 
                             text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 
                             transition-all duration-200"
                  >
                    {company.company_master_data.company_name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!vendorOnboardingId) {
    return (
      <div className="h-screen flex items-center justify-center text-red-600 font-semibold text-lg">
        No approved onboarding found for this company.
      </div>
    );
  }

  return (
    <ViewProfile
      vendor_onboarding={vendorOnboardingId}
      refno={selectedCompany.parent}
      company={selectedCompany.company_name}
      tabtype="Company Detail"
      onChangeCompany={handleChangeCompany}
    />
  );
};

export default ViewProfileWrapper;
