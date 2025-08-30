"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorOnboardingResponse, VendorOnboarding } from "@/src/types/allvendorstypes";
import VendorTable from "@/src/components/templates/allvendorstable";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { Input } from "@/components/ui/input";


const COMPANY_CODES = [
    { id: 1, value: "1000", label: "1000 - BHPL" },
    { id: 2, value: "1012", label: "1012 - MicroLSPL" },
    { id: 3, value: "1022", label: "1022 - MMIPL" },
    { id: 4, value: "1025", label: "1025 - MERAI" },
    { id: 5, value: "2000", label: "2000 - MLSPL" },
    { id: 6, value: "3000", label: "3000 - MLIPL" },
    { id: 7, value: "7000", label: "7000 - MDPL" },
    { id: 8, value: "8000", label: "8000 - MEPL" },
    { id: 9, value: "9000", label: "9000 - MHPL" },
];

const AllVendors = () => {
    const [vendors, setVendors] = useState<VendorOnboarding[]>([]);
    const [defaultTab, setDefaultTab] = useState("1000");
    const [currentSlide, setCurrentSlide] = useState(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCountry, setSearchCountry] = useState("");
    const [searchedVendors, setSearchedVendors] = useState<VendorOnboarding[]>([]);
    const [highlightedCompanies, setHighlightedCompanies] = useState<string[]>([]);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                setLoading(true);
                const url = API_END_POINTS?.allvendorsdetails;
                const res: AxiosResponse<VendorOnboardingResponse> = await requestWrapper({
                    url: url,
                    method: "GET",
                });
                const data = res.data.message;
                setVendors(data?.total_vendor_onboarding || []);
                setSearchedVendors(data?.total_vendor_onboarding || []);
            } catch (err) {
                console.error("Error fetching vendors:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVendors();
    }, []);
    console.log("API result--->", vendors);

    const applyFilters = (
        vendorList: VendorOnboarding[],
        name: string,
        country: string
    ) => {
        return vendorList.filter((vendor) => {
            const matchesName = name ? vendor.vendor_master.vendor_name.toLowerCase().includes(name.toLowerCase()) : true;
            const matchesCountry = country ? vendor.company_details.country.toLowerCase().includes(country.toLowerCase()) : true;
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

        const companiesWithResults = Array.from(new Set(results.map((vendor) => vendor.company_name)));
        setHighlightedCompanies(companiesWithResults);

        if (companiesWithResults.length > 0) {
            setDefaultTab(companiesWithResults[0]);
            const matchedCompany = COMPANY_CODES.find((c) => c.value === companiesWithResults[0]);
            if (matchedCompany) {
                setCurrentSlide(matchedCompany.id);
            }
        } else {
            setDefaultTab("1000");
            setCurrentSlide(1);
        }
    }, [searchTerm, searchCountry, vendors]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const handleCountrySearch = (value: string) => {
        setSearchCountry(value);
    };



    return (
        <div className="bg-[#F4F4F6] p-4">
            <div className="flex space-x-4 mb-4">
                <Input
                    type="text"
                    placeholder="Search vendor name..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-[50%] md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                />
                <Input
                    type="text"
                    placeholder="Search Country name..."
                    value={searchCountry}
                    onChange={(e) => handleCountrySearch(e.target.value)}
                    className="w-[50%] md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                />
            </div>

            <Tabs value={defaultTab} onValueChange={setDefaultTab}>
                <div>
                    <TabsList className="flex flex-wrap justify-start items-start gap-3">
                        {COMPANY_CODES.map((tab) => {
                            const vendorCount = searchedVendors.filter((vendor) => vendor.company_name === tab.value).length;
                            const isHighlighted = highlightedCompanies.includes(tab.value);
                            return (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    onClick={() => setCurrentSlide(tab.id)}
                                    className={[
                                        "flex items-center gap-2 border border-blue-500 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition shadow-md",
                                        currentSlide === tab.id
                                            ? "bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-lg"
                                            : isHighlighted
                                                ? "bg-yellow-100 text-blue-800 border-yellow-400 shadow-md"
                                                : "bg-white text-blue-600 hover:ring-2 hover:ring-blue-200 hover:shadow-lg",
                                    ].join(" ")}
                                    style={currentSlide === tab.id ? { color: "white" } : {}}
                                >
                                    {tab.label}
                                    <span
                                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${currentSlide === tab.id? "bg-white text-blue-700"
                                            : isHighlighted
                                                ? "bg-blue-600 text-white"
                                                : "bg-blue-600 text-white"
                                            }`}
                                    >
                                        {vendorCount}
                                    </span>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                </div>

                {/* Tab Panels */}
                {COMPANY_CODES.map((tab) => {
                    const filteredVendors = searchedVendors.filter(
                        (vendor) => vendor.company_name === tab.value
                    );

                    return (
                        <TabsContent key={tab.value} value={tab.value} className="mt-20 ml-2">
                            {loading ? (
                                <p>Loading vendors...</p>
                            ) : (
                                <VendorTable vendors={filteredVendors} activeTab={tab.value} />
                            )}
                        </TabsContent>
                    );
                })}
            </Tabs>
        </div>
    );
};

export default AllVendors;
