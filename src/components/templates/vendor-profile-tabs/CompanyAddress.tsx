"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../../atoms/input";
import {
  TCompanyAddressDropdown,
  TmultipleLocation,
  VendorOnboardingResponse,
} from "@/src/types/types";
import { useCompanyAddressFormStore } from "@/src/store/companyAddressStore";
import { Button } from "../../atoms/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../atoms/table";
import Link from "next/link";
import { Trash2, X } from "lucide-react";

interface Props {
  companyAddressDropdown?: TCompanyAddressDropdown["message"]["data"];
  ref_no: string;
  onboarding_ref_no: string;
  OnboardingDetail: VendorOnboardingResponse["message"]["company_address_tab"];
  onNextTab: () => void;
  onBackTab: () => void;
}
interface shippingData {
  address1?: string;
  address2?: string;
  pincode?: string;
  city?: string;
  state?: string;
  district?: string;
  country?: string;
}

const CompanyAddress = ({ ref_no, onboarding_ref_no, OnboardingDetail, onNextTab, onBackTab }: Props) => {
  const { billingAddress, shippingAddress, multiple_location_table, resetMultiple, addMultipleLocation } = useCompanyAddressFormStore();
  const [isShippingSame, setIsShippingSame] = useState<boolean>(OnboardingDetail?.same_as_above == 1 ? true : false);
  const [shippingData, setShippingData] = useState<shippingData>();
  const handleShippingCheck = (e: boolean) => {
    console.log(e, "this is check")
    setIsShippingSame(e);
    // setShippingData((prev)=>({...prev,address1:billingAddress?.address_line_1,address2:billingAddress?.address_line_2}))
    if (e) {
      // handleShippingPincodeChange(billingAddress?.pincode ?? "");
      setShippingData((prev) => ({
        ...prev,
        address_line_1: billingAddress?.address_line_1,
        address_line_2: billingAddress?.address_line_2,
        pincode: billingAddress?.pincode,
        district: billingAddress?.district?.district_name,
        city: billingAddress?.city?.city_name,
        state: billingAddress?.state?.state_name,
        country: billingAddress?.country?.country_name,
      }));
    }
  };
  console.log(isShippingSame, "is shipping same");

  const [isMultipleLocation] = useState<boolean>(
    OnboardingDetail?.multiple_locations ? true : false
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    resetMultiple();
    OnboardingDetail?.multiple_location_table?.map((item) => {
      addMultipleLocation({
        address_line_1: item?.address_line_1,
        address_line_2: item?.address_line_2,
        ma_pincode: item?.ma_pincode,
        ma_district: { name: item?.district_details?.name as string, district_name: item?.district_details?.district_name as string, district_code: item?.district_details?.district_code as string },
        ma_state: { name: item?.state_details?.name as string, state_name: item?.state_details?.state_name as string, state_code: item?.state_details?.state_code as string },
        ma_city: {
          name: item?.city_details?.name,
          city_name: item?.city_details?.city_name as string,
          city_code: item?.city_details?.city_code as string
        },
        ma_country: { name: item?.country_details?.name as string, country_code: item?.country_details?.country_code as string, country_name: item?.country_details?.country_name as string }
      })
    })
  }, [])


  const handleRowDelete = (index: number) => {
    console.log("Row delete clicked:", index);
  };

  const handleChangeRequestSubmit = () => {
    console.log("Change Request Submitted:", remark);
    setIsDialogOpen(false);
    setRemark("");
  };

  return (
    <div className="flex flex-col bg-white rounded-lg p-4 w-full h-[calc(100vh-120px)] overflow-y-auto">
      {/* Header with Change Request button */}
      <div className="flex justify-between items-center border-b-2 pb-2">
        <h1 className="text-lg">Company Address</h1>
        <Button
          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-2xl"
          onClick={() => setIsDialogOpen(true)}
        >
          Change Request
        </Button>
      </div>

      {/* Office Address Section */}
      <h1 className="pt-1 font-semibold">Office Address</h1>
      <div className="grid grid-cols-4 gap-6 p-2">
        <div className="col-span-2">
          <h1 className="text-[12px] text-[#626973] pb-1">Address Line 1</h1>
          <Input
            value={
              billingAddress?.address_line_1 ??
              OnboardingDetail?.billing_address?.address_line_1 ??
              ""
            }
            disabled
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] text-[#626973] pb-1">Address Line 2</h1>
          <Input
            value={
              billingAddress?.address_line_2 ??
              OnboardingDetail?.billing_address?.address_line_2 ??
              ""
            }
            disabled
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] text-[#626973] pb-1">Pincode</h1>
          <Input
            value={
              billingAddress?.pincode ??
              OnboardingDetail?.billing_address?.pincode ??
              ""
            }
            disabled
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] text-[#626973] pb-1">District</h1>
          <Input
            value={
              billingAddress?.district?.district_name ??
              OnboardingDetail?.billing_address?.district_details?.district_name ??
              ""
            }
            disabled
          />
        </div>
        <div className="grid grid-cols-3 col-span-4 gap-4">
          <div className="col-span-1">
            <h1 className="text-[12px] text-[#626973] pb-1">District</h1>
            <Input
              value={
                billingAddress?.city?.city_name ??
                OnboardingDetail?.billing_address?.city_details?.city_name ??
                ""
              }
              disabled
            />
          </div>
          <div className="col-span-1">
            <h1 className="text-[12px] text-[#626973] pb-1">District</h1>
            <Input
              value={
                billingAddress?.state?.state_name ??
                OnboardingDetail?.billing_address?.state_details?.state_name ??
                ""
              }
              disabled
            />
          </div>
          <div className="col-span-1">
            <h1 className="text-[12px] text-[#626973] pb-1">District</h1>
            <Input
              value={
                billingAddress?.country?.country_name ??
                OnboardingDetail?.billing_address?.country_details?.country_name ??
                ""
              }
              disabled
            />
          </div>
        </div>
      </div>

      {/* Manufacturing Address Section */}
      <div className="flex justify-start gap-6 items-center">
        <h1 className="pt-1 font-semibold">Manufacturing Address</h1>
        <div className="flex items-center gap-1 pt-2">
          <Input
            type="checkbox"
            className="w-4"
            onChange={(e) => {
              handleShippingCheck(e.target.checked);
            }}
            value={isShippingSame ? 1 : 0}

            checked={isShippingSame ?? OnboardingDetail?.same_as_above}
          />
          <h1 className="font-normal">Same as above</h1>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6 p-2">
        <div className="col-span-2">
          <h1 className="text-[12px] text-[#626973] pb-">Address Line 1</h1>
          <Input
            value={
              shippingAddress?.address_line_1 ??
              OnboardingDetail?.shipping_address?.street_1 ??
              ""
            }
            disabled
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] text-[#626973] pb-1">Address 2</h1>
          <Input
            value={
              shippingAddress?.address_line_2 ??
              OnboardingDetail?.shipping_address?.street_2 ??
              ""
            }
            disabled
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] text-[#626973] pb-1">Pincode</h1>
          <Input
            value={
              shippingAddress?.pincode ??
              OnboardingDetail?.shipping_address?.manufacturing_pincode ??
              ""
            }
            disabled
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] text-[#626973] pb-1">District</h1>
          <Input
            value={
              shippingAddress?.district?.district_name ??
              OnboardingDetail?.shipping_address?.district_details?.district_name ??
              ""
            }
            disabled
          />
        </div>
        <div className="grid grid-cols-3 col-span-4 gap-4">
          <div className="col-span-1">
            <h1 className="text-[12px] text-[#626973] pb-1">City</h1>
            <Input
              value={
                shippingAddress?.city?.city_name ??
                OnboardingDetail?.shipping_address?.city_details?.city_name ??
                ""
              }
              disabled
            />
          </div>
          <div className="col-span-1">
            <h1 className="text-[12px] text-[#626973] pb-1">State</h1>
            <Input
              value={
                shippingAddress?.state?.state_name ??
                OnboardingDetail?.shipping_address?.state_details?.state_name ??
                ""
              }
              disabled
            />
          </div>
          <div className="col-span-1">
            <h1 className="text-[12px] text-[#626973] pb-1">Country</h1>
            <Input
              value={
                shippingAddress?.country?.country_name ??
                OnboardingDetail?.shipping_address?.country_details?.country_name ??
                ""
              }
              disabled
            />
          </div>
        </div>
      </div>

      {/* Multiple Locations Table */}
      {isMultipleLocation && (
        <div className="shadow bg-[#f6f6f7] p-4 mb-4 rounded-2xl">
          <h1 className="text-[20px] text-[#03111F] font-semibold pb-4">
            Multiple Locations
          </h1>
          <Table>
            <TableHeader>
              <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px]">
                <TableHead>Sr No.</TableHead>
                <TableHead>Address1</TableHead>
                <TableHead>Address2</TableHead>
                <TableHead>Pincode</TableHead>
                <TableHead>District</TableHead>
                <TableHead>City</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Country</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {multiple_location_table?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item?.address_line_1}</TableCell>
                  <TableCell>{item?.address_line_2}</TableCell>
                  <TableCell>{item?.ma_pincode}</TableCell>
                  <TableCell>{item?.ma_district?.district_name}</TableCell>
                  <TableCell>{item?.ma_city?.city_name}</TableCell>
                  <TableCell>{item?.ma_state?.state_name}</TableCell>
                  <TableCell>{item?.ma_country?.country_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* File Proof */}
      <div className="flex flex-col gap-2 pl-4 pt-2">
        <h1 className="font-semibold">Main Office Address Proof</h1>
        {OnboardingDetail?.address_proofattachment?.url && (
          <div className="flex gap-2">
            <Link
              target="blank"
              href={OnboardingDetail?.address_proofattachment?.url}
              className="underline text-blue-300 max-w-44 truncate"
            >
              <span>{OnboardingDetail?.address_proofattachment?.file_name}</span>
            </Link>
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end items-center space-x-3 mt-4">
        <Button onClick={onBackTab} variant="backbtn" size="backbtnsize">
          Back
        </Button>
        <Button onClick={onNextTab} variant="nextbtn" size="nextbtnsize">
          Next
        </Button>
      </div>

      {/* Change Request Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl p-6 w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Change Request</h2>
            <Input
              placeholder="Enter remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button
                className="bg-gray-400 hover:bg-gray-500 text-white rounded-2xl"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl"
                onClick={handleChangeRequestSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyAddress;