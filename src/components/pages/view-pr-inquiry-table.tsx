import React from "react";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import PREnuiryTable from "@/src/components/molecules/Purchase-Enquiry-Table";
import { AxiosResponse } from "axios";
import { DashboardPOTableData, dashboardCardData, DashboardTableType, TvendorRegistrationDropdown, TPRInquiryTable, PurchaseRequisition, RFQTable } from "@/src/types/types";
import { cookies } from "next/headers";

const Dashboard = async () => {
    // const cookie = await cookies()
    const cookieStore = await cookies();
    const user = cookieStore.get("user_id")?.value
    console.log(user, "user")
    const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");


    const prInquiryDashboardUrl = API_END_POINTS?.prInquiryDashboardTable;
    const prInquiryApi: AxiosResponse = await requestWrapper({
        url: prInquiryDashboardUrl,
        method: "GET",
        headers: {
            cookie: cookieHeaderString
        }
    });
    const prInquiryData: TPRInquiryTable =
        prInquiryApi?.status == 200 ? prInquiryApi?.data?.message : "";


    return (
        <div className="p-4">
            {/* Cards */}
            <PREnuiryTable
                dashboardTableData={prInquiryData?.cart_details}
            />
        </div>
    );
};

export default Dashboard;