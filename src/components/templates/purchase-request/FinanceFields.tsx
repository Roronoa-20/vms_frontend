"use client"
import React, { useEffect, useState } from 'react'
import { Input } from '../../atoms/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../atoms/select'
import { CostCenterDropdownType } from '@/src/types/prRequisition/prRequisition.types'
import { getCostCenterBasedOnCompanyDropdown } from '@/src/services/prRequisition/prRequisitionZsb.services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Landmark, Hash, IndianRupee } from 'lucide-react'

export type FinanceFieldsData = {
    costCenter: string;
    budgetAmount: string;
    actualAmount: string;
}

interface Props {
    company: string;
    financeFields: FinanceFieldsData;
    setFinanceFields: React.Dispatch<React.SetStateAction<FinanceFieldsData>>;
}

const FinanceFields = ({ company, financeFields, setFinanceFields }: Props) => {
    const [costCenterDropdown, setCostCenterDropdown] = useState<CostCenterDropdownType[]>([]);

    useEffect(() => {
        if (company) {
            getCostCenterBasedOnCompanyDropdown(company).then((res) => {
                setCostCenterDropdown(res);
            }).catch(console.error);
        }
    }, [company]);

    return (
        <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-sm">
                        <Landmark className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-base font-bold text-[#0F172A] tracking-tight">Additional Details</CardTitle>
                        <p className="text-[11px] text-[#94A3B8] mt-0.5 font-medium">Finance approval fields</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-[#475569] flex items-center gap-1.5 uppercase tracking-wide">
                            <Hash className="w-3 h-3 text-[#94A3B8]" />
                            Cost Center
                        </label>
                        <Select value={financeFields.costCenter} onValueChange={(value) => setFinanceFields((prev) => ({ ...prev, costCenter: value }))}>
                            <SelectTrigger className="rounded-md h-8 border-slate-200 bg-white text-xs">
                                <SelectValue placeholder="Select cost center" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {costCenterDropdown?.map((item) => (
                                        <SelectItem key={item?.name} value={item?.name}>
                                            {item?.cost_center_code} - {item?.cost_center_name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-[#475569] flex items-center gap-1.5 uppercase tracking-wide">
                            <IndianRupee className="w-3 h-3 text-[#94A3B8]" />
                            Budget Amount
                        </label>
                        <Input type="number" min="0" value={financeFields.budgetAmount} onChange={(e) => setFinanceFields((prev) => ({ ...prev, budgetAmount: e.target.value }))} placeholder="0.00" className="rounded-md h-8 border-slate-200 bg-white text-xs px-2" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-[#475569] flex items-center gap-1.5 uppercase tracking-wide">
                            <IndianRupee className="w-3 h-3 text-[#94A3B8]" />
                            Actual Amount
                        </label>
                        <Input type="number" min="0" value={financeFields.actualAmount} onChange={(e) => setFinanceFields((prev) => ({ ...prev, actualAmount: e.target.value }))} placeholder="0.00" className="rounded-md h-8 border-slate-200 bg-white text-xs px-2" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default FinanceFields