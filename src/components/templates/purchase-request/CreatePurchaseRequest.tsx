"use client";
import React, { useState, useRef } from "react";
import { Loader2 } from "lucide-react";
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

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-1">
        <h1 className="text-[14px] font-normal text-[#626973] pb-2 relative">
          PR Type{" "}
          {/* <span className="text-red-400 text-[20px] absolute -top-2">
                          *
                        </span> */}
        </h1>
        <Select
          disabled={props?.pr_id ? true : false}
          value={form?.pr_type ?? ""}
          onValueChange={(value) => {
            setForm((prev: any) => ({ ...prev, pr_type: value }));
          }}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {props?.purchaseRequisitionTypeDropdown?.map((item) => (
                <SelectItem key={item?.value} value={item?.label}>
                  {item?.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-1">
        <h1 className="text-[14px] font-normal text-[#626973] pb-2 relative">
          Company{" "}
          {/* <span className="text-red-400 text-[20px] absolute -top-2">
                        *
                      </span> */}
        </h1>
        <Select
          disabled={props?.pr_id ? true : false}
          value={form?.company ?? ""}
          onValueChange={(value) => {
            setForm((prev: any) => ({ ...prev, company: value }));
          }}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {props?.companyDropdown?.map((item) => (
                <SelectItem key={item?.name} value={item?.name}>
                  {item?.company_name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-1">
        <h1 className="text-[14px] font-normal text-[#626973] pb-2 relative">
          Requisitioner Name{" "}
          {/* <span className="text-red-400 text-[20px] absolute -top-2">
                        *
                      </span> */}
        </h1>

        <div className=" flex gap-10">
          <Input
            placeholder="Requisitioner Name"
            className="rounded-xl"
            defaultValue={name as string}
            disabled
          />
          {!props?.pr_id && (
            <Button
              className="bg-[#5291CD] text-white rounded-lg px-6 py-2 hover:bg-[#65a4e7]"
              onClick={handleNextButton}
            >
              Next
              <span ref={nextLoaderRef} className="hidden">
                <Loader2 className="w-5 h-5 text-white" />
              </span>
            </Button>
          )}
        </div>
      </div>

      {props?.pr_id && (
        <>
          <div className="col-span-1 border border-black/10 rounded-xl px-4 py-2 flex flex-col justify-center">
            <h1 className="text-[12px] font-normal text-[#626973] uppercase -mb-1">
              PR Ref No
            </h1>
            <h1 className="text-[16px] font-medium text-black truncate">
              {(form as any)?.name ?? "-"}
            </h1>
          </div>

          <div className="col-span-1 border border-black/10 rounded-xl px-4 py-2 flex flex-col justify-center">
            <h1 className="text-[12px] font-normal text-[#626973] uppercase -mb-1">
              SAP Ref No
            </h1>
            <h1 className="text-[16px] font-medium text-black truncate">
              {(form as any)?.sap_pr_no || "-"}
            </h1>
          </div>

          <div className="col-span-1 border border-black/10 rounded-xl px-4 py-2 flex flex-col justify-center">
            <h1 className="text-[12px] font-normal text-[#626973] uppercase -mb-1">
              SAP Error Message
            </h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h1 className="text-[16px] font-medium text-black truncate cursor-default">
                    {(form as any)?.sap_error || "-"}
                  </h1>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{(form as any)?.sap_error || "No error message"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      )}

    </div>
  );
};

export default CreatePurchaseRequest;
