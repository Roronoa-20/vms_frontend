import { Button } from "@/components/ui/button";
import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GeneralDisclosureData } from "@/src/types/asatypes";

export default function General_Disclosure_Form() {
    const router = useRouter()
    const [formData, setFormData] = useState<GeneralDisclosureData>({
        question1: { selection: "", comment: "", file: null },
        question2: { selection: "", comment: "", file: null },
        question3: { selection: "", comment: "", file: null },
    });

    const handleSelectionChange = (name: string, selection: "yes" | "no" | "na") => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof GeneralDisclosureData],
                selection,
            },
        }));
    };

    const handleCommentChange = (name: string, comment: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof GeneralDisclosureData],
                comment,
            },
        }));
    };

    const handleFileChange = (name: string, file: File | null) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof GeneralDisclosureData],
                file,
            },
        }));
    };


    const environmentalmanagementsystem = () => {
        router.push("/asaform/environmentalmanagementsystem")
    }
    return (
        <>
            <div className="ml-6 mt-3 mr-6">
                <div className="text-xl font-semibold">General Disclosure</div>
                <div className="border-b border-gray-400"></div>
                <div className="mt-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        1. Does the company hold valid Consent to Operate (CTO) from the Pollution Control Board? If yes, provide the expiry date of the Consent.
                    </label>
                    <YesNoNA
                        name="question1"
                        value={formData.question1}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />

                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        2. Do you use recycled plastic/paper in the packaging materials?
                    </label>
                    <YesNoNA
                        name="question2"
                        value={formData.question2}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />

                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        3. Do you have plans/strategy in place to increase the use of recycled materials in the packaging materials?
                    </label>
                    <YesNoNA
                        name="question3"
                        value={formData.question3}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />

                    <Button className="bg-gray-900 hover:bg-gray-700 mt-3" onClick={environmentalmanagementsystem}>Next</Button>
                </div>
            </div>
        </>
    )
}