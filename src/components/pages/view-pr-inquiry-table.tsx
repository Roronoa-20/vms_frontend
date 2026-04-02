import React from "react";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import PREnuiryTable from "@/src/components/molecules/Purchase-Enquiry-Table";
import { AxiosResponse } from "axios";
import { TvendorRegistrationDropdown, TPRInquiryTable } from "@/src/types/types";
import { cookies } from "next/headers";

const Dashboard = async () => {
    const cookieStore = await cookies();
    const user = cookieStore.get("user_id")?.value
    console.log(user, "user")
    const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

    const dropdownUrl = API_END_POINTS.vendorRegistrationDropdown;
    const dropDownApi: AxiosResponse = await requestWrapper({
        url: dropdownUrl,
        method: "GET",
        headers: {
            cookie: cookieHeaderString,
        },
    });

    const dropdownData: TvendorRegistrationDropdown["message"]["data"] =
        dropDownApi?.status === 200 ? dropDownApi?.data?.message?.data : "";

    const companyDropdown = dropdownData?.company_master || [];

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
            <PREnuiryTable
                dashboardTableData={prInquiryData?.cart_details}
                companyDropdown={companyDropdown}
            />
        </div>
    );
};

export default Dashboard;