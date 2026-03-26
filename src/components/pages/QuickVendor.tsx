import React from 'react'
import QuickVendorForm from '../templates/quick-vendor/QuickVendorForm'
import { cookies } from 'next/headers';
import { getVendorTypeMasterList, getCompanyCodesBySessionUser } from '@/src/services/quickVendor/quickVendor.services';
import { TVendorType } from '@/src/types/quickVendor/quickVendor.types';

const QuickVendor = async ({ refno }: { refno?: string }) => {
    const cookieStore = await cookies();
    const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

    const vendortypeDropdown = await getVendorTypeMasterList(cookieHeaderString).then((data) => data?.message?.vendor_types);
    const companyCodeDropdown = await getCompanyCodesBySessionUser(cookieHeaderString).then((data) => data?.message?.data);

    return (
        <QuickVendorForm initialVendorTypes={vendortypeDropdown} initialCompanyCodes={companyCodeDropdown} />
    )
}

export default QuickVendor