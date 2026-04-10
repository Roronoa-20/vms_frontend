
export const multiSelectStyles = {
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  control: (base: any) => ({ ...base, minHeight: "2rem", fontSize: "0.875rem" }),
  input: (base: any) => ({ ...base, fontSize: "0.875rem" }),
  singleValue: (base: any) => ({ ...base, fontSize: "0.875rem" }),
  multiValueLabel: (base: any) => ({ ...base, fontSize: "0.875rem" }),
  option: (base: any) => ({ ...base, fontSize: "0.875rem" }),
};

/** Compact react-select: 12px control + menu rows sized to match (not oversized list text). */
export const itemsRowSelectStyles = (menuMinWidth: string) => ({
  ...multiSelectStyles,
  control: (base: any) => ({
    ...multiSelectStyles.control(base),
    minHeight: "32px",
    minWidth: "0",
    width: "100%",
    borderRadius: "0.375rem",
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
    fontSize: "12px",
  }),
  singleValue: (base: any) => ({
    ...multiSelectStyles.singleValue(base),
    fontSize: "12px",
  }),
  input: (base: any) => ({
    ...multiSelectStyles.input(base),
    fontSize: "12px",
    margin: "0",
    padding: "0",
  }),
  placeholder: (base: any) => ({ ...base, fontSize: "12px" }),
  menuList: (base: any) => ({
    ...base,
    maxHeight: "min(220px, 38vh)",
    paddingTop: "2px",
    paddingBottom: "2px",
  }),
  option: (base: any) => ({
    ...base,
    fontSize: "12px",
    lineHeight: "1.2",
    padding: "4px 8px",
    minHeight: "26px",
  }),
  menu: (base: any) => ({
    ...base,
    minWidth: menuMinWidth,
    fontSize: "12px",
  }),
});
