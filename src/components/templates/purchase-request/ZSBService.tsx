import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../atoms/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/select";
import { Input } from "../../atoms/input";
import { Trash2, Loader2, Plus, Eye, Pencil, X, ListOrdered } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CostCenterDropdownType,
  GlAccountDropdownType,
  MaterialGroupDropdownType,
  nbCapexItemsType,
  nbItemsType,
  purchaseRequisitionDataType,
  PurchaseRequisitionMaterialDropdownType,
  purchaseRequisitionPurchaseGroupDropdownType,
  purchaseRequisitionUOMType,
  serviceCodeDropdownType,
  uomType,
  zsbAssetItemsType,
  zsbServiceItemsType,
  zsbServiceSubItemsType,
} from "@/src/types/prRequisition/prRequisition.types";
import {
  addPurchaseRequisitionNBItems,
  deletePurchaseRequisitionNBItems,
  getPurchaseReqisitionData,
  getPurchaseRequisitionMaterialDropdown,
  getPurchaseRequisitionPurchaseGroupDropdown,
  getPurchaseRequisitionUOM,
  updatePurchaseRequisitionNBItems,
} from "@/src/services/prRequisition/prRequisitionNb.services";
import { set } from "nprogress";
import { useSearchParams } from "next/navigation";
import { deleteEnquiryItems } from "@/src/services/prEnquiry/prEnquiry.services";
import MultiSelect from 'react-select';
import { itemsRowSelectStyles } from "../../common/sharedStyles";
import {
  addSublineItem,
  addZsbLineItems,
  deleteSublineItem,
  deleteZsbLineItems,
  getCostCenterBasedOnCompanyDropdown,
  getGlAccountBasedOnCompanyDropdown,
  getMaterialGroupDropdown,
  getPurchaseRequisitionUom,
  getServiceCodeDropdown,
  getShortTextBasedOnServiceCode,
  getUomBasedOnServiceCode,
  updateSublineItem,
  updateZsbLineItems,
} from "@/src/services/prRequisition/prRequisitionZsb.services";
import { get } from "http";
import PopUp from "../../molecules/PopUp";
import { Button } from "../../atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const itemsTableIconBtn =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F6BED]/25";

const subItemDialogIconBtn =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F6BED]/25";

type Props = {
  prData?: purchaseRequisitionDataType;
  submitLoaderRef: React.RefObject<HTMLSpanElement | null>;
  handlePurchaseRequisitionSubmit: (isAlert: boolean) => void;
};

