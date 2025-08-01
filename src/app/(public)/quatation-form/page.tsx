import React, { Suspense } from 'react';
// import AlreadySubmittedComponent from "@/components/invitationComponents/AlreadySubmitted"
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { cookies } from 'next/headers';
import { RFQDetails } from '@/src/types/RFQtype';
import PublicLogisticsExportQuatationForm from '@/src/components/public/PublicLogisticsExportQuatationForm';
import RFQBasicDetails from '@/src/components/molecules/ViewRFQ/ViewRFQDetails';
import ViewFileAttachment from '@/src/components/molecules/ViewRFQ/ViewFileAttachment';
import PublicLogisticsImportQuatationForm from '@/src/components/public/PublicLogisticsImportQuatationForm';
import ErrorComponent from '@/src/components/public/ErrorComponent';
interface PageProps {
    searchParams: Promise<{ [key: string]: string }>;
}
const Page = async ({ searchParams }: PageProps): Promise<React.ReactElement> => {
    const searchparams = await searchParams;
    const { token } = searchparams
    const cookieStore = await cookies();
    const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
    console.log(token, "token-----------------")

    const dropdownApiUrl = API_END_POINTS?.vendorPurchaseRequestDropdown;
    const resposne: AxiosResponse = await requestWrapper({
        url: dropdownApiUrl, method: "GET", headers: {
            cookie: cookieHeaderString
        }
    });
    const Dropdown = resposne?.status == 200 ? resposne?.data.message : "";
    const RFQDataUrl = `${API_END_POINTS?.ProcessToken}?token=${token}`;
    const RFQDataResponse: AxiosResponse = await requestWrapper({
        url: RFQDataUrl, method: "GET", headers: {
            cookie: cookieHeaderString
        }
    })
    console.log(RFQDataResponse, "RFQDataResponse---------------")
    const RFQData: RFQDetails = RFQDataResponse?.status == 200 ? RFQDataResponse?.data?.message : RFQDataResponse;
    console.log(RFQData, "RFQData")
    if (RFQDataResponse?.status === 410) {
        return <ErrorComponent title='Link Expired' description='The link you are trying to access is no longer active. Please contact support for assistance.' />;
    }
    if (RFQDataResponse?.status != 200) {
        return <ErrorComponent title='Unauthorized Access' description='Your session has expired' />;
    }
    return (
        <Suspense>
            {
                <div className='px-4 py-6'>
                    <h1 className='text-lg py-2'>RFQ RefNo : <span className='font-bold'>{RFQData?.rfq ? RFQData?.rfq : ""}</span></h1>
                    {
                        RFQData.rfq_type == "Logistic Vendor" &&
                        <>
                            <RFQBasicDetails RFQData={RFQData} />
                            <ViewFileAttachment RFQData={RFQData} />
                            {
                                RFQData.logistic_type == "Export" ?
                                    <PublicLogisticsExportQuatationForm token={token} Dropdown={Dropdown} />
                                    :
                                    <PublicLogisticsImportQuatationForm token={token} Dropdown={Dropdown} />
                            }
                        </>
                    }
                </div>
            }
        </Suspense>
    )
}
export default Page