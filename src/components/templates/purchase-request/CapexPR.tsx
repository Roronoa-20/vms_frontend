import React, { useEffect, useState } from "react";
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
import { Loader2, ListOrdered, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { nbCapexItemsType, nbItemsType, purchaseRequisitionDataType, PurchaseRequisitionMaterialDropdownType, purchaseRequisitionPurchaseGroupDropdownType, purchaseRequisitionUOMType } from "@/src/types/prRequisition/prRequisition.types";
import { addPurchaseRequisitionNBItems, deletePurchaseRequisitionNBItems, getPurchaseReqisitionData, getPurchaseRequisitionPurchaseGroupDropdown, getPurchaseRequisitionUOM, updatePurchaseRequisitionNBItems, getMaterialNameByCode, getMaterialsByPlant } from "@/src/services/prRequisition/prRequisitionNb.services";
import { set } from "nprogress";
import { useSearchParams } from "next/navigation";
import { deleteEnquiryItems } from "@/src/services/prEnquiry/prEnquiry.services";
import SearchSelectComponent from "../../molecules/Selectsearchcomponent";
import MultiSelect from 'react-select';
import { itemsRowSelectStyles } from "../../common/sharedStyles";
import { Button } from "../../atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  prData?: purchaseRequisitionDataType
  materialDropdown: PurchaseRequisitionMaterialDropdownType[]
  submitLoaderRef: React.RefObject<HTMLSpanElement | null>
  handlePurchaseRequisitionSubmit: (isAlert: boolean) => void
};


