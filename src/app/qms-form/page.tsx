'use client';

import React, { Suspense } from 'react';
import QMSForm from '@/src/components/pages/QMSForm';

export default function QMSFormPage() {
  return (
    <Suspense>
  <QMSForm />
    </Suspense>
  )
}
