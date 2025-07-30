'use client';

import React, { Suspense } from 'react';
import ASAForm from '@/src/components/pages/asa-form';

export default function QMSFormPage() {
  return (
    <Suspense>
  <ASAForm />
    </Suspense>
  )
}
