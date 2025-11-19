import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button"
import { Biodiversity, GreenProducts } from "@/src/types/asatypes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useASAForm } from "@/src/hooks/useASAForm";
import { useBackNavigation } from "@/src/hooks/useBackNavigationASAForm";


export default function BiodiversityForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vmsRefNo = searchParams.get("vms_ref_no") || "";
  const { biodiversityForm, updateBiodiversityForm, submitEnvironmentForm, refreshFormData, updateGreenProductsForm } = useASAForm();

  const handleSelectionChange = (name: string, selection: "Yes" | "No" | "NA" | "") => {
    updateBiodiversityForm({
      ...biodiversityForm,
      [name]: {
        ...biodiversityForm[name as keyof Biodiversity],
        selection,
      },
    });
  };

  const handleCommentChange = (name: string, comment: string) => {
    updateBiodiversityForm({
      ...biodiversityForm,
      [name]: {
        ...biodiversityForm[name as keyof Biodiversity],
        comment,
      },
    });
  };

  const handleFileChange = (name: string, file: File | null) => {
    updateBiodiversityForm({
      ...biodiversityForm,
      [name]: {
        ...biodiversityForm[name as keyof Biodiversity],
        file,
      },
    });
  };

  // const handleSubmit = async () => {
  //   await submitEnvironmentForm();
  //   refreshFormData();
  // };

  // const handleBack = useBackNavigation<GreenProducts>(
  //   "GreenProductsForm",
  //   updateGreenProductsForm,
  //   "green_products",
  //   vmsRefNo
  // );

  const handleNext = () => {
        router.push(`/view-asa-form?tabtype=labor_rights&vms_ref_no=${vmsRefNo}`);
    };

    const handleBack = () => {
        router.push(`/view-asa-form?tabtype=green_products&vms_ref_no=${vmsRefNo}`);
    };

  return (
    <div className="h-full">
      <div className="p-3 bg-white shadow-md rounded-xl">
        <div className="text-2xl font-bold text-gray-800 mb-2">Biodiversity</div>
        <div className="border-b border-gray-400"></div>
        <div className="space-y-6 p-3">

          <YesNoNA
            name="have_policy_on_biodiversity"
            label="1. Does the organization have a policy or commitment on biodiversity?"
            value={biodiversityForm.have_policy_on_biodiversity}
            onSelectionChange={handleSelectionChange}
            onCommentChange={handleCommentChange}
            onFileChange={handleFileChange}
            disabled={true}

          />
          {/* <div className="space-x-4 flex justify-end">
            <Button
              className="py-2.5"
              variant="backbtn"
              size="backbtnsize"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              className="py-2.5"
              variant="nextbtn"
              size="nextbtnsize"
              onClick={handleNext}
            >
              Next
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  )
}