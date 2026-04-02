"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { Input } from "../../atoms/input";
import {
  useContactDetailStore,
  TcontactDetail,
} from "@/src/store/ContactDetailStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../atoms/table";
import { Button } from "@/components/ui/button";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import { VendorOnboardingResponse } from "@/src/types/types";
import { useRouter } from "next/navigation";
import { Trash2, Edit, Pencil } from "lucide-react";

type Props = {
  ref_no: string;
  onboarding_ref_no: string;
  OnboardingDetail: VendorOnboardingResponse["message"]["contact_details_tab"];
  onNextTab?: () => void;
  onBackTab?: () => void;
};

const ContactDetail = ({ ref_no, onboarding_ref_no, OnboardingDetail, onBackTab, onNextTab }: Props) => {
  const { contactDetail, addContactDetail, resetContactDetail } = useContactDetailStore();
  const [contact, setContact] = useState<Partial<TcontactDetail>>({});
  const [isEditable, setIsEditable] = useState(false);

  const router = useRouter();

  useEffect(() => {
    resetContactDetail();
    OnboardingDetail?.forEach((item) => {
      addContactDetail(item);
    });
  }, []);

  const handleAdd = () => {
    if (!contact?.first_name || !contact?.last_name) {
      alert("Please enter First and Last Name");
      return;
    }
    addContactDetail(contact);
    setContact({});
  };

  const handleRowDelete = (index: number) => {
    const updated = contactDetail.filter((_, i) => i !== index);
    resetContactDetail();
    updated.forEach((item) => addContactDetail(item));
  };

  const handleRowEdit = (index: number) => {
    const row = contactDetail[index];
    setContact(row);
    handleRowDelete(index);
  };

  const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
    if (contactDetail?.length < 1) {
      alert("Please Enter At Least 1 Contact Details");
      return;
    }
    const submitUrl = API_END_POINTS?.contactDetailSubmit;
    const submitResponse: AxiosResponse = await requestWrapper({
      url: submitUrl,
      data: {
        data: {
          contact_details: contactDetail,
          ref_no: ref_no,
          vendor_onboarding: onboarding_ref_no,
        },
      },
      method: "POST",
    });
    if (submitResponse?.status === 200) {
        alert("Saved successfully ✅");
        onNextTab?.();
      }
  };

  return (
    <div className="flex flex-col bg-white rounded-lg p-4 max-h-[85vh] overflow-y-auto w-full">
      {/* Heading + Edit toggle */}
      <div className="flex justify-between items-center border-b pb-1 mb-2 sticky top-0 bg-white z-10">
        <h1 className="text-lg font-semibold">Contact Detail</h1>
        <Button
          type="button"
          onClick={() => setIsEditable(!isEditable)}
          className="flex items-center text-blue-500 hover:text-blue-700 bg-white hover:bg-white"
        >
          <Pencil className="w-4 h-4 mr-1" />
          {isEditable ? "Cancel" : "Edit"}
        </Button>
      </div>

      {/* Form grid */}
      <div className="grid grid-cols-3 gap-6 p-2">
        {[
          { label: "First Name", key: "first_name" },
          { label: "Last Name", key: "last_name" },
          { label: "Designation", key: "designation" },
          { label: "Email", key: "email" },
          { label: "Contact Number", key: "contact_number" },
          { label: "Department Name", key: "department_name" },
        ].map((field) => (
          <div key={field.key} className="col-span-1">
            <label className="text-xs text-gray-600 pb-1 block">
              {field.label}
            </label>
            <Input
              disabled={!isEditable}
              value={(contact as any)?.[field.key] ?? ""}
              onChange={(e) =>
                setContact((prev) => ({
                  ...prev,
                  [field.key]: e.target.value,
                }))
              }
            />
          </div>
        ))}
      </div>

      {/* Add button */}
      {isEditable && (
        <div className="flex justify-end pr-4 pb-4">
          <Button
            className="py-2"
            variant={"nextbtn"}
            size={"nextbtnsize"}
            onClick={handleAdd}
          >
            Add
          </Button>
        </div>
      )}

      {/* Table */}
      {contactDetail?.length > 0 && (
        <div className="bg-gray-50 p-4 mb-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3">Contact Details List</h3>
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-100 text-blue-700 text-sm">
                <TableHead className="text-center text-black">Sr No.</TableHead>
                <TableHead className="text-center text-black">First Name</TableHead>
                <TableHead className="text-center text-black">Last Name</TableHead>
                <TableHead className="text-center text-black">Designation</TableHead>
                <TableHead className="text-center text-black">Email</TableHead>
                <TableHead className="text-center text-black">Contact Number</TableHead>
                <TableHead className="text-center text-black">Department Name</TableHead>
                {isEditable && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {contactDetail?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">{item?.first_name}</TableCell>
                  <TableCell className="text-center">{item?.last_name}</TableCell>
                  <TableCell className="text-center">{item?.designation}</TableCell>
                  <TableCell className="text-center">{item?.email}</TableCell>
                  <TableCell className="text-center">{item?.contact_number}</TableCell>
                  <TableCell className="text-center">{item?.department_name}</TableCell>
                  {isEditable && (
                    <TableCell className="flex space-x-2 justify-center">
                      <Edit
                        className="w-4 h-4 text-blue-500 cursor-pointer"
                        onClick={() => handleRowEdit(index)}
                      />
                      <Trash2
                        className="w-4 h-4 text-red-500 cursor-pointer"
                        onClick={() => handleRowDelete(index)}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex justify-end gap-3">
        {isEditable ? (
          <>
            <Button
              type="button"
              variant="backbtn"
              size="backbtnsize"
              onClick={() => setIsEditable(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="nextbtn"
              size="nextbtnsize"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="backbtn"
              size="backbtnsize"
              onClick={onBackTab}
            >
              Back
            </Button>
            <Button
              variant="nextbtn"
              size="nextbtnsize"
              onClick={onNextTab}
            >
              Next
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactDetail;
