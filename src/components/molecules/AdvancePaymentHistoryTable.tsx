"use client"
import React, { useState } from 'react'
import { Input } from '../atoms/input'
import { ChevronDown } from 'lucide-react'

interface ApprovalHistory {
    team_name: string;
    approval_status: string;
    items: {
        sr_no: number;
        material_code: string;
        material_description: string;
        hsn_code: string;
        uom: string;
        quantity: number;
        rate: number;
        schedule_date: string;
        schedule_quantity: number;
    }[]
}

interface Props {
    approvalHistory: ApprovalHistory[];
    totalAmount?: number;
}

const AdvancePaymentHistoryTable = ({ approvalHistory = [], totalAmount = 0 }: Props) => {
    const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
    const [dateFilter, setDateFilter] = useState("");
    const [searchFilter, setSearchFilter] = useState("");

    const toggleTeam = (teamName: string) => {
        const newExpanded = new Set(expandedTeams);
        if (newExpanded.has(teamName)) {
            newExpanded.delete(teamName);
        } else {
            newExpanded.add(teamName);
        }
        setExpandedTeams(newExpanded);
    };

    const getStatusColor = (status: string) => {
        const lowerStatus = status?.toLowerCase() || "";
        if (lowerStatus.includes("approved")) {
            return "bg-green-100 text-green-800";
        } else if (lowerStatus.includes("rejected")) {
            return "bg-red-100 text-red-800";
        } else if (lowerStatus.includes("pending") || lowerStatus.includes("awaiting")) {
            return "bg-yellow-100 text-yellow-800";
        }
        return "bg-gray-100 text-gray-800";
    };

    return (
        <div className="space-y-4 text-sm text-black font-sans">
            {/* Filters */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-md border border-gray-300">
                <Input
                    type="date"
                    placeholder="dd/mm/yyyy"
                    className="w-48"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                />
                <Input
                    placeholder="Search..."
                    className="flex-1 max-w-sm"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                />
            </div>

            {/* Accordion History */}
            <div className="bg-white border rounded-lg overflow-hidden">
                {approvalHistory && approvalHistory.length > 0 ? (
                    approvalHistory.map((teamApproval, index) => (
                        <div key={index} className="border-b last:border-b-0">
                            {/* Team Header */}
                            <div
                                className="bg-[#DDE8FE] p-4 cursor-pointer flex items-center justify-between hover:bg-[#CDD8F3]"
                                onClick={() => toggleTeam(teamApproval.team_name)}
                            >
                                <div className="flex items-center gap-3">
                                    <ChevronDown
                                        className={`h-5 w-5 transition-transform ${
                                            expandedTeams.has(teamApproval.team_name)
                                                ? "transform rotate-180"
                                                : ""
                                        }`}
                                    />
                                    <span className="font-semibold text-[#2568EF]">
                                        {teamApproval.team_name}
                                    </span>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                        teamApproval.approval_status
                                    )}`}
                                >
                                    {teamApproval.approval_status}
                                </span>
                            </div>

                            {/* Team Details Table */}
                            {expandedTeams.has(teamApproval.team_name) && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50 border-b">
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                                                    Sr.no
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                                                    Material Code
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                                                    Material Description
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                                                    HSN Code
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                                                    UOM
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                                                    Quantity
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                                                    Rate
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                                                    Sche. Date
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                                                    Sche. Quantity
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {teamApproval.items && teamApproval.items.length > 0 ? (
                                                teamApproval.items.map((item, itemIndex) => (
                                                    <tr
                                                        key={itemIndex}
                                                        className="border-b hover:bg-gray-50"
                                                    >
                                                        <td className="px-4 py-3 text-sm">
                                                            {item.sr_no}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                                                            {item.material_code}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            {item.material_description}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            {item.hsn_code}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            {item.uom}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            {item.rate}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                                                            {item.schedule_date}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            {item.schedule_quantity}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={9}
                                                        className="px-4 py-3 text-center text-gray-500"
                                                    >
                                                        No items found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-center text-gray-500">
                        No approval history found
                    </div>
                )}
            </div>

            {/* Total Amount */}
            {totalAmount > 0 && (
                <div className="flex justify-end bg-white p-4 rounded-md border border-gray-300">
                    <div className="text-lg font-semibold">
                        Total Amount : ₹{totalAmount.toLocaleString()}
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdvancePaymentHistoryTable