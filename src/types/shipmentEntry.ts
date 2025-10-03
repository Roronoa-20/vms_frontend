export type entry = {
  id: string;
  title: string;
  color: string;
  textColor?: string;
  iconColor: string;
  icon?: React.ElementType;
  status?: "completed" | "in-progress" | "pending";
};
