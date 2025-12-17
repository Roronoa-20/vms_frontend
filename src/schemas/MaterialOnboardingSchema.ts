import { z } from "zod";

const MaterialOnboardingSchemas = z.object({
    material_company_code: z.string().min(3, "Company Code is required"),
    plant_name: z.string().min(2, "Plant is Required"),
    material_category: z.string().min(1, "Material Category is Required"),
    material_type: z.string().min(1, "Material Type is required"),
    base_unit_of_measure: z.string().min(1, "Base Unit of Measure is required"),
    material_name_description: z.string().min(3, "Material Description is required"),
    material_specifications: z.string().min(3, "Material Specifications is required"),
    comment_by_user: z.string().min(3, "Comment by User is required"),
    });

export default MaterialOnboardingSchemas;
