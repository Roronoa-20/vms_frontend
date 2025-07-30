import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button";
import { WaterConsumptionAndManagement } from "@/src/types/asatypes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Water_Consumption_And_Management() {
    const [formData, setFormData] = useState<WaterConsumptionAndManagement>({
        question1: { selection: "", comment: "", file: null },
        question2: { selection: "", comment: "", file: null },
        question3: { selection: "", comment: "", file: null },
        question4: { selection: "", comment: "", file: null },
        question5: { selection: "", comment: "", file: null },
        question6: { selection: "", comment: "", file: null },
        question7: { selection: "", comment: "", file: null },
    });
    // handlers
    const handleSelectionChange = (name: string, selection: "yes" | "no" | "na") => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof WaterConsumptionAndManagement],
                selection,
            },
        }));
    };

    const handleCommentChange = (name: string, comment: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof WaterConsumptionAndManagement],
                comment,
            },
        }));
    };

    const handleFileChange = (name: string, file: File | null) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof WaterConsumptionAndManagement],
                file,
            },
        }));
    };

    // routing
    const router = useRouter()
    const wastemanagement = () => {
        router.push("/asaform/wastemanagement")
    }
    return (
        <>
            <div className="ml-6 mt-3 mr-6">
                <div className="text-xl font-semibold">Water Consumption and Management</div>
                <div className="border-b border-gray-400"></div>
                <div className="mt-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        1. Whether the company tracks and identifies the sources of its water (e.g. groundwater, municipal water sourced from the local water body, harvested rainwater, etc.)?
                    </label>
                    <YesNoNA
                        name="question1"
                        value={formData.question1}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        2. Do you have the permission for groundwater withdrawal, if applicable?
                    </label>
                    <YesNoNA
                        name="question2"
                        value={formData.question2}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        3. Whether the company has a system in place to track and measure water withdrawals, consumption, and disposal?
                    </label>
                    <YesNoNA
                        name="question3"
                        value={formData.question3}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        4. Do you have a facility (Effluent Treatment Plan/Sewage Treatment Plant) to recycle wastewater generated?
                    </label>
                    <YesNoNA
                        name="question4"
                        value={formData.question4}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        5. Does your company have a Zero Liquid Discharge (ZLD) strategy in place to minimize or eliminate wastewater discharge?
                    </label>
                    <YesNoNA
                        name="question5"
                        value={formData.question5}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        6. Does the company have initiatives in place to increase water use efficiency? If yes, provide the initiative details.
                    </label>
                    <YesNoNA
                        name="question6"
                        value={formData.question6}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        7. Do you have any targets to reduce freshwater consumption or waste water recycling? If yes, mention the targets.
                    </label>
                    <YesNoNA
                        name="question7"
                        value={formData.question7}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <Button className="bg-gray-900 hover:bg-gray-700 mt-3" onClick={wastemanagement}>Next</Button>
                </div>
            </div>
        </>
    )
}