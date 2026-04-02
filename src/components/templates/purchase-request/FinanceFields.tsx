"use client"
import React, { useEffect, useState } from 'react'
import { Input } from '../../atoms/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../atoms/select'
import { CostCenterDropdownType } from '@/src/types/prRequisition/prRequisition.types'
import { getCostCenterBasedOnCompanyDropdown } from '@/src/services/prRequisition/prRequisitionZsb.services'

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
        <div className="mt-5">
            <h1 className="text-[16px] text-[#03111F] font-semibold mb-3">Fill Additional Details</h1>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="text-sm text-gray-600 mb-1 block">Cost Center</label>
                    <Select value={financeFields.costCenter} onValueChange={(value) => setFinanceFields((prev) => ({ ...prev, costCenter: value }))}>
                        <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select" />
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
                <div>
                    <label className="text-sm text-gray-600 mb-1 block">Budget Amount</label>
                    <Input type="number" min="0" value={financeFields.budgetAmount} onChange={(e) => setFinanceFields((prev) => ({ ...prev, budgetAmount: e.target.value }))} placeholder="0.00" />
                </div>
                <div>
                    <label className="text-sm text-gray-600 mb-1 block">Actual Amount</label>
                    <Input type="number" min="0" value={financeFields.actualAmount} onChange={(e) => setFinanceFields((prev) => ({ ...prev, actualAmount: e.target.value }))} placeholder="0.00" />
                </div>
            </div>
        </div>
    )
}

export default FinanceFields