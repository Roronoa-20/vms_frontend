"use client"
import React, { useState, useRef, useEffect } from "react";
import Logo from "@/src/components/atoms/vms-logo";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { SidebarItem, SidebarChild, ApiModule } from "@/src/types/sidebar";


const Sidebar = () => {
  const pathname = usePathname();
  const { modules } = useAuth();

  const DEFAULT_ICON = "/sidebar-assests/home-logo.svg";

  const buildSidebarFromModules = (apiModules: ApiModule[]): SidebarItem[] => {
    return [...apiModules]
      .sort((a, b) => a.sequence - b.sequence)
      .map((mod) => {
        const validSubs = mod.sub_modules
          .filter((sub) => sub.route)
          .sort((a, b) => a.sequence - b.sequence);

        if (validSubs.length === 0) {
          return {
            logo: mod.module_icon || DEFAULT_ICON,
            name: mod.module,
            href: mod.route || undefined,
            defaultActive: mod.sequence === 0,
            children: [],
          };
        }

        return {
          logo: mod.module_icon || DEFAULT_ICON,
          name: mod.module,
          href: mod.route || undefined,
          defaultActive: mod.sequence === 0,
          children: validSubs.map((sub) => ({
            logo: sub.icon || DEFAULT_ICON,
            name: sub.sub_module,
            href: sub.route as string,
          })),
        };
      });
  };

  const sideBar = buildSidebarFromModules(modules);

  const [openMenuName, setOpenMenuName] = useState<string | null>(null);
  const [submenuPos, setSubmenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const submenuRef = useRef<HTMLDivElement | null>(null);

  const updateSubmenuPosition = (itemName: string) => {
    const idx = sideBar.findIndex((i) => i.name === itemName);
    const btn = buttonRefs.current[idx];
    const sidebar = document.querySelector(".sidebar-scroll") as HTMLElement;

    if (!btn || !sidebar) return;

    const btnRect = btn.getBoundingClientRect();

    setSubmenuPos({
      top: btnRect.top,
      left: btnRect.right + 4,
    });
  };

  const handleClick = (item: SidebarItem, idx: number) => {
    if (item.children && item.children.length > 0) {
      setOpenMenuName(prev => {
        const next = prev === item.name ? null : item.name;
        if (next) {
          requestAnimationFrame(() => updateSubmenuPosition(item.name));
        }
        return next;
      });
    } else {
      navigateTo(item);
    }
  };

  const openMenu = sideBar.find(i => i.name === openMenuName);

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar-scroll") as HTMLElement;
    if (!sidebar || !openMenuName) return;

    const onScroll = () => updateSubmenuPosition(openMenuName);

    sidebar.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);

    return () => {
      sidebar.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [openMenuName]);

  const navigateTo = (item: SidebarItem | SidebarChild) => {
    if ("children" in item && item.children.length > 0) return;

    if (item.href) {
      window.location.href = item.href;
    }

    setOpenMenuName(null);
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (submenuRef.current?.contains(event.target as Node) || buttonRefs.current.some(btn => btn?.contains(event.target as Node))) {
        return;
      }
      setOpenMenuName(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!sideBar.length) return null;

  return (
    <div className="relative">
      {/* SIDEBAR */}
      <div className={`w-[115px] bg-[#0C2741] flex flex-col h-screen relative overflow-hidden`}>
        <div className="flex flex-col flex-1 items-center gap-3 overflow-y-auto no-scrollbar sidebar-scroll w-full pb-6">
          <div className="pb-3 pt-2.5">
            <Logo />
          </div>
          {sideBar?.map((item, idx) => (
            <button
              key={idx}
              ref={(el) => { buttonRefs.current[idx] = el; }}
              className={`px-2 py-2 rounded-lg text-sm flex flex-col justify-center items-center gap-1 text-white w-full 
            ${pathname === item.href ||
                  item.children?.some(child => child.href === pathname) ||
                  (pathname === "/dashboard" && item.defaultActive)
                  ? "bg-[#2C567E]"
                  : "hover:bg-[#2C567E]"
                }`}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => handleClick(item, idx)}
            >
              <Image src={item?.logo} alt="" width={30} height={25} />
              <h1 className="text-center text-[16px] break-words">{item?.name}</h1>
            </button>
          ))}
        </div>
        
        {openMenu?.children && (
          <div
            ref={submenuRef}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ top: submenuPos.top, left: submenuPos.left }}
            className="fixed bg-[#15395B] rounded-md shadow-lg flex flex-col gap-2 py-2 px-2 min-w-[180px] z-50"
          >
            {openMenu.children.map((child, idx) => (
              <button
                key={idx}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm text-white ${pathname === child.href ? "bg-[#2C567E]" : "hover:bg-[#2C567E]"}`}
                onClick={() => navigateTo(child)}
              >
                {child.logo && <Image src={child.logo} alt={child.name} width={18} height={18} />}
                <span>{child.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Sidebar;