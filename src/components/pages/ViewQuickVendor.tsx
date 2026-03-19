'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getQuickVendorOnboardingDetails, accountsTeamApproval } from '@/src/services/quickVendor/quickVendor.services';
import { TOnboardingData } from '@/src/types/quickVendor/quickVendor.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/atoms/table';
import Link from 'next/link';
import { Button } from '@/src/components/atoms/button';
import { Input } from '@/src/components/atoms/input';
import PopUp from '@/src/components/molecules/PopUp';
import { Loader2 } from 'lucide-react';

const DataField = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className='col-span-1 flex flex-col gap-1'>
        <h1 className='text-[14px] text-[#626973]'>{label}</h1>
        <span className='text-[13px] font-medium text-[#03111F]'>{value || '-'}</span>
    </div>
);

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="shadow-sm mb-4 p-4 rounded-2xl mt-4">
        <div className="flex w-full justify-between pb-4">
            <h1 className="text-[16px] text-[#03111F] font-semibold">{title}</h1>
        </div>
        {children}
    </div>
);

const renderAttachment = (attachment: any) => {
    const doc = attachment?.gst_attachment_detail || attachment?.bank_attachment_detail || attachment?.domestic_bank_proof || attachment?.import_bank_proof || attachment;
    const url = doc?.url || doc?.file_url;
    const name = doc?.file_name || doc?.name;

    if (url) {
        return <Link href={url} target='_blank' className="text-blue-500 hover:text-blue-700 underline">{name || 'View File'}</Link>;
    }
    return <span className="text-gray-400">-</span>;
};

