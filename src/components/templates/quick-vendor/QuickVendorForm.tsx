"use client"
import React, { useEffect, useState, useRef } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../atoms/select';
import { Input } from '../../atoms/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../atoms/table';
import { Trash2, Loader2 } from 'lucide-react';
import { TVendorType, TCompanyCode, TPurchaseOrg, TAccountGroup, TVendorDetails, TReconciliation, TCurrency, TTermsOfPayment, TState, TCountry, TBankKey, TIncoterm, TGstDetail } from '@/src/types/quickVendor/quickVendor.types';
import SearchSelectComponent from '../../molecules/Selectsearchcomponent';
import { getPurchaseOrgMasterData, getAccountGroupMasterData, getLocationByPincode, getReconciliationMasterData, getCurrencyMasterList, getTermsOfPaymentMasterData, getStateMasterList, getCountryMasterList, getBankKeyMasterData, createQuickVendorOnboarding, getQuickVendorOnboardingDetails, getIncotermsMasterData, updateGstDetail, deleteGstDetailRow, updateContactDetail, deleteContactDetailRow, updateDomesticBankDetails, deleteDomesticBankDetailRow, updateImportBankDetails, deleteImportBankDetailRow, submitOnboardingForm } from '@/src/services/quickVendor/quickVendor.services';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyGstNumber, verifyPanNumber } from "@/src/services/documentVerification";

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
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    // Excise Details - single row input state
    const [exciseRowData, setExciseRowData] = useState<{ gst_number: string; gst_ven_class: string; attachment?: File | null }>({ gst_number: '', gst_ven_class: '' });
    const [editingExciseIndex, setEditingExciseIndex] = useState<number | null>(null);
    const attachmentInputRef = useRef<HTMLInputElement>(null);

    const checkPAN = (str: string) => {
        const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (str == null) return false;
        return regex.test(str);
    };

    const checkGST = (str: string) => {
        let regex = new RegExp(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/);
        if (str == null) return false;
        return regex.test(str);
    };

    const panVerification = async (panNumber: string): Promise<boolean> => {
        if (!checkPAN(panNumber)) return false;
        return await verifyPanNumber(panNumber)
            .then((data) => { console.log(data, "this is pan verification data"); return true; })
            .catch((error) => { console.log(error, "this is error in pan verification"); return false; });
    };

    const gstVerification = async (gstNumber: string): Promise<boolean> => {
        if (!checkGST(gstNumber)) return false;
        return await verifyGstNumber(gstNumber)
            .then((data) => { console.log(data, "this is gst verification data"); return true; })
            .catch((error) => { console.log(error, "this is error in gst verification"); return false; });
    };

    // Contact Person - single row input state
    const [contactRowData, setContactRowData] = useState<{ first_name: string; last_name: string }>({ first_name: '', last_name: '' });
    const [editingContactIndex, setEditingContactIndex] = useState<number | null>(null);

    // Bank Detail (Domestic) - single row input state
    const [bankRowData, setBankRowData] = useState<{ country: string; bank_key: string; bank_name: string; account_number: string; name_of_account_holder: string; ak: string; bnkt: string; ifsc_code: string; bank_type: string; attachment?: File | null }>({ country: '', bank_key: '', bank_name: '', account_number: '', name_of_account_holder: '', ak: '', bnkt: '', ifsc_code: '', bank_type: '' });
    const [editingBankIndex, setEditingBankIndex] = useState<number | null>(null);
    const bankAttachmentInputRef = useRef<HTMLInputElement>(null);

    // Bank Detail (International) - single row input state
    const [intlBankRowData, setIntlBankRowData] = useState<{ beneficiary_name: string; beneficiary_bank_name: string; beneficiary_account_no: string; beneficiary_iban_no: string; beneficiary_bank_address: string; beneficiary_swift_code: string; beneficiary_ach_no: string; beneficiary_aba_no: string; beneficiary_routing_no: string; attachment?: File | null }>({ beneficiary_name: '', beneficiary_bank_name: '', beneficiary_account_no: '', beneficiary_iban_no: '', beneficiary_bank_address: '', beneficiary_swift_code: '', beneficiary_ach_no: '', beneficiary_aba_no: '', beneficiary_routing_no: '' });
    const [editingIntlBankIndex, setEditingIntlBankIndex] = useState<number | null>(null);
    const intlBankAttachmentInputRef = useRef<HTMLInputElement>(null);

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
                    const data = responseData?.vendor_details ? responseData.vendor_details : responseData;

                    // Map international_bank_details fields from API format to form format
                    const mappedInternationalBankDetails = data.international_bank_details?.map((bank: any) => {
                        let parsedProof = bank.import_bank_proof;
                        if (typeof parsedProof === 'string' && parsedProof.trim().startsWith('{')) {
                            try { parsedProof = JSON.parse(parsedProof); } catch (e) { }
                        }
                        return {
                            meril_company_name: bank.meril_company_name || '',
                            beneficiary_name: bank.beneficiary_name || '',
                            beneficiary_bank_name: bank.beneficiary_bank_name || '',
                            beneficiary_account_no: bank.beneficiary_account_no || '',
                            beneficiary_iban_no: bank.iban_no || bank.beneficiary_iban_no || '',
                            beneficiary_bank_address: bank.beneficiary_bank_address || '',
                            beneficiary_swift_code: bank.swift_code || bank.beneficiary_swift_code || '',
                            beneficiary_ach_no: bank.beneficiary_ach_no || '',
                            beneficiary_aba_no: bank.beneficiary_aba_no || '',
                            beneficiary_routing_no: bank.beneficiary_routing_no || '',
                            import_bank_proof: parsedProof || undefined,
                        };
                    }) || [];

                    const mappedData: any = {
                        ...data,
                        vendors_primary_email: data.email || data.vendors_primary_email || '',
                        mobile_no: data.mobile_number || data.mobile_no || '',
                        vendor_type: data.vendor_types && data.vendor_types.length > 0 ? data.vendor_types[0] : (data.vendor_type || ''),
                        payee_in_document: data.payee_in_document === 1 || data.payee_in_document === true,
                        check_double_invoice: data.check_double_invoice === 1 || data.check_double_invoice === true,
                        gr_based_inv_verif: data.gr_base_inv_ver === 1 || data.gr_based_inv_verif === true,
                        service_based_inv_verif: data.service_base_inv_ver === 1 || data.service_based_inv_verif === true,
                        international_bank_details: mappedInternationalBankDetails,
                    };

                    setFormData(mappedData);

                    // Fetch bank key dropdown and set bank_key from bank_name
                    if (data.bank_details?.length > 0 && data.bank_details[0]?.country) {
                        try {
                            const bankKeyRes = await getBankKeyMasterData(data.bank_details[0].country);
                            if (bankKeyRes?.message?.data) {
                                setBankKeyDropdown(bankKeyRes.message.data);
                                const matchedBank = bankKeyRes.message.data.find(
                                    (b: any) => b.name === data.bank_details[0].bank_name
                                );
                                if (matchedBank) {
                                    setFormData((prev: any) => {
                                        const updatedBankDetails = [...(prev.bank_details || [])];
                                        updatedBankDetails[0] = {
                                            ...updatedBankDetails[0],
                                            bank_key: matchedBank.bank_code
                                        };
                                        return { ...prev, bank_details: updatedBankDetails };
                                    });
                                }
                            }
                        } catch (err) {
                            console.error("Failed to fetch bank key dropdown", err);
                        }
                    }
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

    const handleCreateRequest = async () => {
        try {
            if (!formData?.vendor_name) {
                alert('Please enter Vendor Name');
                return;
            }
            if (!formData?.company_code) {
                alert('Please select Company Code');
                return;
            }
            if (!formData?.vendor_type) {
                alert('Please select Vendor Type');
                return;
            }
            if (!formData?.purchase_organization) {
                alert('Please select Purchase Organization');
                return;
            }
            if (!formData?.account_group) {
                alert('Please select Account Group');
                return;
            }
            setLoadingAction('createRequest');

            const vendorDetails = {
                vendor_title: formData.vendor_title || '',
                vendor_name: formData.vendor_name || '',
                vendors_primary_email: formData.vendors_primary_email || '',
                mobile_no: formData.mobile_no || '',
                search_term: formData.search_term || '',
                vendor_type: formData.vendor_type || '',
                street_house_no: formData.street_house_no || '',
                street_2: formData.street_2 || '',
                street_3: formData.street_3 || '',
                street_4: formData.street_4 || '',
                postal_code: formData.postal_code || '',
                city: formData.city || '',
                district: formData.district || '',
                region: formData.region || '',
                country: formData.country || '',
                company_code: formData.company_code || '',
                purchase_organization: formData.purchase_organization || '',
                account_group: formData.account_group || '',
            };

            const body = new FormData();
            body.append('data', JSON.stringify({ vendor_details: vendorDetails }));

            await createQuickVendorOnboarding(body).then((data)=>{
                alert(data?.message?.message);
                router.push(`/quick-vendor?onboarding_id=${data?.message?.onboarding_id}`);
            }).catch((err)=>{
                alert(err?.message?.message || 'Something went wrong.');
            });
            
        } catch (error) {
            console.error(error);
            alert('Failed to create request.');
        } finally {
            setLoadingAction(null);
        }
    };

    const handleSaveAsDraft = async () => {
        try {
            if (formData?.pan_number) {
                if (!checkPAN(formData.pan_number)) {
                    alert('Please enter a valid PAN Number');
                    return;
                }
                const panValid = await panVerification(formData.pan_number);
                if (!panValid) {
                    alert('PAN verification failed');
                    return;
                }
            }
            setLoadingAction('saveAsDraft');
            const submitData: any = JSON.parse(JSON.stringify(formData));
            delete submitData.payee_in_document;
            delete submitData.check_double_invoice;
            delete submitData.gr_based_inv_verif;
            delete submitData.service_based_inv_verif;

            const payload: any = { vendor_details: submitData };
            if (onboarding_id) {
                payload.onboarding_id = onboarding_id;
            }

            submitData.gst_details = [];
            submitData.bank_details = [];
            submitData.international_bank_details = [];
            submitData.contact_persons = [];

            const body = new FormData();
            body.append('data', JSON.stringify(payload));

            if (files.gst_attachment) body.append('gst_attachment', files.gst_attachment);
            if (files.bank_details_attachment) body.append('bank_details_attachment', files.bank_details_attachment);
            if (files.gst_document) body.append('gst_document', files.gst_document);
            if (files.import_bank_proof) body.append('import_bank_proof', files.import_bank_proof);
            if (files.domestic_bank_proof) body.append('domestic_bank_proof', files.domestic_bank_proof);

            await createQuickVendorOnboarding(body).then((data)=>{
                alert(data?.message?.message);
                fetchVendorDetails();
            }).catch((err)=>{
                alert(err?.message?.message || 'Something went wrong.');
            });
        } catch (error) {
            console.error(error);
            alert('Failed to save draft.');
        } finally {
            setLoadingAction(null);
        }
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
            if (formData?.pan_number) {
                if (!checkPAN(formData.pan_number)) {
                    alert('Please enter a valid PAN Number');
                    return;
                }
                const panValid = await panVerification(formData.pan_number);
                if (!panValid) {
                    alert('PAN verification failed');
                    return;
                }
            }
            setLoadingAction('submit');

            const submitData: any = JSON.parse(JSON.stringify(formData));
            delete submitData.payee_in_document;
            delete submitData.check_double_invoice;
            delete submitData.gr_based_inv_verif;
            delete submitData.service_based_inv_verif;

            submitData.gst_details = [];
            submitData.bank_details = [];
            submitData.international_bank_details = [];
            submitData.contact_persons = [];

            const submitData2: any = JSON.parse(JSON.stringify(submitData));
            const payload: any = { vendor_details: submitData2 };
            if (onboarding_id) {
                payload.onboarding_id = onboarding_id;
            }

            const body = new FormData();
            body.append('data', JSON.stringify(payload));

            if (files.gst_attachment) body.append('gst_attachment', files.gst_attachment);
            if (files.bank_details_attachment) body.append('bank_details_attachment', files.bank_details_attachment);
            if (files.gst_document) body.append('gst_document', files.gst_document);
            if (files.import_bank_proof) body.append('import_bank_proof', files.import_bank_proof);
            if (files.domestic_bank_proof) body.append('domestic_bank_proof', files.domestic_bank_proof);

            await submitOnboardingForm(body).then((data)=>{
                alert(data?.message?.message);
                fetchVendorDetails();
                router.push(`/quick-vendor?onboarding_id=${data?.message?.onboarding_id}`);
            }).catch((err)=>{
                alert(err?.message?.message || "Something went wrong.");
            })
            
            
        } catch (error) {
            console.error(error);
            alert("Failed to submit form.");
        } finally {
            setLoadingAction(null);
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
        if (!formData?.account_group) return Promise.resolve([]);
        return getReconciliationMasterData(formData?.account_group, query)
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
            fetchTermsOfPaymentDropdown();
            fetchIncotermsDropdown();
        }
    }, [formData?.company_code]);

    useEffect(() => {
        if (formData?.account_group) {
            fetchReconciliationDropdown();
        }
    }, [formData?.account_group]);

    useEffect(() => {
        if (formData?.vendor_type && formData?.company_code && formData?.purchase_organization) {
            fetchAccountGroupDropdown();
        }
    }, [formData?.vendor_type, formData?.company_code, formData?.purchase_organization])

    useEffect(() => {
        if (bankRowData.country) {
            getBankKeyMasterData(bankRowData.country)
                .then((res) => { setBankKeyDropdown(res?.message?.data || []); })
                .catch((err) => console.error(err));
        }
    }, [bankRowData.country]);

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

    useEffect(() => {
        if (onboarding_id) {
            fetchVendorDetails();
        }
    }, [onboarding_id])

    // ==================== GST / Excise Detail CRUD ====================
    const addGstDetail = async () => {
        if (!exciseRowData.gst_number) {
            alert('Please enter GST Number');
            return;
        }
        if (!checkGST(exciseRowData.gst_number)) {
            alert('Please enter a valid GST Number');
            return;
        }
        if(!await gstVerification(exciseRowData.gst_number)){
            alert("GST Number Failed to verify !");
            return;
        };
        setLoadingAction('addGst');
        try {
        const newGstDetail: any = {
            gst_state: formData.state || '',
            gst_number: exciseRowData.gst_number,
            gst_ven_class: exciseRowData.gst_ven_class,
            attachment: exciseRowData.attachment,
        };

        if (onboarding_id) {
            try {
                const res = await updateGstDetail({
                    onboarding_id: onboarding_id,
                    name: editingExciseIndex !== null ? (formData?.gst_details?.[editingExciseIndex] as any)?.name || '' : '',
                    gst_state: newGstDetail.gst_state,
                    gst_number: newGstDetail.gst_number,
                    gst_ven_class: newGstDetail.gst_ven_class,
                }, exciseRowData.attachment);
                alert(res?.message || 'GST detail saved successfully');
                const details = await getQuickVendorOnboardingDetails(onboarding_id);
                if (details?.message?.data) {
                    const d = details.message.data;
                    setFormData(prev => ({ ...prev, gst_details: d.gst_details || [], pan_number: d.pan_number || prev.pan_number }));
                }
            } catch (error: any) {
                alert(error?.message?.message || 'Error saving GST detail');
                return;
            }
        } else {
            const updatedGstDetails = [...(formData?.gst_details || [])];
            if (editingExciseIndex !== null) {
                updatedGstDetails[editingExciseIndex] = newGstDetail;
            } else {
                updatedGstDetails.push(newGstDetail);
            }
            setFormData(prev => ({ ...prev, gst_details: updatedGstDetails }));
        }
        setEditingExciseIndex(null);
        setExciseRowData({ gst_number: '', gst_ven_class: '', attachment: null });
        if (attachmentInputRef.current) {
            attachmentInputRef.current.value = "";
        }
        } finally {
            setLoadingAction(null);
        }
    };

    const handleGstEdit = (index: number) => {
        const item = formData?.gst_details?.[index];
        if (!item) return;
        setExciseRowData({
            gst_number: item.gst_number,
            gst_ven_class: item.gst_ven_class,
            attachment: null,
        });
        setEditingExciseIndex(index);
    };

    const handleGstDelete = async (index: number) => {
        if (confirm('Are you sure you want to delete this GST entry?')) {
            if (onboarding_id) {
                const rowName = (formData?.gst_details?.[index] as any)?.name || '';
                try {
                    const res = await deleteGstDetailRow(onboarding_id, rowName);
                    alert(res?.message || 'GST entry deleted successfully');
                    const details = await getQuickVendorOnboardingDetails(onboarding_id);
                    if (details?.message?.data) {
                        const d = details.message.data;
                        setFormData(prev => ({ ...prev, gst_details: d.gst_details || [] }));
                    }
                } catch (error: any) {
                    alert(error?.message?.message || 'Error deleting GST entry');
                }
            } else {
                const updatedGstDetails = [...(formData?.gst_details || [])];
                updatedGstDetails.splice(index, 1);
                setFormData(prev => ({ ...prev, gst_details: updatedGstDetails }));
            }
        }
    };

    // ==================== Contact Person CRUD ====================
    const addContact = async () => {
        if (!contactRowData.first_name) {
            alert('Please enter First Name');
            return;
        }
        setLoadingAction('addContact');
        try {
        const newContact = {
            first_name: contactRowData.first_name,
            last_name: contactRowData.last_name,
            email: '',
            contact_number: '',
        };

        if (onboarding_id) {
            try {
                const res = await updateContactDetail({
                    data: {
                        onboarding_id: onboarding_id,
                        name: editingContactIndex !== null ? (formData?.contact_persons?.[editingContactIndex] as any)?.name || '' : '',
                        first_name: newContact.first_name,
                        last_name: newContact.last_name,
                        email: newContact.email,
                        contact_number: newContact.contact_number,
                    }
                });
                alert(res?.message || 'Contact person saved successfully');
                const details = await getQuickVendorOnboardingDetails(onboarding_id);
                if (details?.message?.data) {
                    const d = details.message.data;
                    setFormData(prev => ({ ...prev, contact_persons: d.contact_persons || [] }));
                }
            } catch (error: any) {
                alert(error?.message?.message || 'Error saving contact person');
                return;
            }
        } else {
            const updatedContacts = [...(formData?.contact_persons || [])];
            if (editingContactIndex !== null) {
                updatedContacts[editingContactIndex] = { ...updatedContacts[editingContactIndex], ...newContact };
            } else {
                updatedContacts.push(newContact);
            }
            setFormData(prev => ({ ...prev, contact_persons: updatedContacts }));
        }
        setEditingContactIndex(null);
        setContactRowData({ first_name: '', last_name: '' });
        } finally {
            setLoadingAction(null);
        }
    };

    const handleContactEdit = (index: number) => {
        const item = formData?.contact_persons?.[index];
        if (!item) return;
        setContactRowData({
            first_name: item.first_name,
            last_name: item.last_name,
        });
        setEditingContactIndex(index);
    };

    const handleContactDelete = async (index: number) => {
        if (confirm('Are you sure you want to delete this contact?')) {
            if (onboarding_id) {
                const rowName = (formData?.contact_persons?.[index] as any)?.name || '';
                try {
                    const res = await deleteContactDetailRow(onboarding_id, rowName);
                    alert(res?.message || 'Contact person deleted successfully');
                    const details = await getQuickVendorOnboardingDetails(onboarding_id);
                    if (details?.message?.data) {
                        setFormData(prev => ({ ...prev, contact_persons: details.message.data.contact_persons || [] }));
                    }
                } catch (error: any) {
                    alert(error?.message?.message || 'Error deleting contact person');
                }
            } else {
                const updatedContacts = [...(formData?.contact_persons || [])];
                updatedContacts.splice(index, 1);
                setFormData(prev => ({ ...prev, contact_persons: updatedContacts }));
            }
        }
    };

    // ==================== Bank Detail (Domestic) CRUD ====================
    const addBankDetail = async () => {
        if (!bankRowData.country) {
            alert('Please select Country');
            return;
        }
        if (!bankRowData.bank_key) {
            alert('Please select Bank Key');
            return;
        }
        setLoadingAction('addBank');
        try {
        const newBankDetail = {
            country: bankRowData.country,
            bank_key: bankRowData.bank_key,
            bank_name: bankRowData.bank_name,
            bank_type: bankRowData.bank_type,
            account_number: bankRowData.account_number,
            name_of_account_holder: bankRowData.name_of_account_holder,
            ak: bankRowData.ak,
            bnkt: bankRowData.bnkt,
            ifsc_code: bankRowData.ifsc_code,
        };

        if (onboarding_id) {
            try {
                const res = await updateDomesticBankDetails({
                    onboarding_id: onboarding_id,
                    name: editingBankIndex !== null ? (formData?.bank_details?.[editingBankIndex] as any)?.name || '' : '',
                    country: newBankDetail.country,
                    bank_key: newBankDetail.bank_key,
                    bank_name: newBankDetail.bank_name,
                    name_of_account_holder: newBankDetail.name_of_account_holder,
                    account_number: newBankDetail.account_number,
                    ifsc_code: newBankDetail.ifsc_code,
                }, bankRowData.attachment);
                alert(res?.message || 'Domestic bank detail saved successfully');
                const details = await getQuickVendorOnboardingDetails(onboarding_id);
                if (details?.message?.data) {
                    setFormData(prev => ({ ...prev, bank_details: details.message.data.bank_details as any || [] }));
                }
            } catch (error: any) {
                alert(error?.message?.message || 'Error saving domestic bank detail');
                return;
            }
        } else {
            const updatedBankDetails = [...(formData?.bank_details || [])];
            if (editingBankIndex !== null) {
                updatedBankDetails[editingBankIndex] = newBankDetail;
            } else {
                updatedBankDetails.push(newBankDetail);
            }
            setFormData(prev => ({ ...prev, bank_details: updatedBankDetails }));
        }
        setEditingBankIndex(null);
        setBankRowData({ country: '', bank_key: '', bank_name: '', account_number: '', name_of_account_holder: '', ak: '', bnkt: '', ifsc_code: '', bank_type: '' });
        if (bankAttachmentInputRef.current) bankAttachmentInputRef.current.value = "";
        } finally {
            setLoadingAction(null);
        }
    };

    const handleBankEdit = (index: number) => {
        const item = formData?.bank_details?.[index];
        if (!item) return;
        setBankRowData({
            country: item.country,
            bank_key: item.bank_key,
            bank_name: item.bank_name,
            bank_type: item.bank_type || '',
            account_number: item.account_number,
            name_of_account_holder: item.name_of_account_holder,
            ak: item.ak || '',
            bnkt: item.bnkt || '',
            ifsc_code: item.ifsc_code,
            attachment: null,
        });
        setEditingBankIndex(index);
    };

    const handleBankDelete = async (index: number) => {
        if (confirm('Are you sure you want to delete this bank detail?')) {
            if (onboarding_id) {
                const rowName = (formData?.bank_details?.[index] as any)?.name || '';
                try {
                    const res = await deleteDomesticBankDetailRow(onboarding_id, rowName);
                    alert(res?.message || 'Bank detail deleted successfully');
                    const details = await getQuickVendorOnboardingDetails(onboarding_id);
                    if (details?.message?.data) {
                        setFormData(prev => ({ ...prev, bank_details: details.message.data.bank_details as any || [] }));
                    }
                } catch (error: any) {
                    alert(error?.message?.message || 'Error deleting bank detail');
                }
            } else {
                const updatedBankDetails = [...(formData?.bank_details || [])];
                updatedBankDetails.splice(index, 1);
                setFormData(prev => ({ ...prev, bank_details: updatedBankDetails }));
            }
        }
    };

    // ==================== Bank Detail (International) CRUD ====================
    const addIntlBankDetail = async () => {
        if (!intlBankRowData.beneficiary_name) {
            alert('Please enter Beneficiary Name');
            return;
        }
        setLoadingAction('addIntlBank');
        try {
        const newIntlBank = {
            meril_company_name: '',
            beneficiary_name: intlBankRowData.beneficiary_name,
            beneficiary_bank_name: intlBankRowData.beneficiary_bank_name,
            beneficiary_account_no: intlBankRowData.beneficiary_account_no,
            beneficiary_iban_no: intlBankRowData.beneficiary_iban_no,
            beneficiary_bank_address: intlBankRowData.beneficiary_bank_address,
            beneficiary_swift_code: intlBankRowData.beneficiary_swift_code,
            beneficiary_ach_no: intlBankRowData.beneficiary_ach_no,
            beneficiary_aba_no: intlBankRowData.beneficiary_aba_no,
            beneficiary_routing_no: intlBankRowData.beneficiary_routing_no,
        };

        if (onboarding_id) {
            try {
                const res = await updateImportBankDetails({
                    onboarding_id: onboarding_id,
                    name: editingIntlBankIndex !== null ? (formData?.international_bank_details?.[editingIntlBankIndex] as any)?.name || '' : '',
                    meril_company_name: newIntlBank.meril_company_name,
                    beneficiary_name: newIntlBank.beneficiary_name,
                    beneficiary_swift_code: newIntlBank.beneficiary_swift_code,
                    beneficiary_iban_no: newIntlBank.beneficiary_iban_no,
                    beneficiary_aba_no: newIntlBank.beneficiary_aba_no,
                    beneficiary_bank_address: newIntlBank.beneficiary_bank_address,
                    beneficiary_bank_name: newIntlBank.beneficiary_bank_name,
                    beneficiary_account_no: newIntlBank.beneficiary_account_no,
                    beneficiary_ach_no: newIntlBank.beneficiary_ach_no,
                    beneficiary_routing_no: newIntlBank.beneficiary_routing_no,
                    beneficiary_currency: '',
                }, intlBankRowData.attachment);
                alert(res?.message || 'International bank detail saved successfully');
                const details = await getQuickVendorOnboardingDetails(onboarding_id);
                if (details?.message?.data) {
                    setFormData(prev => ({ ...prev, international_bank_details: details.message.data.international_bank_details as any || [] }));
                }
            } catch (error: any) {
                alert(error?.message?.message || 'Error saving international bank detail');
                return;
            }
        } else {
            const updatedIntlBank = [...(formData?.international_bank_details || [])];
            if (editingIntlBankIndex !== null) {
                updatedIntlBank[editingIntlBankIndex] = newIntlBank;
            } else {
                updatedIntlBank.push(newIntlBank);
            }
            setFormData(prev => ({ ...prev, international_bank_details: updatedIntlBank }));
        }
        setEditingIntlBankIndex(null);
        setIntlBankRowData({ beneficiary_name: '', beneficiary_bank_name: '', beneficiary_account_no: '', beneficiary_iban_no: '', beneficiary_bank_address: '', beneficiary_swift_code: '', beneficiary_ach_no: '', beneficiary_aba_no: '', beneficiary_routing_no: '' });
        if (intlBankAttachmentInputRef.current) intlBankAttachmentInputRef.current.value = "";
        } finally {
            setLoadingAction(null);
        }
    };

    const handleIntlBankEdit = (index: number) => {
        const item = formData?.international_bank_details?.[index];
        if (!item) return;
        setIntlBankRowData({
            beneficiary_name: item.beneficiary_name,
            beneficiary_bank_name: item.beneficiary_bank_name,
            beneficiary_account_no: item.beneficiary_account_no,
            beneficiary_iban_no: item.beneficiary_iban_no,
            beneficiary_bank_address: item.beneficiary_bank_address,
            beneficiary_swift_code: item.beneficiary_swift_code,
            beneficiary_ach_no: item.beneficiary_ach_no,
            beneficiary_aba_no: item.beneficiary_aba_no,
            beneficiary_routing_no: item.beneficiary_routing_no,
        });
        setEditingIntlBankIndex(index);
    };

    const handleIntlBankDelete = async (index: number) => {
        if (confirm('Are you sure you want to delete this international bank detail?')) {
            if (onboarding_id) {
                const rowName = (formData?.international_bank_details?.[index] as any)?.name || '';
                try {
                    const res = await deleteImportBankDetailRow(onboarding_id, rowName);
                    alert(res?.message || 'International bank detail deleted successfully');
                    const details = await getQuickVendorOnboardingDetails(onboarding_id);
                    if (details?.message?.data) {
                        setFormData(prev => ({ ...prev, international_bank_details: details.message.data.international_bank_details as any || [] }));
                    }
                } catch (error: any) {
                    alert(error?.message?.message || 'Error deleting international bank detail');
                }
            } else {
                const updatedIntlBank = [...(formData?.international_bank_details || [])];
                updatedIntlBank.splice(index, 1);
                setFormData(prev => ({ ...prev, international_bank_details: updatedIntlBank }));
            }
        }
    };

    return (
        <div className="flex flex-col w-full mb-4 p-4">
            {/* Create Request Section */}
            <div className="pb-4 border-b border-gray-100">
                <h1 className="text-[18px] text-[#1E293B] font-semibold">
                    Create Request
                </h1>
            </div>

            <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Select Type */}
                <div className="col-span-1 flex flex-col gap-2">
                    <h2 className="text-[13px] font-medium text-[#64748B]">Select Type</h2>
                    <Select onValueChange={(value) => handleSelectChange(value, 'vendor_type')} value={formData.vendor_type} disabled={formData?.is_submitted === 1}>
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
                    <Select onValueChange={(value) => handleSelectChange(value, 'company_code')} value={formData.company_code} disabled={formData?.is_submitted === 1}>
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
                        disabled={formData?.is_submitted === 1}
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
                        disabled={formData?.is_submitted === 1}
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

                {/* Title & Name */}
                <div className="col-span-1 flex gap-2">
                    <div className="flex flex-col gap-2 w-[35%]">
                        <h2 className="text-[13px] font-medium text-[#64748B]">Title</h2>
                        <Select onValueChange={(value) => handleSelectChange(value, 'vendor_title')} value={formData.vendor_title} disabled={formData?.is_submitted === 1}>
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
                    <div className="flex flex-col gap-2 w-[65%]">
                        <h2 className="text-[13px] font-medium text-[#64748B]">Name</h2>
                        <Input
                            name="vendor_name"
                            placeholder="Name"
                            className="rounded-xl h-10 bg-white border-gray-200"
                            value={formData?.vendor_name ?? ''}
                            onChange={handleInputChange}
                            maxLength={40}
                            disabled={formData?.is_submitted === 1}
                        />
                    </div>
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
                        disabled={formData?.is_submitted === 1}
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
                        disabled={formData?.is_submitted === 1}
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
                        disabled={formData?.is_submitted === 1}
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
                        disabled={formData?.is_submitted === 1}
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
                        disabled={formData?.is_submitted === 1}
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
                        onChange={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, '');
                            handleInputChange(e);
                        }}
                        maxLength={10}
                        disabled={formData?.is_submitted === 1}
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
                        disabled={formData?.is_submitted === 1}
                    />
                </div>

            </div>

            {!onboarding_id && (
                <div className="flex justify-end pt-4">
                    <button
                        type="button"
                        onClick={handleCreateRequest}
                        disabled={loadingAction === 'createRequest'}
                        className="px-6 py-2 text-[14px] font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-600 transition-colors h-10 flex items-center gap-2 disabled:opacity-50"
                    >
                        {loadingAction === 'createRequest' && <Loader2 className="w-4 h-4 animate-spin" />}
                        Create Request
                    </button>
                </div>
            )}


            {onboarding_id && (<>
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
                            disabled={formData?.is_submitted === 1}
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
                            disabled={formData?.is_submitted === 1}
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
                            disabled={formData?.is_submitted === 1}
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
                            disabled={formData?.is_submitted === 1}
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
                            disabled={formData?.is_submitted === 1}
                        />
                    </div>

                </div>

                {/* Excise Details Section */}
                <div className="pb-4 border-b border-gray-100">
                    <h1 className="text-[18px] text-[#1E293B] font-semibold">
                        Excise Details
                    </h1>
                </div>

                {/* PAN - standalone field */}
                <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1 flex flex-col gap-2">
                        <h2 className="text-[13px] font-medium text-[#64748B]">PAN</h2>
                        <Input
                            name="pan_number"
                            placeholder="PAN Number"
                            className="rounded-xl h-10 bg-white border-gray-200"
                            value={formData?.pan_number || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, pan_number: e.target.value }))}
                            disabled={formData?.is_submitted === 1}
                        />
                    </div>
                </div>
                {

                    formData?.is_submitted !== 1 ?
                        <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* GST No. */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <h2 className="text-[13px] font-medium text-[#64748B]">GST No.</h2>
                                <Input
                                    name="gst_number"
                                    placeholder="0 - If Non available"
                                    className="rounded-xl h-10 bg-white border-gray-200"
                                    value={exciseRowData.gst_number}
                                    onChange={(e) => setExciseRowData(prev => ({ ...prev, gst_number: e.target.value }))}
                                    disabled={formData?.is_submitted === 1}
                                />
                            </div>

                            {/* GST ven class */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <h2 className="text-[13px] font-medium text-[#64748B]">GST ven class</h2>
                                <Input
                                    name="gst_ven_class"
                                    placeholder="0"
                                    className="rounded-xl h-10 bg-white border-gray-200"
                                    value={exciseRowData.gst_ven_class}
                                    onChange={(e) => setExciseRowData(prev => ({ ...prev, gst_ven_class: e.target.value }))}
                                    disabled={formData?.is_submitted === 1}
                                />
                            </div>

                            {/* Attachment */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <h2 className="text-[13px] font-medium text-[#64748B]">Attachment</h2>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        ref={attachmentInputRef}
                                        className="rounded-xl h-10 bg-white border-gray-200"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setExciseRowData(prev => ({ ...prev, attachment: e.target.files![0] }));
                                            }
                                        }}
                                        disabled={formData?.is_submitted === 1}
                                    />
                                    {editingExciseIndex !== null && (() => {
                                        const item = formData?.gst_details?.[editingExciseIndex] as any;
                                        const doc = item?.gst_document || item?.attachment;
                                        const fileUrl = doc?.url || doc?.file_url;
                                        const fileName = doc?.file_name || doc?.name;
                                        if (fileUrl) {
                                            return (
                                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xs underline whitespace-nowrap hover:text-blue-700" title={fileName}>
                                                    {fileName || 'View File'}
                                                </a>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>
                            </div>

                            {/* Add/Reset Buttons */}
                            <div className="col-span-1 flex items-end gap-2">
                                <button
                                    type="button"
                                    onClick={addGstDetail}
                                    disabled={loadingAction === 'addGst'}
                                    className={`px-6 py-2 text-[14px] font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-600 transition-colors h-10 flex items-center gap-2 disabled:opacity-50 ${formData?.is_submitted === 1 ? 'hidden' : ''}`}
                                >
                                    {loadingAction === 'addGst' && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingExciseIndex !== null ? 'Update' : 'Add'}
                                </button>
                                {editingExciseIndex !== null && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingExciseIndex(null);
                                            setExciseRowData({ gst_number: '', gst_ven_class: '', attachment: null });
                                            if (attachmentInputRef.current) attachmentInputRef.current.value = "";
                                        }}
                                        className={`px-6 py-2 text-[14px] font-medium text-[#3B82F6] bg-white border border-[#3B82F6] rounded-lg hover:bg-blue-50 transition-colors h-10 ${formData?.is_submitted === 1 ? 'hidden' : ''}`}
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>

                        </div> : ""
                }
                {/* Excise Details Table */}
                {(formData?.gst_details?.length ?? 0) > 0 && (
                    <Table className="overflow-y-scroll border border-black/20 mb-6">
                        <TableHeader>
                            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-nowrap">
                                <TableHead className="w-[8%]">Sr.no</TableHead>
                                <TableHead className="w-[28%]">GST Number</TableHead>
                                <TableHead className="w-[22%]">GST ven class</TableHead>
                                <TableHead className="w-[28%]">Attachment</TableHead>
                                {
                                    formData?.is_submitted !== 1 ?
                                        <TableHead className="w-[14%]">Action</TableHead> : ""
                                }
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {formData?.gst_details?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell className="font-medium">{item.gst_number}</TableCell>
                                    <TableCell className="font-medium">{item.gst_ven_class}</TableCell>
                                    <TableCell className="font-medium">
                                        {(() => {
                                            const doc = (item as any)?.gst_document || (item as any)?.attachment;
                                            const fileUrl = doc?.url || doc?.file_url;
                                            const fileName = doc?.file_name || doc?.name;

                                            if (fileUrl) {
                                                return (
                                                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700" title={fileName}>
                                                        {fileName || 'View File'}
                                                    </a>
                                                );
                                            } else if (doc?.name) {
                                                return <span className="text-blue-500">{doc.name}</span>;
                                            }
                                            return <span className="text-gray-400">-</span>;
                                        })()}
                                    </TableCell>
                                    {
                                        formData?.is_submitted !== 1 ?

                                            <TableCell className="font-medium">
                                                <div className="flex gap-4 justify-center items-center">
                                                    {/* Edit Icon */}
                                                    <svg
                                                        onClick={() => handleGstEdit(index)}
                                                        className="hover:cursor-pointer"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 22 22"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M12 20.0008H20.0001M14.0001 4.00045L18.0001 8.00054M20.1741 5.81249C20.7028 5.2839 20.9999 4.56693 21 3.8193C21.0001 3.07167 20.7032 2.35462 20.1746 1.8259C19.646 1.29718 18.9291 1.00009 18.1814 1C17.4338 0.999906 16.7168 1.29681 16.1881 1.8254L2.84195 15.1747C2.60977 15.4062 2.43806 15.6912 2.34195 16.0047L1.02093 20.3568C0.99509 20.4433 0.993138 20.5352 1.01529 20.6227C1.03743 20.7102 1.08286 20.7901 1.14673 20.8538C1.21061 20.9176 1.29056 20.9629 1.3781 20.9849C1.46564 21.0069 1.5575 21.0048 1.64394 20.9788L5.99698 19.6588C6.31015 19.5636 6.59516 19.3929 6.82699 19.1618L20.1741 5.81249Z"
                                                            stroke="#03111F"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    {/* Delete Icon */}
                                                    <Trash2
                                                        className="text-red-400 hover:cursor-pointer w-5 h-5"
                                                        onClick={() => handleGstDelete(index)}
                                                    />
                                                </div>
                                            </TableCell> : ""
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {/* Contact Person Section */}
                <div className="pb-4 border-b border-gray-100">
                    <h1 className="text-[18px] text-[#1E293B] font-semibold">
                        Contact Person
                    </h1>
                </div>
                {

                    formData?.is_submitted !== 1 ?
                        <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* First Name */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <h2 className="text-[13px] font-medium text-[#64748B]">First Name</h2>
                                <Input
                                    name="first_name"
                                    placeholder="Enter First Name"
                                    className="rounded-xl h-10 bg-white border-gray-200"
                                    value={contactRowData.first_name}
                                    onChange={(e) => setContactRowData(prev => ({ ...prev, first_name: e.target.value }))}
                                    disabled={formData?.is_submitted === 1}
                                />
                            </div>

                            {/* Last Name */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <h2 className="text-[13px] font-medium text-[#64748B]">Last Name</h2>
                                <Input
                                    name="last_name"
                                    placeholder="Enter Last Name"
                                    className="rounded-xl h-10 bg-white border-gray-200"
                                    value={contactRowData.last_name}
                                    onChange={(e) => setContactRowData(prev => ({ ...prev, last_name: e.target.value }))}
                                    disabled={formData?.is_submitted === 1}
                                />
                            </div>

                            {/* Add/Reset Buttons */}
                            <div className="col-span-1 flex items-end gap-2">
                                <button
                                    type="button"
                                    onClick={addContact}
                                    disabled={loadingAction === 'addContact'}
                                    className={`px-6 py-2 text-[14px] font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-600 transition-colors h-10 flex items-center gap-2 disabled:opacity-50 ${formData?.is_submitted === 1 ? 'hidden' : ''}`}
                                >
                                    {loadingAction === 'addContact' && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingContactIndex !== null ? 'Update' : 'Add'}
                                </button>
                                {editingContactIndex !== null && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingContactIndex(null);
                                            setContactRowData({ first_name: '', last_name: '' });
                                        }}
                                        className={`px-6 py-2 text-[14px] font-medium text-[#3B82F6] bg-white border border-[#3B82F6] rounded-lg hover:bg-blue-50 transition-colors h-10 ${formData?.is_submitted === 1 ? 'hidden' : ''}`}
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>

                        </div> : ""
                }
                {/* Contact Person Table */}
                {(formData?.contact_persons?.length ?? 0) > 0 && (
                    <Table className="overflow-y-scroll border border-black/20 mb-6">
                        <TableHeader>
                            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-nowrap">
                                <TableHead className="w-[10%]">Sr.no</TableHead>
                                <TableHead className="w-[35%]">First Name</TableHead>
                                <TableHead className="w-[35%]">Last Name</TableHead>
                                {
                                    formData?.is_submitted !== 1 ?
                                        <TableHead className="w-[20%]">Action</TableHead> : ""
                                }
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {formData?.contact_persons?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell className="font-medium">{item.first_name}</TableCell>
                                    <TableCell className="font-medium">{item.last_name}</TableCell>
                                    {
                                        formData?.is_submitted !== 1 ?

                                            <TableCell className="font-medium">
                                                <div className="flex gap-4 justify-center items-center">
                                                    {/* Edit Icon */}
                                                    <svg
                                                        onClick={() => handleContactEdit(index)}
                                                        className="hover:cursor-pointer"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 22 22"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M12 20.0008H20.0001M14.0001 4.00045L18.0001 8.00054M20.1741 5.81249C20.7028 5.2839 20.9999 4.56693 21 3.8193C21.0001 3.07167 20.7032 2.35462 20.1746 1.8259C19.646 1.29718 18.9291 1.00009 18.1814 1C17.4338 0.999906 16.7168 1.29681 16.1881 1.8254L2.84195 15.1747C2.60977 15.4062 2.43806 15.6912 2.34195 16.0047L1.02093 20.3568C0.99509 20.4433 0.993138 20.5352 1.01529 20.6227C1.03743 20.7102 1.08286 20.7901 1.14673 20.8538C1.21061 20.9176 1.29056 20.9629 1.3781 20.9849C1.46564 21.0069 1.5575 21.0048 1.64394 20.9788L5.99698 19.6588C6.31015 19.5636 6.59516 19.3929 6.82699 19.1618L20.1741 5.81249Z"
                                                            stroke="#03111F"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    {/* Delete Icon */}
                                                    <Trash2
                                                        className="text-red-400 hover:cursor-pointer w-5 h-5"
                                                        onClick={() => handleContactDelete(index)}
                                                    />
                                                </div>
                                            </TableCell> : ""
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {/* Bank Detail (Domestic) Section */}
                <div className="pb-4 border-b border-gray-100">
                    <h1 className="text-[18px] text-[#1E293B] font-semibold">
                        Bank Detail (Domestic)
                    </h1>
                </div>
                {
                    formData?.is_submitted !== 1 ?

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
                                    setData={(value) => setBankRowData(prev => ({ ...prev, country: value ?? '' }))}
                                    data={bankRowData.country}
                                    placeholder="IN"
                                    disabled={formData?.is_submitted === 1}
                                />
                            </div>

                            {/* Bank Key */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <h2 className="text-[13px] font-medium text-[#64748B]">Bank Key</h2>
                                <SearchSelectComponent
                                    searchApi={(query?: string) => {
                                        return getBankKeyMasterData(bankRowData.country || undefined, query)
                                            .then((res) => { setBankKeyDropdown(res?.message?.data); return res?.message?.data; })
                                            .catch((err) => { console.error(err); return []; });
                                    }}
                                    getLabel={(item) => item?.bank_code}
                                    getValue={(item) => item?.name}
                                    setDropdown={setBankKeyDropdown}
                                    dropdown={bankKeyDropdown}
                                    setData={(value) => {
                                        const selectedBank = bankKeyDropdown.find((item) => item.name === value);
                                        setBankRowData(prev => ({
                                            ...prev,
                                            bank_key: selectedBank?.name ?? '',
                                            bank_name: value ?? '',
                                        }));
                                    }}
                                    data={bankRowData.bank_name}
                                    placeholder="Select Bank Key"
                                    disabled={formData?.is_submitted === 1}
                                />
                            </div>

                            {/* Bank Name */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <h2 className="text-[13px] font-medium text-[#64748B]">Bank Name</h2>
                                <Input
                                    name="bank_name"
                                    placeholder="Bank Name"
                                    className="rounded-xl h-10 bg-white border-gray-200"
                                    value={bankRowData.bank_name}
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
                                    value={bankRowData.account_number}
                                    onChange={(e) => setBankRowData(prev => ({ ...prev, account_number: e.target.value }))}
                                    disabled={formData?.is_submitted === 1}
                                />
                            </div>

                            {/* Account Holder */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <h2 className="text-[13px] font-medium text-[#64748B]">Account Holder</h2>
                                <Input
                                    name="name_of_account_holder"
                                    placeholder="Name of Account Holder"
                                    className="rounded-xl h-10 bg-white border-gray-200"
                                    value={bankRowData.name_of_account_holder}
                                    onChange={(e) => setBankRowData(prev => ({ ...prev, name_of_account_holder: e.target.value }))}
                                    disabled={formData?.is_submitted === 1}
                                />
                            </div>

                            {/* AK */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <h2 className="text-[13px] font-medium text-[#64748B]">AK</h2>
                                <Input
                                    name="ak"
                                    placeholder=""
                                    className="rounded-xl h-10 bg-white border-gray-200"
                                    value={bankRowData.ak}
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
                                    value={bankRowData.bnkt}
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
                                    value={bankRowData.ifsc_code}
                                    onChange={(e) => setBankRowData(prev => ({ ...prev, ifsc_code: e.target.value }))}
                                    disabled={formData?.is_submitted === 1}
                                />
                            </div>

                            {/* Attachment */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <h2 className="text-[13px] font-medium text-[#64748B]">Attachment</h2>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        ref={bankAttachmentInputRef}
                                        className="rounded-xl h-10 bg-white border-gray-200"
                                        disabled={formData?.is_submitted === 1}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setBankRowData(prev => ({ ...prev, attachment: e.target.files![0] }));
                                            }
                                        }}
                                    />
                                    {editingBankIndex !== null && (() => {
                                        const item = formData?.bank_details?.[editingBankIndex] as any;
                                        const doc = item?.domestic_bank_proof || item?.attachment;
                                        const fileUrl = doc?.url || doc?.file_url;
                                        const fileName = doc?.file_name || doc?.name;
                                        if (fileUrl) {
                                            return (
                                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xs underline whitespace-nowrap hover:text-blue-700" title={fileName}>
                                                    {fileName || 'View File'}
                                                </a>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>
                            </div>

                        </div> : ""
                }
                {/* Add/Reset Buttons */}
                <div className="flex justify-end gap-2 pb-4">
                    <button
                        type="button"
                        onClick={addBankDetail}
                        disabled={loadingAction === 'addBank'}
                        className={`px-6 py-2 text-[14px] font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-600 transition-colors h-10 flex items-center gap-2 disabled:opacity-50 ${formData?.is_submitted === 1 ? 'hidden' : ''}`}
                    >
                        {loadingAction === 'addBank' && <Loader2 className="w-4 h-4 animate-spin" />}
                        {editingBankIndex !== null ? 'Update' : 'Add'}
                    </button>
                    {editingBankIndex !== null && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingBankIndex(null);
                                setBankRowData({ country: '', bank_key: '', bank_name: '', account_number: '', name_of_account_holder: '', ak: '', bnkt: '', ifsc_code: '', bank_type: '' });
                                if (bankAttachmentInputRef.current) bankAttachmentInputRef.current.value = "";
                            }}
                            className={`px-6 py-2 text-[14px] font-medium text-[#3B82F6] bg-white border border-[#3B82F6] rounded-lg hover:bg-blue-50 transition-colors h-10 ${formData?.is_submitted === 1 ? 'hidden' : ''}`}
                        >
                            Reset
                        </button>
                    )}
                </div>

                {/* Bank Detail (Domestic) Table */}
                {(formData?.bank_details?.length ?? 0) > 0 && (
                    <Table className="overflow-x-auto border border-black/20 mb-6">
                        <TableHeader>
                            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-nowrap">
                                <TableHead>Sr.no</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>Bank Key</TableHead>
                                <TableHead>Bank Name</TableHead>
                                <TableHead>Bank Account</TableHead>
                                <TableHead>Account Holder</TableHead>
                                <TableHead>AK</TableHead>
                                <TableHead>BnkT</TableHead>
                                <TableHead>Reference Detail</TableHead>
                                <TableHead>Attachment</TableHead>
                                {
                                    formData?.is_submitted !== 1 ?
                                        <TableHead>Action</TableHead> : ""
                                }
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {formData?.bank_details?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell className="font-medium">{item.country}</TableCell>
                                    <TableCell className="font-medium">{item.bank_key}</TableCell>
                                    <TableCell className="font-medium">{item.bank_name}</TableCell>
                                    <TableCell className="font-medium">{item.account_number}</TableCell>
                                    <TableCell className="font-medium">{item.name_of_account_holder}</TableCell>
                                    <TableCell className="font-medium">{item.ak}</TableCell>
                                    <TableCell className="font-medium">{item.bnkt}</TableCell>
                                    <TableCell className="font-medium">{item.ifsc_code}</TableCell>
                                    <TableCell className="font-medium">
                                        {(() => {
                                            const doc = (item as any)?.domestic_bank_proof || (item as any)?.attachment;
                                            const fileUrl = doc?.url || doc?.file_url;
                                            const fileName = doc?.file_name || doc?.name;

                                            if (fileUrl) {
                                                return (
                                                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700" title={fileName}>
                                                        {fileName || 'View File'}
                                                    </a>
                                                );
                                            } else if (doc?.name) {
                                                return <span className="text-blue-500">{doc.name}</span>;
                                            }
                                            return <span className="text-gray-400">-</span>;
                                        })()}
                                    </TableCell>
                                    {
                                        formData?.is_submitted !== 1 ?

                                            <TableCell className="font-medium">
                                                <div className="flex gap-4 justify-center items-center">
                                                    {/* Edit Icon */}
                                                    <svg
                                                        onClick={() => handleBankEdit(index)}
                                                        className="hover:cursor-pointer"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 22 22"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M12 20.0008H20.0001M14.0001 4.00045L18.0001 8.00054M20.1741 5.81249C20.7028 5.2839 20.9999 4.56693 21 3.8193C21.0001 3.07167 20.7032 2.35462 20.1746 1.8259C19.646 1.29718 18.9291 1.00009 18.1814 1C17.4338 0.999906 16.7168 1.29681 16.1881 1.8254L2.84195 15.1747C2.60977 15.4062 2.43806 15.6912 2.34195 16.0047L1.02093 20.3568C0.99509 20.4433 0.993138 20.5352 1.01529 20.6227C1.03743 20.7102 1.08286 20.7901 1.14673 20.8538C1.21061 20.9176 1.29056 20.9629 1.3781 20.9849C1.46564 21.0069 1.5575 21.0048 1.64394 20.9788L5.99698 19.6588C6.31015 19.5636 6.59516 19.3929 6.82699 19.1618L20.1741 5.81249Z"
                                                            stroke="#03111F"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    {/* Delete Icon */}
                                                    <Trash2
                                                        className="text-red-400 hover:cursor-pointer w-5 h-5"
                                                        onClick={() => handleBankDelete(index)}
                                                    />
                                                </div>
                                            </TableCell> : ""
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {/* Bank Detail (International) Section */}
                <div className="pb-4 border-b border-gray-100">
                    <h1 className="text-[18px] text-[#1E293B] font-semibold">
                        Bank Detail (International)
                    </h1>
                </div>
                {
                    formData?.is_submitted !== 1 ?
                        <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Beneficiary Name */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <h2 className="text-[13px] font-medium text-[#64748B]">Beneficiary Name</h2>
                                <Input
                                    name="beneficiary_name"
                                    placeholder="Beneficiary Name"
                                    className="rounded-xl h-10 bg-white border-gray-200"
                                    value={intlBankRowData.beneficiary_name}
                                    onChange={(e) => setIntlBankRowData(prev => ({ ...prev, beneficiary_name: e.target.value }))}
                                    disabled={formData?.is_submitted === 1}
                                />
                            </div>

                            {/* Beneficiary Bank Name */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <h2 className="text-[13px] font-medium text-[#64748B]">Beneficiary Bank Name</h2>
                                <Input
                                    name="beneficiary_bank_name"
                                    placeholder="Beneficiary Bank Name"
                                    className="rounded-xl h-10 bg-white border-gray-200"
                                    value={intlBankRowData.beneficiary_bank_name}
                                    onChange={(e) => setIntlBankRowData(prev => ({ ...prev, beneficiary_bank_name: e.target.value }))}
                                    disabled={formData?.is_submitted === 1}
                                />
                            </div>

                            {/* Beneficiary Account No. */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <h2 className="text-[13px] font-medium text-[#64748B]">Beneficiary Account No.</h2>
                                <Input
                                    name="beneficiary_account_no"
                                    placeholder="Beneficiary Account No."
                                    className="rounded-xl h-10 bg-white border-gray-200"
                                    value={intlBankRowData.beneficiary_account_no}
                                    onChange={(e) => setIntlBankRowData(prev => ({ ...prev, beneficiary_account_no: e.target.value }))}
                                    disabled={formData?.is_submitted === 1}
                                />
                            </div>

                            {/* Beneficiary IBAN No. */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <h2 className="text-[13px] font-medium text-[#64748B]">Beneficiary IBAN No.</h2>
                                <Input
                                    name="beneficiary_iban_no"
                                    placeholder="Beneficiary IBAN No."
                                    className="rounded-xl h-10 bg-white border-gray-200"
                                    value={intlBankRowData.beneficiary_iban_no}
                                    onChange={(e) => setIntlBankRowData(prev => ({ ...prev, beneficiary_iban_no: e.target.value }))}
                                    disabled={formData?.is_submitted === 1}
                                />
                            </div>

                            {/* Beneficiary Bank Address */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <h2 className="text-[13px] font-medium text-[#64748B]">Beneficiary Bank Address</h2>
                                <Input
                                    name="beneficiary_bank_address"
                                    placeholder="Beneficiary Bank Address"
                                    className="rounded-xl h-10 bg-white border-gray-200"
                                    value={intlBankRowData.beneficiary_bank_address}
                                    onChange={(e) => setIntlBankRowData(prev => ({ ...prev, beneficiary_bank_address: e.target.value }))}
                                    disabled={formData?.is_submitted === 1}
                                />
                            </div>

                            {/* Beneficiary Bank Swift Code */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <h2 className="text-[13px] font-medium text-[#64748B]">Beneficiary Bank Swift Code</h2>
                                <Input
                                    name="beneficiary_swift_code"
                                    placeholder="Beneficiary Bank Swift Code"
                                    className="rounded-xl h-10 bg-white border-gray-200"
                                    value={intlBankRowData.beneficiary_swift_code}
                                    onChange={(e) => setIntlBankRowData(prev => ({ ...prev, beneficiary_swift_code: e.target.value }))}
                                    disabled={formData?.is_submitted === 1}
                                />
                            </div>

                            {/* Beneficiary ACH No. */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <h2 className="text-[13px] font-medium text-[#64748B]">Beneficiary ACH No.</h2>
                                <Input
                                    name="beneficiary_ach_no"
                                    placeholder="Beneficiary ACH No."
                                    className="rounded-xl h-10 bg-white border-gray-200"
                                    value={intlBankRowData.beneficiary_ach_no}
                                    onChange={(e) => setIntlBankRowData(prev => ({ ...prev, beneficiary_ach_no: e.target.value }))}
                                    disabled={formData?.is_submitted === 1}
                                />
                            </div>

                            {/* Beneficiary ABA No. */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <h2 className="text-[13px] font-medium text-[#64748B]">Beneficiary ABA No.</h2>
                                <Input
                                    name="beneficiary_aba_no"
                                    placeholder="Beneficiary ABA No."
                                    className="rounded-xl h-10 bg-white border-gray-200"
                                    value={intlBankRowData.beneficiary_aba_no}
                                    onChange={(e) => setIntlBankRowData(prev => ({ ...prev, beneficiary_aba_no: e.target.value }))}
                                    disabled={formData?.is_submitted === 1}
                                />
                            </div>

                            {/* Beneficiary Routing No. */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <h2 className="text-[13px] font-medium text-[#64748B]">Beneficiary Routing No.</h2>
                                <Input
                                    name="beneficiary_routing_no"
                                    placeholder="Beneficiary Routing No."
                                    className="rounded-xl h-10 bg-white border-gray-200"
                                    value={intlBankRowData.beneficiary_routing_no}
                                    onChange={(e) => setIntlBankRowData(prev => ({ ...prev, beneficiary_routing_no: e.target.value }))}
                                    disabled={formData?.is_submitted === 1}
                                />
                            </div>

                            {/* Attachment */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <h2 className="text-[13px] font-medium text-[#64748B]">Attachment</h2>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        ref={intlBankAttachmentInputRef}
                                        className="rounded-xl h-10 bg-white border-gray-200"
                                        disabled={formData?.is_submitted === 1}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setIntlBankRowData(prev => ({ ...prev, attachment: e.target.files![0] }));
                                            }
                                        }}
                                    />
                                    {editingIntlBankIndex !== null && (() => {
                                        const item = formData?.international_bank_details?.[editingIntlBankIndex] as any;
                                        const doc = item?.import_bank_proof || item?.attachment;
                                        const fileUrl = doc?.url || doc?.file_url;
                                        const fileName = doc?.file_name || doc?.name;
                                        if (fileUrl) {
                                            return (
                                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xs underline whitespace-nowrap hover:text-blue-700" title={fileName}>
                                                    {fileName || 'View File'}
                                                </a>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>
                            </div>

                        </div> : ""
                }

                {/* Add/Reset Buttons */}
                <div className="flex justify-end gap-2 pb-4">
                    <button
                        type="button"
                        onClick={addIntlBankDetail}
                        disabled={loadingAction === 'addIntlBank'}
                        className={`px-6 py-2 text-[14px] font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-600 transition-colors h-10 flex items-center gap-2 disabled:opacity-50 ${formData?.is_submitted === 1 ? 'hidden' : ''}`}
                    >
                        {loadingAction === 'addIntlBank' && <Loader2 className="w-4 h-4 animate-spin" />}
                        {editingIntlBankIndex !== null ? 'Update' : 'Add'}
                    </button>
                    {editingIntlBankIndex !== null && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingIntlBankIndex(null);
                                setIntlBankRowData({ beneficiary_name: '', beneficiary_bank_name: '', beneficiary_account_no: '', beneficiary_iban_no: '', beneficiary_bank_address: '', beneficiary_swift_code: '', beneficiary_ach_no: '', beneficiary_aba_no: '', beneficiary_routing_no: '' });
                                if (intlBankAttachmentInputRef.current) intlBankAttachmentInputRef.current.value = "";
                            }}
                            className={`px-6 py-2 text-[14px] font-medium text-[#3B82F6] bg-white border border-[#3B82F6] rounded-lg hover:bg-blue-50 transition-colors h-10 ${formData?.is_submitted === 1 ? 'hidden' : ''}`}
                        >
                            Reset
                        </button>
                    )}
                </div>

                {/* Bank Detail (International) Table */}
                {(formData?.international_bank_details?.length ?? 0) > 0 && (
                    <Table className="overflow-x-auto border border-black/20 mb-6">
                        <TableHeader>
                            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-nowrap">
                                <TableHead>Sr.no</TableHead>
                                <TableHead>Beneficiary Name</TableHead>
                                <TableHead>Beneficiary Bank Name</TableHead>
                                <TableHead>Beneficiary Account No.</TableHead>
                                <TableHead>Beneficiary IBAN No.</TableHead>
                                <TableHead>Beneficiary Bank Address</TableHead>
                                <TableHead>Benef</TableHead>
                                <TableHead>Attachment</TableHead>
                                {
                                    formData?.is_submitted !== 1 ?
                                        <TableHead>Action</TableHead> : ""
                                }
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {formData?.international_bank_details?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell className="font-medium">{item.beneficiary_name}</TableCell>
                                    <TableCell className="font-medium">{item.beneficiary_bank_name}</TableCell>
                                    <TableCell className="font-medium">{item.beneficiary_account_no}</TableCell>
                                    <TableCell className="font-medium">{item.beneficiary_iban_no}</TableCell>
                                    <TableCell className="font-medium">{item.beneficiary_bank_address}</TableCell>
                                    <TableCell className="font-medium">{item.beneficiary_swift_code}</TableCell>
                                    <TableCell className="font-medium">
                                        {(() => {
                                            const doc = (item as any)?.import_bank_proof || (item as any)?.attachment;
                                            const fileUrl = doc?.url || doc?.file_url;
                                            const fileName = doc?.file_name || doc?.name;

                                            if (fileUrl) {
                                                return (
                                                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700" title={fileName}>
                                                        {fileName || 'View File'}
                                                    </a>
                                                );
                                            } else if (doc?.name) {
                                                return <span className="text-blue-500">{doc.name}</span>;
                                            }
                                            return <span className="text-gray-400">-</span>;
                                        })()}
                                    </TableCell>
                                    {
                                        formData?.is_submitted !== 1 ?

                                            <TableCell className="font-medium">
                                                <div className="flex gap-4 justify-center items-center">
                                                    {/* Edit Icon */}
                                                    <svg
                                                        onClick={() => handleIntlBankEdit(index)}
                                                        className="hover:cursor-pointer"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 22 22"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M12 20.0008H20.0001M14.0001 4.00045L18.0001 8.00054M20.1741 5.81249C20.7028 5.2839 20.9999 4.56693 21 3.8193C21.0001 3.07167 20.7032 2.35462 20.1746 1.8259C19.646 1.29718 18.9291 1.00009 18.1814 1C17.4338 0.999906 16.7168 1.29681 16.1881 1.8254L2.84195 15.1747C2.60977 15.4062 2.43806 15.6912 2.34195 16.0047L1.02093 20.3568C0.99509 20.4433 0.993138 20.5352 1.01529 20.6227C1.03743 20.7102 1.08286 20.7901 1.14673 20.8538C1.21061 20.9176 1.29056 20.9629 1.3781 20.9849C1.46564 21.0069 1.5575 21.0048 1.64394 20.9788L5.99698 19.6588C6.31015 19.5636 6.59516 19.3929 6.82699 19.1618L20.1741 5.81249Z"
                                                            stroke="#03111F"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    {/* Delete Icon */}
                                                    <Trash2
                                                        className="text-red-400 hover:cursor-pointer w-5 h-5"
                                                        onClick={() => handleIntlBankDelete(index)}
                                                    />
                                                </div>
                                            </TableCell> : ""
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

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
                            disabled={formData?.is_submitted === 1}
                        />
                    </div>

                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleSaveAsDraft}
                        disabled={loadingAction === 'saveAsDraft'}
                        className={`px-6 py-2 text-[14px] font-medium text-[#3B82F6] border border-[#3B82F6] rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 disabled:opacity-50 ${formData?.is_submitted === 1 ? 'hidden' : ''}`}
                    >
                        {loadingAction === 'saveAsDraft' && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save as Draft
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loadingAction === 'submit'}
                        className={`px-6 py-2 text-[14px] font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 ${formData?.is_submitted === 1 ? 'hidden' : ''}`}
                    >
                        {loadingAction === 'submit' && <Loader2 className="w-4 h-4 animate-spin" />}
                        Submit
                    </button>
                </div>
            </>)}

        </div >
    );
}

export default QuickVendorForm;