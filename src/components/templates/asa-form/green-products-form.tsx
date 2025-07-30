import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button";
import { GreenProducts } from "@/src/types/asatypes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Green_Products() {
    const router = useRouter()
    const [formData, setFormData] = useState<GreenProducts>({
        question1: { selection: "", comment: "", file: null }
    });
    // handlers
    const handleSelectionChange = (name: string, selection: "yes" | "no" | "na") => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof GreenProducts],
                selection,
            },
        }));
    };

    const handleCommentChange = (name: string, comment: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof GreenProducts],
                comment,
            },
        }));
    };

    const handleFileChange = (name: string, file: File | null) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof GreenProducts],
                file,
            },
        }));
    };

    // routing
    const biodiversity = () => {
        router.push("/asaform/biodiversity")
    }
    return (
        <>
            <div className="ml-6 mt-3 mr-6">
                <div className="text-xl font-semibold">Green Products</div>
                <div className="border-b border-gray-400"></div>
                <div className="mt-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Do you have any products that has been certified as Green by the certification bodies like Green Label, Forest Stewardship Council (FSC), etc.?
                    </label>
                    <YesNoNA
                        name="question1"
                        value={formData.question1}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <Button className="bg-gray-900 hover:bg-gray-700 mt-3" onClick={biodiversity}>Next</Button>
                </div>
            </div>
        </>
    )
}