'use client';

import React, { Suspense } from 'react';
import QMSForm from '@/src/components/pages/QMSForm';
import { AuthProvider } from '@/src/context/AuthContext';

export default function QMSFormPage() {
  return (
    <Suspense>
      <AuthProvider>
        <QMSForm />
      </AuthProvider>
    </Suspense>
  )
}
