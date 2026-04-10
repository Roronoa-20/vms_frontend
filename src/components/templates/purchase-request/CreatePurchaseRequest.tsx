"use client";
import React, { useState, useRef } from "react";

import { Loader2, ClipboardList, Building2, UserCircle, ArrowRight } from "lucide-react";
import ReactSelect from "react-select";
import { multiSelectStyles } from "@/src/components/common/sharedStyles";
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
  purchaseRequisitionPlantDropdownType,
} from "@/src/types/prRequisition/prRequisition.types";
import jsCookie from "js-cookie";
import { useAuth } from "@/src/context/AuthContext";
import {
  createPurchaseReqisition,
  getPurchaseReqisitionData,
  getPurchaseRequisitionPlantDropdown,
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
  plant: string;
  requisitioner: string;
  requisition_date: string;
  account_assignment_category: string;
};

const plantSelectStyles = {
  ...multiSelectStyles,
  control: (base: any, state: any) => ({
    ...multiSelectStyles.control(base),
    minHeight: "2rem",
    height: "2rem",
    borderRadius: "0.375rem",
    borderColor: state.isFocused ? "#94a3b8" : "#e2e8f0",
    backgroundColor: "#fff",
    fontSize: "0.75rem",
    boxShadow: "none",
    "&:hover": { borderColor: "#94a3b8" },
  }),
  valueContainer: (base: any) => ({ ...base, padding: "0 0.5rem", fontSize: "0.75rem" }),
  input: (base: any) => ({ ...multiSelectStyles.input(base), margin: "0", padding: "0", fontSize: "0.75rem" }),
  placeholder: (base: any) => ({ ...base, fontSize: "0.75rem", color: "#a1a1aa" }),
  singleValue: (base: any) => ({ ...multiSelectStyles.singleValue(base), fontSize: "0.75rem" }),
  indicatorsContainer: (base: any) => ({ ...base, height: "2rem" }),
  dropdownIndicator: (base: any) => ({ ...base, padding: "4px" }),
  clearIndicator: (base: any) => ({ ...base, padding: "4px" }),
  option: (base: any) => ({ ...multiSelectStyles.option(base), fontSize: "0.75rem" }),
};

