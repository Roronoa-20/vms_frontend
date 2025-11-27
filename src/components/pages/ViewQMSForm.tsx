'use client';

import React from "react";
import { useSearchParams } from "next/navigation";
import { VendorInfoForm } from "../templates/qms-form-details/vendor-info-form";
import { QASForm } from "../templates/qms-form-details/qas-form";
import { BuildingForm } from "../templates/qms-form-details/building-form";
import { MaterialForm } from "../templates/qms-form-details/material-form";
import { OrganizationalForm } from "../templates/qms-form-details/organizational-form";
import { QualityForm } from "../templates/qms-form-details/quality-form";
import { ProductionForm } from "../templates/qms-form-details/production-form";
import { ComplaintForm } from "../templates/qms-form-details/complaint-form";
import { SupplementForm } from "../templates/qms-form-details/supplement-form";
import ViewQMSFormDetails from '../molecules/viewqmsformtab';
import { ConclusionForm } from "../templates/qms-form-details/conclusion-form";
import { MLSPLQualityAgreementForm } from "../templates/qms-form-details/mlspl-quality-agreement-form";
import { MDPLQualityAgreementForm } from "../templates/qms-form-details/mdpl-quality-agreement-form";

interface Props {
  vendor_onboarding: string;
  tabtype: string;
  company_code: string;
}

const formComponents: { [key: string]: React.ComponentType<any> } = {
  "vendor_information": VendorInfoForm,
  qas: QASForm,
  building: BuildingForm,
  material: MaterialForm,
  organizational: OrganizationalForm,
  quality: QualityForm,
  production: ProductionForm,
  complaint: ComplaintForm,
  supplement: SupplementForm,
  // "quality_agreement": QualityForm,
  conclusion: ConclusionForm,
};

const ViewQMSFormClient = ({ }) => {
  const params = useSearchParams();
  const vendor_onboarding = params.get('vendor_onboarding') || '';
  const tabtype = params.get('tabtype') || '';
  const company_code = params.get("company_code") || '';
  const safeTabtype = (tabtype || "vendorinfo").toLowerCase();
  const SelectedForm = formComponents[safeTabtype];
  if (safeTabtype === "quality_agreement") {
    const codes = company_code.split(",").map(code => code.trim());
    return (
      <div>
        <ViewQMSFormDetails vendor_onboarding={vendor_onboarding} company_code={company_code}/>
        <div className="pt-14 p-2">
          {/* {codes.includes("2000") && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">MLSPL Quality Agreement</h2>
              <MLSPLQualityAgreementForm vendor_onboarding={vendor_onboarding} company_code={company_code} />
            </div>
          )}
          {codes.includes("7000") && (
            <div>
               <h2 className="text-lg font-semibold mb-2">MDPL Quality Agreement</h2>
              <MDPLQualityAgreementForm vendor_onboarding={vendor_onboarding} company_code={company_code} />
            </div>
          )}
          {!codes.includes("2000") && !codes.includes("7000") && (
            <div className="text-red-500">No valid company code for Quality Agreement.</div>
          )} */}
        </div>
      </div>
    );
  }

  return (
    <div>
      <ViewQMSFormDetails vendor_onboarding={vendor_onboarding} company_code={company_code} />
      <div className="pt-14 p-2">
        {SelectedForm ? (
          <SelectedForm vendor_onboarding={vendor_onboarding} company_code={company_code} />
        ) : (
          <div className="text-red-500">Invalid tab type: {tabtype}</div>
        )}
      </div>
    </div>
  );
};

export default ViewQMSFormClient;
