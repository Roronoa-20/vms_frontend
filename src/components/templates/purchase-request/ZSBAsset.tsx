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
import { Trash2, Loader2 } from "lucide-react";
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
  purchaseRequisitionDataType,
  PurchaseRequisitionMaterialDropdownType,
  purchaseRequisitionPlantDropdownType,
  purchaseRequisitionPurchaseGroupDropdownType,
  purchaseRequisitionUOMType,
  serviceCodeDropdownType,
  uomType,
  zsbAssetItemsType,
  zsbAssetSubItemsType,
  zsbServiceItemsType,
  zsbServiceSubItemsType,
} from "@/src/types/prRequisition/prRequisition.types";
import {
  getPurchaseReqisitionData,
} from "@/src/services/prRequisition/prRequisitionNb.services";
import { useSearchParams } from "next/navigation";
import MultiSelect from 'react-select';
import { multiSelectStyles } from "../../common/sharedStyles";
import {
  addSublineItem,
  addZsbLineItems,
  deleteSublineItem,
  deleteZsbLineItems,
  getCostCenterBasedOnCompanyDropdown,
  getGlAccountBasedOnCompanyDropdown,
  getMaterialGroupDropdown,
  getPurchaseRequisitionPlantBasedOnCompany,
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

type Props = {
  prData?: purchaseRequisitionDataType;
  submitLoaderRef: React.RefObject<HTMLSpanElement | null>;
  handlePurchaseRequisitionSubmit: (isAlert: boolean) => void;
};

const AssetPR = (props: Props) => {
  const searchParams = useSearchParams();
  const pr_id = searchParams.get("pr_id") as string;
  const addLoaderRef = useRef<HTMLSpanElement>(null);
  const [purchaseGroupDropdown, setPurchaseGroupDropdown] = useState<
    purchaseRequisitionPurchaseGroupDropdownType[]
  >([]);
  const [uomDrop, setUOM] = useState<purchaseRequisitionUOMType>();
  const [isPurchaseGroupDropdown, setIsPurchaseGroupDropdown] = useState(false);
  const [UOMDropdown, setUOMDropdown] = useState<uomType[]>([]);
  const [plantBasedOnCompanyDropdown, setPlantBasedCompanyDropdown] = useState<
    purchaseRequisitionPlantDropdownType[]
  >([]);
  const [materialGroupDropdown, setMaterialGroupDropdown] = useState<
    MaterialGroupDropdownType[]
  >([]);

  const [isSubItemDialog, setIsSubItemDialog] = useState(false);
  const [isSubItemShortText, setIsSubItemShortText] = useState(false);
  const [isSubItemUom, setIsSubItemUom] = useState(false);

  const [subLineItem, setSubLineItem] = useState<zsbAssetSubItemsType>();

  const [singleRowData, setSingleRowData] = useState<zsbAssetItemsType>();

  const [selectedSubItemIndex, setSelectedSubItemIndex] = useState<any>(null);

  const [serviceCodeDropdown, setServiceCodeDropdown] =
    useState<serviceCodeDropdownType[]>();

  const [tableData, setTableData] = useState<zsbAssetItemsType[]>(
    props?.prData?.zsb_asset_items || [],
  );

  const [isSubItemsView, setIsSubItemView] = useState(false);

  useEffect(() => {
    fetchUom();
    if (props?.prData?.company) {
      fetchPlantBAsedOnCompany(props.prData.company);
    }

    fetchServiceCode();

    fetchMatrialGroup(props?.prData?.company as string);
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

  const fetchPlantBAsedOnCompany = (company: string) => {
    getPurchaseRequisitionPlantBasedOnCompany(company)
      .then((res) => {
        setPlantBasedCompanyDropdown(res);
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

  const fetchServiceCode = () => {
    getServiceCodeDropdown()
      .then((res) => {
        setServiceCodeDropdown(res);
      })
      .catch((err) => {
        console.log(err, "error fetching service code dropdown");
      });
  };


  const fetchUomBasedOnServiceCode = (serviceCode: string) => {
    getUomBasedOnServiceCode(serviceCode)
      .then((res) => {
        setSubLineItem(
          (prev) => ({ ...prev, uom: res?.uom }) as zsbAssetItemsType,
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
            }) as zsbAssetItemsType,
        );
      })
      .catch((err) => {
        console.log(err, "error fetching short text based on service code");
      });
  };

  const fetchPrData = () => {
    getPurchaseReqisitionData(pr_id as string)
      .then((res) => {
        setTableData(res?.zsb_asset_items || []);
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
        zsb_asset_item: selectedSubItemIndex?.parent_id,
      },
    };

    if (subLineItem?.name) {
      updateSublineItem(body, "asset").then((res) => { alert(res); fetchPrData(); setSubLineItem(undefined); }).catch((err) => { alert(err) });
    } else {
      addSublineItem(body, "asset")
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

    if (!singleRowData?.plant) {
      alert("please select plant");
      return;
    }

    if (!singleRowData?.quantity) {
      alert("please enter quantity");
      return;
    }

    if (!singleRowData?.asset_code) {
      alert("please enter asset code");
      return;
    }

    if (!singleRowData?.material_group) {
      alert("please select material group");
      return;
    }

    if (!singleRowData?.short_text) {
      alert("please enter short text");
      return;
    }

    const body = {
      data: {
        name: singleRowData?.name,
        purchase_requisition: props?.prData?.name,
        company: props?.prData?.company,
        material_description: singleRowData?.material_description,
        plant: singleRowData?.plant,
        requisitioner: props?.prData?.name,
        uom: "AU",
        quantity: singleRowData?.quantity,
        material_group: singleRowData?.material_group,
        asset_code: singleRowData?.asset_code,
        short_text: singleRowData?.short_text,
        asset: singleRowData?.asset_code,
      },
    };

    if (addLoaderRef?.current) {
      addLoaderRef.current.className = "inline-flex animate-spin ml-2";
    }

    if (singleRowData?.name) {
      updateZsbLineItems(body, "asset").then((res) => {
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
      addZsbLineItems(body, "asset")
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
    deleteZsbLineItems(name, "asset")
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
    setSingleRowData(tableData[index]);
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
    deleteSublineItem(name, "asset").then((res) => {
      alert(res);
      fetchPrData();
      setSubLineItem(undefined);
    }).catch((err) => {
      console.log(err)
    });
  }

  return (
    <>
      <div className='flex justify-end'>
        {
          pr_id && !props?.prData?.is_submitted &&
          <Button className='mt-5 bg-[#5291CD] text-white rounded-lg px-6 py-2 hover:bg-[#65a4e7]' onClick={() => {
            let isAlert = true;
            if (singleRowData?.material_description || singleRowData?.plant || singleRowData?.quantity || singleRowData?.asset_code || singleRowData?.material_group || singleRowData?.short_text) {
              if (!confirm("You have unsaved changes in the table. Do you want to continue without saving?")) {
                return;
              }
              isAlert = false;
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
      <div className="">
        <div className="flex w-full justify-between pb-4">
          <h1 className="text-[20px] text-[#03111F] font-semibold">
            Items List
          </h1>
        </div>
        <Table className=" max-h-40 overflow-y-scroll border border-black/20">
          <TableHeader className="text-center">
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
              <TableHead className="text-center w-[50px]">Sr No.</TableHead>
              <TableHead className="w-[20%] text-center">Material Description</TableHead>
              <TableHead className="w-[10%] text-center">UOM</TableHead>
              <TableHead className="w-[10%] text-center">Plant</TableHead>
              <TableHead className="w-[10%] text-center">Quantity</TableHead>
              <TableHead className="w-[15%] text-center">Material Group</TableHead>
              <TableHead className="w-[10%] text-center">Asset Code</TableHead>
              <TableHead className="w-[15%] text-center">Short Text</TableHead>
              <TableHead className="w-[10%] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {tableData?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-center w-[50px]">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium text-center">
                  {item.material_description}
                </TableCell>
                <TableCell className="font-medium text-center">{item.uom}</TableCell>
                <TableCell className="font-medium text-center">{item.plant}</TableCell>
                <TableCell className="font-medium text-center">{item.quantity}</TableCell>
                <TableCell className="font-medium text-center">
                  {item.material_group}
                </TableCell>
                <TableCell className="font-medium text-center">
                  {item.asset_code}
                </TableCell>
                <TableCell className="font-medium text-center">{item.short_text}</TableCell>
                <TableCell className="font-medium text-center flex justify-center">
                  <div className="flex gap-4 justify-center items-center p-0 m-0 w-fit">
                    {
                      props?.prData?.is_submitted !== 1 &&
                      <div className="flex gap-4 justify-center items-center p-0 m-0 w-fit">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className="bg-[#D1FAE5] flex justify-center items-center text-2xl  text-[#065F46] w-[30px] h-[30px] hover:cursor-pointer"
                                onClick={() => {
                                  setIsSubItemDialog(true);
                                  setIsSubItemView(false);
                                  setSelectedSubItemIndex({ index: index, parent_id: item?.name });
                                }}
                              >
                                +
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add Sub Item</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    }

                    {
                      props?.prData?.is_submitted == 1 &&
                      <div className="flex items-end gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <svg
                                onClick={() => {
                                  setIsSubItemDialog(true);
                                  setIsSubItemView(true);
                                  setSelectedSubItemIndex({ index: index, parent_id: item?.name });
                                }}
                                width="22"
                                height="16"
                                viewBox="0 0 22 16"
                                fill="none"
                                className="hover:cursor-pointer"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1.01387 8.46318C0.877686 8.24754 0.809592 8.13972 0.771474 7.97342C0.742842 7.8485 0.742842 7.6515 0.771474 7.52658C0.809592 7.36028 0.877685 7.25246 1.01387 7.03682C2.13928 5.25484 5.48915 0.75 10.5942 0.75C15.6992 0.75 19.049 5.25484 20.1744 7.03682C20.3106 7.25246 20.3787 7.36028 20.4168 7.52658C20.4455 7.6515 20.4455 7.8485 20.4168 7.97342C20.3787 8.13972 20.3106 8.24754 20.1744 8.46318C19.049 10.2452 15.6992 14.75 10.5942 14.75C5.48915 14.75 2.13928 10.2452 1.01387 8.46318Z"
                                  stroke="#5291CD"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M10.5942 10.75C12.251 10.75 13.5942 9.40685 13.5942 7.75C13.5942 6.09315 12.251 4.75 10.5942 4.75C8.9373 4.75 7.59415 6.09315 7.59415 7.75C7.59415 9.40685 8.9373 10.75 10.5942 10.75Z"
                                  stroke="#5291CD"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Sub Items</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    }
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <h1 className="cursor-default">{item?.sub_items?.length}</h1>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Sub Line Items Count</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {
                      !props?.prData?.is_submitted &&
                      <>
                        {/* Pencil Icon */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <svg
                                onClick={() => {
                                  handleUpdateItem(index);
                                }}
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
                              <Trash2
                                className="text-red-400 hover:cursor-pointer"
                                onClick={() => {
                                  handleDeleteItem(item?.name as string);
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Item</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    }
                  </div>
                </TableCell>

              </TableRow>
            ))}

            {props?.prData?.is_submitted !== 1 && (
              <TableRow>
                <TableCell className="font-medium text-center"></TableCell>
                <TableCell className="font-medium">
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
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <h1 className="text-center">AU</h1>
                </TableCell>
                <TableCell className="font-medium">
                  <MultiSelect
                    options={plantBasedOnCompanyDropdown?.map(item => ({ label: item?.plant_name || item?.name, value: item?.name })) || []}
                    value={singleRowData?.plant ? { label: plantBasedOnCompanyDropdown?.find(p => p.name === singleRowData.plant)?.plant_name || singleRowData.plant, value: singleRowData.plant } : null}
                    onChange={(selectedOption: any) => {
                      setSingleRowData(
                        (prev) =>
                          ({ ...prev, plant: selectedOption?.value }) as zsbAssetItemsType,
                      );
                    }}
                    instanceId="zsbasset-plant-select"
                    placeholder="Select Plant..."
                    className="text-[12px] text-black text-left min-w-[150px]"
                    styles={{
                      ...multiSelectStyles,
                      control: (base: any) => ({
                        ...base,
                        minHeight: "36px",
                        borderRadius: "0.5rem",
                        borderColor: "#e5e7eb",
                      }),
                    }}
                    menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                    menuPlacement="auto"
                    menuPosition="fixed"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Input
                    type="number"
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
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <MultiSelect
                    options={materialGroupDropdown?.map(item => ({ label: item?.material_group_description || item?.name, value: item?.name })) || []}
                    value={singleRowData?.material_group ? { label: materialGroupDropdown?.find(p => p.name === singleRowData.material_group)?.material_group_description || singleRowData.material_group, value: singleRowData.material_group } : null}
                    onChange={(selectedOption: any) => {
                      setSingleRowData(
                        (prev) =>
                          ({
                            ...prev,
                            material_group: selectedOption?.value,
                          }) as zsbAssetItemsType,
                      );
                    }}
                    instanceId="zsbasset-mg-select"
                    placeholder="Select Material Group..."
                    className="text-[12px] text-black text-left min-w-[150px]"
                    styles={{
                      ...multiSelectStyles,
                      control: (base: any) => ({
                        ...base,
                        minHeight: "36px",
                        borderRadius: "0.5rem",
                        borderColor: "#e5e7eb",
                      }),
                    }}
                    menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                    menuPlacement="auto"
                    menuPosition="fixed"
                  />
                  {/* <Input value={singleRowData?.material_group ?? ""} onChange={(e)=>{setSingleRowData(prev=>({...prev,material_group:e.target.value} as zsbServiceItemsType))}} /> */}
                </TableCell>
                <TableCell className="font-medium">
                  <Input value={singleRowData?.asset_code ?? ""} onChange={(e) => { setSingleRowData((prev: any) => ({ ...prev, asset_code: e.target.value })) }} />
                </TableCell>
                <TableCell className="font-medium">
                  <Input
                    type=""
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
                  />
                </TableCell>
                <TableCell className="">
                  {/* <div className="flex gap-4 justify-center items-center p-0 m-0 w-fit">
                    <div
                      className="bg-[#D1FAE5] flex justify-center items-center text-2xl  text-[#065F46] w-[30px] h-[30px] hover:cursor-pointer"
                      onClick={() => {
                        handleTableAdd();
                      }}
                    >
                      +
                    </div>
                  </div> */}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {props?.prData?.is_submitted !== 1 && (
          <div className='flex gap-4'>
            <Button className='mt-5 bg-[#5291CD] text-white rounded-lg px-6 py-2 hover:bg-[#65a4e7]' onClick={() => {
              handleTableAdd();
            }}>
              {singleRowData?.name ? "Update Row" : "Add Row"}
              <span ref={addLoaderRef} className="hidden">
                <Loader2 className="w-5 h-5" />
              </span>
            </Button>
            {singleRowData?.name && (
              <Button className='mt-5 bg-red-100 text-red-600 rounded-lg px-6 py-2 hover:bg-red-200' onClick={() => {
                setSingleRowData(undefined);
                setIsPurchaseGroupDropdown(false);
                setUOM(undefined);
              }}>
                Cancel
              </Button>
            )}
          </div>
        )}
      </div>
      {isSubItemDialog && (
        <PopUp
          handleClose={handleClose}
          headerText="SubItems"
          classname="md:max-w-[1300px]"
        >
          <Table className=" max-h-40 overflow-y-scroll border border-black/20">
            <TableHeader className="text-center">
              <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
                <TableHead className="text-center w-[50px]">Sr No.</TableHead>
                <TableHead className="w-[15%]">Service No</TableHead>
                <TableHead className="w-[40%]">Short Text</TableHead>
                <TableHead className="w-[15%]">UOM</TableHead>
                <TableHead className="w-[15%]">Quantity</TableHead>
                {props?.prData?.is_submitted !== 1 && !isSubItemsView && (
                  <TableHead className="w-[15%]">Action</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {tableData?.[selectedSubItemIndex?.index as number]?.sub_items?.map(
                (item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-center w-[50px]">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.service_code}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.short_text}
                    </TableCell>
                    <TableCell className="font-medium">{item.uom}</TableCell>
                    <TableCell className="font-medium">
                      {item.quantity}
                    </TableCell>
                    {props?.prData?.is_submitted !== 1 && !isSubItemsView && (
                      <TableCell className="font-medium">
                        <div className="flex gap-4 justify-center items-center p-0 m-0 w-fit">
                          {/* Pencil Icon */}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <svg
                                  onClick={() => {
                                    handleUpdateSubItem(index);
                                  }}
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
                                <p>Edit Sub Item</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Trash2
                                  className="text-red-400 hover:cursor-pointer"
                                  onClick={() => {
                                    handleSublineItemDelete(item?.name as string);
                                  }}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Sub Item</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ),
              )}

              {props?.prData?.is_submitted !== 1 && !isSubItemsView && (
                <TableRow>
                  <TableCell className="font-medium text-center"></TableCell>
                  <TableCell className="font-medium">
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
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
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
                  <TableCell className="font-medium">
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
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <MultiSelect
                      isDisabled={isSubItemUom ? true : false}
                      options={UOMDropdown?.map(item => ({ label: item?.description || item?.name, value: item?.name })) || []}
                      value={subLineItem?.uom ? { label: UOMDropdown?.find(p => p.name === subLineItem.uom)?.description || subLineItem.uom, value: subLineItem.uom } : null}
                      onChange={(selectedOption: any) => {
                        setSubLineItem(
                          (prev) =>
                            ({ ...prev, uom: selectedOption?.value }) as zsbAssetSubItemsType,
                        );
                      }}
                      instanceId="zsbasset-subuom-select"
                      placeholder="Select UOM..."
                      className="text-[12px] text-black text-left min-w-[150px]"
                      styles={{
                        ...multiSelectStyles,
                        control: (base: any) => ({
                          ...base,
                          minHeight: "36px",
                          borderRadius: "0.5rem",
                          borderColor: "#e5e7eb",
                        }),
                      }}
                      menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                      menuPlacement="auto"
                      menuPosition="fixed"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Input value={subLineItem?.quantity ?? ""} onChange={(e) => { setSubLineItem((prev: any) => ({ ...prev, quantity: e.target.value })) }} />
                  </TableCell>
                  <TableCell className="">
                    <div className="flex gap-4 justify-center items-center p-0 m-0 w-fit">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="bg-[#D1FAE5] flex justify-center items-center text-2xl  text-[#065F46] w-[30px] h-[30px] hover:cursor-pointer"
                              onClick={() => {
                                handleSubItemAdd();
                              }}
                            >
                              +
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add Sub Item</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {subLineItem?.name && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className="bg-red-100 flex justify-center items-center text-lg text-red-600 w-[30px] h-[30px] hover:cursor-pointer rounded-full"
                                onClick={() => {
                                  setSubLineItem(undefined);
                                }}
                              >
                                ✕
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Cancel Sub Item Update</p>
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
        </PopUp>
      )}
    </>
  );
};

export default AssetPR;
