'use client';

import React from "react";
import { useSearchParams } from "next/navigation";
import { QualityForm } from "../templates/qms-form-details/quality-form";
import ViewQMSFormDetails from '../molecules/viewqmsformtab';
import { MLSPLQualityAgreementForm } from "../templates/qms-form-details/mlspl-quality-agreement-form";
import { MDPLQualityAgreementForm } from "../templates/qms-form-details/mdpl-quality-agreement-form";

interface Props {
  vendor_onboarding: string;
  tabtype: string;
  company_code: string;
}

const formComponents: { [key: string]: React.ComponentType<any> } = {
  "quality_agreement": QualityForm,
};

const ViewQualityAgreemtnClient = ({ }) => {
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
        {/* <ViewQMSFormDetails vendor_onboarding={vendor_onboarding} company_code={company_code}/> */}
        <div className="pt-4 p-2">
          {codes.includes("2000") && (
            <div className="mb-6">
              {/* <h2 className="text-lg font-semibold mb-2">MLSPL Quality Agreement</h2> */}
              <MLSPLQualityAgreementForm vendor_onboarding={vendor_onboarding} company_code={company_code} />
            </div>
          )}
          {codes.includes("7000") && (
            <div>
               {/* <h2 className="text-lg font-semibold mb-2">MDPL Quality Agreement</h2> */}
              <MDPLQualityAgreementForm vendor_onboarding={vendor_onboarding} company_code={company_code} />
            </div>
          )}
          {!codes.includes("2000") && !codes.includes("7000") && (
            <div className="text-red-500">No valid company code for Quality Agreement.</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* <ViewQMSFormDetails vendor_onboarding={vendor_onboarding} company_code={company_code} /> */}
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

export default ViewQualityAgreemtnClient;
