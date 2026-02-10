"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../atoms/input";
import { Button } from "../atoms/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../atoms/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/select";
import {
  PurchaseRequestData,
  PurchaseRequestDropdown,
} from "@/src/types/PurchaseRequestType";
import { EyeClosed, EyeIcon, Loader2, ScanEyeIcon, Trash2 } from "lucide-react";
import { PencilIcon } from "lucide-react";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XIcon } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import MultiSelect, { GroupBase, MultiValue } from "react-select";
import { multiSelectStyles } from "@/src/components/common/sharedStyles";
import {
  categoryTypeDropdownType,
  cityDropdownType,
  companyDropdownBasedOnUserType,
  locationDropdownType,
  ProductNameDropdown,
  PurchaseTypeType,
  TPRInquiry,
} from "@/src/types/prEnquiry/prEnquiry.types";
import {
  addEnquiryItems,
  createPurchaseEnquiry,
  deleteEnquiryItems,
  getCityDropdown,
  getlocationDropdown,
  getProductNameDropdown,
  getPurchaseEnquiryData,
  submitEnquiry,
} from "@/src/services/prEnquiry/prEnquiry.services";
import SearchableDropdown from "../molecules/SearchableDropdown";
import SearchSelectComponent from "../molecules/Selectsearchcomponent";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  companyDropdown: companyDropdownBasedOnUserType[];
  purchaseTypeDropdown: PurchaseTypeType[];
  categoryTypeDropdown: categoryTypeDropdownType[];
  cityDropdown: cityDropdownType[];
  data: TPRInquiry;
}