const ServicePR = (props: Props) => {
  const searchParams = useSearchParams();
  const pr_id = searchParams.get("pr_id") as string;
  const addLoaderRef = useRef<HTMLSpanElement>(null);
  const [purchaseGroupDropdown, setPurchaseGroupDropdown] = useState<
    purchaseRequisitionPurchaseGroupDropdownType[]
  >([]);
  const [uomDrop, setUOM] = useState<purchaseRequisitionUOMType>();
  const [isPurchaseGroupDropdown, setIsPurchaseGroupDropdown] = useState(false);
  const [UOMDropdown, setUOMDropdown] = useState<uomType[]>([]);
  const [materialGroupDropdown, setMaterialGroupDropdown] = useState<
    MaterialGroupDropdownType[]
  >([]);
  const [glAccountDropdown, setGlAccountDropdown] = useState<
    GlAccountDropdownType[]
  >([]);
  const [costCenterDropdown, setCostCenterDropdown] = useState<
    CostCenterDropdownType[]
  >([]);

  const [isSubItemDialog, setIsSubItemDialog] = useState(false);
  const [isSubItemShortText, setIsSubItemShortText] = useState(false);
  const [isSubItemUom, setIsSubItemUom] = useState(false);

  const [subLineItem, setSubLineItem] = useState<zsbServiceSubItemsType>();

  const [singleRowData, setSingleRowData] = useState<zsbServiceItemsType>();

  const [selectedSubItemIndex, setSelectedSubItemIndex] = useState<any>(null);

  const [serviceCodeDropdown, setServiceCodeDropdown] =
    useState<serviceCodeDropdownType[]>();

  const [tableData, setTableData] = useState<zsbServiceItemsType[]>(
    props?.prData?.zsb_service_items || [],
  );

  const [isSubItemsView, setIsSubItemView] = useState(false);

  useEffect(() => {
    fetchUom();
    if (props?.prData?.company) {
      fetchGlAccountBasedOnCommpany(props.prData.company);
      fetchCostCenterBasedOnCompany(props.prData.company);
      fetchMatrialGroup(props?.prData?.company as string);
    }

    fetchServiceCode();

    fetchMatrialGroup(props?.prData?.company ?? "");
  }, []);

  const fetchUom = () => {
    getPurchaseRequisitionUom("")
      .then((res) => {
        setUOMDropdown(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchMatrialGroup = (company:string) => {
    getMaterialGroupDropdown(company)
      .then((res) => {
        setMaterialGroupDropdown(res);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchGlAccountBasedOnCommpany = (company: string) => {
    getGlAccountBasedOnCompanyDropdown(company)
      .then((res) => {
        setGlAccountDropdown(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchCostCenterBasedOnCompany = (company: string) => {
    getCostCenterBasedOnCompanyDropdown(company)
      .then((res) => {
        setCostCenterDropdown(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchServiceCode = () => {
    getServiceCodeDropdown()
      .then((res) => {
        setServiceCodeDropdown(res);
      })
      .catch((err) => {
        console.log(err, "error fetching service code dropdown");
      });
  };

  const getPurchaseGroupBasedOnMaterial = (material: string) => {
    getPurchaseRequisitionPurchaseGroupDropdown(material)
      .then((res: any) => {
        if (Array.isArray(res)) {
          setPurchaseGroupDropdown(res);
          setIsPurchaseGroupDropdown(true);
        } else {
          setSingleRowData(
            (prev) =>
              ({
                ...prev,
                purchasing_group: res?.purchase_group,
              }) as zsbServiceItemsType,
          );
          setIsPurchaseGroupDropdown(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUomBasedOnServiceCode = (serviceCode: string) => {
    getUomBasedOnServiceCode(serviceCode)
      .then((res) => {
        setSubLineItem(
          (prev) => ({ ...prev, uom: res?.uom }) as zsbServiceSubItemsType,
        );
      })
      .catch((err) => {
        console.log(err, "error fetching uom based on service code");
      });
  };

  const fetchShortTextBasedOnServiceCode = (serviceCode: string) => {
    getShortTextBasedOnServiceCode(serviceCode)
      .then((res) => {
        setSubLineItem(
          (prev) =>
            ({
              ...prev,
              short_text: res?.short_text,
            }) as zsbServiceSubItemsType,
        );
      })
      .catch((err) => {
        console.log(err, "error fetching short text based on service code");
      });
  };

  const fetchPrData = () => {
    getPurchaseReqisitionData(pr_id as string)
      .then((res) => {
        setTableData(res?.zsb_service_items || []);
      })
      .catch((err) => {
        console.error("Error fetching PR data:", err);
      });
  };

  const handleSubItemAdd = () => {

    // if (!subLineItem?.service_code) {
    //   alert("please select service code");
    //   return;
    // }

    if (!subLineItem?.short_text) {
      alert("please enter short text");
      return;
    }

    if (!subLineItem?.uom) {
      alert("please select uom");
      return;
    }

    if (!subLineItem?.quantity) {
      alert("please enter quantity");
      return;
    }


    const body = {
      data: {
        name: subLineItem?.name,
        service_code: subLineItem?.service_code,
        short_text: subLineItem?.short_text,
        uom: subLineItem?.uom,
        quantity: subLineItem?.quantity,
        zsb_service_item: selectedSubItemIndex?.parent_id,
      },
    };

    if (subLineItem?.name) {
      updateSublineItem(body, "service").then((res) => { alert(res); fetchPrData(); setSubLineItem(undefined); }).catch((err) => { alert(err) });
    } else {
      addSublineItem(body, "service")
        .then((res) => {
          alert(res?.message);
          setSubLineItem(undefined);
          fetchPrData();
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  const handleTableAdd = () => {

    if (!singleRowData?.material_description) {
      alert("please enter material description");
      return;
    }

    if (!singleRowData?.quantity) {
      alert("please enter quantity");
      return;
    }

    if (!singleRowData?.material_group) {
      alert("please select material group");
      return;
    }

    if (!singleRowData?.cost_center) {
      alert("please select cost center");
      return;
    }

    if (!singleRowData?.gl_account) {
      alert("please select gl account");
      return;
    }

    if (!singleRowData?.short_text) {
      alert("please enter short text");
      return;
    }
    if (!singleRowData?.required_delivery_date) {
      alert("please select required delivery date");
      return;
    }

    const body = {
      data: {
        name: singleRowData?.name,
        purchase_requisition: props?.prData?.name,
        company: props?.prData?.company,
        material_description: singleRowData?.material_description,
        requisitioner: props?.prData?.name,
        uom: "AU",
        quantity: singleRowData?.quantity,
        material_group: singleRowData?.material_group,
        asset_code: singleRowData?.asset_code,
        short_text: singleRowData?.short_text,
        gl_account: singleRowData?.gl_account,
        cost_center: singleRowData?.cost_center,
        required_delivery_date: singleRowData?.required_delivery_date,
      },
    };

    if (addLoaderRef?.current) {
      addLoaderRef.current.className = "inline-flex animate-spin ml-2";
    }

    if (singleRowData?.name) {
      updateZsbLineItems(body, "service").then((res) => {
        alert(res?.message);
        setSingleRowData(undefined);
        setIsPurchaseGroupDropdown(false);
        setUOM(undefined);
        if (addLoaderRef?.current) {
          addLoaderRef.current.className = "hidden";
        }
        fetchPrData();
      })
        .catch((err) => {
          if (addLoaderRef?.current) {
            addLoaderRef.current.className = "hidden";
          }
          alert(err?.map((item:any)=>item));
        });
    } else {
      addZsbLineItems(body, "service")
        .then((res) => {
          alert(res?.message);
          // setTableData(prev=>[...prev,singleRowData as nbItemsType]);
          setSingleRowData(undefined);
          if (addLoaderRef?.current) {
            addLoaderRef.current.className = "hidden";
          }
          fetchPrData();
        })
        .catch((err) => {
          if (addLoaderRef?.current) {
            addLoaderRef.current.className = "hidden";
          }
          console.log(err);
        });
    }
  };

  const handleDeleteItem = (name: string) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }
    deleteZsbLineItems(name, "service")
      .then((res) => {
        alert(res?.message);
        fetchPrData();
        setSingleRowData(undefined);
        setIsPurchaseGroupDropdown(false);
        setUOM(undefined);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateItem = (index: number) => {
    fetchMatrialGroup(props?.prData?.company as string);
    let material = materialGroupDropdown?.find((item)=>item?.material_group_name == tableData[index]?.material_group)?.name;
    setSingleRowData({...tableData[index],material_group:material as string});
    // setSingleRowData(tableData[index]);
  };

  const handleUpdateSubItem = (index: number) => {
    setSubLineItem(tableData[selectedSubItemIndex?.index]?.sub_items[index]);
  }

  const handleClose = () => {
    setIsSubItemDialog(false);
    setSelectedSubItemIndex(undefined);
    setIsSubItemView(false);
  };


  const handleSublineItemDelete = (name: string) => {
    if (!confirm("Are you sure you want to delete this sub line item?")) {
      return;
    }
    deleteSublineItem(name, "service").then((res) => {
      alert(res);
      fetchPrData();
      setSubLineItem(undefined);
    }).catch((err) => {
      console.log(err)
    });
  }

  const subDlgActions = !!(props?.prData?.can_edit && !isSubItemsView);

  return (
    <>
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#4F6BED] to-[#6366F1] shadow-sm">
              <ListOrdered className="h-4 w-4 text-white" aria-hidden />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base font-bold tracking-tight text-[#0F172A]">
                Items list
              </CardTitle>
              <p className="mt-0.5 text-[11px] font-medium text-[#94A3B8]">
                {tableData?.length ?? 0} line item{(tableData?.length ?? 0) !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-3 pt-3">
          <div className="w-full overflow-x-auto">
            <div className="max-h-[min(65vh,560px)] min-w-[1120px] overflow-y-auto">
              <Table className="w-full border-collapse">
                <TableHeader className="sticky top-0 z-[1] bg-slate-50 shadow-[0_1px_0_0_rgb(226_232_240)]">
                  <TableRow className="border-b border-slate-200 hover:bg-slate-50">
                    <TableHead className="h-9 w-[4%] px-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                      #
                    </TableHead>
                    <TableHead className="h-9 w-[15%] px-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                      Material description
                    </TableHead>
                    <TableHead className="h-9 w-[4%] px-1 text-center text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                      UOM
                    </TableHead>
                    <TableHead className="h-9 w-[10%] px-1 text-center text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                      Qty
                    </TableHead>
                    <TableHead className="h-9 w-[14%] px-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                      Material group
                    </TableHead>
                    <TableHead className="h-9 w-[13%] px-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                      Cost center
                    </TableHead>
                    <TableHead className="h-9 w-[14%] px-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                      G/L account
                    </TableHead>
                    <TableHead className="h-9 w-[12%] px-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                      Short text
                    </TableHead>
                    <TableHead className="h-9 w-[16%] px-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                      Required Delivery Date
                    </TableHead>
                    <TableHead className="h-9 w-[30%] px-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData?.map((item, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-slate-100 transition-colors hover:bg-slate-50/60"
                    >
                      <TableCell className="px-1.5 py-2 text-center text-xs font-medium tabular-nums leading-snug text-[#334155]">
                        {index + 1}
                      </TableCell>
                      <TableCell className="min-w-0 px-2 py-2 align-middle text-center text-xs leading-snug text-[#334155]">
                        <span className="line-clamp-2 break-words" title={item.material_description}>
                          {item.material_description}
                        </span>
                      </TableCell>
                      <TableCell className="min-w-0 px-1 py-2 text-center align-middle text-xs leading-snug text-[#334155]">
                        <span className="block truncate" title={item.uom}>
                          {item.uom}
                        </span>
                      </TableCell>
                      <TableCell className="min-w-0 px-1 py-2 text-center align-middle text-xs font-medium tabular-nums leading-snug text-[#334155]">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="min-w-0 px-2 py-2 align-middle text-center text-xs leading-snug text-[#334155]">
                        <span className="line-clamp-2 break-words" title={item.material_group}>
                          {item.material_group}
                        </span>
                      </TableCell>
                      <TableCell className="min-w-0 px-2 py-2 align-middle text-center text-xs leading-snug text-[#334155]">
                        <span className="line-clamp-2 break-words" title={item.cost_center}>
                          {item.cost_center}
                        </span>
                      </TableCell>
                      <TableCell className="min-w-0 px-2 py-2 align-middle text-center text-xs leading-snug text-[#334155]">
                        <span className="line-clamp-2 break-words" title={item.gl_account}>
                          {item.gl_account}
                        </span>
                      </TableCell>
                      <TableCell className="min-w-0 px-2 py-2 align-middle text-center text-xs leading-snug text-[#334155]">
                        <span className="line-clamp-2 break-words" title={item.short_text}>
                          {item.short_text}
                        </span>
                      </TableCell>
                      <TableCell className="min-w-0 px-2 py-2 align-middle text-center text-xs leading-snug text-[#334155]">
                        <span className="line-clamp-2 break-words" title={item.required_delivery_date}>
                          {item.required_delivery_date}
                        </span>
                      </TableCell>
                      <TableCell className="min-w-0 px-1 py-1.5 align-middle">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <div className="flex flex-nowrap items-center justify-center gap-1.5 rounded-lg bg-slate-50/90 px-1.5 py-1 ring-1 ring-slate-200/80">
                            {props?.prData?.can_edit && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      className={`${itemsTableIconBtn} border-emerald-200/90 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300`}
                                      onClick={() => {
                                        setIsSubItemDialog(true);
                                        setIsSubItemView(false);
                                        setSelectedSubItemIndex({ index: index, parent_id: item?.name });
                                      }}
                                    >
                                      <Plus className="h-3.5 w-3.5" strokeWidth={2.25} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Add sub line item</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            {!props?.prData?.can_edit && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      className={`${itemsTableIconBtn} border-slate-200 bg-white text-slate-600 hover:border-[#4F6BED]/30 hover:bg-slate-50 hover:text-[#4F6BED]`}
                                      onClick={() => {
                                        setIsSubItemDialog(true);
                                        setIsSubItemView(true);
                                        setSelectedSubItemIndex({ index: index, parent_id: item?.name });
                                      }}
                                    >
                                      <Eye className="h-3.5 w-3.5" strokeWidth={2} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View sub line items</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span
                                    className="inline-flex min-h-8 min-w-8 cursor-default items-center justify-center rounded-md bg-white px-1.5 text-[11px] font-semibold tabular-nums text-slate-700 ring-1 ring-inset ring-slate-200/90"
                                    title="Sub line items count"
                                  >
                                    {item?.sub_items?.length ?? 0}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Sub line items count</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          {props?.prData?.can_edit && (
                            <div className="flex flex-nowrap items-center justify-center gap-1.5">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      className={`${itemsTableIconBtn} border-slate-200 bg-white text-slate-600 hover:border-[#4F6BED]/35 hover:bg-slate-50 hover:text-[#4F6BED]`}
                                      onClick={() => {
                                        handleUpdateItem(index);
                                      }}
                                    >
                                      <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit row</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      className={`${itemsTableIconBtn} border-red-200/90 bg-red-50 text-red-600 hover:bg-red-100`}
                                      onClick={() => {
                                        handleDeleteItem(item?.name as string);
                                      }}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete row</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {props?.prData?.can_edit && (
                    <TableRow className="border-t border-slate-200 bg-slate-50/50 hover:bg-slate-50/50">
                      <TableCell className="px-2 py-2" />
                      <TableCell className="min-w-0 px-2 py-2 align-middle">
                        <Input
                          value={singleRowData?.material_description ?? ""}
                          onChange={(e) => {
                            setSingleRowData(
                              (prev) =>
                                ({
                                  ...prev,
                                  material_description: e.target.value,
                                }) as zsbServiceItemsType,
                            );
                          }}
                          className="h-8 w-full min-w-0 rounded-md border-slate-200 px-2 text-xs"
                        />
                      </TableCell>
                      <TableCell className="min-w-0 px-1 py-2 text-center align-middle">
                        <span className="inline-flex h-8 w-full items-center justify-center rounded-md border border-slate-200 bg-white px-1 text-xs font-medium tabular-nums text-slate-600">
                          AU
                        </span>
                      </TableCell>
                      <TableCell className="min-w-0 px-1 py-2 align-middle">
                        <Input
                          type="number"
                          min={0}
                          value={singleRowData?.quantity ?? ""}
                          onChange={(e) => {
                            setSingleRowData(
                              (prev) =>
                                ({
                                  ...prev,
                                  quantity: Number(e.target.value),
                                }) as zsbServiceItemsType,
                            );
                          }}
                          className="h-8 w-full min-w-0 rounded-md border-slate-200 px-2 text-center text-xs tabular-nums"
                        />
                      </TableCell>
                      <TableCell className="min-w-0 px-2 py-2 align-middle">
                        <MultiSelect
                          options={materialGroupDropdown?.map(item => ({ label: item?.material_group_description || item?.name, value: item?.name })) || []}
                          value={singleRowData?.material_group ? { label: materialGroupDropdown?.find(p => p.name === singleRowData.material_group)?.material_group_description || singleRowData.material_group, value: singleRowData.material_group } : null}
                          onChange={(selectedOption: any) => {
                            setSingleRowData(
                              (prev) =>
                                ({
                                  ...prev,
                                  material_group: selectedOption?.value,
                                }) as zsbServiceItemsType,
                            );
                          }}
                          instanceId="zsbservice-mg-select"
                          placeholder="Material group"
                          className="w-full min-w-0 text-left text-xs text-black"
                          styles={itemsRowSelectStyles("min(24rem, 90vw)")}
                          menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                          menuPlacement="auto"
                          menuPosition="fixed"
                        />
                      </TableCell>
                      <TableCell className="min-w-0 px-2 py-2 align-middle">
                        <MultiSelect
                          options={costCenterDropdown?.map(item => ({ label: item?.cost_center_name || item?.name, value: item?.name })) || []}
                          value={singleRowData?.cost_center ? { label: costCenterDropdown?.find(p => p.name === singleRowData.cost_center)?.cost_center_name || singleRowData.cost_center, value: singleRowData.cost_center } : null}
                          onChange={(selectedOption: any) => {
                            setSingleRowData(
                              (prev) =>
                                ({
                                  ...prev,
                                  cost_center: selectedOption?.value,
                                }) as zsbServiceItemsType,
                            );
                          }}
                          instanceId="zsbservice-cc-select"
                          placeholder="Cost center"
                          className="w-full min-w-0 text-left text-xs text-black"
                          styles={itemsRowSelectStyles("min(28rem, 90vw)")}
                          menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                          menuPlacement="auto"
                          menuPosition="fixed"
                        />
                      </TableCell>
                      <TableCell className="min-w-0 px-2 py-2 align-middle">
                        <MultiSelect
                          options={glAccountDropdown?.map(item => ({ label: item?.gl_account_name || item?.name, value: item?.name })) || []}
                          value={singleRowData?.gl_account ? { label: glAccountDropdown?.find(p => p.name === singleRowData.gl_account)?.gl_account_name || singleRowData.gl_account, value: singleRowData.gl_account } : null}
                          onChange={(selectedOption: any) => {
                            setSingleRowData(
                              (prev) =>
                                ({
                                  ...prev,
                                  gl_account: selectedOption?.value,
                                }) as zsbServiceItemsType,
                            );
                          }}
                          instanceId="zsbservice-gl-select"
                          placeholder="G/L account"
                          className="w-full min-w-0 text-left text-xs text-black"
                          styles={itemsRowSelectStyles("min(30rem, 92vw)")}
                          menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                          menuPlacement="auto"
                          menuPosition="fixed"
                        />
                      </TableCell>
                      <TableCell className="min-w-0 px-2 py-2 align-middle">
                        <Input
                          type="text"
                          value={singleRowData?.short_text ?? ""}
                          onChange={(e) => {
                            setSingleRowData(
                              (prev) =>
                                ({
                                  ...prev,
                                  short_text: e.target.value,
                                }) as zsbServiceItemsType,
                            );
                          }}
                          className="h-8 w-full min-w-0 rounded-md border-slate-200 px-2 text-xs"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <Input type="date"
                          className="h-8 text-xs rounded-md px-2"
                          value={singleRowData?.required_delivery_date ?? ""}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => { setSingleRowData(prev => ({ ...prev, required_delivery_date: e.target.value } as zsbServiceItemsType)) }}
                        />
                      </TableCell>
                      <TableCell className="min-w-0 px-1 py-2 align-middle" />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          {props?.prData?.can_edit && (
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-4 pt-3">
            <Button
              className="h-8 rounded-lg bg-[#4F6BED] px-4 text-xs text-white shadow-sm hover:bg-[#3d56c7]"
              onClick={() => {
                handleTableAdd();
              }}
            >
              {singleRowData?.name ? "Update row" : "Add row"}
              <span ref={addLoaderRef} className="hidden">
                <Loader2 className="w-4 h-4" />
              </span>
            </Button>
            {singleRowData?.name && (
              <Button
                variant="backbtn"
                size="backbtnsize"
                className="h-8 rounded-lg border-red-200 text-xs text-red-600 hover:bg-red-50"
                onClick={() => {
                  setSingleRowData(undefined);
                  setIsPurchaseGroupDropdown(false);
                  setUOM(undefined);
                }}
              >
                Cancel
              </Button>
            )}
          </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end pt-1">
        {
          props?.prData?.can_edit &&
          <Button className="mt-3 h-8 rounded-lg bg-[#4F6BED] px-4 text-xs text-white shadow-sm hover:bg-[#3d56c7]" onClick={() => {
            let isAlert = true;
            if (singleRowData?.material_description || singleRowData?.quantity || singleRowData?.material_group || singleRowData?.cost_center || singleRowData?.gl_account) {
              alert("You have unsaved changes in the table. Do you want to continue without saving?") 
              isAlert = false;
                return;
              }
            //   isAlert = false;
            // }
            props?.handlePurchaseRequisitionSubmit(isAlert);
          }}>
            Submit PR
            <span ref={props?.submitLoaderRef} className="hidden">
              <Loader2 className="w-4 h-4" />
            </span>
          </Button>
        }
      </div>
      {isSubItemDialog && (
        <PopUp
          handleClose={handleClose}
          headerText="Sub line items"
          isHeaderTextUnderline
          containInMainColumn
          compact
          classname="min-w-0 mx-auto w-[calc(100%-2rem)] max-w-[calc(100vw-1.5rem)] md:max-w-[min(64rem,calc(100vw-115px-2rem))] md:max-h-[min(88vh,720px)]"
        >
          <p className="mb-3 border-b border-slate-100 pb-2 text-xs leading-snug text-[#64748B]">
            {isSubItemsView
              ? "Read-only list of sub line items for this row."
              : "Add or edit sub line items. Use the bottom row, then add."}
          </p>
          <div className="mb-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="max-h-[min(52vh,480px)] overflow-y-auto overflow-x-auto pb-3">
              <Table className="w-max min-w-full table-auto">
                <TableHeader className="sticky top-0 z-[1] bg-slate-50 shadow-[0_1px_0_0_rgb(226_232_240)]">
                  <TableRow className="border-b border-slate-200 hover:bg-slate-50">
                    <TableHead className="h-9 w-14 shrink-0 px-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                      Sr no.
                    </TableHead>
                    <TableHead className="h-9 min-w-[13rem] px-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                      Service no.
                    </TableHead>
                    <TableHead className="h-9 min-w-[16rem] px-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                      Short text
                    </TableHead>
                    <TableHead className="h-9 min-w-[11rem] px-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                      UOM
                    </TableHead>
                    <TableHead className="h-9 w-20 min-w-[4.5rem] shrink-0 px-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                      Qty
                    </TableHead>
                    {subDlgActions && (
                      <TableHead className="h-9 w-24 shrink-0 px-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                        Action
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData?.[selectedSubItemIndex?.index as number]?.sub_items?.map(
                    (item, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-slate-100 transition-colors hover:bg-slate-50/70"
                      >
                        <TableCell className="px-2 py-2 text-center text-xs font-medium leading-snug tabular-nums text-[#334155]">
                          {index + 1}
                        </TableCell>
                        <TableCell className="max-w-xs px-3 py-2 text-xs leading-snug text-[#334155]">
                          <span className="block break-words" title={item.service_code}>
                            {item.service_code}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-md px-3 py-2 text-xs leading-snug text-[#334155]">
                          <span className="block break-words" title={item.short_text}>
                            {item.short_text}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[10rem] px-2 py-2 text-center text-xs leading-snug text-[#334155]">
                          <span className="block break-words" title={item.uom}>
                            {item.uom}
                          </span>
                        </TableCell>
                        <TableCell className="px-2 py-2 text-center text-xs font-medium leading-snug tabular-nums text-[#334155]">
                          {item.quantity}
                        </TableCell>
                        {subDlgActions && (
                          <TableCell className="px-2 py-2">
                            <div className="flex items-center justify-center gap-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      className={`${subItemDialogIconBtn} border-slate-200 bg-white text-slate-600 hover:border-[#4F6BED]/35 hover:bg-slate-50 hover:text-[#4F6BED]`}
                                      onClick={() => {
                                        handleUpdateSubItem(index);
                                      }}
                                    >
                                      <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit sub line item</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      className={`${subItemDialogIconBtn} border-red-200/90 bg-red-50 text-red-600 hover:bg-red-100`}
                                      onClick={() => {
                                        handleSublineItemDelete(item?.name as string);
                                      }}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete sub line item</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ),
                  )}

                  {subDlgActions && (
                    <TableRow className="border-t border-slate-200 bg-slate-50/50 hover:bg-slate-50/50">
                      <TableCell className="px-2 py-2 text-center" />
                      <TableCell className="min-w-[13rem] px-3 py-2">
                        <Select
                          value={subLineItem?.service_code ?? ""}
                          onValueChange={(value) => {
                            fetchUomBasedOnServiceCode(value);
                            fetchShortTextBasedOnServiceCode(value);
                            setSubLineItem(
                              (prev) =>
                                ({
                                  ...prev,
                                  service_code: value,
                                }) as zsbServiceSubItemsType,
                            );
                          }}
                        >
                          <SelectTrigger className="h-8 w-full min-w-[12rem] rounded-md border-slate-200 bg-white text-xs">
                            <SelectValue placeholder="Service no." />
                          </SelectTrigger>
                          <SelectContent className="max-h-72 min-w-[var(--radix-select-trigger-width)] sm:min-w-[26rem]">
                            <SelectGroup>
                              {serviceCodeDropdown?.map((item) => (
                                <SelectItem key={item?.name} value={item?.name}>
                                  {item?.service_code}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="min-w-[16rem] px-3 py-2">
                        <Input
                          disabled={isSubItemShortText ? true : false}
                          value={subLineItem?.short_text ?? ""}
                          onChange={(e) => {
                            setSubLineItem(
                              (prev) =>
                                ({
                                  ...prev,
                                  short_text: e.target.value,
                                }) as zsbServiceSubItemsType,
                            );
                          }}
                          className="h-8 w-full min-w-[14rem] rounded-md border-slate-200 px-2 text-xs"
                        />
                      </TableCell>
                      <TableCell className="min-w-[11rem] px-2 py-2">
                        <MultiSelect
                          isDisabled={isSubItemUom ? true : false}
                          options={UOMDropdown?.map(item => ({ label: item?.description || item?.name, value: item?.name })) || []}
                          value={subLineItem?.uom ? { label: UOMDropdown?.find(p => p.name === subLineItem.uom)?.description || subLineItem.uom, value: subLineItem.uom } : null}
                          onChange={(selectedOption: any) => {
                            setSubLineItem(
                              (prev) =>
                                ({ ...prev, uom: selectedOption?.value }) as zsbServiceSubItemsType,
                            );
                          }}
                          instanceId="zsbservice-subuom-select"
                          placeholder="UOM"
                          className="min-w-[10rem] text-left text-xs text-black"
                          styles={itemsRowSelectStyles("min(12rem, calc(100vw - 2rem))")}
                          menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                          menuPlacement="auto"
                          menuPosition="fixed"
                        />
                      </TableCell>
                      <TableCell className="w-20 min-w-[4.5rem] px-2 py-2">
                        <Input
                          value={subLineItem?.quantity ?? ""}
                          onChange={(e) => {
                            setSubLineItem((prev: any) => ({ ...prev, quantity: e.target.value }));
                          }}
                          className="h-8 w-full rounded-md border-slate-200 px-2 text-xs tabular-nums"
                        />
                      </TableCell>
                      <TableCell className="w-24 px-2 py-2">
                        <div className="flex items-center justify-center gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className={`${subItemDialogIconBtn} border-emerald-200/90 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300`}
                                  onClick={() => {
                                    handleSubItemAdd();
                                  }}
                                >
                                  <Plus className="h-3.5 w-3.5" strokeWidth={2.25} />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Add sub line item</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {subLineItem?.name && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    className={`${subItemDialogIconBtn} border-red-200/90 bg-white text-red-600 hover:bg-red-50`}
                                    onClick={() => {
                                      setSubLineItem(undefined);
                                    }}
                                  >
                                    <X className="h-3.5 w-3.5" strokeWidth={2.25} />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Cancel update</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </PopUp>
      )}
    </>
  );
};

export default ServicePR;