const ViewQuickOnboardingContent = () => {
    const searchParams = useSearchParams();
    const onboardingId = searchParams.get('onboarding_id');
    const [data, setData] = useState<TOnboardingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isApprovedDialog, setIsApprovedDialog] = useState(false);
    const [isRejectDialog, setIsRejectDialog] = useState(false);
    const [comment, setComment] = useState<string>("");
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    const handleClose = () => {
        setIsApprovedDialog(false);
        setIsRejectDialog(false);
        setComment("");
    };

    const handleApprovalSubmit = async () => {
        try {
            setLoadingAction('approve');
            if (onboardingId) {
                const response = await accountsTeamApproval({
                    data: {
                        onboarding_id: onboardingId,
                        action: 1,
                        remarks: comment || "Approved"
                    }
                });
                console.log(response);
                alert(response?.message?.message);
                fetchData();
                // TODO: router.push('/dashboard') or similar navigation
            }
        } catch (error:any) {
            console.error("Approval flow error:", error);
            alert(error?.message?.message);
        } finally {
            setLoadingAction(null);
            setIsApprovedDialog(false);
            setComment("");
        }
    };

    const handleRejectSubmit = async () => {
        try {
            setLoadingAction('reject');
            if (onboardingId) {
                const response = await accountsTeamApproval({
                    data: {
                        onboarding_id: onboardingId,
                        action: 0,
                        remarks: comment || "Rejected"
                    }
                });
                console.log(response?.message?.message);
                alert(response?.message?.message);
                fetchData();
                // TODO: router.push('/dashboard') or similar navigation
            }
        } catch (error:any) {
            console.error(error);
            alert(error?.message?.message);
        } finally {
            setLoadingAction(null);
            setIsRejectDialog(false);
            setComment("");
        }
    };

    const fetchData = () => {
        if (onboardingId) {
            setLoading(true);
            getQuickVendorOnboardingDetails(onboardingId)
                .then(res => {
                    setData(res?.message?.data);
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [onboardingId]);

    if (loading) {
        return <div className="p-8 text-gray-500 text-center">Loading Vendor Details...</div>;
    }

    const title = data?.vendor_title ? `${data.vendor_title} ` : '';
    const name = data?.vendor_name || '';

    return (
        <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[85vh] overflow-y-auto w-full">
            <Section title="General Data">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 p-3">
                    <DataField label="Name" value={`${title}${name}`} />
                    <DataField label="Search Term" value={data?.search_term} />
                    <DataField label="Street / House No." value={data?.street_house_no} />
                    <DataField label="Street 2" value={data?.street_2} />
                    <DataField label="Street 3" value={data?.street_3} />
                    <DataField label="Street 4" value={data?.street_4} />
                    <DataField label="City" value={data?.city} />
                    <DataField label="District" value={data?.district} />
                    <DataField label="Postal Code" value={data?.postal_code} />
                    <DataField label="Country" value={data?.country} />
                    <DataField label="Region" value={data?.region} />
                    <DataField label="Mobile No." value={data?.mobile_number} />
                    <DataField label="E-Mail Address" value={data?.email} />
                </div>
            </Section>

            <Section title="Company Data">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 p-3">
                    <DataField label="Vendor Type" value={data?.vendor_types?.join(', ')} />
                    <DataField label="Company Code" value={data?.company_code} />
                    <DataField label="Purchase Organization" value={data?.purchase_organization} />
                    <DataField label="Account Group" value={data?.account_group} />
                </div>
            </Section>

            <Section title="Purchasing Data">
                <div className="flex gap-6 w-full pb-4">
                    <label className="flex items-center gap-2 text-[13px] font-medium text-[#64748B]">
                        <input type="checkbox" checked={!!(data?.payee_in_document)} disabled className="w-4 h-4 accent-blue-500" />
                        Payee in document
                    </label>
                    <label className="flex items-center gap-2 text-[13px] font-medium text-[#64748B]">
                        <input type="checkbox" checked={!!(data?.check_double_invoice)} disabled className="w-4 h-4 accent-blue-500" />
                        Check double invoice
                    </label>
                    <label className="flex items-center gap-2 text-[13px] font-medium text-[#64748B]">
                        <input type="checkbox" checked={!!(data?.gr_base_inv_ver)} disabled className="w-4 h-4 accent-blue-500" />
                        GR-Based Inv. Verif.
                    </label>
                    <label className="flex items-center gap-2 text-[13px] font-medium text-[#64748B]">
                        <input type="checkbox" checked={!!(data?.service_base_inv_ver)} disabled className="w-4 h-4 accent-blue-500" />
                        Service-Based Invoice Verification
                    </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 p-3">
                    <DataField label="PAN Number" value={data?.pan_number} />
                    <DataField label="Reconciliation Account" value={data?.reconciliation_account} />
                    <DataField label="Order Currency" value={data?.order_currency} />
                    <DataField label="Term of Payment" value={data?.terms_of_payment} />
                    <DataField label="Inco Terms" value={data?.incoterms} />
                </div>
            </Section>

            <Section title="Administrative Data">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-3">
                    <DataField label="Email Requestor" value={data?.requestor_name} />
                    <DataField label="Vendor Code" value={data?.vendor_code} />
                </div>
            </Section>

            <Section title="Excise / GST Details">
                {data?.gst_details && data.gst_details.length > 0 ? (
                    <Table className="relative">
                        <TableHeader>
                            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-nowrap">
                                <TableHead className="w-[100px]">Sr No.</TableHead>
                                <TableHead>GST State</TableHead>
                                <TableHead>GST No.</TableHead>
                                <TableHead>GST ven class</TableHead>
                                <TableHead>Attachment</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.gst_details.map((item, index) => (
                                <TableRow key={index} className='bg-white'>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>{item?.gst_state || '-'}</TableCell>
                                    <TableCell>{item?.gst_number || '-'}</TableCell>
                                    <TableCell>{item?.gst_ven_class || '-'}</TableCell>
                                    <TableCell>{renderAttachment(item?.gst_document || data?.gst_attachment?.[index])}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-[14px] text-gray-500 p-3">No GST details provided.</div>
                )}
            </Section>

            <Section title="Contact Person">
                {data?.contact_persons && data.contact_persons.length > 0 ? (
                    <Table className="relative">
                        <TableHeader>
                            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-nowrap">
                                <TableHead className="w-[100px]">Sr No.</TableHead>
                                <TableHead>First Name</TableHead>
                                <TableHead>Last Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Contact</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.contact_persons.map((item, index) => (
                                <TableRow key={index} className='bg-white'>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>{item?.first_name || item?.name || '-'}</TableCell>
                                    <TableCell>{item?.last_name || '-'}</TableCell>
                                    <TableCell>{item?.email || '-'}</TableCell>
                                    <TableCell>{item?.contact_number || '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-[14px] text-gray-500 p-3">No contact persons provided.</div>
                )}
            </Section>

            <Section title="Domestic Bank Detail">
                {data?.bank_details && data.bank_details.length > 0 ? (
                    <Table className="relative">
                        <TableHeader>
                            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-nowrap">
                                <TableHead className="w-[80px]">Sr No.</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>Bank Key / Name</TableHead>
                                <TableHead>Account Number</TableHead>
                                <TableHead>Account Holder</TableHead>
                                <TableHead>AK / BnkT</TableHead>
                                <TableHead>IFSC</TableHead>
                                <TableHead>Attachment</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.bank_details.map((item, index) => (
                                <TableRow key={index} className='bg-white'>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>{item?.country || '-'}</TableCell>
                                    <TableCell>{item?.bank_name || '-'}</TableCell>
                                    <TableCell>{item?.account_number || '-'}</TableCell>
                                    <TableCell>{item?.name || '-'}</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>{renderAttachment(item?.domestic_bank_proof || data?.bank_details_attachment?.[index])}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-[14px] text-gray-500 p-3">No domestic bank details provided.</div>
                )}
            </Section>

            {data?.international_bank_details && data.international_bank_details.length > 0 && (
                <Section title="International Bank Detail">
                    <Table className="relative max-w-full overflow-x-auto">
                        <TableHeader>
                            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-nowrap">
                                <TableHead>Sr No.</TableHead>
                                <TableHead>Beneficiary Name</TableHead>
                                <TableHead>Beneficiary Bank</TableHead>
                                <TableHead>Beneficiary Account</TableHead>
                                <TableHead>IBAN No.</TableHead>
                                <TableHead>Swift Code</TableHead>
                                <TableHead>Attachment</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.international_bank_details.map((item, index) => (
                                <TableRow key={index} className='bg-white text-nowrap'>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>{item?.beneficiary_name || '-'}</TableCell>
                                    <TableCell>{item?.beneficiary_bank_name || '-'}</TableCell>
                                    <TableCell>{item?.beneficiary_account_no || '-'}</TableCell>
                                    <TableCell>{item?.iban_no || '-'}</TableCell>
                                    <TableCell>{item?.swift_code || '-'}</TableCell>
                                    <TableCell>{renderAttachment(item?.import_bank_proof)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Section>
            )}

            {

                data?.can_approve === 1 ?
                    <div className="w-full flex justify-end gap-5 pt-6 pb-2">
                        <Button
                            variant="backbtn"
                            size="backbtnsize"
                            className="py-2 flex items-center gap-2"
                            disabled={loadingAction === 'reject'}
                            onClick={() => { setIsRejectDialog(true); }}
                        >
                            {loadingAction === 'reject' && <Loader2 className="w-4 h-4 animate-spin" />}
                            Reject
                        </Button>
                        <Button
                            variant="nextbtn"
                            size="nextbtnsize"
                            className="py-2 flex items-center gap-2"
                            disabled={loadingAction === 'approve'}
                            onClick={() => { setIsApprovedDialog(true); }}
                        >
                            {loadingAction === 'approve' && <Loader2 className="w-4 h-4 animate-spin" />}
                            Approve
                        </Button>
                    </div> : ""
            }

            {
                isApprovedDialog &&
                <PopUp Submitbutton={handleApprovalSubmit} isSubmit={true} disableSubmit={loadingAction === 'approve'} headerText='Are You Sure You Want to Approve ?' handleClose={handleClose} classname='pb-3 md:w-full md:max-w-[600px] md:max-h-[400px]' isHeaderTextUnderline={true}>
                    <Input className='mt-3 rounded-xl py-2' placeholder='Enter your comment here...' onChange={(e) => { setComment(e.target.value) }} />
                    {loadingAction === 'approve' && <div className="flex items-center gap-2 mt-2 text-sm text-gray-500"><Loader2 className="w-4 h-4 animate-spin" /> Processing...</div>}
                </PopUp>
            }
            {
                isRejectDialog &&
                <PopUp Submitbutton={handleRejectSubmit} isSubmit={true} disableSubmit={loadingAction === 'reject'} headerText='Are You Sure You Want to Reject ?' handleClose={handleClose} classname='pb-3 md:w-full md:max-w-[600px] md:max-h-[400px]' isHeaderTextUnderline={true}>
                    <Input className='mt-3 rounded-xl py-2' placeholder='Enter your comment here...' onChange={(e) => { setComment(e.target.value) }} />
                    {loadingAction === 'reject' && <div className="flex items-center gap-2 mt-2 text-sm text-gray-500"><Loader2 className="w-4 h-4 animate-spin" /> Processing...</div>}
                </PopUp>
            }
        </div>
    );
};

const ViewQuickOnboarding = () => {
    return (
        <Suspense fallback={<div className="p-8 text-gray-500 text-center">Loading...</div>}>
            <ViewQuickOnboardingContent />
        </Suspense>
    );
};

export default ViewQuickOnboarding;