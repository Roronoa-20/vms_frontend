"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import POforUserConfirmation from "../molecules/POforUserConfirmation";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import UserConfirmationButton from "@/src/components/molecules/UserConfirmationButton";
import { Button } from "@/components/ui/button";

const ViewPO = () => {
    const [poDetails, setPODetails] = useState();
    const [PONumber, setPONumber] = useState<string>("");
    const Params = useSearchParams();
    const po_no = Params.get("po_number");
    const grn_no = Params.get("grn_ref");
    const router = useRouter();

    useEffect(() => {
        console.log("po_no from params:", po_no);

        if (po_no) {
            // setPONumber(po_no);
            getPODetails();
        }
    }, [po_no]);

    const getPODetails = async () => {
        // if (!PONumber) return;
        const url = `${API_END_POINTS?.getPODatainUserConfirmation}?po_name=${po_no}`;
        const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
        console.log("PO Response--->", response);
        if (response?.status === 200) {
            setPODetails(response?.data?.message);
        }
    };

    const handleBackClick = () => {
        if (grn_no) {
            router.push(`/view-grn-details?grn_ref=${grn_no}`);
        } else {
            router.back();
        }
    };


    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 space-y-6 text-sm text-black font-sans m-5">
            <div className="flex justify-between mb-4">
                <Button
                    onClick={handleBackClick}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-[8px]"
                    variant="backbtn"
                    size="backbtnsize"
                >
                    Back to GRN Table
                </Button>
                <UserConfirmationButton po_no={po_no} />
            </div>

            <POforUserConfirmation poDetails={poDetails} />
        </div>
    );
};

export default ViewPO;
