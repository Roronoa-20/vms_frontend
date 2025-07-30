import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button";
import { EmployeeWellBeing } from "@/src/types/asatypes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Employee_Wellbeing() {
    const [formData, setFormData] = useState<EmployeeWellBeing>({
        question1: { selection: "", comment: "", file: null }
    });
    // handlers
    const handleSelectionChange = (name: string, selection: "yes" | "no" | "na") => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof EmployeeWellBeing],
                selection,
            },
        }));
    };

    const handleCommentChange = (name: string, comment: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof EmployeeWellBeing],
                comment,
            },
        }));
    };

    const handleFileChange = (name: string, file: File | null) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof EmployeeWellBeing],
                file,
            },
        }));
    };
    // router
    const router = useRouter()
    const healthandsafety = () => {
        router.push("/asaform/healthandsafety")
    }
    return (
        <>
            <div className="ml-6 mt-3 mr-6">
                <div className="text-xl font-semibold">Employee Well-Being</div>
                <div className="border-b border-gray-400"></div>
                <div className="mt-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Are there employee well-being initiatives in place? If Yes, provide the details of the initiatives.
                    </label>
                    <YesNoNA
                        name="question1"
                        value={formData.question1}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <Button className="bg-gray-900 hover:bg-gray-700 mt-3" onClick={healthandsafety}>Next</Button>
                </div>
            </div>
        </>
    )
}