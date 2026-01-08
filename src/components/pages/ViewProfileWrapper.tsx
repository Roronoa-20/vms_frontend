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

  // Reset on path change
  useEffect(() => {
    localStorage.clear();
    setSelectedCompany(null);
    setVendorOnboardingId(null);
  }, [pathname]);

  // Load selected company from localStorage
  useEffect(() => {
    const storedCompany = localStorage.getItem("selectedCompany");
    if (storedCompany) setSelectedCompany(JSON.parse(storedCompany));
  }, []);

  // Fetch companies
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

          // Auto-select if only one
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

    if (user_email) fetchCompanies();
  }, [user_email]);

  // Fetch onboarding ID
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
        setVendorOnboardingId(approved ? approved.name : null);
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

  // Loading
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500" />
      </div>
    );
  }

  // Company selection modal
  if (!selectedCompany) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div
          className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 w-11/12 max-w-4xl max-h-[80vh] overflow-y-auto
                     flex flex-col items-center animate-[fadeUp_0.6s_ease-out_forwards]"
        >
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4 text-center">
            Welcome Vendor
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Please select your registered company to continue
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {companies.map((company) => (
              <button
                key={company.name}
                onClick={() => handleCompanySelect(company)}
                className="w-full h-24 bg-gradient-to-r from-blue-500 to-indigo-600
                           text-white font-semibold rounded-2xl shadow-lg
                           hover:shadow-xl transform hover:scale-105
                           transition-all duration-200 flex items-center justify-center text-center p-4"
              >
                {company.company_master_data.company_name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // No approved onboarding
  if (!vendorOnboardingId) {
    return (
      <div className="h-screen flex items-center justify-center text-red-600 font-semibold text-lg">
        No approved onboarding found for this company.
      </div>
    );
  }

  // Render profile
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
