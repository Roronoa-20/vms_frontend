'use client';

import React, { Suspense } from 'react';
import ViewQMSFormClient from './ViewQMSForm';

export const ViewQMSFormWrapper = () => {
  return (
    <Suspense fallback={<div>Loading Form...</div>}>
      <ViewQMSFormClient />
    </Suspense>
  );
};
