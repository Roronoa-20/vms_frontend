"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vendor, VendorRow } from "@/src/types/allvendorstypes";
import VendorTable from "@/src/components/templates/allvendorstable";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { Input } from "@/components/ui/input";
import { Users, CheckCircle, Upload, IdCard } from "lucide-react";
import CountUp from "react-countup";

interface ApiResponse {
  message: {
    success: boolean;
    data: {
      vendors: Vendor[];
      pagination: { current_page: number; total_pages: number; total_records: number };
      analytics: { total_vendors: number; vms_registered: number; imported_vendors: number; total_vc_code: number };
      company_analytics: { company_wise_analytics: any[] };
    };
  };
}

const AllVendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchedVendors, setSearchedVendors] = useState<Vendor[]>([]);
  const [companyAnalytics, setCompanyAnalytics] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({ total_vendors: 0, vms_registered: 0, imported_vendors: 0, total_vc_code: 0 });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [defaultTab, setDefaultTab] = useState<string>("");
  const [currentSlide, setCurrentSlide] = useState(1);
  const [activeVendorTab, setActiveVendorTab] = useState<"vms_registered" | "imported_vendors">("vms_registered");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 1000;
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const params: any = { page: currentPage, page_size: pageSize };

        if (activeVendorTab === "vms_registered") params.onboarding_form_status = "Approved";
        else if (activeVendorTab === "imported_vendors") params.via_data_import = 1;

        if (defaultTab) params.company_id = defaultTab;

        const res: AxiosResponse<ApiResponse> = await requestWrapper({
          url: API_END_POINTS.allvendorsdetails,
          method: "GET",
          params,
        });

        const apiData = res.data.message.data;

        setAnalytics(apiData.analytics || analytics);
        setCompanyAnalytics(apiData.company_analytics?.company_wise_analytics || []);

        setVendors(apiData.vendors || []);
        setSearchedVendors(apiData.vendors || []);
        setTotalPages(apiData.pagination?.total_pages || 1);
        setTotalRecords(apiData.pagination?.total_records || 0);

        if (!defaultTab && apiData.company_analytics?.company_wise_analytics?.[0]) {
          setDefaultTab(apiData.company_analytics.company_wise_analytics[0].company_id);
        }
      } catch (err) {
        console.error("Error fetching vendors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [activeVendorTab, currentPage, defaultTab]);



  // ---- SEARCH LOGIC ----
  useEffect(() => {
    if (!searchTerm && !searchCountry) return setSearchedVendors(vendors);

    const results = vendors.filter(vendor => {
      const matchesName = searchTerm ? vendor.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const matchesCountry = searchCountry ? (vendor.country?.toLowerCase() || "").includes(searchCountry.toLowerCase()) : true;
      return matchesName && matchesCountry;
    });

    setSearchedVendors(results);
  }, [searchTerm, searchCountry, vendors]);

  useEffect(() => {
    console.log("Vendors from API:", vendors);
  }, [vendors]);

  // ---- MEMOIZED FILTERED VENDORS PER COMPANY & TAB ----
  const filteredVendorsByCompany = useMemo(() => {
    if (!defaultTab || !searchedVendors.length) return [];

    return searchedVendors
      .map(vendor => {
        if (activeVendorTab === "vms_registered") {
          const onbRecord = (vendor.vendor_onb_records || []).find(
            rec => rec.onboarding_company_name === defaultTab && rec.onboarding_form_status?.toLowerCase() === "approved"
          );
          if (onbRecord) return { ...vendor, onboarding: onbRecord } as VendorRow;
        } else if (activeVendorTab === "imported_vendors") {
          const companyRecord = (vendor.multiple_company_data || []).find(
            rec => rec.company_id === defaultTab && rec.via_import === 1
          );
          if (companyRecord) return { ...vendor, company: companyRecord } as VendorRow;
        }
        return null;
      })
      .filter(Boolean) as VendorRow[];
  }, [searchedVendors, activeVendorTab, defaultTab]);








  return (
    <div className="min-h-screen bg-gray-50 p-2">
      {/* --- Stats --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-xl"><Users className="h-6 w-6 text-blue-600" /></div>
          <div>
            <p className="text-sm text-gray-500">Total Vendors</p>
            <h3 className="text-xl font-bold text-gray-800">
              <CountUp end={analytics.total_vendors} duration={1.5} separator="," />
            </h3>
          </div>
        </div>

        <div onClick={() => setActiveVendorTab("vms_registered")} className={`cursor-pointer bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 transition ${activeVendorTab === "vms_registered" ? "ring-2 ring-blue-500" : ""}`}>
          <div className="bg-green-100 p-3 rounded-xl"><CheckCircle className="h-6 w-6 text-green-600" /></div>
          <div>
            <p className="text-sm text-gray-500">VMS Registered</p>
            <h3 className="text-xl font-bold text-gray-800">
              <CountUp end={analytics.vms_registered} duration={1.5} separator="," />
            </h3>
          </div>
        </div>

        <div onClick={() => setActiveVendorTab("imported_vendors")} className={`cursor-pointer bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 transition ${activeVendorTab === "imported_vendors" ? "ring-2 ring-blue-500" : ""}`}>
          <div className="bg-indigo-100 p-3 rounded-xl"><Upload className="h-6 w-6 text-indigo-600" /></div>
          <div>
            <p className="text-sm text-gray-500">Imported Vendors</p>
            <h3 className="text-xl font-bold text-gray-800">
              <CountUp end={analytics.imported_vendors} duration={1.5} separator="," />
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-xl"><IdCard className="h-6 w-6 text-indigo-600" /></div>
          <div>
            <p className="text-sm text-gray-500">Vendor Code Count</p>
            <h3 className="text-xl font-bold text-gray-800">
              <CountUp end={analytics.total_vc_code} duration={1.5} separator="," />
            </h3>
          </div>
        </div>
      </div>

      {/* --- Search --- */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Search Vendors</h2>
        <div className="flex flex-wrap gap-4">
          <Input type="text" placeholder="Search by vendor name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full md:w-1/3 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
          <Input type="text" placeholder="Search by country..." value={searchCountry} onChange={e => setSearchCountry(e.target.value)} className="w-full md:w-1/3 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* --- Company Tabs --- */}
      <div className="bg-white rounded-2xl shadow-sm h-40 p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Meril Verticals</h2>
        <Tabs value={defaultTab} onValueChange={setDefaultTab} className="w-full">
          <TabsList className="flex flex-wrap gap-3 justify-start items-start w-full bg-transparent p-0 border-0">
            {companyAnalytics.map((company, index) => {
              const totalCompanies = companyAnalytics.length;
              const paddingClass = totalCompanies > 15 ? "px-2 py-1 text-sm" : totalCompanies > 10 ? "px-3 py-1 text-sm" : "px-4 py-2 text-sm";

              return (
                <TabsTrigger
                  key={company.company_id}
                  value={company.company_id}
                  onClick={() => setCurrentSlide(index + 1)}
                  className={`flex items-center gap-2 border rounded-full font-medium transition ${paddingClass} ${currentSlide === index + 1 ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-gray-50 text-gray-700 hover:bg-blue-50 border-gray-300"}`}
                >
                  {company.company_id} - {company.company_short_form}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* --- Vendor Table --- */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <VendorTable
          vendors={filteredVendorsByCompany.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          activeTab={defaultTab}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          totalRecords={totalRecords}
        />
      </div>
    </div>
  );
};

export default AllVendors;