const CapexPR = (props: Props) => {
  const searchParams = useSearchParams();
  const pr_id = searchParams.get("pr_id") as string;
  const [purchaseGroupDropdown, setPurchaseGroupDropdown] = useState<purchaseRequisitionPurchaseGroupDropdownType[]>([]);
  const [uomDrop, setUOM] = useState<purchaseRequisitionUOMType>();
  const [isPurchaseGroupDropdown, setIsPurchaseGroupDropdown] = useState(false);

  const [singleRowData, setSingleRowData] = useState<nbCapexItemsType>();

  const [tableData, setTableData] = useState<nbCapexItemsType[]>(props?.prData?.nb_capex_items || []);

  const [materialDropdown, setMaterialDropdown] = useState<any[]>([]);

  const getPurchaseGroupBasedOnMaterial = (material: string) => {
    getPurchaseRequisitionPurchaseGroupDropdown(material).then((res: any) => {
      if (Array.isArray(res)) {
        setPurchaseGroupDropdown(res);
        setIsPurchaseGroupDropdown(true);
      } else {
        setSingleRowData((prev) => ({ ...prev, purchasing_group: res?.purchase_group } as nbCapexItemsType));
        setIsPurchaseGroupDropdown(false);
      }

    }).catch((err) => {
      console.log(err);
    })
  }

  const fetchPrData = () => {
    getPurchaseReqisitionData(pr_id as string).then((res) => {
      setTableData(res?.nb_capex_items || []);
    }).catch((err) => {
      console.error("Error fetching PR data:", err);
    })
  }

  const getUOMBasedOnMaterial = (material: string) => {
    getPurchaseRequisitionUOM(material).then((res) => {
      setSingleRowData(prev => ({ ...prev, uom: res?.base_uom }) as nbCapexItemsType);
    }).catch((err) => {
      console.log(err);
    })
  }

  const handleTableAdd = () => {

    if (!singleRowData?.material) {
      alert("please select material");
      return;
    }

    if (!singleRowData?.asset_code) {
      alert("please enter asset code");
      return;
    }

    if (!singleRowData?.quantity) {
      alert("please enter quantity");
      return;
    }

    if (!singleRowData?.purchasing_group) {
      alert("please select purchasing group");
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
        material: singleRowData?.material,
        material_description: singleRowData?.material_description,
        requisitioner: props?.prData?.name,
        uom: singleRowData?.uom,
        quantity: singleRowData?.quantity,
        purchasing_group: singleRowData?.purchasing_group,
        required_delivery_date: singleRowData?.required_delivery_date,
        asset_code: singleRowData?.asset_code,
        account_assignment_category: "A"
      }
    }



    if (singleRowData?.name) {
      updatePurchaseRequisitionNBItems(body, "NB-CAPEX").then((res) => {
        alert(res);
        setSingleRowData(undefined);
        setIsPurchaseGroupDropdown(false);
        setUOM(undefined);
        fetchPrData();
      }).catch((err) => {
        alert(err);
      })
    } else {

      addPurchaseRequisitionNBItems(body, "NB-CAPEX").then((res) => {
        alert(res);
        // setTableData(prev=>[...prev,singleRowData as nbItemsType]);
        setSingleRowData(undefined);
        setIsPurchaseGroupDropdown(false);
        setUOM(undefined);
        fetchPrData();
      }).catch((err) => {
        console.log(err);
      })
    }
  }


  const handleDeleteItem = (name: string) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }
    deletePurchaseRequisitionNBItems(name, "NB-CAPEX").then((res) => {
      alert(res);
      fetchPrData();
      setSingleRowData(undefined);
      setIsPurchaseGroupDropdown(false);
      setUOM(undefined);
    }).catch((err) => {
      console.log(err);
    })
  }

  const handleUpdateItem = async (index: number) => {
    const materialName = await getMaterialNameByCode(tableData[index]?.material);
    getPurchaseGroupBasedOnMaterial(materialName?.material_name as string);
    getUOMBasedOnMaterial(materialName?.material_name as string);
    fetchMaterialsByPlant();
    setSingleRowData({ ...tableData[index], material: materialName?.material_name } as nbCapexItemsType);
  }


  const fetchMaterialsByPlant = (query?: string): Promise<any[]> => {
    return getMaterialsByPlant(props?.prData?.plant as string, query)
      .then((res: any) => { setMaterialDropdown(res); return res; })
      .catch((err: any) => {
        console.error("Error fetching materials by plant:", err);
        return [];
      });
  }




  return (
    <>
    <div className='flex justify-end'>
                {
                    props?.prData?.can_edit &&
                    <Button className='mt-4 h-8 bg-[#5291CD] text-white text-xs rounded-md px-4 py-0 hover:bg-[#65a4e7]' onClick={() => {
                      let isAlert = true;
                      if (singleRowData?.material || singleRowData?.asset_code || singleRowData?.quantity || singleRowData?.purchasing_group || singleRowData?.required_delivery_date) {
                        alert("You have unsaved changes in the table. Do you want to continue without saving?")
                          isAlert = false;
                          return;
                        
                      }
                      props?.handlePurchaseRequisitionSubmit(isAlert);
                    }}>
                        Submit PR
                        <span ref={props?.submitLoaderRef} className="hidden">
                            <Loader2 className="w-5 h-5" />
                        </span>
                    </Button>
                }
            </div>
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
      <CardContent className="px-0 pb-3 pt-3">
        <div className="max-h-[min(48vh,400px)] overflow-auto">
      <Table className="w-full min-w-[800px] border border-slate-200">
        <TableHeader className="text-center">
          <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[11px] hover:bg-[#DDE8FE] text-center text-nowrap">
            <TableHead className="text-center w-[50px]">Sr No.</TableHead>
            <TableHead className="text-center w-[20%]">Materials</TableHead>
            <TableHead className="text-center w-[25%]">Material Description</TableHead>
            <TableHead className="text-center w-[10%]">UOM</TableHead>
            <TableHead className="text-center w-[15%]">Asset Code</TableHead>
            <TableHead className="text-center w-[10%]">Quantity</TableHead>
            <TableHead className="text-center w-[15%]">Purchasing Group</TableHead>
            <TableHead className="text-center w-[15%]">Required Delivery Date</TableHead>
            {
              props?.prData?.can_edit &&
              <TableHead className="text-center w-[10%]">Action</TableHead>
            }
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {
            tableData?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="py-1.5 text-xs font-medium text-center w-[50px] leading-snug">{index + 1}</TableCell>
                <TableCell className="py-1.5 text-xs font-medium text-center max-w-[200px] truncate leading-snug" title={item.material}>{item.material}</TableCell>
                <TableCell className="py-1.5 text-xs font-medium text-center max-w-[200px] truncate leading-snug" title={item.material_description}>{item.material_description}</TableCell>
                <TableCell className="py-1.5 text-xs font-medium text-center max-w-[100px] truncate leading-snug" title={item.uom}>{item.uom}</TableCell>
                <TableCell className="py-1.5 text-xs font-medium text-center max-w-[150px] truncate leading-snug" title={item.asset_code}>{item.asset_code}</TableCell>
                <TableCell className="py-1.5 text-xs font-medium text-center max-w-[120px] truncate leading-snug tabular-nums" title={item.quantity?.toString()}>{item.quantity}</TableCell>
                <TableCell className="py-1.5 text-xs font-medium text-center max-w-[200px] truncate leading-snug" title={item.purchasing_group}>{item.purchasing_group}</TableCell>
                <TableCell className="py-1.5 text-xs font-medium text-center max-w-[150px] truncate leading-snug" title={item.required_delivery_date}>{item.required_delivery_date}</TableCell>
                {
                  props?.prData?.can_edit &&
                  <TableCell className="font-medium">
                    <div className="flex gap-4 justify-center items-center p-0 m-0 w-fit">
                      {/* Pencil Icon */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <svg
                              onClick={() => { handleUpdateItem(index) }}
                              className="hover:cursor-pointer"
                              width="18"
                              height="18"
                              viewBox="0 0 22 22"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 20.0008H20.0001M14.0001 4.00045L18.0001 8.00054M20.1741 5.81249C20.7028 5.2839 20.9999 4.56693 21 3.8193C21.0001 3.07167 20.7032 2.35462 20.1746 1.8259C19.646 1.29718 18.9291 1.00009 18.1814 1C17.4338 0.999906 16.7168 1.29681 16.1881 1.8254L2.84195 15.1747C2.60977 15.4062 2.43806 15.6912 2.34195 16.0047L1.02093 20.3568C0.99509 20.4433 0.993138 20.5352 1.01529 20.6227C1.03743 20.7102 1.08286 20.7901 1.14673 20.8538C1.21061 20.9176 1.29056 20.9629 1.3781 20.9849C1.46564 21.0069 1.5575 21.0048 1.64394 20.9788L5.99698 19.6588C6.31015 19.5636 6.59516 19.3929 6.82699 19.1618L20.1741 5.81249Z"
                                stroke="#03111F"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Item</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Trash2 className="h-4 w-4 text-red-400 hover:cursor-pointer" onClick={() => { handleDeleteItem(item?.name as string) }} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Item</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                }
              </TableRow>
            ))
          }

          {
            props?.prData?.can_edit &&

            <TableRow>
              <TableCell className="font-medium text-center"></TableCell>
              <TableCell className="font-medium">
                {/* <Select
              value={singleRowData?.material ?? ""}
              onValueChange={(value)=>{
                  getPurchaseGroupBasedOnMaterial(value);
                  getUOMBasedOnMaterial(value);
                  setSingleRowData(prev=>({...prev,material:value} as nbCapexItemsType));
                }}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {props?.materialDropdown?.map((item) => (
                        <SelectItem key={item?.name} value={item?.name}>
                              {item?.material_description}
                            </SelectItem>
                          ))}
                  </SelectGroup>
                </SelectContent>
              </Select> */}
                <SearchSelectComponent
                  searchApi={fetchMaterialsByPlant}
                  getLabel={(item: any) => item?.material_code}
                  getValue={(item: any) => item?.name}
                  setDropdown={setMaterialDropdown}
                  dropdown={materialDropdown}
                  setData={(value) => { setSingleRowData((prev: any) => ({ ...prev, material: value ?? "" })); getPurchaseGroupBasedOnMaterial(value as string); getUOMBasedOnMaterial(value as string); }}
                  data={singleRowData?.material}
                  placeholder="Search material..."
                />
              </TableCell>
              <TableCell className="font-medium align-middle">
                <span className="flex h-8 w-full items-center justify-center rounded-md border border-slate-200 bg-white text-xs font-medium tabular-nums text-slate-600">
                  {singleRowData?.uom ?? "—"}
                </span>
              </TableCell>
              <TableCell className="font-medium">
                <Input value={singleRowData?.asset_code ?? ""} className="h-8 text-xs rounded-md px-2" onChange={(e) => { setSingleRowData(prev => ({ ...prev, asset_code: e.target.value } as nbCapexItemsType)) }} />
              </TableCell>
              <TableCell className="font-medium">
                <Input type="number" className="h-8 text-xs rounded-md px-2" value={singleRowData?.quantity ?? ""} onChange={(e) => { setSingleRowData(prev => ({ ...prev, quantity: Number(e.target.value) } as nbCapexItemsType)) }} />
              </TableCell>
              <TableCell className="font-medium">
                {
                  isPurchaseGroupDropdown ?

                    <MultiSelect
                      options={purchaseGroupDropdown?.map(item => ({ label: item?.purchase_group_name, value: item?.name })) || []}
                      value={singleRowData?.purchasing_group ? { label: purchaseGroupDropdown?.find(p => p.name === singleRowData.purchasing_group)?.purchase_group_name || singleRowData.purchasing_group, value: singleRowData.purchasing_group } : null}
                      onChange={(selectedOption: any) => {
                        setSingleRowData(prev => ({ ...prev, purchasing_group: selectedOption?.value } as nbCapexItemsType));
                      }}
                      instanceId="capexpr-pg-select"
                      placeholder="Select Purchase Group..."
                      className="min-w-[120px] text-left text-xs text-black"
                      styles={itemsRowSelectStyles("min(18rem, 90vw)")}
                      menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                      menuPlacement="auto"
                      menuPosition="fixed"
                    />
                    :
                    <Input value={singleRowData?.purchasing_group ?? ""} className="h-8 text-xs rounded-md px-2" onChange={(e) => { setSingleRowData(prev => ({ ...prev, purchasing_group: e.target.value } as nbCapexItemsType)) }} disabled />
                }
              </TableCell>
              <TableCell className="font-medium">
                <Input type="date"
                  className="h-8 text-xs rounded-md px-2"
                  value={singleRowData?.required_delivery_date ?? ""}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => { setSingleRowData(prev => ({ ...prev, required_delivery_date: e.target.value } as nbCapexItemsType)) }}
                />
              </TableCell>
              <TableCell className="">
                <div className="flex gap-4 justify-center items-center p-0 m-0 w-fit">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-[#D1FAE5] flex justify-center items-center text-lg font-semibold text-[#065F46] w-7 h-7 rounded-md hover:cursor-pointer" onClick={() => { handleTableAdd() }}>
                          {singleRowData?.name ? "✓" : "+"}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{singleRowData?.name ? "Update Row" : "Add Row"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {singleRowData?.name && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="bg-red-100 flex justify-center items-center text-sm font-semibold text-red-600 w-7 h-7 hover:cursor-pointer rounded-md"
                            onClick={() => {
                              setSingleRowData(undefined);
                              setIsPurchaseGroupDropdown(false);
                              setUOM(undefined);
                            }}
                          >
                            ✕
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Cancel Update</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </TableCell>
            </TableRow>
          }
        </TableBody>
      </Table>
        </div>
      </CardContent>
    </Card>
    </>
  );
};

export default CapexPR;
