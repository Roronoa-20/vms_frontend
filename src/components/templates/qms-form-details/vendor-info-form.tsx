'use client'
import React from "react";
import { Input } from "../../atoms/input";
import { Button } from "../../atoms/button";
import { Label } from "../../atoms/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useQMSForm } from '@/src/hooks/useQMSForm';

export const VendorInfoForm = ({ vendor_onboarding, company_code }: { vendor_onboarding: string; company_code: string }) => {
    const params = useSearchParams();
    const currentTab = params.get("tabtype")?.toLowerCase() || "vendor_information";
    const { formData, handleTextareaChange,
        handleNextTab } = useQMSForm(vendor_onboarding, currentTab);

    const companyCodes = company_code.split(',').map((code) => code.trim());
    const is2000 = companyCodes.includes('2000');
    const is7000 = companyCodes.includes('7000');

    console.log("FormData:", formData);


    return (
        <div>
            <div className='bg-white p-2 rounded-[8px]'>
                <h2 className="text-lg font-bold bg-gray-200 border border-gray-300 p-3">
                    SECTION – I: VENDOR INFORMATION
                </h2>
                <div className='grid grid-cols-2 gap-x-4 gap-y-2 p-2 border border-gray-300'>
                    {is7000 && (
                        <>
                            <div className='grid grid-cols-1 relative'>
                                <div className='col-span-1 space-y-[5px]'>
                                    <Label className="text-[13px]" htmlFor="vendor_name1">Name</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter the name here"
                                        name="vendor_name1"
                                        value={formData.vendor_name1 || ""}
                                        // onChange={(e) => handleTextareaChange(e, 'vendor_name1')}
                                        onChange={() => { }}
                                        readOnly
                                    />
                                </div>

                                <div className='col-span-1 space-y-[5px] mt-4'>
                                    <Label className="text-[13px]" htmlFor="date">Date</Label>
                                    <Input
                                        type="date"
                                        name="date"
                                        value={formData.date1 || ""}
                                        // onChange={(e) => handleTextareaChange(e, 'date1')}
                                        onChange={() => { }}
                                        readOnly

                                    />
                                </div>
                            </div>

                            <div className="col-span-2 space-y-[5px]">
                                <div className="">
                                    {formData.vendor_signature ? (
                                        <div className="w-[600px] h-[200px] relative flex items-center">
                                            <img
                                                src={formData.vendor_signature || ""}
                                                alt="Vendor Signature"
                                                className="object-contain border border-gray-300"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">No signature available.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                    {(is2000 || is7000) && (
                        <div className='col-span-3 space-y-[5px]'>
                            <Label htmlFor="name_of_parent_company" className="font-semibold text-[16px] leading-[19px] text-[#03111F]">
                                If a division of a subsidiary, please provide name and address of parent company
                            </Label>
                            <div className="border-b border-gray-300 mt-2">
                                <textarea
                                    className="w-full border border-gray-300 p-2"
                                    rows={4}
                                    placeholder='Enter the details'
                                    value={formData.name_of_parent_company ?? ""}
                                    // onChange={(e) => handleTextareaChange(e, 'name_of_parent_company')}
                                    onChange={() => { }}
                                    readOnly
                                />
                            </div>
                        </div>
                    )}
                    {is2000 && (
                        <div className="col-span-3 space-y-[5px]">
                            <Label
                                htmlFor="name_of_manufacturer_of_supplied_material"
                                className="font-semibold text-[16px] text-[#03111F]"
                            >
                                If supplier is a distributor, please provide name and address of the manufacturer of supplied material
                            </Label>
                            <div className="border-b border-gray-300 mt-2">
                                <textarea
                                    className="w-full border border-gray-300 p-2"
                                    rows={4}
                                    placeholder="Enter the details"
                                    value={formData.name_of_manufacturer_of_supplied_material || ''}
                                    // onChange={() => ()}
                                    readOnly
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-end gap-4">
                <Button
                    variant="nextbtn"
                    size="nextbtnsize"
                    className="py-2.5"
                    onClick={handleNextTab}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};
