"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vendor } from "@/src/types/allvendorstypes";
import VendorTable from "@/src/components/templates/allvendorstable";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { Input } from "@/components/ui/input";

interface ApiResponse {
    message: {
        success: boolean;
        data: {
            vendors: Vendor[];
            pagination: {
                current_page: number;
                page_size: number;
                total_records: number;
                total_pages: number;
                has_next: boolean;
                has_previous: boolean;
                next_page: number | null;
                previous_page: number | null;
            };
            analytics: any;
            company_analytics: {
                company_wise_analytics: {
                    company_id: string;
                    company_name: string;
                    company_short_form: string;
                    total_vendors: number;
                }[];
            };
        };
    };
}

const AllVendors = () => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [companyAnalytics, setCompanyAnalytics] = useState<{ company_id: string; company_name: string; company_short_form: string; total_vendors: number }[]>([]);
    const [defaultTab, setDefaultTab] = useState("1000");
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

    useEffect(() => {
        if (!searchTerm && !searchCountry) {
            setSearchedVendors(vendors);
            setHighlightedCompanies([]);
            setDefaultTab("1000");
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
            setDefaultTab("1000");
            setCurrentSlide(1);
        }
    }, [searchTerm, searchCountry, vendors]);

    return (
        <div className="min-h-screen bg-[#F4F4F6] p-4">
            {/* 🔹 Search Section */}
            <div className="bg-rose-100 rounded-xl shadow p-4 mb-4">
                <div className="flex flex-wrap gap-4">
                    <Input
                        type="text"
                        placeholder="Search vendor name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-[50%] md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                    />
                    <Input
                        type="text"
                        placeholder="Search Country name..."
                        value={searchCountry}
                        onChange={(e) => setSearchCountry(e.target.value)}
                        className="w-[50%] md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                    />
                </div>
            </div>

            {/* 🔹 Tabs Section */}
            <div className="bg-rose-100 rounded-xl shadow p-4 h-28 mb-4">
                <Tabs value={defaultTab} onValueChange={setDefaultTab} className="w-full">
                    <TabsList className="flex flex-wrap gap-2 justify-start items-start w-full bg-transparent p-0 border-0 shadow-none relative">
                        {companyAnalytics.map((company, index) => {
                            const vendorCount = searchedVendors.filter(
                                (vendor) =>
                                    vendor.vendor_onb_records?.some(
                                        (record) => record.onboarding_form_status === "Approved"
                                    ) &&
                                    vendor.multiple_company_data?.some(
                                        (c) => c.company_name === company.company_id
                                    )
                            ).length;
                            const isHighlighted = highlightedCompanies.includes(company.company_id);
                            const totalCompanies = companyAnalytics.length;
                            const paddingClass =
                                totalCompanies > 15
                                    ? "px-2 py-1 text-md"
                                    : totalCompanies > 10
                                        ? "px-3 py-1 text-md"
                                        : "px-4 py-2 text-md";
                            return (
                                <TabsTrigger
                                    key={company.company_id}
                                    value={company.company_id}
                                    onClick={() => setCurrentSlide(index + 1)}
                                    className={[
                                        `flex items-center gap-1 border border-blue-500 rounded-full transition shadow-md ${paddingClass}`,
                                        currentSlide === index + 1
                                            ? "bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-lg"
                                            : isHighlighted
                                                ? "bg-yellow-100 text-blue-800 border-yellow-400 shadow-md"
                                                : "bg-white text-blue-600 hover:ring-2 hover:ring-blue-200 hover:shadow-lg",
                                    ].join(" ")}
                                >
                                    {company.company_id} - {company.company_short_form}
                                    <span
                                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${currentSlide === index + 1
                                            ? "bg-white text-blue-700"
                                            : "bg-blue-600 text-white"
                                            }`}
                                    >
                                        {vendorCount}
                                    </span>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                </Tabs>
            </div>
            {/* 🔹 Bottom Section: Tab Content */}
            <div className="bg-green-200 rounded-xl shadow p-4">
                <Tabs value={defaultTab} onValueChange={setDefaultTab}>
                    {companyAnalytics.map((company) => {
                        const filteredVendors = searchedVendors.filter(
                            (vendor) =>
                                vendor.vendor_onb_records?.some((record) => record.onboarding_form_status === "Approved") &&
                                vendor.multiple_company_data?.some((c) => c.company_name === company.company_id)
                        );

                        return (
                            <TabsContent
                                key={company.company_id}
                                value={company.company_id}
                                className="relative"
                            >
                                {loading ? (
                                    <p>Loading vendors...</p>
                                ) : (
                                    <VendorTable
                                        vendors={filteredVendors}
                                        activeTab={company.company_id}
                                    />
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