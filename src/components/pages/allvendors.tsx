"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vendor } from "@/src/types/allvendorstypes";
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
      pagination: {
        current_page: number;
        total_pages: number;
        total_records: number;
      };
    };
  };
}

const AllVendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
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
  const [defaultTab, setDefaultTab] = useState<string>("1000");
  const [activeVendorTab, setActiveVendorTab] = useState<"vms_registered" | "imported_vendors" | "both_registered_and_import">("vms_registered");
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_records: 0,
  });
  const [tablePage, setTablePage] = useState(1);
  const pageSize = 10;

  /* ================= FETCH ANALYTICS ================= */

  useEffect(() => {
    const fetchCompanyWiseAnalytics = async () => {
      try {
        const res: AxiosResponse<any> = await requestWrapper({
          url: API_END_POINTS.companyWiseVendorAnalytics,
          method: "GET",
        });

        const responseData = res.data.message.data;

        setCompanyAnalytics(responseData.company_analytics || []);

        setAnalytics({
          total_vendors: responseData.overall_totals.total_vendors || 0,
          vms_registered: responseData.overall_totals.vms_registered_only || 0,
          imported_vendors: responseData.overall_totals.imported_only || 0,
          both_imported_and_vms_registered: responseData.overall_totals.both_imported_and_registered || 0,
          total_vc_code: responseData.Vendor_Code_Count || 0,
        });
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };

    fetchCompanyWiseAnalytics();
  }, []);

  /* ================= FETCH VENDORS ================= */

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);

      try {
        const params: any = {
          page: tablePage,
          page_size: pageSize
        };

        if (defaultTab) {
          params.company_name = defaultTab;
        }

        if (activeVendorTab === "vms_registered") {
          params.onboarding_form = "Approved";
          params.created_from_registration = 1;
          params.via_data_import = 0;
        }

        if (activeVendorTab === "imported_vendors") {
          params.via_data_import = 1;
          params.created_from_registration = 0;
        }

        if (activeVendorTab === "both_registered_and_import") {
          params.created_from_registration = 1;
          params.via_data_import = 1;
        }
        console.log("Sending params:", params);
        const res: AxiosResponse<ApiResponse> = await requestWrapper({
          url: API_END_POINTS.allvendorsdetails,
          method: "GET",
          params,
        });
        console.log("Fetched Vendors:", res.data.message.data);
        setVendors(res.data.message.data.vendor_data_list || []);
        setPagination(res.data.message.data.pagination);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [activeVendorTab, defaultTab, tablePage]);

  /* ================= UI SEARCH FILTER ================= */

  const filteredVendors = useMemo(() => {
    return vendors
      .filter((vendor) => {
        if (searchTerm && !vendor.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }

        if (searchCountry && !vendor.bank_details?.currency?.toLowerCase().includes(searchCountry.toLowerCase())) {
          return false;
        }

        return true;
      })
      .map((vendor) => vendor);
  }, [vendors, defaultTab, searchTerm, searchCountry]);

  useEffect(() => {
    setTablePage(1);
  }, [defaultTab, activeVendorTab]);

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 mt-2">
        <StatCard
          icon={<Users className="h-6 w-6 text-blue-600" />}
          label="Total Vendors"
          value={analytics.total_vendors}
        />
        <StatCard
          icon={<CheckCircle className="h-6 w-6 text-green-600" />}
          label="VMS Registered"
          value={analytics.vms_registered}
          active={activeVendorTab === "vms_registered"}
          onClick={() => setActiveVendorTab("vms_registered")}
        />
        <StatCard
          icon={<Upload className="h-6 w-6 text-indigo-600" />}
          label="Imported Vendors"
          value={analytics.imported_vendors}
          active={activeVendorTab === "imported_vendors"}
          onClick={() => setActiveVendorTab("imported_vendors")}
        />
        <StatCard
          icon={<Upload className="h-6 w-6 text-indigo-600" />}
          label="Registered & Imported"
          value={analytics.both_imported_and_vms_registered}
          active={activeVendorTab === "both_registered_and_import"}
          onClick={() =>
            setActiveVendorTab("both_registered_and_import")
          }
        />
        {/* <StatCard
          icon={<IdCard className="h-6 w-6 text-indigo-600" />}
          label="Vendor Code Count"
          value={analytics.total_vc_code}
        /> */}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow p-3 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Search Vendors
        </h2>
        <div className="flex flex-wrap gap-4">
          <Input
            placeholder="Search by vendor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3"
          />
          <Input
            placeholder="Search by country..."
            value={searchCountry}
            onChange={(e) => setSearchCountry(e.target.value)}
            className="w-full md:w-1/3"
          />
        </div>
      </div>

      {/* Company Tabs */}
      <div className="bg-white rounded-2xl shadow p-4 mb-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">
          Meril Verticals
        </h2>

        <div className="flex flex-wrap gap-2">
          {[...companyAnalytics]
            .sort((a, b) => Number(a.company_id) - Number(b.company_id))
            .map((company) => {
              const isActive = defaultTab === company.company_id;

              return (
                <button
                  key={company.company_id}
                  onClick={() => setDefaultTab(company.company_id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border
              inline-flex items-center gap-1
              ${isActive
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                    }
            `}
                >
                  <span className="font-semibold">
                    {company.company_id}
                  </span>
                  <span className="opacity-70">
                    {company.company_short_form}
                  </span>
                </button>
              );
            })}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-700">
          {activeVendorTab === "vms_registered" && "VMS Registered Vendors"}
          {activeVendorTab === "imported_vendors" && "Imported Vendors"}
          {activeVendorTab === "both_registered_and_import" && "Registered & Imported Vendors"}
        </h2>

        <span className="text-sm text-gray-500">
          {pagination.total_records} records
        </span>
      </div>


      {/* Table */}
      <div className="bg-white rounded-2xl shadow p-3 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-sm font-medium text-gray-600 animate-pulse">
              Loading vendors...
            </div>
          </div>
        )}

        <VendorTable
          vendors={filteredVendors}
          activeTab={defaultTab}
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          totalRecords={pagination.total_records}
          setCurrentPage={setTablePage}
          pageSize={pageSize}
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
