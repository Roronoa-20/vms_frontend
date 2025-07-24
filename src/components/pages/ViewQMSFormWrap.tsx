'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ViewQMSFormClient from './ViewQMSForm';

export const ViewQMSFormWrapper = () => {
  const params = useSearchParams();
  const vendor_onboarding = params.get('vendor_onboarding') || '';
  const tabtype = params.get('tabtype') || '';
  const company_code = params.get("company_code") || '';

  return (
    <Suspense fallback={<div>Loading Form...</div>}>
      <ViewQMSFormClient vendor_onboarding={vendor_onboarding} tabtype={tabtype} company_code={company_code} />
    </Suspense>
  );
};
