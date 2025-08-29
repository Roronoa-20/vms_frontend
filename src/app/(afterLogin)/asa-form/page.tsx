'use client';

import React, { Suspense } from 'react';
import ASAForm from '@/src/components/pages/asa-form';
import { AuthProvider } from '@/src/context/AuthContext';

export default function ASAFormPage() {
  return (
    <Suspense>
      <AuthProvider>
        <ASAForm />
      </AuthProvider>
    </Suspense>
  )
}
