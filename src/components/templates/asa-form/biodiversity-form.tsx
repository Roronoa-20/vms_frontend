import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button"
import { Biodiversity } from "@/src/types/asatypes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BiodiversityForm() {
    const [formData, setFormData] = useState<Biodiversity>({
        question1: { selection: "", comment: "", file: null }
    });

    // handlers
    const handleSelectionChange = (name: string, selection: "yes" | "no" | "na") => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof Biodiversity],
                selection,
            },
        }));
    };

    const handleCommentChange = (name: string, comment: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof Biodiversity],
                comment,
            },
        }));
    };

    const handleFileChange = (name: string, file: File | null) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof Biodiversity],
                file,
            },
        }));
    };

    // routing
    const router = useRouter()
    const laborrightsandworkingconditions = () => {
        router.push("/asaform/laborrightsandworkingconditions")
    }
    return (
        <>
            <div className="ml-6 mt-3 mr-6">
                <div className="text-xl font-semibold">Biodiversity</div>
                <div className="border-b border-gray-400"></div>
                <div className="mt-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Does the organization have a policy or commitment on biodiversity?
                    </label>
                    <YesNoNA
                        name="question1"
                        value={formData.question1}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <Button className="bg-gray-900 hover:bg-gray-700 mt-3" onClick={laborrightsandworkingconditions}>Next</Button>
                </div>
            </div>
        </>
    )
}