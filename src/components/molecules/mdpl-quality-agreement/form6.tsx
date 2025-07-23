import React from "react";
import Header from "@/src/components/molecules/mdpl-quality-agreement/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQMSForm } from "@/src/hooks/useQMSForm";
import { useSearchParams } from "next/navigation";

export const Form6 = ({ vendor_onboarding }: { vendor_onboarding: string }) => {
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "vendor_information";
  const { formData, setFormData } = useQMSForm(vendor_onboarding, currentTab);

  const products: Array<any> = Array.isArray(formData?.products_in_qa)
    ? formData.products_in_qa
    : [];

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
      isNew: updatedProducts[index]?.isNew ?? false,
    };
    setFormData((prev: any) => ({
      ...prev,
      products_in_qa: updatedProducts,
    }));
  };

  const addRow = () => {
    setFormData((prev: any) => ({
      ...prev,
      products_in_qa: [
        ...(prev.products_in_qa || []),
        { material_description: "", specification: "", isNew: true },
      ],
    }));
  };

  return (
    <div className="space-y-[32px] flex flex-col justify-between min-h-[80vh]">
      <div style={{ boxShadow: "0px 0px 5px 5px rgba(0, 0, 0, 0.05)" }} className="space-y-10">
        <div className="bg-white text-black px-4 pb-8 pt-4 mx-auto border border-gray-300">
          <Header />
          <section className="ml-8 space-y-2 z-[50] relative text-justify text-[15px]">
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
                            value={product.material_description}
                            onChange={e =>
                              handleInputChange(index, "material_description", e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-400 rounded"
                            placeholder="Enter material name"
                          />
                        </TableCell>
                        <TableCell className="text-center border-r border-black">
                          <input
                            type="text"
                            value={product.specification}
                            onChange={e =>
                              handleInputChange(index, "specification", e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-400 rounded"
                            placeholder="Enter specifications"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <button
                  type="button"
                  onClick={addRow}
                  className="mt-4 flex items-center justify-center text-blue-600 hover:text-blue-800 font-semibold"
                >
                  ➕ Insert a new row if required
                </button>
              </div>
            </div>
          </section>
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
