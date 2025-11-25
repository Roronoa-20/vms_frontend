'use client';

import React, { Suspense } from 'react';
import ViewQualityAgreemtnClient from './ViewQualityAgreement';

export const ViewQualityAgreemtnWrapper = () => {
  return (
    <Suspense fallback={<div>Loading Form...</div>}>
      <ViewQualityAgreemtnClient />
    </Suspense>
  );
};
