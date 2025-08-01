import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button";
import { WasteManagement } from "@/src/types/asatypes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Waste_Management() {
    const [formData, setFormData] = useState<WasteManagement>({
        question1: { selection: "", comment: "", file: null },
        question2: { selection: "", comment: "", file: null },
        question3: { selection: "", comment: "", file: null },
        question4: { selection: "", comment: "", file: null },
        question5: { selection: "", comment: "", file: null },
    });
    // handlers
    const handleSelectionChange = (name: string, selection: "yes" | "no" | "na") => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof WasteManagement],
                selection,
            },
        }));
    };

    const handleCommentChange = (name: string, comment: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof WasteManagement],
                comment,
            },
        }));
    };

    const handleFileChange = (name: string, file: File | null) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof WasteManagement],
                file,
            },
        }));
    };


    // routing
    const router = useRouter()
    const greenproducts = () => {
        router.push("/asaform/greenproducts")
    }
    return (
        <>
            <div className="ml-6 mt-3 mr-6">
                <div className="text-xl font-semibold">Waste Management</div>
                <div className="border-b border-gray-400"></div>
                <div className="mt-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        1. Does the company track the waste generation and keep the record different categories of waste?
                    </label>
                    <YesNoNA
                        name="question1"
                        value={formData.question1}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        2. Does the company handover the waste to the authorized vendors?
                    </label>
                    <YesNoNA
                        name="question2"
                        value={formData.question2}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        3.Does the company conduct vendor audits for waste management?
                    </label>
                    <YesNoNA
                        name="question3"
                        value={formData.question3}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        4. Does your company have an Extended Producer Responsibility (EPR) program in place for plastic waste management?
                    </label>
                    <YesNoNA
                        name="question4"
                        value={formData.question4}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        5. Does the company have goals, initiatives, and targets to reduce, recycle, and reuse waste, including hazardous waste? If yes, provide the initiative details.
                    </label>
                    <YesNoNA
                        name="question5"
                        value={formData.question5}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />

                    <Button className="bg-gray-900 hover:bg-gray-700 mt-3" onClick={greenproducts}>Next</Button>
                </div>
            </div>
        </>
    )
}