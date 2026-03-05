"use client"
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../atoms/select';
import { Input } from '../../atoms/input';
import { TVendorType, TCompanyCode, TPurchaseOrg, TAccountGroup, TVendorDetails, TReconciliation, TCurrency, TTermsOfPayment, TState, TCountry, TBankKey, TIncoterm } from '@/src/types/quickVendor/quickVendor.types';
import SearchSelectComponent from '../../molecules/Selectsearchcomponent';
import { getPurchaseOrgMasterData, getAccountGroupMasterData, getLocationByPincode, getReconciliationMasterData, getCurrencyMasterList, getTermsOfPaymentMasterData, getStateMasterList, getCountryMasterList, getBankKeyMasterData, createQuickVendorOnboarding, getQuickVendorOnboardingDetails, getIncotermsMasterData } from '@/src/services/quickVendor/quickVendor.services';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
    initialVendorTypes: TVendorType[];
    initialCompanyCodes: TCompanyCode[];
}

const QuickVendorForm = ({ initialVendorTypes, initialCompanyCodes }: Props) => {
    const [vendorTypes] = useState<TVendorType[]>(initialVendorTypes);
    const [companyCodes] = useState<TCompanyCode[]>(initialCompanyCodes);
    const router = useRouter();
    const searchParams = useSearchParams();
    const onboarding_id = searchParams.get('onboarding_id');
    const [purchaseOrgDropdown, setPurchaseOrgDropdown] = useState<TPurchaseOrg[]>([]);
    const [accountGroupDropdown, setAccountGroupDropdown] = useState<TAccountGroup[]>([]);
    const [reconciliationDropdown, setReconciliationDropdown] = useState<TReconciliation[]>([]);
    const [currencyDropdown, setCurrencyDropdown] = useState<TCurrency[]>([]);
    const [termsOfPaymentDropdown, setTermsOfPaymentDropdown] = useState<TTermsOfPayment[]>([]);
    const [stateDropdown, setStateDropdown] = useState<TState[]>([]);
    const [countryDropdown, setCountryDropdown] = useState<TCountry[]>([]);
    const [bankKeyDropdown, setBankKeyDropdown] = useState<TBankKey[]>([]);
    const [incotermsDropdown, setIncotermsDropdown] = useState<TIncoterm[]>([]);

    const [formData, setFormData] = useState<TVendorDetails>({} as TVendorDetails);

    // File attachments
    const [files, setFiles] = useState<{
        gst_attachment?: File;
        bank_details_attachment?: File;
        gst_document?: File;
        import_bank_proof?: File;
        domestic_bank_proof?: File;
    }>({});

    const handleFileChange = (key: keyof typeof files, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(prev => ({ ...prev, [key]: e.target.files![0] }));
        }
    };

    const fetchVendorDetails = async () => {
        if (onboarding_id) {
            try {
                const response = await getQuickVendorOnboardingDetails(onboarding_id);
                const responseData: any = response?.message?.data;
                if (responseData) {
                    setFormData(responseData?.vendor_details ? responseData.vendor_details : responseData);
                }
            } catch (error) {
                console.error("Failed to fetch vendor draft details", error);
            }
        }
    };

    const handleSelectChange = (value: string, name: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (!formData?.company_code) {
                alert("Please select Company Code");
                return;
            }
            if (!formData?.vendor_type) {
                alert("Please select Vendor Type");
                return;
            }
            if (!formData?.purchase_organization) {
                alert("Please select Purchase Organization");
                return;
            }
            if (!formData?.account_group) {
                alert("Please select Account Group");
                return;
            }

            const submitData: any = JSON.parse(JSON.stringify(formData));
            delete submitData.payee_in_document;
            delete submitData.check_double_invoice;
            delete submitData.gr_based_inv_verif;
            delete submitData.service_based_inv_verif;

            const body = new FormData();
            body.append('data', JSON.stringify({ vendor_details: submitData }));

            if (files.gst_attachment) body.append('gst_attachment', files.gst_attachment);
            if (files.bank_details_attachment) body.append('bank_details_attachment', files.bank_details_attachment);
            if (files.gst_document) body.append('gst_document', files.gst_document);
            if (files.import_bank_proof) body.append('import_bank_proof', files.import_bank_proof);
            if (files.domestic_bank_proof) body.append('domestic_bank_proof', files.domestic_bank_proof);

            const response = await createQuickVendorOnboarding(body);
            if (response?.message?.status === 'success') {
                alert("Vendor created successfully!");
                router.push(`/quick-vendor?onboarding_id=${response?.message?.data?.onboarding_id}`); // Redirect back or to a specific page
            } else {
                alert(response?.message?.message || "Something went wrong.");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to submit form.");
        }
    };

    const fetchPurchaseOrgDropdown = (query?: string): Promise<TPurchaseOrg[]> => {
        if (!formData?.company_code) return Promise.resolve([]);
        return getPurchaseOrgMasterData(formData?.company_code, query)
            .then((res) => { setPurchaseOrgDropdown(res?.message?.data); return res?.message?.data; })
            .catch((err) => {
                console.error(err);
                return [];
            });
    }

    const fetchAccountGroupDropdown = (query?: string): Promise<TAccountGroup[]> => {
        if (!formData?.purchase_organization || !formData?.vendor_type) return Promise.resolve([]);
        return getAccountGroupMasterData(formData?.purchase_organization, [formData.vendor_type])
            .then((res) => { setAccountGroupDropdown(res?.message?.data); return res?.message?.data; })
            .catch((err) => {
                console.error(err);
                return [];
            });
    }

    const fetchReconciliationDropdown = (query?: string): Promise<TReconciliation[]> => {
        if (!formData?.company_code) return Promise.resolve([]);
        return getReconciliationMasterData(formData?.company_code, query)
            .then((res) => { setReconciliationDropdown(res?.message?.data); return res?.message?.data; })
            .catch((err) => {
                console.error(err);
                return [];
            });
    }

    const fetchCurrencyDropdown = (query?: string): Promise<TCurrency[]> => {
        return getCurrencyMasterList(query)
            .then((res) => { setCurrencyDropdown(res?.message?.data); return res?.message?.data; })
            .catch((err) => {
                console.error(err);
                return [];
            });
    }

    const fetchTermsOfPaymentDropdown = (query?: string): Promise<TTermsOfPayment[]> => {
        if (!formData?.company_code) return Promise.resolve([]);
        return getTermsOfPaymentMasterData(formData?.company_code, query)
            .then((res) => { setTermsOfPaymentDropdown(res?.message?.data); return res?.message?.data; })
            .catch((err) => {
                console.error(err);
                return [];
            });
    }

    const fetchStateDropdown = (query?: string): Promise<TState[]> => {
        return getStateMasterList(query ?? "")
            .then((res) => { setStateDropdown(res?.message?.data); return res?.message?.data; })
            .catch((err) => {
                console.error(err);
                return [];
            });
    }

    useEffect(() => {
        if (formData?.company_code) {
            fetchPurchaseOrgDropdown();
            fetchReconciliationDropdown();
            fetchTermsOfPaymentDropdown();
            fetchIncotermsDropdown();
        }
    }, [formData?.company_code]);

    useEffect(() => {
        if (formData?.vendor_type && formData?.company_code && formData?.purchase_organization) {
            fetchAccountGroupDropdown();
        }
    }, [formData?.vendor_type, formData?.company_code, formData?.purchase_organization])

    useEffect(() => {
        if (formData?.postal_code && formData?.postal_code?.length >= 6) {
            getLocationByPincode(formData.postal_code)
                .then((res) => {
                    const data = res?.message?.data;
                    if (data) {
                        setFormData((prev) => ({
                            ...prev,
                            city: data?.city?.city_name || '',
                            district: data?.district?.name || '',
                            region: data?.state?.state_name || '',
                            country: data?.country?.country_name || '',
                        }));
                    }
                })
                .catch((err) => console.error(err));
        }
    }, [formData?.postal_code]);

    const fetchIncotermsDropdown = (query?: string): Promise<TIncoterm[]> => {
        if (!formData?.company_code) return Promise.resolve([]);
        return getIncotermsMasterData(formData?.company_code, query)
            .then((res) => { setIncotermsDropdown(res?.message?.data); return res?.message?.data; })
            .catch((err) => {
                console.error(err);
                return [];
            });
    };

    return (
        <div className="flex flex-col w-full mb-4 p-4">
            {/* Header Section */}
            <div className="pb-4 border-b border-gray-100">
                <h1 className="text-[18px] text-[#1E293B] font-semibold">
                    Create Request
                </h1>
            </div>

            {/* Form Fields Section */}
            <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Select Type */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Select Type</h2>
                    <Select onValueChange={(value) => handleSelectChange(value, 'vendor_type')} value={formData.vendor_type}>
                        <SelectTrigger className="w-full text-black h-10 bg-white rounded-xl border-gray-200">
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {vendorTypes?.map((vendorType) => (
                                    <SelectItem key={vendorType?.name} value={vendorType?.name}>
                                        {vendorType?.description}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Company Code */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Company Code</h2>
                    <Select onValueChange={(value) => handleSelectChange(value, 'company_code')} value={formData.company_code}>
                        <SelectTrigger className="w-full text-black h-10 bg-white rounded-xl border-gray-200">
                            <SelectValue placeholder="Company Code" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {companyCodes?.map((companyCode) => (
                                    <SelectItem key={companyCode?.name} value={companyCode?.name}>
                                        {companyCode?.company_name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Purchase Organization */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Purchase Organization</h2>
                    <SearchSelectComponent
                        searchApi={fetchPurchaseOrgDropdown}
                        getLabel={(item) => item?.purchase_organization_name}
                        getValue={(item) => item?.name}
                        setDropdown={setPurchaseOrgDropdown}
                        dropdown={purchaseOrgDropdown}
                        setData={(value) => handleSelectChange(value ?? '', 'purchase_organization')}
                        data={formData.purchase_organization}
                        placeholder="Search Purchase Organization"
                    />
                </div>

                {/* Account Group */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Account Group</h2>
                    <SearchSelectComponent
                        searchApi={fetchAccountGroupDropdown}
                        getLabel={(item) => item?.account_group_name}
                        getValue={(item) => item?.name}
                        setDropdown={setAccountGroupDropdown}
                        dropdown={accountGroupDropdown}
                        setData={(value) => handleSelectChange(value ?? '', 'account_group')}
                        data={formData.account_group}
                        placeholder="Search Account Group"
                    />
                </div>

            </div>

            {/* General Data Section */}
            <div className="pb-4 border-b border-gray-100">
                <h1 className="text-[18px] text-[#1E293B] font-semibold">
                    General Data
                </h1>
            </div>

            <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Title */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Title</h2>
                    <Select onValueChange={(value) => handleSelectChange(value, 'vendor_title')} value={formData.vendor_title}>
                        <SelectTrigger className="w-full text-black h-10 bg-white rounded-xl border-gray-200">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="Company">Company</SelectItem>
                                <SelectItem value="Mr.">Mr.</SelectItem>
                                <SelectItem value="Mrs.">Mrs.</SelectItem>
                                <SelectItem value="Ms.">Ms.</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Name */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Name</h2>
                    <Input
                        name="vendor_name"
                        placeholder="Name"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.vendor_name ?? ''}
                        onChange={handleInputChange}
                        maxLength={40}
                    />
                </div>

                {/* Search Term */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Search Term</h2>
                    <Input
                        name="search_term"
                        placeholder="Search Term"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.search_term ?? ''}
                        onChange={handleInputChange}
                        maxLength={20}
                    />
                </div>

                {/* Street/House Number */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Street/House Number</h2>
                    <Input
                        name="street_house_no"
                        placeholder="Street/House Number"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.street_house_no ?? ''}
                        onChange={handleInputChange}
                        maxLength={60}
                    />
                </div>

                {/* Street 2 */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Street 2</h2>
                    <Input
                        name="street_2"
                        placeholder="Street 2"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.street_2 ?? ''}
                        onChange={handleInputChange}
                        maxLength={40}
                    />
                </div>

                {/* Street 4 */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Street 4</h2>
                    <Input
                        name="street_4"
                        placeholder="Street 4"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.street_4 ?? ''}
                        onChange={handleInputChange}
                        maxLength={40}
                    />
                </div>

                {/* Postal Code */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Postal Code</h2>
                    <Input
                        name="postal_code"
                        placeholder="Pin Code"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.postal_code ?? ''}
                        onChange={handleInputChange}
                        maxLength={10}
                    />
                </div>

                {/* Country */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Country</h2>
                    <Input
                        name="country"
                        placeholder="Country"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.country ?? ''}
                        disabled
                    />
                </div>

                {/* Region */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Region</h2>
                    <Input
                        name="region"
                        placeholder="State"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.region ?? ''}
                        disabled
                    />
                </div>

                {/* Mobile No. */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Mobile No.</h2>
                    <Input
                        name="mobile_no"
                        placeholder="Enter Number"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.mobile_no ?? ''}
                        onChange={handleInputChange}
                    />
                </div>

                {/* E-Mail Address */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">E-Mail Address</h2>
                    <Input
                        name="vendors_primary_email"
                        placeholder="Official E-Mail ID"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.vendors_primary_email ?? ''}
                        onChange={handleInputChange}
                    />
                </div>

            </div>

            {/* Purchasing Data Section */}
            <div className="pb-4 border-b border-gray-100">
                <h1 className="text-[18px] text-[#1E293B] font-semibold">
                    Purchasing Data
                </h1>
            </div>

            {/* Checkboxes */}
            <div className="py-4 flex justify-evenly gap-6 w-full">
                <label className="flex items-center gap-2 text-[13px] font-medium text-[#64748B]">
                    <input
                        type="checkbox"
                        defaultChecked
                        disabled
                        className="w-4 h-4 accent-blue-500"
                    />
                    Payee in document
                </label>
                <label className="flex items-center gap-2 text-[13px] font-medium text-[#64748B]">
                    <input
                        type="checkbox"
                        defaultChecked
                        disabled
                        className="w-4 h-4 accent-blue-500"
                    />
                    Check double invoice
                </label>
                <label className="flex items-center gap-2 text-[13px] font-medium text-[#64748B]">
                    <input
                        type="checkbox"
                        defaultChecked
                        disabled
                        className="w-4 h-4 accent-blue-500"
                    />
                    GR-Based Inv. Verif.
                </label>
                <label className="flex items-center gap-2 text-[13px] font-medium text-[#64748B]">
                    <input
                        type="checkbox"
                        defaultChecked
                        disabled
                        className="w-4 h-4 accent-blue-500"
                    />
                    Service-Based Invoice Verification
                </label>
            </div>

            <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Reconciliation Account */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Reconciliation Account</h2>
                    <SearchSelectComponent
                        searchApi={fetchReconciliationDropdown}
                        getLabel={(item) => item?.name}
                        getValue={(item) => item?.name}
                        setDropdown={setReconciliationDropdown}
                        dropdown={reconciliationDropdown}
                        setData={(value) => handleSelectChange(value ?? '', 'reconciliation_account')}
                        data={formData.reconciliation_account}
                        placeholder="Sundry creditors - Employees"
                    />
                </div>

                {/* Order Currency */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Order Currency</h2>
                    <SearchSelectComponent
                        searchApi={fetchCurrencyDropdown}
                        getLabel={(item) => item?.currency_name}
                        getValue={(item) => item?.name}
                        setDropdown={setCurrencyDropdown}
                        dropdown={currencyDropdown}
                        setData={(value) => handleSelectChange(value ?? '', 'order_currency')}
                        data={formData.order_currency}
                        placeholder="INR"
                    />
                </div>

                {/* Term of Payment */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Term of Payment</h2>
                    <SearchSelectComponent
                        searchApi={fetchTermsOfPaymentDropdown}
                        getLabel={(item) => item?.terms_of_payment_name || item?.name}
                        getValue={(item) => item?.name}
                        setDropdown={setTermsOfPaymentDropdown}
                        dropdown={termsOfPaymentDropdown}
                        setData={(value) => handleSelectChange(value ?? '', 'terms_of_payment')}
                        data={formData.terms_of_payment}
                        placeholder="Pay Immediately"
                    />
                </div>

                {/* Inco Terms */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Inco Terms</h2>
                    <SearchSelectComponent
                        searchApi={fetchIncotermsDropdown}
                        getLabel={(item) => item?.incoterm_name || item?.name}
                        getValue={(item) => item?.name}
                        setDropdown={setIncotermsDropdown}
                        dropdown={incotermsDropdown}
                        setData={(value) => handleSelectChange(value ?? '', 'incoterms')}
                        data={formData.incoterms}
                        placeholder="EX Works - State Name"
                    />
                </div>

                {/* State */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">State</h2>
                    <SearchSelectComponent
                        searchApi={fetchStateDropdown}
                        getLabel={(item) => item?.name}
                        getValue={(item) => item?.name}
                        setDropdown={setStateDropdown}
                        dropdown={stateDropdown}
                        setData={(value) => handleSelectChange(value ?? '', 'state')}
                        data={formData.state}
                        placeholder="Select"
                    />
                </div>

            </div>

            {/* Excise Details Section */}
            <div className="pb-4 border-b border-gray-100">
                <h1 className="text-[18px] text-[#1E293B] font-semibold">
                    Excise Details
                </h1>
            </div>

            <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* GST No. */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">GST No.</h2>
                    <Input
                        name="gst_no"
                        placeholder="0 - If Non available"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.gst_no ?? ''}
                        onChange={handleInputChange}
                    />
                </div>

                {/* GST ven class */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">GST ven class</h2>
                    <Input
                        name="gst_ven_class"
                        placeholder="0"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.gst_ven_class ?? ''}
                        onChange={handleInputChange}
                    />
                </div>

                {/* PAN */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">PAN</h2>
                    <Input
                        name="pan_number"
                        placeholder="PAN Number"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.pan_number ?? ''}
                        onChange={handleInputChange}
                    />
                </div>

                {/* GST Attachment */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Attachment</h2>
                    <Input
                        type="file"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        onChange={(e) => handleFileChange('gst_attachment', e)}
                    />
                </div>

                {/* GST Document */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">GST Document</h2>
                    <Input
                        type="file"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        onChange={(e) => handleFileChange('gst_document', e)}
                    />
                </div>

            </div>

            {/* Contact Person Section */}
            <div className="pb-4 border-b border-gray-100">
                <h1 className="text-[18px] text-[#1E293B] font-semibold">
                    Contact Person
                </h1>
            </div>

            <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* First Name */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">First Name</h2>
                    <Input
                        name="first_name"
                        placeholder="Enter First Name"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.contact_persons?.[0]?.first_name ?? ''}
                        onChange={(e) => {
                            const updated = [...(formData?.contact_persons || [])];
                            if (updated.length === 0) updated.push({ first_name: '', last_name: '', email: '', contact_number: '' });
                            updated[0] = { ...updated[0], first_name: e.target.value };
                            setFormData((prev) => ({ ...prev, contact_persons: updated }));
                        }}
                    />
                </div>

                {/* Last Name */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Last Name</h2>
                    <Input
                        name="last_name"
                        placeholder="Enter Last Name"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.contact_persons?.[0]?.last_name ?? ''}
                        onChange={(e) => {
                            const updated = [...(formData?.contact_persons || [])];
                            if (updated.length === 0) updated.push({ first_name: '', last_name: '', email: '', contact_number: '' });
                            updated[0] = { ...updated[0], last_name: e.target.value };
                            setFormData((prev) => ({ ...prev, contact_persons: updated }));
                        }}
                    />
                </div>

            </div>

            {/* Bank Detail (Domestic) Section */}
            <div className="pb-4 border-b border-gray-100">
                <h1 className="text-[18px] text-[#1E293B] font-semibold">
                    Bank Detail (Domestic)
                </h1>
            </div>

            <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Country */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Country</h2>
                    <SearchSelectComponent
                        searchApi={(query?: string) => {
                            return getCountryMasterList(query)
                                .then((res) => { setCountryDropdown(res?.message?.data); return res?.message?.data; })
                                .catch((err) => { console.error(err); return []; });
                        }}
                        getLabel={(item) => item?.name}
                        getValue={(item) => item?.name}
                        setDropdown={setCountryDropdown}
                        dropdown={countryDropdown}
                        setData={(value) => {
                            const updated = [...(formData?.bank_details || [])];
                            if (updated.length === 0) updated.push({ country: '', bank_key: '', bank_name: '', bank_type: '', name_of_account_holder: '', account_number: '', ak: '', bnkt: '', ifsc_code: '' });
                            updated[0] = { ...updated[0], country: value ?? '' };
                            setFormData((prev) => ({ ...prev, bank_details: updated }));
                        }}
                        data={formData?.bank_details?.[0]?.country}
                        placeholder="IN"
                    />
                </div>

                {/* Bank Key */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Bank Key</h2>
                    <SearchSelectComponent
                        searchApi={(query?: string) => {
                            return getBankKeyMasterData(formData?.bank_details?.[0]?.country, query)
                                .then((res) => { setBankKeyDropdown(res?.message?.data); return res?.message?.data; })
                                .catch((err) => { console.error(err); return []; });
                        }}
                        getLabel={(item) => item?.bank_code}
                        getValue={(item) => item?.name}
                        setDropdown={setBankKeyDropdown}
                        dropdown={bankKeyDropdown}
                        setData={(value) => {
                            const updated = [...(formData?.bank_details || [])];
                            if (updated.length === 0) updated.push({ country: '', bank_key: '', bank_name: '', bank_type: '', name_of_account_holder: '', account_number: '', ak: '', bnkt: '', ifsc_code: '' });

                            // Here 'value' is actually the name based on getValue mapping
                            // We need to find the corresponding item to get the bank_code if needed
                            const selectedBank = bankKeyDropdown.find((item) => item.name === value);

                            // User requested: map bank name as value and bank_code as label
                            // and map the selected name to the bank name field.
                            // Assuming `bank_key` field in API still expects the code, or does it expect the name?
                            // Let's store what they selected in bank_key, and also populate bank_name
                            updated[0] = {
                                ...updated[0],
                                bank_key: selectedBank?.bank_code ?? '',
                                bank_name: value ?? ''
                            };
                            setFormData((prev) => ({ ...prev, bank_details: updated }));
                        }}
                        data={formData?.bank_details?.[0]?.bank_name}
                        placeholder="Select Bank Key"
                    />
                </div>

                {/* Bank Name */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Bank Name</h2>
                    <Input
                        name="bank_name"
                        placeholder="Bank Name"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.bank_details?.[0]?.bank_name ?? ''}
                        disabled
                    />
                </div>

                {/* Bank Account */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Bank Account</h2>
                    <Input
                        name="account_number"
                        placeholder="Account Number"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.bank_details?.[0]?.account_number ?? ''}
                        onChange={(e) => {
                            const updated = [...(formData?.bank_details || [])];
                            if (updated.length === 0) updated.push({ country: '', bank_key: '', bank_name: '', bank_type: '', name_of_account_holder: '', account_number: '', ak: '', bnkt: '', ifsc_code: '' });
                            updated[0] = { ...updated[0], account_number: e.target.value };
                            setFormData((prev) => ({ ...prev, bank_details: updated }));
                        }}
                    />
                </div>

                {/* Account Holder */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Account Holder</h2>
                    <Input
                        name="name_of_account_holder"
                        placeholder="Name of Account Holder"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.bank_details?.[0]?.name_of_account_holder ?? ''}
                        onChange={(e) => {
                            const updated = [...(formData?.bank_details || [])];
                            if (updated.length === 0) updated.push({ country: '', bank_key: '', bank_name: '', bank_type: '', name_of_account_holder: '', account_number: '', ak: '', bnkt: '', ifsc_code: '' });
                            updated[0] = { ...updated[0], name_of_account_holder: e.target.value };
                            setFormData((prev) => ({ ...prev, bank_details: updated }));
                        }}
                    />
                </div>

                {/* AK */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">AK</h2>
                    <Input
                        name="ak"
                        placeholder=""
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.bank_details?.[0]?.ak ?? ''}
                        disabled
                    />
                </div>

                {/* BnkT */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">BnkT</h2>
                    <Input
                        name="bnkt"
                        placeholder=""
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.bank_details?.[0]?.bnkt ?? ''}
                        disabled
                    />
                </div>

                {/* Reference Detail */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Reference Detail</h2>
                    <Input
                        name="ifsc_code"
                        placeholder="IFSC Code"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.bank_details?.[0]?.ifsc_code ?? ''}
                        onChange={(e) => {
                            const updated = [...(formData?.bank_details || [])];
                            if (updated.length === 0) updated.push({ country: '', bank_key: '', bank_name: '', bank_type: '', name_of_account_holder: '', account_number: '', ak: '', bnkt: '', ifsc_code: '' });
                            updated[0] = { ...updated[0], ifsc_code: e.target.value };
                            setFormData((prev) => ({ ...prev, bank_details: updated }));
                        }}
                    />
                </div>

                {/* Attachment */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Attachment</h2>
                    <Input
                        type="file"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        onChange={(e) => handleFileChange('domestic_bank_proof', e)}
                    />
                </div>

            </div>

            {/* Bank Detail (International) Section */}
            <div className="pb-4 border-b border-gray-100">
                <h1 className="text-[18px] text-[#1E293B] font-semibold">
                    Bank Detail (International)
                </h1>
            </div>

            <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Beneficiary Name */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Beneficiary Name</h2>
                    <Input
                        name="beneficiary_name"
                        placeholder="Beneficiary Name"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.international_bank_details?.[0]?.beneficiary_name ?? ''}
                        onChange={(e) => {
                            const updated = [...(formData?.international_bank_details || [])];
                            if (updated.length === 0) updated.push({ meril_company_name: '', beneficiary_name: '', beneficiary_bank_name: '', beneficiary_account_no: '', beneficiary_iban_no: '', beneficiary_bank_address: '', beneficiary_swift_code: '', beneficiary_ach_no: '', beneficiary_aba_no: '', beneficiary_routing_no: '' });
                            updated[0] = { ...updated[0], beneficiary_name: e.target.value };
                            setFormData((prev) => ({ ...prev, international_bank_details: updated }));
                        }}
                    />
                </div>

                {/* Beneficiary Bank Name */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Beneficiary Bank Name</h2>
                    <Input
                        name="beneficiary_bank_name"
                        placeholder="Beneficiary Bank Name"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.international_bank_details?.[0]?.beneficiary_bank_name ?? ''}
                        onChange={(e) => {
                            const updated = [...(formData?.international_bank_details || [])];
                            if (updated.length === 0) updated.push({ meril_company_name: '', beneficiary_name: '', beneficiary_bank_name: '', beneficiary_account_no: '', beneficiary_iban_no: '', beneficiary_bank_address: '', beneficiary_swift_code: '', beneficiary_ach_no: '', beneficiary_aba_no: '', beneficiary_routing_no: '' });
                            updated[0] = { ...updated[0], beneficiary_bank_name: e.target.value };
                            setFormData((prev) => ({ ...prev, international_bank_details: updated }));
                        }}
                    />
                </div>

                {/* Beneficiary Account No. */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Beneficiary Account No.</h2>
                    <Input
                        name="beneficiary_account_no"
                        placeholder="Beneficiary Account No."
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.international_bank_details?.[0]?.beneficiary_account_no ?? ''}
                        onChange={(e) => {
                            const updated = [...(formData?.international_bank_details || [])];
                            if (updated.length === 0) updated.push({ meril_company_name: '', beneficiary_name: '', beneficiary_bank_name: '', beneficiary_account_no: '', beneficiary_iban_no: '', beneficiary_bank_address: '', beneficiary_swift_code: '', beneficiary_ach_no: '', beneficiary_aba_no: '', beneficiary_routing_no: '' });
                            updated[0] = { ...updated[0], beneficiary_account_no: e.target.value };
                            setFormData((prev) => ({ ...prev, international_bank_details: updated }));
                        }}
                    />
                </div>

                {/* Beneficiary IBAN No. */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Beneficiary IBAN No.</h2>
                    <Input
                        name="beneficiary_iban_no"
                        placeholder="Beneficiary IBAN No."
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.international_bank_details?.[0]?.beneficiary_iban_no ?? ''}
                        onChange={(e) => {
                            const updated = [...(formData?.international_bank_details || [])];
                            if (updated.length === 0) updated.push({ meril_company_name: '', beneficiary_name: '', beneficiary_bank_name: '', beneficiary_account_no: '', beneficiary_iban_no: '', beneficiary_bank_address: '', beneficiary_swift_code: '', beneficiary_ach_no: '', beneficiary_aba_no: '', beneficiary_routing_no: '' });
                            updated[0] = { ...updated[0], beneficiary_iban_no: e.target.value };
                            setFormData((prev) => ({ ...prev, international_bank_details: updated }));
                        }}
                    />
                </div>

                {/* Beneficiary Bank Address */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Beneficiary Bank Address</h2>
                    <Input
                        name="beneficiary_bank_address"
                        placeholder="Beneficiary Bank Address"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.international_bank_details?.[0]?.beneficiary_bank_address ?? ''}
                        onChange={(e) => {
                            const updated = [...(formData?.international_bank_details || [])];
                            if (updated.length === 0) updated.push({ meril_company_name: '', beneficiary_name: '', beneficiary_bank_name: '', beneficiary_account_no: '', beneficiary_iban_no: '', beneficiary_bank_address: '', beneficiary_swift_code: '', beneficiary_ach_no: '', beneficiary_aba_no: '', beneficiary_routing_no: '' });
                            updated[0] = { ...updated[0], beneficiary_bank_address: e.target.value };
                            setFormData((prev) => ({ ...prev, international_bank_details: updated }));
                        }}
                    />
                </div>

                {/* Beneficiary Bank Swift Code */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Beneficiary Bank Swift Code</h2>
                    <Input
                        name="beneficiary_swift_code"
                        placeholder="Beneficiary Bank Swift Code"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.international_bank_details?.[0]?.beneficiary_swift_code ?? ''}
                        onChange={(e) => {
                            const updated = [...(formData?.international_bank_details || [])];
                            if (updated.length === 0) updated.push({ meril_company_name: '', beneficiary_name: '', beneficiary_bank_name: '', beneficiary_account_no: '', beneficiary_iban_no: '', beneficiary_bank_address: '', beneficiary_swift_code: '', beneficiary_ach_no: '', beneficiary_aba_no: '', beneficiary_routing_no: '' });
                            updated[0] = { ...updated[0], beneficiary_swift_code: e.target.value };
                            setFormData((prev) => ({ ...prev, international_bank_details: updated }));
                        }}
                    />
                </div>

                {/* Beneficiary ACH No. */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Beneficiary ACH No.</h2>
                    <Input
                        name="beneficiary_ach_no"
                        placeholder="Beneficiary ACH No."
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.international_bank_details?.[0]?.beneficiary_ach_no ?? ''}
                        onChange={(e) => {
                            const updated = [...(formData?.international_bank_details || [])];
                            if (updated.length === 0) updated.push({ meril_company_name: '', beneficiary_name: '', beneficiary_bank_name: '', beneficiary_account_no: '', beneficiary_iban_no: '', beneficiary_bank_address: '', beneficiary_swift_code: '', beneficiary_ach_no: '', beneficiary_aba_no: '', beneficiary_routing_no: '' });
                            updated[0] = { ...updated[0], beneficiary_ach_no: e.target.value };
                            setFormData((prev) => ({ ...prev, international_bank_details: updated }));
                        }}
                    />
                </div>

                {/* Beneficiary ABA No. */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Beneficiary ABA No.</h2>
                    <Input
                        name="beneficiary_aba_no"
                        placeholder="Beneficiary ABA No."
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.international_bank_details?.[0]?.beneficiary_aba_no ?? ''}
                        onChange={(e) => {
                            const updated = [...(formData?.international_bank_details || [])];
                            if (updated.length === 0) updated.push({ meril_company_name: '', beneficiary_name: '', beneficiary_bank_name: '', beneficiary_account_no: '', beneficiary_iban_no: '', beneficiary_bank_address: '', beneficiary_swift_code: '', beneficiary_ach_no: '', beneficiary_aba_no: '', beneficiary_routing_no: '' });
                            updated[0] = { ...updated[0], beneficiary_aba_no: e.target.value };
                            setFormData((prev) => ({ ...prev, international_bank_details: updated }));
                        }}
                    />
                </div>

                {/* Beneficiary Routing No. */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Beneficiary Routing No.</h2>
                    <Input
                        name="beneficiary_routing_no"
                        placeholder="Beneficiary Routing No."
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.international_bank_details?.[0]?.beneficiary_routing_no ?? ''}
                        onChange={(e) => {
                            const updated = [...(formData?.international_bank_details || [])];
                            if (updated.length === 0) updated.push({ meril_company_name: '', beneficiary_name: '', beneficiary_bank_name: '', beneficiary_account_no: '', beneficiary_iban_no: '', beneficiary_bank_address: '', beneficiary_swift_code: '', beneficiary_ach_no: '', beneficiary_aba_no: '', beneficiary_routing_no: '' });
                            updated[0] = { ...updated[0], beneficiary_routing_no: e.target.value };
                            setFormData((prev) => ({ ...prev, international_bank_details: updated }));
                        }}
                    />
                </div>

            </div>

            {/* Administrative Data Section */}
            <div className="pb-4 border-b border-gray-100">
                <h1 className="text-[18px] text-[#1E293B] font-semibold">
                    Administrative Data
                </h1>
            </div>

            <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Email Requestor */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Email Requestor</h2>
                    <Input
                        name="email_requestor"
                        placeholder="E-mail ID of Requestor"
                        className="rounded-xl h-10 bg-white border-gray-200"
                        value={formData?.vendors_primary_email ?? ''}
                        onChange={handleInputChange}
                    />
                </div>

            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    className="px-6 py-2 text-[14px] font-medium text-[#3B82F6] border border-[#3B82F6] rounded-lg hover:bg-blue-50 transition-colors"
                >
                    Include Another Company
                </button>
                <button
                    type="button"
                    className="px-6 py-2 text-[14px] font-medium text-[#3B82F6] border border-[#3B82F6] rounded-lg hover:bg-blue-50 transition-colors"
                >
                    Save as Draft
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2 text-[14px] font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Submit
                </button>
            </div>

        </div>
    );
}

export default QuickVendorForm;