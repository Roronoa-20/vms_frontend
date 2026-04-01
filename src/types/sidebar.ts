
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

export interface ApiSubModule {
  sub_module: string;
  route: string | null;
  icon: string | null;
  sequence: number;
}

export interface ApiModule {
  module: string;
  route: string | null;
  module_icon: string | null;
  sequence: number;
  sub_modules: ApiSubModule[];
}
