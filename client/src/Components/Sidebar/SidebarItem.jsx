import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Divider, IconButton } from "@mui/material";
import { useState, useTransition } from "react";
import { PiCaretDownLight, PiCaretUpLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import { TransitionGroup } from "react-transition-group";
import { getLeadReducer } from "../../redux/reducer/lead";
import { useLocation } from "react-router-dom";

const SidebarItem = ({ item, child, openedMenu, setOpenedMenu, setShowSidebar }) => {
  const isMenuOpen = openedMenu === item?.title?.toLowerCase();
  const { pathname } = useLocation();

  const handleMenuClick = (e) => {
    e.stopPropagation();
    if (child) {
      return;
    }
    if (isMenuOpen) {
      setOpenedMenu("");
    } else {
      setOpenedMenu(item?.title.toLowerCase());
    }
  };

  const isActive = pathname === item.link;

  return (
    <div
      className={`${
        pathname.includes("/client/") || pathname.includes("download") ? "hidden" : "visible"
      }`}>
      <div
        className={`pl-4 pr-2 transition-all text-sm font-primary ${
          isActive || isMenuOpen
            ? "text-[#20aee3] font-medium border-l-[3px] border-l-[#20aee3]"
            : "text-gray-700 font-light"
        } hover:text-[#20aee3] hover:border-l-[3px] hover:border-l-[#20aee3] cursor-pointer`}>
        <Link
          to={item?.link}
          className="flex items-center justify-between cursor-pointer py-[12px]"
          onClick={handleMenuClick}>
          <span className="flex items-center gap-2">
            {item?.icon && <div>{item?.icon}</div>}
            {item?.title}
          </span>
          {item?.childrens?.length > 0 &&
            (isMenuOpen ? (
              <PiCaretUpLight className="text-[20px]" />
            ) : (
              <PiCaretDownLight className="text-[20px]" />
            ))}
        </Link>

        {item?.childrens?.length > 0 && isMenuOpen && (
          <div className="py-2">
            {item?.childrens.map((child, index) => (
              <SidebarItem
                className="transition-all"
                key={index}
                item={child}
                child={true}
                openedMenu={openedMenu}
                setOpenedMenu={setOpenedMenu}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarItem;
