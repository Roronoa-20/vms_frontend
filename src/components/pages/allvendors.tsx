"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
            vendors: Vendor[];
            pagination: any;
            analytics: {
                total_vendors: number;
                vms_registered: number;
                imported_vendors: number;
                total_vc_code: number;
            };
            company_analytics: {
                company_wise_analytics: {
                    company_id: string;
                    company_name: string;
                    company_short_form: string;
                    total_vendors: number;
                    vendors_with_company_code: number;
                }[];
            };
        };
    };
}

const AllVendors = () => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [companyAnalytics, setCompanyAnalytics] = useState<
        {
            company_id: string;
            company_name: string;
            company_short_form: string;
            total_vendors: number;
            vendors_with_company_code: number;
        }[]
    >([]);
    const [analytics, setAnalytics] = useState<{
        total_vendors: number;
        vms_registered: number;
        imported_vendors: number;
        total_vc_code: number;
    }>({
        total_vendors: 0,
        vms_registered: 0,
        imported_vendors: 0,
        total_vc_code: 0,
    });

    const [defaultTab, setDefaultTab] = useState("");
    const [currentSlide, setCurrentSlide] = useState(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCountry, setSearchCountry] = useState("");
    const [searchedVendors, setSearchedVendors] = useState<Vendor[]>([]);
    const [highlightedCompanies, setHighlightedCompanies] = useState<string[]>([]);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                setLoading(true);
                const url = API_END_POINTS?.allvendorsdetails;
                const res: AxiosResponse<ApiResponse> = await requestWrapper({
                    url: url,
                    method: "GET",
                });

                const apiData = res.data.message.data;

                setVendors(apiData?.vendors || []);
                setSearchedVendors(apiData?.vendors || []);
                setCompanyAnalytics(apiData?.company_analytics?.company_wise_analytics || []);
                setAnalytics(apiData?.analytics || { total_vendors: 0, vms_registred: 0, imported_vendors: 0, total_vc_code: 0 });
            } catch (err) {
                console.error("Error fetching vendors:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVendors();
    }, []);

    const applyFilters = (vendorList: Vendor[], name: string, country: string) => {
        return vendorList.filter((vendor) => {
            const matchesName = name
                ? vendor.vendor_name?.toLowerCase().includes(name.toLowerCase())
                : true;
            const matchesCountry = country
                ? (vendor.country?.toLowerCase() || "").includes(country.toLowerCase())
                : true;
            return matchesName && matchesCountry;
        });
    };

    const getVendorsForCompany = (
        vendorList: Vendor[],
        companyId: string,
        vendorsWithCompanyCode: number
    ): { vendors: Vendor[]; count: number } => {
        const filtered = vendorList.filter((vendor) =>
            vendor.multiple_company_data?.some(
                (c) =>
                    c.company_name === companyId &&
                    c.company_vendor_code &&
                    c.company_vendor_code.trim() !== ""
            )
        );

        const count = searchTerm || searchCountry ? filtered.length : vendorsWithCompanyCode;
        return { vendors: filtered, count };
    };

    useEffect(() => {
        if (!searchTerm && !searchCountry) {
            setSearchedVendors(vendors);
            setHighlightedCompanies([]);
            //   setDefaultTab("1000");
            setCurrentSlide(1);
            return;
        }

        const results = applyFilters(vendors, searchTerm, searchCountry);
        setSearchedVendors(results);

        const companiesWithResults = Array.from(
            new Set(
                results.flatMap((vendor) =>
                    vendor.multiple_company_data?.map((c) => c.company_name) || []
                )
            )
        );
        setHighlightedCompanies(companiesWithResults);

        if (companiesWithResults.length > 0) {
            setDefaultTab(companiesWithResults[0]);
        } else {
            //   setDefaultTab("1000");
            setCurrentSlide(1);
        }
    }, [searchTerm, searchCountry, vendors]);

    useEffect(() => {
        if (companyAnalytics.length > 0 && !defaultTab) {
            setDefaultTab(companyAnalytics[0].company_id);
            setCurrentSlide(1);
        }
    }, [companyAnalytics, defaultTab]);


    return (
        <div className="min-h-screen bg-gray-50 p-2">
            {/* 🔹 Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                        <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Vendors</p>
                        {/* <h3 className="text-xl font-bold text-gray-800">{analytics.total_vendors}</h3> */}
                        <h3 className="text-xl font-bold text-gray-800">
                            <CountUp end={analytics.total_vendors} duration={1.5} separator="," />
                        </h3>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-xl">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">VMS Registered</p>
                        {/* <h3 className="text-xl font-bold text-gray-800">{analytics.vms_registered}</h3> */}
                        <h3 className="text-xl font-bold text-gray-800">
                            <CountUp end={analytics.vms_registered} duration={1.5} separator="," />
                        </h3>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
                    <div className="bg-indigo-100 p-3 rounded-xl">
                        <Upload className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Imported Vendors</p>
                        {/* <h3 className="text-xl font-bold text-gray-800">{analytics.imported_vendors}</h3> */}
                        <h3 className="text-xl font-bold text-gray-800">
                            <CountUp end={analytics.imported_vendors} duration={1.5} separator="," />
                        </h3>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
                    <div className="bg-indigo-100 p-3 rounded-xl">
                        <IdCard className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Vendor Code Count</p>
                        <h3 className="text-xl font-bold text-gray-800">
                            <CountUp end={analytics.total_vc_code} duration={1.5} separator="," />
                        </h3>
                    </div>
                </div>

            </div>

            {/* 🔹 Search Section */}
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Search Vendors</h2>
                <div className="flex flex-wrap gap-4">
                    <Input
                        type="text"
                        placeholder="Search by vendor name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/3 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <Input
                        type="text"
                        placeholder="Search by country..."
                        value={searchCountry}
                        onChange={(e) => setSearchCountry(e.target.value)}
                        className="w-full md:w-1/3 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* 🔹 Company Tabs */}
            <div className="bg-white rounded-2xl shadow-sm h-40 p-5 mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Meril Verticals</h2>
                <Tabs value={defaultTab} onValueChange={setDefaultTab} className="w-full">
                    <TabsList className="flex flex-wrap gap-3 justify-start items-start w-full bg-transparent p-0 border-0">
                        {companyAnalytics.map((company, index) => {
                            const { count } = getVendorsForCompany(
                                searchedVendors,
                                company.company_id,
                                company.vendors_with_company_code
                            );

                            const isHighlighted = highlightedCompanies.includes(company.company_id);
                            const totalCompanies = companyAnalytics.length;
                            const paddingClass =
                                totalCompanies > 15
                                    ? "px-2 py-1 text-sm"
                                    : totalCompanies > 10
                                        ? "px-3 py-1 text-sm"
                                        : "px-4 py-2 text-sm";

                            return (
                                <TabsTrigger
                                    key={company.company_id}
                                    value={company.company_id}
                                    onClick={() => setCurrentSlide(index + 1)}
                                    className={[
                                        `flex items-center gap-2 border rounded-full font-medium transition ${paddingClass}`,
                                        currentSlide === index + 1
                                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                            : isHighlighted
                                                ? "bg-yellow-100 text-yellow-800 border-yellow-400 shadow-sm"
                                                : "bg-gray-50 text-gray-700 hover:bg-blue-50 border-gray-300",
                                    ].join(" ")}
                                >
                                    <span>{company.company_id} - {company.company_short_form}</span>
                                    <span
                                        className={`text-sm font-semibold px-2 py-0.5 rounded-full ${currentSlide === index + 1
                                            ? "bg-white text-blue-700"
                                            : "bg-[#5291CD] text-white"
                                            }`}
                                    >
                                        <CountUp
                                            end={count}
                                            duration={1.2}
                                            separator=","
                                        />
                                    </span>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                </Tabs>
            </div>

            {/* 🔹 Vendors Table */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <Tabs value={defaultTab} onValueChange={setDefaultTab}>
                    {companyAnalytics.map((company) => {
                        const { vendors: filteredVendors } = getVendorsForCompany(
                            searchedVendors,
                            company.company_id,
                            company.vendors_with_company_code
                        );

                        return (
                            <TabsContent
                                key={company.company_id}
                                value={company.company_id}
                                className="relative"
                            >
                                {loading ? (
                                    <p className="text-gray-500">Loading vendors...</p>
                                ) : (
                                    <VendorTable vendors={filteredVendors} activeTab={company.company_id} />
                                )}
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </div>
        </div>
    );
};

export default AllVendors;