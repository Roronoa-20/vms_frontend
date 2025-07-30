import { Button } from "@/components/ui/button";
import Form_Input from "@/src/components/common/FormInput";
import Textarea_Input from "@/src/components/common/TextareaWithLabel";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CompanyInformation } from "@/src/types/asatypes";

export default function Company_Information_Form() {
    const router = useRouter()
    const [formData, setFormData] = useState<CompanyInformation>({
        companyName: "",
        companyAddress: "",
        productOrServiceName: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const generaldisclosure = () => {
        router.push("/asaform/generaldisclosure")
    }
    return (
        <>
            <div className="ml-6 mt-3 mr-6">
                <div className="text-xl font-semibold">Company Information</div>
                <div className="border-b border-gray-400"></div>
                <div className="mt-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">1. Name of the Company</label>
                    <Form_Input name="companyName" value={formData.companyName} onChange={handleChange} />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">2. Location(Full Address)</label>
                    <Textarea_Input name="companyAddress" label="Company Address" value={formData.companyAddress} onChange={handleChange}/>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">3. Name of the product/products/services supplied/provided to Meril</label>
                    <Form_Input name="productOrServiceName" value={formData.productOrServiceName} onChange={handleChange} />
                    <Button className="bg-gray-900 hover:bg-gray-700 mt-3" onClick={generaldisclosure}>Next</Button>
                </div>
            </div>
        </>
    )
}