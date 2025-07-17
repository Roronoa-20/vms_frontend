import React from "react";
import { cookies } from "next/headers";
import { VendorInfoForm } from "../templates/qms-form/vendor-info-form";
import { QASForm } from "../templates/qms-form/qas-form";
import { BuildingForm } from "../templates/qms-form/building-form";
import { MaterialForm } from "../templates/qms-form/material-form";
import { OrganizationalForm } from "../templates/qms-form/organizational-form";
import { QualityForm } from "../templates/qms-form/quality-form";
import { ProductionForm } from "../templates/qms-form/production-form";
import { ComplaintForm } from "../templates/qms-form/complaint-form";
import { SupplementForm } from "../templates/qms-form/supplement-form";
import ViewQMSFormDetails from '../molecules/qmsformtab';
import { ConclusionForm } from "../templates/qms-form/conclusion-form";


interface Props {
    vendor_onboarding: string;
    tabtype: string;
}

const formComponents: { [key: string]: React.FC<{ vendor_onboarding: string; }> } = {
    "vendor information": VendorInfoForm,
    qas: QASForm,
    building: BuildingForm,
    material: MaterialForm,
    organizational: OrganizationalForm,
    quality: QualityForm,
    production: ProductionForm,
    complaint: ComplaintForm,
    supplement: SupplementForm,
    conclusion: ConclusionForm
};

const ViewQMSForm = async ({ vendor_onboarding, tabtype }: Props) => {
    const cookie = await cookies()
    const cookieStore = await cookies();
    const user = cookie.get("user_id")?.value
    const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

    const safeTabtype = (tabtype || "vendorinfo").toLowerCase();
    const SelectedForm = formComponents[safeTabtype];

    return (
        <div>
            <ViewQMSFormDetails vendor_onboarding={vendor_onboarding} />
            <div className="pt-14 p-2">
                {SelectedForm ? (
                    <SelectedForm vendor_onboarding={vendor_onboarding} />
                ) : (
                    <div className="text-red-500">Invalid tab type: {tabtype}</div>
                )}
            </div>
        </div>
    );
};

export default ViewQMSForm;
