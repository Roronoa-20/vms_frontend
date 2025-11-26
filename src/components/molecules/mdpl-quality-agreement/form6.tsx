import React from "react";
import { useEffect } from "react";
import Header from "@/src/components/molecules/mdpl-quality-agreement/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQMSForm } from "@/src/hooks/useQMSForm";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/src/context/AuthContext";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { Trash2 } from "lucide-react";

type QAProduct = {
  name_of_the_purchased_material__processes: string;
  specifications: string;
  isNew: boolean;
  name?: string;
  idx?: number;
};


export const Form6 = ({ vendor_onboarding }: { vendor_onboarding: string }) => {
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "vendor_information";
  const { qualityagreementData, formData, setQualityAgreementData } = useQMSForm(vendor_onboarding, currentTab);
  const { designation } = useAuth();

  const products: QAProduct[] = Array.isArray(qualityagreementData?.products_in_qa)
    ? qualityagreementData.products_in_qa.map((p: any) => ({
      name_of_the_purchased_material__processes: p.name_of_the_purchased_material__processes || p.material_description || "",
      specifications: p.specification || p.specifications || "",
      isNew: p.isNew ?? false,
      name: p.name,
      idx: p.idx
    }))
    : [];

  const handleInputChange = (index: number, field: keyof QAProduct, value: string) => {
    const updated: QAProduct[] = [...products];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setQualityAgreementData((prev: any) => ({
      ...prev,
      products_in_qa: updated,
    }));
  };


  const deleteRow = async (index: number) => {
    const row = products[index];

    if (row.isNew) {
      const updated = [...products];
      updated.splice(index, 1);
      setQualityAgreementData((prev: any) => ({
        ...prev,
        products_in_qa: updated as any,
      }));
      return;
    }

    try {
      const payload = {
        qms_form: formData.name,
        name: row.name,
      };

      const response = await requestWrapper({
        url: API_END_POINTS.deleteform5Products,
        method: "POST",
        data: { data: JSON.stringify(payload) },
      });
      if (response?.data?.message?.status === "success") {
        const updated = [...products];
        updated.splice(index, 1);

        setQualityAgreementData((prev: any) => ({
          ...prev,
          products_in_qa: updated as any,
        }));

        alert("Product deleted!");
      } else {
        console.error("Delete failed:", response);
        alert("Delete failed. Try again.");
      }
    } catch (err) {
      console.error("Delete API error:", err);
      alert("Something went wrong while deleting.");
    }
  };

  const addRow = () => {
    setQualityAgreementData((prev: any) => ({
      ...prev,
      products_in_qa: [
        ...(prev.products_in_qa || []),
        { name_of_the_purchased_material__processes: "", specifications: "", isNew: true },
      ],
    }));
  };

  const handleSubmit = async () => {
    try {

      const newRows = products.filter(p => p.isNew);

      if (newRows.length === 0) {
        alert("No new products to add.");
        return;
      }

      const payload = {
        qms_form: formData.name,
        products_in_qa: newRows,
      };

      const response = await requestWrapper({
        url: API_END_POINTS.submitform5MDPLQualityAgreement,
        method: 'POST',
        data: { data: JSON.stringify(payload) }
      });
      if (response?.data?.message?.status === "success") {
        alert("Prodcuts Added!");
      } else {
        alert("Failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during form 5 submittion:", error);
      alert("Something went wrong while submitting.");
    }
  };

  useEffect(() => {
    const productsFromForm = qualityagreementData?.products_in_qa || [];
    if (productsFromForm.length > 0) {
      localStorage.setItem("QAProductList", JSON.stringify(productsFromForm));
    }
  }, [formData.products_in_qa]);

  const hasNewRows = products.some(p => p.isNew);

  return (
    <div className="space-y-[32px] flex flex-col justify-between min-h-[80vh]">
      <div style={{ boxShadow: "0px 0px 5px 5px rgba(0, 0, 0, 0.05)" }} className="space-y-10">
        <div className="bg-white text-black px-4 pb-8 pt-4 mx-auto border border-gray-300">
          <Header />
          <section className="ml-8 space-y-2 z-[50] text-justify text-[15px]">
            <div className="space-y-2 text-justify pr-8">
              <h1 className="text-center font-bold text-[17px]">
                Annex I – List of the Products
              </h1>
              <div className="mt-5">
                <Table className="border border-black">
                  <TableHeader>
                    <TableRow className="border-b border-black">
                      <TableHead className="w-[50px] text-center border-r border-black">
                        Sr. No.
                      </TableHead>
                      <TableHead className="w-[300px] text-center border-r border-black">
                        Name of the Purchased Material / Processes
                      </TableHead>
                      <TableHead className="w-[300px] text-center border-r border-black">
                        Specifications
                      </TableHead>
                      {(designation !== "QA Team" && designation !== "Purchase Team") && (
                        <TableHead className="w-[70px] text-center border-black">
                          Delete
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product, index) => (
                      <TableRow key={index} className="border-b border-black">
                        <TableCell className="text-center border-r border-black">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-center border-r border-black">
                          <input
                            type="text"
                            value={product.name_of_the_purchased_material__processes}
                            onChange={e =>
                              handleInputChange(index, "name_of_the_purchased_material__processes", e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-400 rounded"
                            placeholder="Enter material name"
                          />
                        </TableCell>
                        <TableCell className="text-center border-r border-black">
                          <input
                            type="text"
                            value={product.specifications}
                            onChange={e =>
                              handleInputChange(index, "specifications", e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-400 rounded"
                            placeholder="Enter specifications"
                          />
                        </TableCell>
                        {(designation !== "QA Team" && designation !== "Purchase Team") && (
                          <TableCell className="text-center">
                            <Trash2
                              size={20}
                              className="cursor-pointer text-red-600 hover:text-red-800"
                              onClick={() => deleteRow(index)}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {(designation !== "QA Team" && designation !== "Purchase Team") && (
                  <button
                    type="button"
                    onClick={addRow}
                    className="mt-4 flex items-center justify-center text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    ➕ Insert a new row if required
                  </button>
                )}
              </div>
            </div>
          </section>
          {(designation !== "QA Team" && designation !== "Purchase Team") && hasNewRows && (
            <div className="flex justify-end mt-4 pr-6">
              <Button className="py-2.5" variant={"nextbtn"} size={"nextbtnsize"} onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          )}
          <section className="items-center">
            <div className="text-center text-lg font-semibold mt-[400px]">
              Page 6 of 7
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
