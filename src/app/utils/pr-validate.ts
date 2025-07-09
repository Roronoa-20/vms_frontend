// export interface ValidationResult {
//   isValid: boolean;
//   errors: Record<string, string>;
// }

// /**
//  * Validates required fields dynamically from API config,
//  * excluding 'requisitioner'.
//  */
// export function validateRequiredFields(
//   data: Record<string, any>,
//   validationMap: Record<string, string>
// ): ValidationResult {
//   const errors: Record<string, string> = {};

//   Object.entries(validationMap).forEach(([key, value]) => {
//     if (key === "requisitioner") return; 

//     if (value === "Compulsory" && (!data[key] || data[key]?.toString().trim() === "")) {
//       errors[key] = `${key.replace(/_/g, ' ')} is required`;
//     }
//   });

//   return {
//     isValid: Object.keys(errors).length === 0,
//     errors,
//   };
// }

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates required fields from backend config,
 * while always requiring `account_assignment_category`,
 * and ignoring `requisitioner`.
 */
export function validateRequiredFields(
  data: Record<string, any>,
  validationMap: Record<string, string>
): ValidationResult {
  const errors: Record<string, string> = {};

  Object.entries(validationMap).forEach(([key, value]) => {
    if (key === "requisitioner") return; // ❌ Ignore
    if (
      (value === "Compulsory" || key === "account_assignment_category") &&
      (!data[key] || data[key]?.toString().trim() === "")
    ) {
      errors[key] = `${key.replace(/_/g, ' ')} is required`;
    }
  });

  // ✅ Force validate `account_assignment_category` if missing in validationMap
  if (
    (!data["account_assignment_category"] || data["account_assignment_category"]?.toString().trim() === "") &&
    !errors["account_assignment_category"]
  ) {
    errors["account_assignment_category"] = "Account assignment category is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