const CreatePurchaseRequest = (props: Props) => {
  const { role, name, designation } = useAuth();
  const [form, setForm] = useState<FormType>({ ...(props.prData as any) });
  const [plantDropdown, setPlantDropdown] = useState<purchaseRequisitionPlantDropdownType[]>([]);
  const router = useRouter();
  const nextLoaderRef = useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (props.prData) {
      setForm((prev) => ({ ...prev, ...(props.prData as any) }));
    }
  }, [props.prData]);

  React.useEffect(() => {
    if (form?.company) {
      const cookie = jsCookie.get("access_token");
      getPurchaseRequisitionPlantDropdown(form.company, cookie)
        .then((res) => {
          setPlantDropdown(res);
        })
        .catch((err) => {
          console.error("Error fetching plant dropdown:", err);
        });
    }
  }, [form?.company]);

  const fetchPrData = () => {
    getPurchaseReqisitionData(props?.pr_id as string).then((res) => {
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

    if (!form?.plant) {
      alert("please select plant");
      return;
    }

    const body: any = {
      pr_type: form.pr_type,
      company: form.company,
      plant: form.plant,
      requisitioner: form.requisitioner,
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
        // alert(res?.message?.message);
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
        <p className="text-[10px] font-medium text-[#94A3B8] uppercase tracking-wide leading-none">{label}</p>
        {hasTooltip ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs font-semibold text-[#1E293B] mt-0.5 truncate leading-snug cursor-default max-w-[250px]">{value ?? '—'}</p>
              </TooltipTrigger>
              <TooltipContent><p>{value || "No error message"}</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <p className="text-xs font-semibold text-[#1E293B] mt-0.5 truncate leading-snug">{value ?? '—'}</p>
        )}
      </div>
    </div>
  );

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#4F6BED] to-[#7C93F5] flex items-center justify-center shadow-sm">
              <ClipboardList className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-[#0F172A] tracking-tight">Purchase Requisition</CardTitle>
              <p className="text-[11px] text-[#94A3B8] mt-0.5 font-medium">
                {props?.pr_id ? `PR: ${(form as any)?.name ?? props.pr_id}` : 'Create a new purchase requisition'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-end">
            {form?.pr_type && (
              <Badge variant="outline" className="text-[10px] font-semibold px-2 py-0.5 tracking-wide bg-blue-50 text-blue-700 border-blue-200">
                {form.pr_type}
              </Badge>
            )}
            <div className="flex items-center gap-2 text-right min-w-0">
              {/* <UserCircle className="w-4 h-4 text-[#94A3B8] shrink-0" /> */}
              <div className="min-w-0">
                {/* <p className="text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider leading-none">Requisitioner</p> */}
                <Badge variant="outline" className="text-[10px] font-semibold px-2 py-0.5 tracking-wide bg-green-50 text-green-700 border-green-200">
                  Requisitioner: {form?.requisitioner || name || "—"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[#475569] flex items-center gap-1.5 uppercase tracking-wide">
              <ClipboardList className="w-3 h-3 text-[#94A3B8]" />
              PR Type
            </label>
            <Select
              disabled={!!props?.pr_id}
              value={form?.pr_type ?? ""}
              onValueChange={(value) => { setForm((prev: any) => ({ ...prev, pr_type: value })); }}
            >
              <SelectTrigger className="rounded-md h-8 border-slate-200 bg-white text-xs">
                <SelectValue placeholder="Select PR type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {props?.purchaseRequisitionTypeDropdown?.map((item) => (
                    <SelectItem key={item?.value} value={item?.value}>{item?.label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[#475569] flex items-center gap-1.5 uppercase tracking-wide">
              <Building2 className="w-3 h-3 text-[#94A3B8]" />
              Company
            </label>
            <Select
              disabled={!!props?.pr_id}
              value={form?.company ?? ""}
              onValueChange={(value) => { setForm((prev: any) => ({ ...prev, company: value })); }}
            >
              <SelectTrigger className="rounded-md h-8 border-slate-200 bg-white text-xs">
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

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[#475569] flex items-center gap-1.5 uppercase tracking-wide">
              <Building2 className="w-3 h-3 text-[#94A3B8]" />
              Plant
            </label>
            <ReactSelect
              isDisabled={!!props?.pr_id || !form?.company}
              value={plantDropdown?.filter((item) => item?.name === form?.plant)?.map((item) => ({ value: item?.name, label: item?.plant_name }))?.[0] ?? null}
              onChange={(selected: any) => { setForm((prev: any) => ({ ...prev, plant: selected?.value ?? "" })); }}
              options={plantDropdown?.map((item) => ({ value: item?.name, label: item?.plant_name }))}
              placeholder="Select plant"
              instanceId="plant-select"
              className="text-xs"
              menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
              styles={plantSelectStyles}
              menuPlacement="auto"
              menuPosition="fixed"
              isClearable
            />
          </div>
        </div>

        {!props?.pr_id && (
          <div className="mt-4 flex justify-end">
            <Button
              variant={"nextbtn"}
              size={"nextbtnsize"}
              className="h-8 px-4 rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
              onClick={handleNextButton}
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" />
              <span ref={nextLoaderRef} className="hidden">
                <Loader2 className="w-3.5 h-3.5 text-white" />
              </span>
            </Button>
          </div>
        )}

        {props?.pr_id && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
              <InfoField label="PR Ref No" value={(form as any)?.name} />
              <InfoField label="SAP Ref No" value={(form as any)?.sap_pr_no} />
              <InfoField label="SAP Error Message" value={(form as any)?.sap_error} hasTooltip />
            </div>
          </div>
        )}

        {props?.prData?.cost_center && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
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