const PRInquiryForm = ({
  companyDropdown,
  purchaseTypeDropdown,
  categoryTypeDropdown,
  cityDropdown,
  data,
}: Props) => {
  const router = useRouter();
  const param = useSearchParams();
  const refno = param.get("cart_id");

  const [formData, setFormData] = useState<TPRInquiry>(data);
  const [singleTableRow, setSingleTableRow] = useState<any>(null);

  const [productNameDropdown, setProductNameDropdown] = useState<
    ProductNameDropdown[]
  >([]);
  const [locationDropdown, setLocationDropdown] =
    useState<cityDropdownType[]>(cityDropdown);
  const [selectedLocation, setSelectedLocation] = useState<string>();
  const [isDialog, setIsDialog] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(-1);

  const [plantDropdown, setPlantDropdown] =
    useState<{ name: string; plant_name: string; description: string }[]>();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [selectedProductName, setSelectedProductName] = useState<string>();
  const [attachment, setAttachment] = useState<File>();

  const fileUploadRef = useRef<HTMLInputElement>(null);
  const addLoaderRef = useRef<HTMLSpanElement>(null);
  const submitLoaderRef = useRef<HTMLSpanElement>(null);

  console.log(cityDropdown, "this is city");

  useEffect(() => {
    if (selectedProductName) {
      const data = productNameDropdown?.filter((item) => {
        if (item?.name == selectedProductName) {
          return item;
        }
      });
      setSingleTableRow((prev: any) => ({
        ...prev,
        category_type: data?.[0]?.category_type,
        product_price: data?.[0]?.product_price,
        uom: data?.[0]?.uom,
        lead_time: data?.[0]?.lead_time,
      }));
    }
  }, [selectedProductName]);

  // useEffect(()=>{
  //   if(refno){
  //     getPurchaseEnquiryData(refno).then((data)=>{
  //       setFormData(data)
  //     })
  //   }
  // },[])

  const requiredTableFields = {
    product_name: "Please Select Product",
    uom: "Please Select UOM",
    product_quantity: "Please Enter Product Quantity",
    user_specifications: "Please Enter User Specification",
  };

  const handleSuccessOk = () => {
    setShowSuccessModal(false);
    router.push("/dashboard");
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFillMaterialDetails = async () => {
    if (!formData?.company) {
      alert("please select company");
      return;
    }

    if (!formData?.cart_use) {
      alert("please select Cart Use");
      return;
    }

    const body = {
      data: {
        company: formData?.company,
        cart_use: formData?.cart_use,
      },
    };

    const response = await createPurchaseEnquiry(body);
    router.replace(`/pr-enquiry?cart_id=${response?.name}`);
    getPurchaseEnquiryData(response?.name).then((data) => {
      setFormData(data);
    });
  };

  // const fetchLocationDropdown = async(query:string)=>{
  //   if(formData?.company){
  //     return await getlocationDropdown(query,formData?.company?.name as string)
  //   }else{
  //     return []
  //   }
  // }

  const fetchCityDropdown = async (query?: string) => {
    if (formData?.company?.name) {
      return await getCityDropdown(
        query as string,
        formData?.company?.name as string,
      );
    } else {
      return [];
    }
  };

  useEffect(() => {
    fetchCityDropdown();
  }, [formData?.company?.name]);
  let nbrequiredFields: { [key: string]: string } = {
    // cart_use: "Please Select Cart Use",
    // category_type: "Please Select Category Type",
    // company: "Please Select Company",
    product_name: "Please Select Product Name",
    quantity: "Please Enter Quantity",
    location: "Please Select Location",
  };

  let sbrequiredFields: { [key: string]: string } = {
    category_type: "Please Select Category Type",
    location: "Please Select Location",
  };

  const addItems = () => {
    if (!singleTableRow?.purchase_type) {
      alert("Please Select Purchase Type");
      return;
    }

    if (singleTableRow?.purchase_type == "SB") {
      if (!singleTableRow?.category_type) {
        alert("Please Select Category Type");
        return;
      }
      if (!selectedLocation) {
        alert("Please Select Location");
        return;
      }
    }

    if (singleTableRow?.purchase_type == "NB") {
      if (!selectedProductName) {
        alert("Please Select Purchase Name");
        return;
      }

      if (!singleTableRow?.product_quantity) {
        alert("Please select quantity");
        return;
      }

      if (!selectedLocation) {
        alert("Please Select Location");
        return;
      }
    }

    if (addLoaderRef?.current) {
      addLoaderRef.current.className = "inline-flex animate-spin";
    }

    const data = {
      purchase_type: singleTableRow?.purchase_type,
      product_name: selectedProductName,
      product_quantity: singleTableRow?.product_quantity,
      location: selectedLocation,
      cart_id: refno,
      user_specifications: singleTableRow?.user_specifications,
      name: singleTableRow?.name,
      category_type: singleTableRow?.category_type,
    };

    const body = new FormData();
    body.append("data", JSON.stringify(data));
    if (attachment) {
      body.append("attachment", attachment);
    }
    addEnquiryItems(body)
      .then(() => {
        alert("Items added successfully!");
        getPurchaseEnquiryData(refno as string).then((data) =>
          setFormData(data),
        );
        setSingleTableRow(null);
        setSelectedLocation("");
        setSelectedProductName("");
        if (fileUploadRef?.current) {
          fileUploadRef.current.value = "";
        }
      })
      .catch((error) => {
        alert(error?.message?.message || "Error adding items");
      })
      .finally(() => {if (addLoaderRef?.current) {
        addLoaderRef.current.className = "hidden";
      }}
    )
  };

  const handleEdit = async (index: number) => {
    setSingleTableRow((prev: any) => ({
      purchase_type: formData?.cart_product[index]?.purchase_type,
      product_quantity: formData?.cart_product[index]?.product_quantity,
      user_specifications: formData?.cart_product[index]?.user_specifications,
      file: formData?.cart_product[index]?.attachment_details,
      category_type: formData?.cart_product[index]?.category_type,
      product_price: formData?.cart_product[index]?.product_price,
      uom: formData?.cart_product[index]?.uom,
      lead_time: formData?.cart_product[index]?.lead_time,
      name: formData?.cart_product[index]?.name,
    }));
    await fetchCityDropdown(
      formData?.cart_product[index]?.location_details?.name as string,
    ).then((data) => setLocationDropdown(data));
    await getProductNameDropdown(
      formData?.cart_product[index]?.product_details?.name as string,
    ).then((data) => setProductNameDropdown(data));
    setSelectedProductName(
      formData?.cart_product[index]?.product_details?.name,
    );
    setSelectedLocation(formData?.cart_product[index]?.location_details?.name);
  };

  const handleRowDelete = async (row_id: string) => {
    if (confirm("are you sure you want to delete this row?")) {
      deleteEnquiryItems(refno as string, row_id).then((data) => {
        alert("Row deleted successfully!");
        getPurchaseEnquiryData(refno as string).then((data) => {
          setFormData(data);
        });
      });
    }
  };

  return (
    <>
      <TooltipProvider>
        <div className="flex flex-col bg-white rounded-lg px-2 pb-2 max-h-[80vh] w-full">
          <div className="grid grid-cols-3 gap-6 p-3">
            <div className="col-span-1">
              <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                Cart Use{" "}
                <span className="text-red-400 text-[20px] absolute -top-2 left-16">
                  *
                </span>
              </h1>
              <Select
                onValueChange={(value) => {
                  handleSelectChange(value, "cart_use");
                }}
                value={formData?.cart_use}
                disabled={refno ? true : false}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Individual Use">
                      Individual Use
                    </SelectItem>
                    <SelectItem value="Commercial Use">Group Use</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1">
              <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                Company{" "}
                <span className="text-red-400 text-[20px] absolute -top-2 left-[4rem]">
                  *
                </span>
              </h1>
              <Select
                onValueChange={(value) => {
                  handleSelectChange(value, "company");
                }}
                value={formData?.company?.name}
                disabled={refno ? true : false}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companyDropdown?.map((item) => (
                      <SelectItem key={item?.name} value={item?.name}>
                        {item?.company_name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1 flex items-end  justify-end gap-4">
              <Button
                className={` ${refno ? "hidden" : ""}`}
                variant={"nextbtn"}
                size={"nextbtnsize"}
                onClick={(e) => {
                  handleFillMaterialDetails();
                }}
              >
                Fill Material Details
              </Button>
            </div>
          </div>
          {refno && !formData?.is_submited && (
            <>
              <h1 className="border-b-2 border-gray-400 font-bold text-[18px] p-1">
                Material Details
              </h1>
              <div className="grid grid-cols-3 gap-6 p-3">
                <div className="col-span-1">
                  <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                    Purchase Type{" "}
                    <span className="text-red-400 text-[20px] absolute -top-2">
                      *
                    </span>
                  </h1>
                  <Select
                    onValueChange={(value) => {
                      setSingleTableRow((prev: any) => ({
                        ...prev,
                        purchase_type: value,
                      }));
                    }}
                    value={singleTableRow?.purchase_type ?? ""}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="overflow-x-visible">
                      <SelectGroup>
                        {purchaseTypeDropdown?.map((item) => (
                          <SelectItem key={item?.name} value={item?.name}>
                            <div className="flex items-center justify-between w-full gap-2">
                              {item?.purchase_requisition_type_name}

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center"
                                  >
                                    {/* <h1 className="w-4 cursor-pointer border-black rounded-lg text-center text-sm text-slate-400" >i</h1> */}
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="" className="w-4 h-4 shrink-0 z-30"
  viewBox="0 20 500 400"
  preserveAspectRatio="xMidYMid meet">
<path d="M0 0 C0.81176193 -0.00979385 1.62352386 -0.01958771 2.45988464 -0.02967834 C20.42209711 -0.20170332 37.75572087 -0.02748286 55.3125 4.23828125 C56.18745117 4.44195312 57.06240234 4.645625 57.96386719 4.85546875 C101.27108341 15.18416809 139.81787087 41.70916841 166.3125 77.23828125 C166.93769531 78.0684375 167.56289063 78.89859375 168.20703125 79.75390625 C178.44026406 93.8455711 185.97688889 109.06414951 192.3125 125.23828125 C192.57401855 125.90005371 192.83553711 126.56182617 193.10498047 127.24365234 C199.58465757 143.99368511 203.37124719 162.96783954 203.55078125 180.92578125 C203.56052979 181.73767914 203.57027832 182.54957703 203.58032227 183.38607788 C203.75173951 201.36538996 203.50155732 218.65052935 199.3125 236.23828125 C199.14121582 237.01075195 198.96993164 237.78322266 198.79345703 238.57910156 C187.707873 287.88386049 154.44319235 329.94625726 112.37890625 356.77734375 C101.54865299 363.49054619 90.16158642 368.59684487 78.3125 373.23828125 C77.65072754 373.4997998 76.98895508 373.76131836 76.30712891 374.03076172 C59.55709669 380.51043861 40.58294134 384.29702964 22.625 384.4765625 C21.81305679 384.48631104 21.00111359 384.49605957 20.16456604 384.50610352 C2.22839048 384.67710236 -15.16125245 384.55948623 -32.6875 380.23828125 C-33.47012207 380.04572754 -34.25274414 379.85317383 -35.05908203 379.65478516 C-40.0100204 378.39037866 -44.85508187 376.89541844 -49.6875 375.23828125 C-50.68354248 374.90207764 -50.68354248 374.90207764 -51.69970703 374.55908203 C-88.47501105 361.98109367 -120.45970552 338.28077095 -143.6875 307.23828125 C-144.31398437 306.40683594 -144.94046875 305.57539063 -145.5859375 304.71875 C-162.43892395 281.49644238 -173.5754003 254.42567961 -178.6875 226.23828125 C-178.86700195 225.25021484 -179.04650391 224.26214844 -179.23144531 223.24414062 C-180.88108132 213.1102407 -181.08528551 203.11097269 -181.0625 192.86328125 C-181.06228851 191.98387878 -181.06207703 191.10447632 -181.06185913 190.19842529 C-181.02756773 175.87762322 -180.01570572 162.21174879 -176.6875 148.23828125 C-176.51621582 147.46581055 -176.34493164 146.69333984 -176.16845703 145.89746094 C-166.42970462 102.58293294 -138.98291779 63.55864023 -103.6875 37.23828125 C-102.85734375 36.61308594 -102.0271875 35.98789063 -101.171875 35.34375 C-87.08021015 25.11051719 -71.86163174 17.57389236 -55.6875 11.23828125 C-55.02572754 10.9767627 -54.36395508 10.71524414 -53.68212891 10.44580078 C-36.9320364 3.96610057 -17.95798621 0.17965746 0 0 Z M-59.6875 49.23828125 C-60.85152344 49.80546875 -62.01554687 50.37265625 -63.21484375 50.95703125 C-101.16213505 70.45963914 -128.69739049 105.46857479 -141.79077148 145.72753906 C-146.45584736 160.82013684 -147.92501274 175.87679143 -147.9375 191.61328125 C-147.93817474 192.37527832 -147.93884949 193.13727539 -147.93954468 193.92236328 C-147.92354312 205.29034561 -147.44314941 216.17228757 -144.6875 227.23828125 C-144.52121094 227.95757812 -144.35492188 228.676875 -144.18359375 229.41796875 C-141.40090419 241.33200256 -137.05018811 252.2621888 -131.6875 263.23828125 C-131.1203125 264.40230469 -130.553125 265.56632813 -129.96875 266.765625 C-111.41298325 302.87059567 -77.51743628 331.48708678 -38.95556641 344.13427734 C-28.40750607 347.34707772 -17.6882178 350.20614739 -6.6875 351.23828125 C-6.0284668 351.3038623 -5.36943359 351.36944336 -4.69042969 351.43701172 C39.08904542 355.55058565 80.92732278 341.68345627 114.65844727 313.92358398 C145.55875814 287.9082955 166.32417039 249.57900025 170.3125 209.23828125 C170.54733114 203.78237117 170.55816702 198.323714 170.5625 192.86328125 C170.56317474 192.10128418 170.56384949 191.33928711 170.56454468 190.55419922 C170.54854312 179.18621689 170.06814941 168.30427493 167.3125 157.23828125 C167.14621094 156.51898438 166.97992188 155.7996875 166.80859375 155.05859375 C164.02590419 143.14455994 159.67518811 132.2143737 154.3125 121.23828125 C153.7453125 120.07425781 153.178125 118.91023438 152.59375 117.7109375 C133.24485642 80.06273655 98.39626647 52.46096653 58.49487305 39.30737305 C19.06967543 27.08859673 -22.83913265 31.23494332 -59.6875 49.23828125 Z " fill="#000000" transform="translate(244.6875,63.76171875)"/>
<path d="M0 0 C3.8982939 3.23631947 6.61052193 6.1498579 7.12055016 11.36500359 C7.12390184 12.37118296 7.12725353 13.37736233 7.13070679 14.41403198 C7.13923676 15.57201294 7.14776672 16.7299939 7.15655518 17.92306519 C7.1556488 19.18965973 7.15474243 20.45625427 7.15380859 21.76123047 C7.15979447 23.11167777 7.16660015 24.46212165 7.17416382 25.81256104 C7.19182517 29.47791771 7.19651925 33.14318099 7.19779539 36.80857611 C7.19921748 39.0995172 7.20348817 41.39043458 7.20878983 43.68136978 C7.22729058 51.67642981 7.23546039 59.67142318 7.23388672 67.66650391 C7.23268531 75.1146932 7.25378718 82.56259272 7.28537405 90.01070869 C7.31154064 96.40914549 7.32225386 102.80748767 7.3209759 109.20597756 C7.32046637 113.02582813 7.32614413 116.84542116 7.347332 120.66521835 C7.36672111 124.25880835 7.36683479 127.85189531 7.35229874 131.44550323 C7.34921652 133.38856954 7.36588246 135.33163592 7.38317871 137.27462769 C7.30627443 147.94188818 7.30627443 147.94188818 2.86328125 152.734375 C-1.35588308 156.20346568 -4.65851122 157.64152402 -10.13671875 157.734375 C-15.02652562 156.85909115 -18.87059326 155.52325997 -22.13671875 151.671875 C-24.81437346 147.73906965 -25.26393571 146.00196287 -25.28388977 141.29522705 C-25.29104507 140.13999542 -25.29820038 138.98476379 -25.30557251 137.79452515 C-25.30826141 136.52074005 -25.31095032 135.24695496 -25.3137207 133.93457031 C-25.31998474 132.58442001 -25.32663149 131.23427143 -25.33363342 129.88412476 C-25.35105009 126.21040977 -25.36159728 122.53670781 -25.36983895 118.86296177 C-25.37498837 116.56768378 -25.38106417 114.27240984 -25.38735008 111.9771347 C-25.4064052 104.79569367 -25.42063488 97.61426294 -25.42896205 90.43280149 C-25.43873259 82.14332673 -25.46504573 73.85411913 -25.50546294 65.56473851 C-25.53562913 59.15786108 -25.55043144 52.75106019 -25.55374306 46.34411311 C-25.55609326 42.51750897 -25.56504901 38.69119012 -25.59020424 34.86466217 C-25.61349869 31.26291362 -25.61771303 27.66163791 -25.60744286 24.05983353 C-25.60671204 22.11196087 -25.62579436 20.16411215 -25.64550781 18.21633911 C-25.58211679 7.56710729 -25.58211679 7.56710729 -21.13671875 2.734375 C-15.23107767 -2.728343 -7.25386165 -4.29662006 0 0 Z " fill="#000000" transform="translate(265.13671875,206.265625)"/>
<path d="M0 0 C5.65842186 3.35748683 9.01834623 8.14105438 11.0546875 14.30859375 C12.61328751 20.65089687 11.70385218 25.48921562 8.90234375 31.26171875 C5.99765338 35.84316916 1.60911022 39.38856832 -3.4375 41.375 C-10.81953986 42.2386623 -17.72157656 42.50233474 -23.82421875 37.86328125 C-29.33731269 32.77735197 -32.05274241 28.22257589 -32.8125 20.625 C-32.62001392 14.71454509 -30.68736936 8.96608178 -26.7890625 4.4765625 C-19.38125262 -2.15488303 -9.29654974 -4.24177174 0 0 Z " fill="#000000" transform="translate(266.4375,150.625)"/>
</svg>

                                  </span>
                                </TooltipTrigger>

                                <TooltipContent side="right">
                                  {item?.description}
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {singleTableRow?.purchase_type == "SB" && (
                  <div className="col-span-1">
                    <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                      Category Type{" "}
                      <span className="text-red-400 text-[20px] absolute -top-2">
                        *
                      </span>
                    </h1>
                    <Select
                      onValueChange={(value) => {
                        setSingleTableRow((prev: any) => ({
                          ...prev,
                          category_type: value,
                        }));
                      }}
                      value={singleTableRow?.category_type ?? ""}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categoryTypeDropdown?.map((item) => (
                            <SelectItem key={item?.name} value={item?.name}>
                              {item?.category_name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {singleTableRow?.purchase_type !== "SB" && (
                  <>
                    <div className="col-span-1">
                      <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                        Product Name{" "}
                        <span className="text-red-400 text-[20px] absolute -top-2">
                          *
                        </span>
                      </h1>
                      {/* <SearchableDropdown /> */}
                      <SearchSelectComponent
                        searchApi={getProductNameDropdown}
                        getLabel={(item) => item?.product_name}
                        getValue={(item) => item?.name}
                        setDropdown={setProductNameDropdown}
                        dropdown={productNameDropdown}
                        setData={(value) => setSelectedProductName(value ?? "")}
                        data={selectedProductName}
                      />
                    </div>
                    <div className="col-span-1">
                      <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                        Category Type{" "}
                        <span className="text-red-400 text-[20px] absolute -top-2">
                          *
                        </span>
                      </h1>
                      <Input
                        placeholder=""
                        className="rounded-xl"
                        value={singleTableRow?.category_type ?? ""}
                        name="category_type"
                        disabled
                      />
                    </div>
                    <div className="col-span-1">
                      <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                        Product Price Range{" "}
                        <span className="text-red-400 text-[20px] absolute -top-2">
                          *
                        </span>
                      </h1>
                      <Input
                        placeholder=""
                        className="rounded-xl"
                        name="product_price_range"
                        value={singleTableRow?.product_price ?? ""}
                        onChange={(e) => {
                          setSingleTableRow((prev: any) => ({
                            ...prev,
                            product_price: e.target.value,
                          }));
                        }}
                        disabled
                      />
                    </div>
                    <div className="col-span-1">
                      <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                        UOM{" "}
                        <span className="text-red-400 text-[20px] absolute -top-2">
                          *
                        </span>
                      </h1>
                      <Input
                        placeholder=""
                        className="rounded-xl"
                        name="uom"
                        value={singleTableRow?.uom ?? ""}
                        disabled
                      />
                    </div>
                    <div className="col-span-1">
                      <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                        Lead Time{" "}
                        <span className="text-red-400 text-[20px] absolute -top-2">
                          *
                        </span>
                      </h1>
                      <Input
                        placeholder=""
                        className="rounded-xl"
                        name="lead_time"
                        value={singleTableRow?.lead_time ?? ""}
                        disabled
                      />
                    </div>
                  
                    <div className="col-span-1">
                      <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                        Quantity{" "}
                        <span className="text-red-400 text-[20px] absolute -top-2">
                          *
                        </span>
                      </h1>
                      <Input
                        placeholder=""
                        name="product_quantity"
                        value={singleTableRow?.product_quantity ?? ""}
                        className="rounded-xl"
                        type="number"
                        onChange={(e) => {
                          setSingleTableRow((prev: any) => ({
                            ...prev,
                            product_quantity: e?.target?.value,
                          }));
                        }}
                      />
                    </div>
                  </>
                )}

                <div className="col-span-1">
                  <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                    Location{" "}
                    <span className="text-red-400 text-[20px] absolute -top-2">
                      *
                    </span>
                  </h1>
                  <SearchSelectComponent
                    searchApi={fetchCityDropdown}
                    getLabel={(item) => item?.city_name}
                    getValue={(item) => item?.name}
                    setDropdown={setLocationDropdown}
                    dropdown={locationDropdown}
                    setData={(value) => setSelectedLocation(value ?? "")}
                    data={selectedLocation}
                  />
                </div>
                <div className="col-span-1">
                  <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                    User Specification
                    {/* <span className='text-red-400 text-[20px] absolute -top-2'>*</span> */}
                  </h1>
                  <Input
                    placeholder=""
                    className="rounded-xl"
                    name="user_specifications"
                    onChange={(e) => {
                      setSingleTableRow((prev: any) => ({
                        ...prev,
                        user_specifications: e?.target?.value,
                      }));
                    }}
                    value={singleTableRow?.user_specifications ?? ""}
                  />
                </div>
                <div className="col-span-1">
                  <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                    Attachment
                  </h1>
                  <div className="flex gap-3 items-center">
                    <Input
                      ref={fileUploadRef}
                      type="file"
                      onChange={(e) => {
                        setAttachment(e.target.files?.[0]);
                      }}
                      className="rounded-xl"
                    />
                    {singleTableRow?.file?.url && !attachment && (
                      <Link href={singleTableRow?.file?.url}>
                        {singleTableRow?.file?.file_name}
                      </Link>
                    )}
                    {/* <XIcon className={`text-red-400 ${singleTableRow?.file?.url ? "" : "hidden"} hover:cursor-pointer`} onClick={() => { handleFileDelete() }} /> */}
                  </div>
                </div>
                
                <div className="col-span-1 flex items-end pb-[2px]">
                  <Button
                    className=" rounded-xl px-3 py-2 font-normal"
                    variant="nextbtn"
                    size="nextbtnsize"
                    onClick={() => {
                      addItems();
                    }}
                  >
                    Add
                    <span ref={addLoaderRef} className="hidden">
                      <Loader2 />
                    </span>
                  </Button>
                </div>
              </div>
            </>
          )}

          <div className="shadow- bg-[#f6f6f7] mb-4 p-4 rounded-2xl mt-4">
            <div className="flex w-full justify-between pb-4">
              <h1 className="text-[20px] text-[#03111F] font-semibold">
                Items List
              </h1>
            </div>
            <Table className=" max-h-40 overflow-y-scroll">
              <TableHeader className="text-center">
                <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
                  <TableHead className="w-[100px]">Sr No.</TableHead>
                  <TableHead className="text-center">Product Type</TableHead>
                  <TableHead className="text-center">Product Name</TableHead>
                  <TableHead className="text-center">
                    Is Assest Code?{" "}
                  </TableHead>
                  <TableHead className="text-center">
                    Product Quantity
                  </TableHead>
                  <TableHead className="text-center">location</TableHead>
                  <TableHead className="text-center">
                    User Specification
                  </TableHead>
                  <TableHead className="text-center">Attachment</TableHead>
                  <TableHead className="text-center">Category Type</TableHead>
                  <TableHead className="text-center">Product Price</TableHead>
                  <TableHead className="text-center">UOM</TableHead>
                  <TableHead className="text-center">Lead Time</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  {!formData?.is_submited && (
                    <TableHead className="text-center">Action</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody className="text-center">
                {formData?.cart_product?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="">
                      {item?.purchase_type ?? ""}
                    </TableCell>
                    <TableCell>{item?.product_details?.product_name}</TableCell>
                    <TableCell className="flex justify-center">
                      <Input
                        className="w-5"
                        type="checkbox"
                        checked={item?.need_asset_code ? true : false}
                        disabled
                      />
                    </TableCell>
                    <TableCell>{item?.product_quantity}</TableCell>
                    <TableCell>
                      {item?.location_details?.location_name ?? ""}
                    </TableCell>
                    <TableCell>{item?.user_specifications}</TableCell>
                    <TableCell>
                      <Link
                        href={item?.attachment_details?.url ?? ""}
                        target="blank"
                      >
                        {item?.attachment_details?.file_name}
                      </Link>
                    </TableCell>
                    <TableCell>{item?.category_type ?? ""}</TableCell>
                    <TableCell>{item?.product_price ?? ""}</TableCell>
                    <TableCell>{item?.uom}</TableCell>
                    <TableCell>{item?.lead_time}</TableCell>
                    <TableCell className="text-nowrap w-full">
                      {item?.approval_status}
                    </TableCell>
                    {!formData?.is_submited && (
                      <TableCell>
                        <div className="flex gap-4 justify-center items-center">
                          <svg
                            onClick={() => {
                              handleEdit(index);
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
                          <Trash2
                            onClick={() => {
                              handleRowDelete(item?.name as string);
                            }}
                            className={`text-red-400 cursor-pointer`}
                          />
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {!formData?.is_submited && (
            <div
              className={`flex justify-end pr-2 mt-4 pb-4 ${refno && formData?.cart_product.length > 0 ? "" : "hidden"}`}
            >
              <Button
                className="py-2.5"
                variant={"nextbtn"}
                size={"nextbtnsize"}
                onClick={() => {
                  if (submitLoaderRef.current) {
                    submitLoaderRef.current.className =
                      "inline-flex animate-spin";
                  }
                  submitEnquiry(refno as string).then(() => {
                    setShowSuccessModal(true);
                    if (submitLoaderRef.current) {
                      submitLoaderRef.current.className = "hidden";
                    }
                  });
                }}
              >
                Submit
                <span ref={submitLoaderRef} className="hidden">
                  <Loader2 />
                </span>
              </Button>
            </div>
          )}

          {showSuccessModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <Card className="bg-white p-6 w-[400px] text-center rounded-lg shadow-lg">
                <CardContent className="p-8 text-center bg-gradient-to-b from-white to-gray-50 rounded-2xl">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Success
                  </h2>
                  <p className="text-sm text-gray-600">
                    {"Product Enquiry Submitted Successfully!"}
                  </p>
                  <Button
                    className="mt-2"
                    variant="nextbtn"
                    size="nextbtnsize"
                    onClick={() => handleSuccessOk()}
                  >
                    OK
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </TooltipProvider>
      <ToastContainer closeButton theme="dark" autoClose={2000} />
    </>
  );
};

export default PRInquiryForm;
