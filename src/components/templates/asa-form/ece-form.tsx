import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button";
import { EnergyConsumptionAndEmission } from "@/src/types/asatypes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Energy_Consumption_And_Emission() {
    const [formData, setFormData] = useState<EnergyConsumptionAndEmission>({
        question1: { selection: "", comment: "", file: null },
        question2: { selection: "", comment: "", file: null },
        question3: { selection: "", comment: "", file: null },
        question4: { selection: "", comment: "", file: null },
        question5: { selection: "", comment: "", file: null },
        question6: { selection: "", comment: "", file: null },
        question7: { selection: "", comment: "", file: null },
        question8: { selection: "", comment: "", file: null },
        question9: { selection: "", comment: "", file: null },
    });

    // handlers
    const handleSelectionChange = (name: string, selection: "yes" | "no" | "na") => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof EnergyConsumptionAndEmission],
                selection,
            },
        }));
    };

    const handleCommentChange = (name: string, comment: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof EnergyConsumptionAndEmission],
                comment,
            },
        }));
    };

    const handleFileChange = (name: string, file: File | null) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof EnergyConsumptionAndEmission],
                file,
            },
        }));
    };

    // routing
    const router = useRouter()
    const waterconsumptionandmanagement = () => {
        router.push("/asaform/waterconsumptionandmanagement")
    }
    return (
        <>
            <div className="ml-6 mt-3 mr-6">
                <div className="text-xl font-semibold">Energy Consumption and Emission</div>
                <div className="border-b border-gray-400"></div>
                <div className="mt-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        1. Does your company track energy consumption? If yes, provide the total energy consmed.
                    </label>
                    <YesNoNA
                        name="question1"
                        value={formData.question1}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        2. Does your company track greenhouse gas emissions? If yes, provide the scope 1, 2 and 3 GHG emissions. Provide the Scope emissions category wise.
                    </label>
                    <YesNoNA
                        name="question2"
                        value={formData.question2}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        3. Do you consume renewable energy? If yes, provide % of total electricity consumption coming from renewable sources.
                    </label>
                    <YesNoNA
                        name="question3"
                        value={formData.question3}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        4.Does your company have systems in place to control air emissions? If yes, provide the details.
                    </label>
                    <YesNoNA
                        name="question4"
                        value={formData.question4}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        5. Do you have a target in place to increase the renewable energy share? If yes, mention the target.
                    </label>
                    <YesNoNA
                        name="question5"
                        value={formData.question5}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        6. Do you have a target in place to reduce the energy consumption? If yes, mention the target.
                    </label>
                    <YesNoNA
                        name="question6"
                        value={formData.question6}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        7. Do you have a plan to improve energy efficiency of process and assets? If yes, list down the initiatives.
                    </label>
                    <YesNoNA
                        name="question7"
                        value={formData.question7}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        8. Do you have initiatives and targets in place to reduce emission? If yes, provide the target details.
                    </label>
                    <YesNoNA
                        name="question8"
                        value={formData.question8}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        9. Do you do PFC (Product Carbon Footprinting) of your products?
                    </label>
                    <YesNoNA
                        name="question9"
                        value={formData.question9}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <Button className="bg-gray-900 hover:bg-gray-700 mt-3" onClick={waterconsumptionandmanagement}>Next</Button>
                </div>
            </div>
        </>
    )
}