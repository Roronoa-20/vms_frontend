type AnyObject = Record<string, any>;

const DEFAULT_EXCLUDED_FIELDS = [
    "id",
    "name",
    "created_at",
    "updated_at",
    "created_by",
    "updated_by",
];

export function calculateSectionProgress(
    data: AnyObject | null | undefined,
    options?: {
        excludeFields?: string[];
        questionMode?: boolean; // force question mode if needed
    }
): number {
    if (!data || typeof data !== "object") return 0;

    const excludeFields = [
        ...DEFAULT_EXCLUDED_FIELDS,
        ...(options?.excludeFields || []),
    ];

    // 🔥 Detect question-based structure automatically
    const isQuestionStructure = Object.values(data).every(
        (val) =>
            typeof val === "object" &&
            val !== null &&
            "selection" in val
    );

    if (isQuestionStructure || options?.questionMode) {
        return calculateQuestionProgress(data);
    }

    return calculateGenericProgress(data, excludeFields);
}


function calculateQuestionProgress(data: AnyObject): number {
    const keys = Object.keys(data);
    if (keys.length === 0) return 0;

    let completed = 0;

    keys.forEach((key) => {
        const question = data[key];
        if (!question?.selection) return;

        const { selection, comment, file } = question;

        let valid = true;

        // Selection must exist
        if (!selection) valid = false;

        // If YES → comment required
        if (selection === "Yes" && !comment?.trim()) {
            valid = false;
        }

        // If file field exists and is empty → required
        if (
            question.hasOwnProperty("file") &&
            question.file !== undefined &&
            question.file !== null &&
            question.file === ""
        ) {
            valid = false;
        }


        if (valid) completed++;
    });

    return Math.round((completed / keys.length) * 100);
}


function calculateGenericProgress(
    data: AnyObject,
    excludeFields: string[]
): number {
    let totalFields = 0;
    let filledFields = 0;

    function evaluate(value: any, key?: string) {
        if (key && excludeFields.includes(key)) return;

        if (Array.isArray(value)) {
            if (value.length === 0) {
                totalFields++;
                return;
            }

            value.forEach((item) => {
                if (typeof item === "object" && item !== null) {
                    Object.entries(item).forEach(([k, v]) =>
                        evaluate(v, k)
                    );
                } else {
                    totalFields++;
                    if (isFilled(item)) filledFields++;
                }
            });

            return;
        }

        if (typeof value === "object" && value !== null) {
            Object.entries(value).forEach(([k, v]) =>
                evaluate(v, k)
            );
            return;
        }

        totalFields++;
        if (isFilled(value)) filledFields++;
    }

    function isFilled(value: any): boolean {
        if (value === null || value === undefined) return false;
        if (typeof value === "string") return value.trim() !== "";
        if (typeof value === "number") return true;
        if (typeof value === "boolean") return true;
        return false;
    }

    Object.entries(data).forEach(([key, value]) =>
        evaluate(value, key)
    );

    if (totalFields === 0) return 0;

    return Math.round((filledFields / totalFields) * 100);
}
