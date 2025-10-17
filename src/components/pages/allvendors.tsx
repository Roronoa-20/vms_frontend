"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      vendor_data_list: Vendor[];
      pagination: { current_page: number; total_pages: number; total_records: number };
      analytics: {
        total_vendors: number;
        vms_registered: number;
        imported_vendors: number;
        total_vc_code: number;
        both_imported_and_vms_registered: number;
      };
      company_analytics: { company_wise_analytics: any[] };
    };
  };
}

const AllVendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [bothRegisteredImportedVendors, setBothRegisteredImportedVendors] = useState<Vendor[]>([]);
  const [companyAnalytics, setCompanyAnalytics] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({
    total_vendors: 0,
    vms_registered: 0,
    imported_vendors: 0,
    total_vc_code: 0,
    both_imported_and_vms_registered: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [defaultTab, setDefaultTab] = useState<string>("");
  const [activeVendorTab, setActiveVendorTab] = useState<"vms_registered" | "imported_vendors" | "both_registered_and_import">("vms_registered");
  const [tablePage, setTablePage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        if (activeVendorTab === "both_registered_and_import") {
          // Special API call for both registered and imported
          const res: AxiosResponse<ApiResponse> = await requestWrapper({
            url: API_END_POINTS.allvendorsdetails,
            method: "GET",
            params: {
              page: 1,
              page_size: 1000,
              onboarding_form: "Approved",
              via_data_import: 1,
              search_filters: JSON.stringify({ created_from_registration: 1 }),
              company_name: defaultTab || undefined,
            },
          });
          setBothRegisteredImportedVendors(res.data.message.data.vendor_data_list || []);
        } else {
          // Single API call for vms_registered or imported_vendors
          const params: any = { page: 1, page_size: 1000 };

          if (activeVendorTab === "vms_registered") {
            params.onboarding_form = "Approved";
            params.via_data_import = 0;
          } else if (activeVendorTab === "imported_vendors") {
            // Only send via_data_import = 1
            params.via_data_import = 1;
          }

          const res: AxiosResponse<ApiResponse> = await requestWrapper({
            url: API_END_POINTS.allvendorsdetails,
            method: "GET",
            params,
          });

          // Filter imported_vendors to include only vendors with the selected company and via_import = 1
          let vendorList = res.data.message.data.vendor_data_list || [];
          if (activeVendorTab === "imported_vendors" && defaultTab) {
            vendorList = vendorList.filter(vendor =>
              (vendor.company_data || []).some(cd => cd.company_name === defaultTab && cd.via_import === 1)
            );
          }

          setVendors(vendorList);
          setAnalytics(res.data.message.data.analytics || analytics);
          setCompanyAnalytics(res.data.message.data.company_analytics?.company_wise_analytics || []);
        }

        // Set default tab if not set
        if (!defaultTab && companyAnalytics?.[0]) {
          setDefaultTab(companyAnalytics[0].company_id);
        }
      } catch (err) {
        console.error("Error fetching vendors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [activeVendorTab, defaultTab]);

  const filteredVendors = useMemo(() => {
    const source = activeVendorTab === "both_registered_and_import"
      ? bothRegisteredImportedVendors
      : vendors;

    return source
      .filter(vendor => {
        if (searchTerm && !vendor.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()))
          return false;
        if (searchCountry && !(vendor.country?.toLowerCase() || "").includes(searchCountry.toLowerCase()))
          return false;
        return true;
      })
      .map(vendor => {
        const onbRecord = (vendor.onboarding_records || []).find(
          rec =>
            rec.onboarding_company_name === defaultTab &&
            rec.onboarding_form?.toLowerCase() === "approved"
        );

        const companyRecord = (vendor.company_data || []).find(
          rec => rec.company_name === defaultTab && rec.via_import === 1
        );

        return {
          ...vendor,
          onboarding: onbRecord || null,
          company: companyRecord || null,
        } as VendorRow;
      });
  }, [vendors, bothRegisteredImportedVendors, activeVendorTab, defaultTab, searchTerm, searchCountry]);

  useEffect(() => setTablePage(1), [filteredVendors]);

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6 mt-2">
        <StatCard icon={<Users className="h-6 w-6 text-blue-600" />} label="Total Vendors" value={analytics.total_vendors} />
        <StatCard icon={<CheckCircle className="h-6 w-6 text-green-600" />} label="VMS Registered" value={analytics.vms_registered} active={activeVendorTab === "vms_registered"} onClick={() => setActiveVendorTab("vms_registered")} />
        <StatCard icon={<Upload className="h-6 w-6 text-indigo-600" />} label="Imported Vendors" value={analytics.imported_vendors} active={activeVendorTab === "imported_vendors"} onClick={() => setActiveVendorTab("imported_vendors")} />
        <StatCard icon={<Upload className="h-6 w-6 text-indigo-600" />} label="Registered & Imported" value={analytics.both_imported_and_vms_registered} active={activeVendorTab === "both_registered_and_import"} onClick={() => setActiveVendorTab("both_registered_and_import")} />
        <StatCard icon={<IdCard className="h-6 w-6 text-indigo-600" />} label="Vendor Code Count" value={analytics.total_vc_code} />
      </div>

      {/* --- Search --- */}
      <div className="bg-white rounded-2xl shadow p-3 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Search Vendors</h2>
        <div className="flex flex-wrap gap-4">
          <Input placeholder="Search by vendor name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full md:w-1/3" />
          <Input placeholder="Search by country..." value={searchCountry} onChange={e => setSearchCountry(e.target.value)} className="w-full md:w-1/3" />
        </div>
      </div>

      {/* --- Company Tabs --- */}
      <div className="bg-white rounded-2xl shadow h-40 p-3 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Meril Verticals</h2>
        <Tabs value={defaultTab} onValueChange={setDefaultTab} className="w-full">
          <TabsList className="flex flex-wrap gap-3 justify-start items-start p-0 border-0">
            {companyAnalytics.map(company => (
              <TabsTrigger key={company.company_id} value={company.company_id} onClick={() => setDefaultTab(company.company_id)}>
                {company.company_id} - {company.company_short_form}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* --- Vendor Table --- */}
      <div className="bg-white rounded-2xl shadow p-3">
        <VendorTable
          vendors={filteredVendors}
          activeTab={defaultTab}
          currentPage={tablePage}
          setCurrentPage={setTablePage}
          pageSize={pageSize}
          totalPages={Math.ceil(filteredVendors.length / pageSize)}
          totalRecords={filteredVendors.length}
        />
      </div>
    </div>
  );
};

export default AllVendors;

// --- Helper StatCard Component ---
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  active?: boolean;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, active, onClick }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer bg-white rounded-2xl shadow-sm p-1 flex items-center gap-4 border-l-4 border-blue-500 transition ${active ? "ring-2 ring-blue-500" : ""}`}
  >
    <div className="bg-indigo-100 p-3 rounded-xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className="text-xl font-bold text-gray-800">
        <CountUp end={value} duration={1.5} separator="," />
      </h3>
    </div>
  </div>
);
