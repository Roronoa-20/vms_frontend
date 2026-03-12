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
import { Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { nbItemsType, purchaseRequisitionDataType, PurchaseRequisitionMaterialDropdownType, purchaseRequisitionPlantDropdownType, purchaseRequisitionPurchaseGroupDropdownType, purchaseRequisitionUOMType } from "@/src/types/prRequisition/prRequisition.types";
import { addPurchaseRequisitionNBItems, deletePurchaseRequisitionNBItems, getPurchaseReqisitionData, getPurchaseRequisitionMaterialDropdown, getPurchaseRequisitionPurchaseGroupDropdown, getPurchaseRequisitionUOM, updatePurchaseRequisitionNBItems, getPlantByMaterial, getMaterialNameByCode } from "@/src/services/prRequisition/prRequisitionNb.services";
import { set } from "nprogress";
import { useSearchParams } from "next/navigation";
import { deleteEnquiryItems } from "@/src/services/prEnquiry/prEnquiry.services";
import SearchSelectComponent from "../../molecules/Selectsearchcomponent";
import MultiSelect from 'react-select';
import { multiSelectStyles } from "../../common/sharedStyles";

type Props = {
  prData?: purchaseRequisitionDataType
  materialDropdown: PurchaseRequisitionMaterialDropdownType[]
};


const NormalPR = (props: Props) => {
  const searchParams = useSearchParams();
  const pr_id = searchParams.get("pr_id") as string;
  const [purchaseGroupDropdown, setPurchaseGroupDropdown] = useState<purchaseRequisitionPurchaseGroupDropdownType[]>([]);
  const [uomDrop, setUOM] = useState<purchaseRequisitionUOMType>();
  const [isPurchaseGroupDropdown, setIsPurchaseGroupDropdown] = useState(false);
  const [isPlantDropdown, setIsPlantDropdown] = useState(false);
  const [plantDropdown, setPlantDropdown] = useState<purchaseRequisitionPlantDropdownType[]>();

  const [singleRowData, setSingleRowData] = useState<nbItemsType>();

  const [tableData, setTableData] = useState<nbItemsType[]>(props?.prData?.nb_normal_items || []);

  const [materialDropdown, setMaterialDropdown] = useState<PurchaseRequisitionMaterialDropdownType[]>([]);

  const getPurchaseGroupBasedOnMaterial = (material: string) => {
    getPurchaseRequisitionPurchaseGroupDropdown(material).then((res: any) => {
      if (Array.isArray(res)) {
        setPurchaseGroupDropdown(res);
        setIsPurchaseGroupDropdown(true);
      } else {
        setSingleRowData((prev) => ({ ...prev, purchasing_group: res?.purchase_group } as nbItemsType));
        setIsPurchaseGroupDropdown(false);
      }

    }).catch((err) => {
      console.log(err);
    })
  }

  const fetchPrData = () => {
    getPurchaseReqisitionData(pr_id as string).then((res) => {
      setTableData(res?.nb_normal_items || []);
    }).catch((err) => {
      console.error("Error fetching PR data:", err);
    })
  }

  const getUOMBasedOnMaterial = (material: string) => {
    getPurchaseRequisitionUOM(material).then((res) => {
      setSingleRowData(prev => ({ ...prev, uom: res?.base_uom }) as nbItemsType);
    }).catch((err) => {
      console.log(err);
    })
  }

  const getPlantBasedOnMaterial = (material: string) => {
    getPlantByMaterial(material).then((res: any) => {
      if (Array.isArray(res)) {
        setPlantDropdown(res);
        setIsPlantDropdown(true);
      } else {
        setSingleRowData(prev => ({ ...prev, plant: res?.plant }) as nbItemsType);
        setIsPlantDropdown(false);
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const handleTableAdd = () => {
    if (!singleRowData?.material) {
      alert("please select material");
      return;
    }

    if (!singleRowData?.plant) {
      alert("please select plant");
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
        plant: singleRowData?.plant,
        requisitioner: props?.prData?.name,
        uom: singleRowData?.uom,
        quantity: singleRowData?.quantity,
        purchasing_group: singleRowData?.purchasing_group,
        required_delivery_date: singleRowData?.required_delivery_date
      }
    }

    if (singleRowData?.name) {
      updatePurchaseRequisitionNBItems(body, "NB-Normal").then((res) => {
        alert(res);
        setSingleRowData(undefined);
        setIsPurchaseGroupDropdown(false);
        setIsPlantDropdown(false);
        setUOM(undefined);
        fetchPrData();
      }).catch((err) => {
        alert(err);
      })
    } else {

      addPurchaseRequisitionNBItems(body, "NB-Normal").then((res) => {
        alert(res);
        // setTableData(prev=>[...prev,singleRowData as nbItemsType]);
        setSingleRowData(undefined);
        setIsPurchaseGroupDropdown(false);
        setIsPlantDropdown(false);
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
    deletePurchaseRequisitionNBItems(name, "NB-Normal").then((res) => {
      alert(res);
      fetchPrData();
      setSingleRowData(undefined);
      setIsPurchaseGroupDropdown(false);
      setIsPlantDropdown(false);
      setUOM(undefined);
    }).catch((err) => {
      console.log(err);
    })
  }

  const handleUpdateItem = async (index: number) => {
    const materialName = await getMaterialNameByCode(tableData[index]?.material);
    getPurchaseGroupBasedOnMaterial(materialName?.material_name as string);
    getUOMBasedOnMaterial(materialName?.material_name as string);
    getPlantBasedOnMaterial(materialName?.material_name as string);
    fetchMaterialDropdown(materialName?.material_name as string);
    setSingleRowData({ ...tableData[index], material: materialName?.material_name });
  }


  const fetchMaterialDropdown = (query?: string): Promise<PurchaseRequisitionMaterialDropdownType[]> => {
    return getPurchaseRequisitionMaterialDropdown(query as string, props?.prData?.company as string)
      .then((res) => { setMaterialDropdown(res); return res })
      .catch((err) => {
        console.error(err);
        return [];
      });
  }





  return (
    <div className="">
      <div className="flex w-full justify-between pb-4">
        <h1 className="text-[20px] text-[#03111F] font-semibold">Items List</h1>
      </div>
      <Table className=" max-h-40 overflow-y-scroll border border-black/20">
        <TableHeader className="text-center">
          <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
            <TableHead className="text-center max-w-[60px]">Sr No.</TableHead>
            <TableHead className="text-center min-w-[200px]">Materials</TableHead>
            <TableHead className="text-center min-w-[100px]">UOM</TableHead>
            <TableHead className="text-center min-w-[150px]">Plant</TableHead>
            <TableHead className="text-center min-w-[120px]">Quantity</TableHead>
            <TableHead className="text-center min-w-[200px]">Purchasing Group</TableHead>
            <TableHead className="text-center min-w-[150px]">Required Delivery Date</TableHead>
            {
              props?.prData?.is_submitted !== 1 &&
              <TableHead className="text-center min-w-[120px]">Action</TableHead>
            }
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {
            tableData?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-center">{index + 1}</TableCell>
                <TableCell className="font-medium text-center max-w-[200px] truncate" title={item.material}>{item.material}</TableCell>
                <TableCell className="font-medium text-center max-w-[100px] truncate" title={item.uom}>{item.uom}</TableCell>
                <TableCell className="font-medium text-center max-w-[150px] truncate" title={item.plant}>{item.plant}</TableCell>
                <TableCell className="font-medium text-center max-w-[120px] truncate" title={item.quantity?.toString()}>{item.quantity}</TableCell>
                <TableCell className="font-medium text-center max-w-[200px] truncate" title={item.purchasing_group}>{item.purchasing_group}</TableCell>
                <TableCell className="font-medium text-center max-w-[150px] truncate" title={item.required_delivery_date}>{item.required_delivery_date}</TableCell>
                {

                  props?.prData?.is_submitted !== 1 &&
                  <TableCell className="font-medium">
                    <div className="flex gap-4 justify-center items-center p-0 m-0 w-fit">
                      {/* Pencil Icon */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <svg
                              onClick={() => { handleUpdateItem(index) }}
                              className="hover:cursor-pointer"
                              width="22"
                              height="22"
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
                            <Trash2 className="text-red-400 hover:cursor-pointer" onClick={() => { handleDeleteItem(item?.name as string) }} />
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
            props?.prData?.is_submitted !== 1 &&

            <TableRow>
              <TableCell className="font-medium text-center"></TableCell>
              <TableCell className="font-medium">
                {/* <Select
              value={singleRowData?.material ?? ""}
               onValueChange={(value)=>{
                getPurchaseGroupBasedOnMaterial(value);
                getUOMBasedOnMaterial(value);
                setSingleRowData(prev=>({...prev,material:value} as nbItemsType));
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
                  searchApi={fetchMaterialDropdown}
                  getLabel={(item) => item?.material_description}
                  getValue={(item) => item?.name}
                  setDropdown={setMaterialDropdown}
                  dropdown={materialDropdown}
                  setData={(value) => { setSingleRowData((prev: any) => ({ ...prev, material: value ?? "" })); getPurchaseGroupBasedOnMaterial(value as string); getUOMBasedOnMaterial(value as string); getPlantBasedOnMaterial(value as string); }}
                  data={singleRowData?.material}
                />
              </TableCell>
              <TableCell className="font-medium">
                <h1 className="text-center">{singleRowData?.uom}</h1>
              </TableCell>
              <TableCell className="font-medium">
                {
                  isPlantDropdown ?
                    <MultiSelect
                      options={plantDropdown?.map(item => ({ label: item?.plant_name || item?.name, value: item?.name })) || []}
                      value={singleRowData?.plant ? { label: plantDropdown?.find(p => p.name === singleRowData.plant)?.plant_name || singleRowData.plant, value: singleRowData.plant } : null}
                      onChange={(selectedOption: any) => {
                        setSingleRowData(prev => ({ ...prev, plant: selectedOption?.value } as nbItemsType));
                      }}
                      instanceId="normalpr-plant-select"
                      placeholder="Select Plant..."
                      className="text-[12px] text-black text-left min-w-[150px]"
                      styles={{
                        ...multiSelectStyles,
                        control: (base: any) => ({
                          ...base,
                          minHeight: "36px",
                          borderRadius: "0.5rem", // matches tailwind's rounded-lg
                          borderColor: "#e5e7eb", // standard Tailwind border-gray-200
                        }),
                      }}
                      menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                      menuPlacement="auto"
                      menuPosition="fixed"
                    />
                    :
                    <Input value={singleRowData?.plant ?? ""} onChange={(e) => { setSingleRowData(prev => ({ ...prev, plant: e.target.value } as nbItemsType)) }} disabled />
                }
              </TableCell>
              <TableCell className="font-medium">
                <Input type="number" value={singleRowData?.quantity ?? ""} onChange={(e) => { setSingleRowData(prev => ({ ...prev, quantity: Number(e.target.value) } as nbItemsType)) }} />
              </TableCell>
              <TableCell className="font-medium">
                {
                  isPurchaseGroupDropdown ?

                    <MultiSelect
                      options={purchaseGroupDropdown?.map(item => ({ label: item?.purchase_group_name, value: item?.name })) || []}
                      value={singleRowData?.purchasing_group ? { label: purchaseGroupDropdown?.find(p => p.name === singleRowData.purchasing_group)?.purchase_group_name || singleRowData.purchasing_group, value: singleRowData.purchasing_group } : null}
                      onChange={(selectedOption: any) => {
                        setSingleRowData(prev => ({ ...prev, purchasing_group: selectedOption?.value } as nbItemsType));
                      }}
                      instanceId="normalpr-pg-select"
                      placeholder="Select Purchase Group..."
                      className="text-[12px] text-black text-left min-w-[150px]"
                      styles={{
                        ...multiSelectStyles,
                        control: (base: any) => ({
                          ...base,
                          minHeight: "36px",
                          borderRadius: "0.5rem", // matches tailwind's rounded-lg
                          borderColor: "#e5e7eb", // standard Tailwind border-gray-200
                        }),
                      }}
                      menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                      menuPlacement="auto"
                      menuPosition="fixed"
                    />
                    :
                    <Input value={singleRowData?.purchasing_group ?? ""} onChange={(e) => { setSingleRowData(prev => ({ ...prev, purchasing_group: e.target.value } as nbItemsType)) }} disabled />
                }
              </TableCell>
              <TableCell className="font-medium">
                <Input type="date"
                  value={singleRowData?.required_delivery_date ?? ""}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => { setSingleRowData(prev => ({ ...prev, required_delivery_date: e.target.value } as nbItemsType)) }}
                />
              </TableCell>
              <TableCell className="">
                <div className="flex gap-4 justify-center items-center p-0 m-0 w-fit">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-[#D1FAE5] flex justify-center items-center text-2xl  text-[#065F46] w-[30px] h-[30px] hover:cursor-pointer" onClick={() => { handleTableAdd() }}>
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
                            className="bg-red-100 flex justify-center items-center text-lg text-red-600 w-[30px] h-[30px] hover:cursor-pointer rounded-full"
                            onClick={() => {
                              setSingleRowData(undefined);
                              setIsPurchaseGroupDropdown(false);
                              setIsPlantDropdown(false);
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
  );
};

export default NormalPR;
