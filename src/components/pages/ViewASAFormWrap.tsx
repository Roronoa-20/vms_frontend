'use client';

import React, { Suspense } from 'react';
import ViewASAFormClient from './ViewASAFormDetails';

export const ViewASAFormWrapper = () => {
  return (
    <Suspense fallback={<div>Loading Form...</div>}>
      <ViewASAFormClient />
    </Suspense>
  );
};
