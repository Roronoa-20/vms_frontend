import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button";
import { LaborRightsAndWorkingConditions } from "@/src/types/asatypes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Labor_Rights_And_Working_Conditions() {
    const [formData, setFormData] = useState<LaborRightsAndWorkingConditions>({
        question1: { selection: "", comment: "", file: null },
        question2: { selection: "", comment: "", file: null },
        question3: { selection: "", comment: "", file: null },
        question4: { selection: "", comment: "", file: null },
        question5: { selection: "", comment: "", file: null },
        question6: { selection: "", comment: "", file: null },
        question7: { selection: "", comment: "", file: null },
        question8: { selection: "", comment: "", file: null },
        question9: { selection: "", comment: "", file: null },
        question10: { selection: "", comment: "", file: null },
        question11: { selection: "", comment: "", file: null },
        question12: { selection: "", comment: "", file: null },
    });

    // handlers
    const handleSelectionChange = (name: string, selection: "yes" | "no" | "na") => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof LaborRightsAndWorkingConditions],
                selection,
            },
        }));
    };

    const handleCommentChange = (name: string, comment: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof LaborRightsAndWorkingConditions],
                comment,
            },
        }));
    };

    const handleFileChange = (name: string, file: File | null) => {
        setFormData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name as keyof LaborRightsAndWorkingConditions],
                file,
            },
        }));
    };

    // routing
    const router = useRouter()
    const grievancemechanism = () => {
        router.push("/asaform/grievancemechanism")
    }
    return (
        <>
            <div className="ml-6 mt-3 mr-6">
                <div className="text-xl font-semibold">Labor Rights and Working Conditions</div>
                <div className="border-b border-gray-400"></div>
                <div className="mt-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        1. Does the company have a policy on prohibition of child labor and forced labor?
                    </label>
                    <YesNoNA
                        name="question1"
                        value={formData.question1}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        2. Does the company obtain proof of Age documentation from all potential employees and workers and review the documents for authenticity prior to hiring?
                    </label>
                    <YesNoNA
                        name="question2"
                        value={formData.question2}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        3. Does the company ensure that no forced, bonded, indentured or involuntary prison labor, human trafficking, or any form of modern slavery takes place in their operations and their supply chain?
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
                        5. Does the company have a non-discrimination policy communicated to all employees and workers?
                    </label>
                    <YesNoNA
                        name="question5"
                        value={formData.question5}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        6. Has the company established a procedure, accessible and known to all employees and workers, where workers can safely report incidents of workplace discrimination?
                    </label>
                    <YesNoNA
                        name="question6"
                        value={formData.question6}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        7. Are there any legal cases pending regarding workplace harassment? If yes, provide details.
                    </label>
                    <YesNoNA
                        name="question7"
                        value={formData.question7}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        8. Does your company comply with all applicable minimum wage laws and regulations in the countries where you operate?
                    </label>
                    <YesNoNA
                        name="question8"
                        value={formData.question8}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        9. Are working hours within the legal limit (9 hours pr day, 48 hours per week)?
                    </label>
                    <YesNoNA
                        name="question9"
                        value={formData.question9}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        10. Are working hours and attendance tracked by the company and authenticated by employees and workers?
                    </label>
                    <YesNoNA
                        name="question10"
                        value={formData.question10}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        11. Whether the company has a Diversity and inclusion policy covering anti-discrimination and anti-harassment, equal opportunity, etc?
                    </label>
                    <YesNoNA
                        name="question11"
                        value={formData.question11}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        12. Do you have initiatives and targets in place to promote diversity and inclusion? If Yes, provide the details.
                    </label>
                    <YesNoNA
                        name="question12"
                        value={formData.question12}
                        onSelectionChange={handleSelectionChange}
                        onCommentChange={handleCommentChange}
                        onFileChange={handleFileChange}
                    />
                    <Button className="bg-gray-900 hover:bg-gray-700 mt-3" onClick={grievancemechanism}>Next</Button>
                </div>
            </div>
        </>
    )
}