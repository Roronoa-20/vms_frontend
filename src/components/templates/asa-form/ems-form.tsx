import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EnvironmentalManagementSystem } from "@/src/types/asatypes";

export default function Environmental_Management_System() {
    
    const [formData, setFormData] = useState<EnvironmentalManagementSystem>({
        question1: { selection: "", comment: "", file: null },
        question2: { selection: "", comment: "", file: null },
        question3: { selection: "", comment: "", file: null },
    });
    // handlers
    const handleSelectionChange = (name: string, selection: "yes" | "no" | "na") => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof EnvironmentalManagementSystem],
                selection,
            },
        }));
    };

    const handleCommentChange = (name: string, comment: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof EnvironmentalManagementSystem],
                comment,
            },
        }));
    };

    const handleFileChange = (name: string, file: File | null) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof EnvironmentalManagementSystem],
                file,
            },
        }));
    };
    // routing
    const router = useRouter()
    const energyconsumptionandemission = () => {
        router.push("/asaform/energyconsumptionandemission")
    }
    return (
        <>
            <div className="ml-6 mt-3 mr-6">
                <div className="text-xl font-semibold">Environmental Management System</div>
                <div className="border-b border-gray-400"></div>
                <div className="mt-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Does your Company have:

                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            i. Environment/Sustainability Policy in place?
                        </label>
                        <YesNoNA
                            name="question1"
                            value={formData.question1}
                            onSelectionChange={handleSelectionChange}
                            onCommentChange={handleCommentChange}
                            onFileChange={handleFileChange}
                        />
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            ii. Environment Management System certified to standards like ISO 14001, ISO 5001, etc.
                        </label>
                        <YesNoNA
                            name="question2"
                            value={formData.question2}
                            onSelectionChange={handleSelectionChange}
                            onCommentChange={handleCommentChange}
                            onFileChange={handleFileChange}
                        />
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            iii. Do you conduct regular energy, water, and waste audits
                        </label>
                        <YesNoNA
                            name="question3"
                            value={formData.question3}
                            onSelectionChange={handleSelectionChange}
                            onCommentChange={handleCommentChange}
                            onFileChange={handleFileChange}
                        />
                    </label>


                    <Button className="bg-gray-900 hover:bg-gray-700 mt-3" onClick={energyconsumptionandemission}>Next</Button>
                </div>
            </div>
        </>
    )
}