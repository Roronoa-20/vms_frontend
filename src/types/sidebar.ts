
export interface SidebarChild {
  logo: string;
  name: string;
  href: string;
}

export interface SidebarItem {
  logo: string;
  name: string;
  href?: string;
  defaultActive?: boolean;
  children: SidebarChild[];
}
