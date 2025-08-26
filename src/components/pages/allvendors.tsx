"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorOnboardingResponse, VendorOnboarding } from "@/src/types/allvendorstypes";
import VendorTable from "@/src/components/templates/allvendorstable";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';

const COMPANY_CODES = [
    { id: 1, value: "1012", label: "1012 - MicroLSPL" },
    { id: 2, value: "1022", label: "1022 - MMIPL" },
    { id: 3, value: "1025", label: "1025 - MERAI" },
    { id: 4, value: "2000", label: "2000 - MLSPL" },
    { id: 5, value: "3000", label: "3000 - MLIPL" },
    { id: 6, value: "7000", label: "7000 - MDPL" },
    { id: 7, value: "8000", label: "8000 - MEPL" },
    { id: 8, value: "9000", label: "9000 - MHPL" },
];

const AllVendors = () => {
    const [vendors, setVendors] = useState<VendorOnboarding[]>([]);
    const [defaultTab, setDefaultTab] = useState("1012");
    const [currentSlide, setCurrentSlide] = useState(1);
    const [loading, setLoading] = useState<boolean>(false);

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
            } catch (err) {
                console.error("Error fetching vendors:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVendors();
    }, []);
    console.log("Approved Vendors Detials---->", vendors);

    return (
        <div className="bg-[#F4F4F6] p-4">
            <Tabs value={defaultTab} onValueChange={setDefaultTab}>
                {/* Tabs Bar */}
                <div>
                    <TabsList className="flex justify-start items-start gap-4 p-2">
                        {COMPANY_CODES.map(tab => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                onClick={() => setCurrentSlide(tab.id)}
                                className={[
                                    "whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition",
                                    currentSlide === tab.id
                                        ? "bg-gradient-to-br from-blue-600 to-indigo-800 shadow-lg text-white"
                                        : "bg-white text-blue-600 hover:ring-2 hover:ring-blue-200 shadow"
                                ].join(" ")}
                                style={currentSlide === tab.id ? { color: "white" } : {}}
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* Tab Panels */}
                {COMPANY_CODES.map(tab => {
                    const filteredVendors = vendors.filter(
                        (vendor) => vendor.company_name === tab.value
                    );

                    return (
                        <TabsContent key={tab.value} value={tab.value} className="mt-8">
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
