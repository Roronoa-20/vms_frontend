"use client";
import React, { useState, useRef } from "react";

import { Loader2, ClipboardList, Building2, UserCircle, Hash, AlertCircle, ArrowRight } from "lucide-react";
import { Input } from "../../atoms/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/select";
import { Button } from "../../atoms/button";
import {
  companyDropdownBasedOnUserType,
  purchaseRequisitionDataType,
  purchaseRequisitionTypeDropdownType,
} from "@/src/types/prRequisition/prRequisition.types";
import jsCookie from "js-cookie";
import { useAuth } from "@/src/context/AuthContext";
import {
  createPurchaseReqisition,
  getPurchaseReqisitionData,
} from "@/src/services/prRequisition/prRequisitionNb.services";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  purchaseRequisitionTypeDropdown: purchaseRequisitionTypeDropdownType[];
  companyDropdown: companyDropdownBasedOnUserType[];
  prData?: purchaseRequisitionDataType;
  pr_id?: string;
  fetchPrData: (prId?: string) => void
}

type FormType = {
  pr_type: string;
  company: string;
  requisitioner_name: string;
  requisition_date: string;
  account_assignment_category: string;
};

const CreatePurchaseRequest = (props: Props) => {
  const { role, name, designation } = useAuth();
  const [form, setForm] = useState<FormType>({ ...(props.prData as any) });
  const router = useRouter();
  const nextLoaderRef = useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (props.prData) {
      setForm((prev) => ({ ...prev, ...(props.prData as any) }));
    }
  }, [props.prData]);

  const fetchPrData = () => {
    getPurchaseReqisitionData(props?.pr_id as string).then((res) => {
      console.log(res, "fetched pr data");
      setForm(res as any);
    }).catch((err) => {
      console.error("Error fetching PR data:", err);
    })
  }

  const handleNextButton = () => {

    if (!form?.pr_type) {
      alert("please select purchase type");
      return;
    }

    if (!form?.company) {
      alert("please select company");
      return;
    }

    const body = {
      ...form,
      requisitioner_name: name,
      requisition_date: new Date().toISOString().split("T")[0], // current date in YYYY-MM-DD format
    };

    if (form?.pr_type === "NB-Capex") {
      body.account_assignment_category = "A";
    }

    if (nextLoaderRef?.current) {
      nextLoaderRef.current.className = "inline-flex animate-spin ml-2 text-white";
    }

    createPurchaseReqisition(body)
      .then((res) => {
        alert(res?.message?.message);
        if (nextLoaderRef?.current) {
          nextLoaderRef.current.className = "hidden";
        }
        router.replace(`/pr-request?pr_id=${res?.message?.data?.name}`);
        props?.fetchPrData(res?.message?.data?.name as string);
      })
      .catch((err) => {
        if (nextLoaderRef?.current) {
          nextLoaderRef.current.className = "hidden";
        }
        alert("Error creating purchase requisition: " + err?.message);
      });
  };

  const InfoField = ({ label, value, hasTooltip }: { label: string; value?: string | number | null; hasTooltip?: boolean }) => (
    <div className="flex items-start gap-3 min-w-0">
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider leading-none">{label}</p>
        {hasTooltip ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-sm font-semibold text-[#1E293B] mt-1 truncate leading-snug cursor-default max-w-[250px]">{value ?? '—'}</p>
              </TooltipTrigger>
              <TooltipContent><p>{value || "No error message"}</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <p className="text-sm font-semibold text-[#1E293B] mt-1 truncate leading-snug">{value ?? '—'}</p>
        )}
      </div>
    </div>
  );

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F6BED] to-[#7C93F5] flex items-center justify-center shadow-sm">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-[#0F172A] tracking-tight">Purchase Requisition</CardTitle>
              <p className="text-xs text-[#94A3B8] mt-0.5 font-medium">
                {props?.pr_id ? `PR: ${(form as any)?.name ?? props.pr_id}` : 'Create a new purchase requisition'}
              </p>
            </div>
          </div>
          {props?.pr_id && form?.pr_type && (
            <Badge variant="outline" className="text-[11px] font-semibold px-3 py-1 tracking-wide bg-blue-50 text-blue-700 border-blue-200">
              {form.pr_type}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#475569] flex items-center gap-1.5 uppercase tracking-wider">
              <ClipboardList className="w-3.5 h-3.5 text-[#94A3B8]" />
              PR Type
            </label>
            <Select
              disabled={!!props?.pr_id}
              value={form?.pr_type ?? ""}
              onValueChange={(value) => { setForm((prev: any) => ({ ...prev, pr_type: value })); }}
            >
              <SelectTrigger className="rounded-lg h-10 border-slate-200 bg-white">
                <SelectValue placeholder="Select PR type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {props?.purchaseRequisitionTypeDropdown?.map((item) => (
                    <SelectItem key={item?.value} value={item?.label}>{item?.label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#475569] flex items-center gap-1.5 uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-[#94A3B8]" />
              Company
            </label>
            <Select
              disabled={!!props?.pr_id}
              value={form?.company ?? ""}
              onValueChange={(value) => { setForm((prev: any) => ({ ...prev, company: value })); }}
            >
              <SelectTrigger className="rounded-lg h-10 border-slate-200 bg-white">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {props?.companyDropdown?.map((item) => (
                    <SelectItem key={item?.name} value={item?.name}>{item?.company_name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#475569] flex items-center gap-1.5 uppercase tracking-wider">
              <UserCircle className="w-3.5 h-3.5 text-[#94A3B8]" />
              Requisitioner Name
            </label>
            <div className="flex gap-3">
              <Input
                placeholder="Requisitioner Name"
                className="rounded-lg h-10 border-slate-200 bg-slate-50 text-sm"
                defaultValue={name as string}
                disabled
              />
              {!props?.pr_id && (
                <Button
                  variant={"nextbtn"}
                  size={"nextbtnsize"}
                  className="px-5 rounded-xl flex items-center gap-2 shadow-sm flex-shrink-0"
                  onClick={handleNextButton}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                  <span ref={nextLoaderRef} className="hidden">
                    <Loader2 className="w-4 h-4 text-white" />
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {props?.pr_id && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
              <InfoField label="PR Ref No" value={(form as any)?.name} />
              <InfoField label="SAP Ref No" value={(form as any)?.sap_pr_no} />
              <InfoField label="SAP Error Message" value={(form as any)?.sap_error} hasTooltip />
            </div>
          </div>
        )}

        {props?.prData?.cost_center && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
              <InfoField label="Cost Center" value={props.prData.cost_center} />
              <InfoField label="Budget Amount" value={props.prData.budget_amount} />
              <InfoField label="Actual Amount" value={props.prData.actual_amount} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreatePurchaseRequest;
