import { Button } from "@/components/ui/button";
import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { EmployeeSatisfaction } from "@/src/types/asatypes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Employee_Satisfaction() {
const [formData, setFormData] = useState<EmployeeSatisfaction>({
        question1: { selection: "", comment: "", file: null }
    });
    // handlers
    const handleSelectionChange = (name: string, selection: "yes" | "no" | "na") => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof EmployeeSatisfaction],
                selection,
            },
        }));
    };

    const handleCommentChange = (name: string, comment: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof EmployeeSatisfaction],
                comment,
            },
        }));
    };

    const handleFileChange = (name: string, file: File | null) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof EmployeeSatisfaction],
                file,
            },
        }));
    };

    // routing
    const router = useRouter()
    const governance = () => {
        router.push("/asaform/governance")
    }
    return (
        <>
            <div className="ml-6 mt-3 mr-6">
                <div className="text-xl font-semibold">Employee Satisfaction</div>
                <div className="border-b border-gray-400"></div>
                <div className="mt-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Do you conduct employee satisfaction survey (ESAT)? If yes, provide the ESAT score.
                    </label>
                    <YesNoNA
                        name="question1"
                        value={formData.question1}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <Button className="bg-gray-900 hover:bg-gray-700 mt-3" onClick={governance}>Next</Button>
                </div>
            </div>
        </>
    )
}