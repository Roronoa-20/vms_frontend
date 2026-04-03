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
            <CardHeader className="pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-sm">
                        <Landmark className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold text-[#0F172A] tracking-tight">Additional Details</CardTitle>
                        <p className="text-xs text-[#94A3B8] mt-0.5 font-medium">Finance approval fields</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-[#475569] flex items-center gap-1.5 uppercase tracking-wider">
                            <Hash className="w-3.5 h-3.5 text-[#94A3B8]" />
                            Cost Center
                        </label>
                        <Select value={financeFields.costCenter} onValueChange={(value) => setFinanceFields((prev) => ({ ...prev, costCenter: value }))}>
                            <SelectTrigger className="rounded-lg h-10 border-slate-200 bg-white">
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
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-[#475569] flex items-center gap-1.5 uppercase tracking-wider">
                            <IndianRupee className="w-3.5 h-3.5 text-[#94A3B8]" />
                            Budget Amount
                        </label>
                        <Input type="number" min="0" value={financeFields.budgetAmount} onChange={(e) => setFinanceFields((prev) => ({ ...prev, budgetAmount: e.target.value }))} placeholder="0.00" className="rounded-lg h-10 border-slate-200 bg-white text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-[#475569] flex items-center gap-1.5 uppercase tracking-wider">
                            <IndianRupee className="w-3.5 h-3.5 text-[#94A3B8]" />
                            Actual Amount
                        </label>
                        <Input type="number" min="0" value={financeFields.actualAmount} onChange={(e) => setFinanceFields((prev) => ({ ...prev, actualAmount: e.target.value }))} placeholder="0.00" className="rounded-lg h-10 border-slate-200 bg-white text-sm" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default FinanceFields