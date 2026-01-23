import React, { Suspense } from 'react';
import API_END_POINTS from '@/src/services/apiEndPoints';
import { RFQDetails } from '@/src/types/RFQtype';
import PublicLogisticsExportQuatationForm from '@/src/components/public/PublicLogisticsExportQuatationForm';
import RFQBasicDetails from '@/src/components/molecules/ViewRFQ/ViewRFQDetails';
import ViewFileAttachment from '@/src/components/molecules/ViewRFQ/ViewFileAttachment';
import PublicLogisticsImportQuatationForm from '@/src/components/public/PublicLogisticsImportQuatationForm';
import ErrorComponent from '@/src/components/public/ErrorComponent';
import { cookies } from 'next/headers';
import PublicMaterialQuotationForm from '@/src/components/public/PublicMaterialQuotationForm';
import PublicServiceQuotationForm from '@/src/components/public/PublicServiceQuotationForm';
import ViewServicePRItemsTable from '@/src/components/molecules/ViewRFQ/ViewServicePRItemsTable';
import ViewMaterialPRItemsTable from '@/src/components/molecules/ViewRFQ/ViewMaterialPRItemsTable';
import { QuotationDetail } from '@/src/types/QuatationTypes';

interface PageProps {
    searchParams: Promise<{ [key: string]: string }>;
}

const Page = async ({ searchParams }: PageProps): Promise<React.ReactElement> => {
    const searchparams = await searchParams;
    const { token } = searchparams;

    const cookieStore = await cookies();
    const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

    const dropdownApiUrl = API_END_POINTS?.vendorPurchaseRequestDropdown;
    const dropdownResponse = await fetch(dropdownApiUrl, {
        method: "GET",
        headers: {
            cookie: cookieHeaderString,
        },
    });

    const Dropdown = dropdownResponse.ok ? (await dropdownResponse.json())?.message : "";

    const RFQDataUrl = `${API_END_POINTS?.ProcessToken}?token=${token}`;
    const RFQDataResponse = await fetch(RFQDataUrl, {
        method: "GET",
        headers: {
            cookie: cookieHeaderString,
        },
    });

    const responseData = await RFQDataResponse.json();
    const RFQData: RFQDetails = responseData?.message ?? responseData;
    let QuotationData: QuotationDetail | null = null;
    if (RFQData?.prev_quotation_id) {
        const QuotationUrl = `${API_END_POINTS?.QuotationDetail}?quotation_name=${RFQData?.prev_quotation_id}`;
        const QuotationResponse = await fetch(QuotationUrl, {
            method: "GET",
            headers: {
                cookie: cookieHeaderString,
            },
        });
        const Quotation = await QuotationResponse.json();
        QuotationData = Quotation?.message ?? Quotation;
    }
    // console.log(QuotationData, "QuotationData")
    if (RFQDataResponse?.status === 410) {
        return (
            <div className="">
                <ErrorComponent
                    title="Link Expired"
                    description="The link you are trying to access is no longer active."
                />
            </div>
        );
    }

    if (RFQDataResponse?.status !== 200) {
        return (
            <div className="">
                <ErrorComponent
                    title="Unauthorized Access"
                    description="Your session has expired"
                />
            </div>
        );
    }
    console.log(RFQDataResponse, "RFQDataResponse");
    return (
        <Suspense>
            <div className="px-4 py-6">
                <h1 className="text-lg py-2">
                    RFQ RefNo: <span className="font-bold">{RFQData?.unique_id || ""}</span>
                </h1>
                <RFQBasicDetails RFQData={RFQData} />
                <ViewFileAttachment RFQData={RFQData} />
                {RFQData.rfq_type === "Logistics Vendor" && (
                    <>
                        {RFQData.logistic_type === "Export" ? (
                            <PublicLogisticsExportQuatationForm token={token} Dropdown={Dropdown} RFQData={RFQData} QuotationData={QuotationData}/>
                        ) : (
                            <PublicLogisticsImportQuatationForm token={token} Dropdown={Dropdown} RFQData={RFQData} QuotationData={QuotationData}/>
                        )}
                    </>
                )}
                {RFQData?.rfq_type === "Service Vendor" ? (
                    <>
                        <ViewServicePRItemsTable RFQData={RFQData} />
                        <PublicServiceQuotationForm token={token} Dropdown={Dropdown} RFQData={RFQData} />
                    </>
                ) : RFQData?.rfq_type === "Material Vendor" ? (
                    <>
                        <ViewMaterialPRItemsTable RFQData={RFQData} />
                        <PublicMaterialQuotationForm token={token} Dropdown={Dropdown} RFQData={RFQData} />
                    </>
                ) : null}
            </div>
        </Suspense>
    );
};

export default Page;
