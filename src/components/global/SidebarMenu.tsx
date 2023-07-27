import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useEffect } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import HomeIcon from "../../public/icon/home.svg";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { IMenuList } from "@/utils/menuList";
import { LinkBehavior } from "@/theme";

type IProps = {
  menu: IMenuList;
};

export function isMenuActive(
  to: string,
  pathname: string,
  exact: boolean = false
): boolean {
  if (exact) {
    return pathname == to;
  }
  return pathname.includes(to);
}

const SidebarMenu = (props: IProps) => {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const { menu } = props;

  const handleClick = () => {
    setOpen(!open);
  };

  const hasChildren = Object.prototype.hasOwnProperty.call(menu, "children");

  return (
    <ListItemButton
      component={hasChildren ? "div" : LinkBehavior}
      href={hasChildren ? "" : menu.to}
      dense
    >
      <ListItemIcon>
        {menu.Icon == FiberManualRecordIcon ? (
          <menu.Icon sx={{ fontSize: "12px" }} />
        ) : (
          <menu.Icon />
        )}
      </ListItemIcon>
      <ListItemText
        primary={menu.label}
        primaryTypographyProps={{
          color: "#637381",
          fontWeight: 400,
          fontSize: "14px",
          fontFamily: "Public Sans, sans-serif",
          variant: "body2",
        }}
      />
      {/* <List sx={{ width: "100%", paddingY: 0 }}>
        {isMenuActive(menu.to, location.pathname, menu.to == "/") ? (
          <ListItemButton
            dense
            sx={{ height: 55, borderRadius: "16px" }}
            onClick={handleClick}
            selected={true}
            className={menu.Icon == FiberManualRecordIcon ? `bg-white` : ""}
          >
            <ListItemIcon>
              {menu.Icon == FiberManualRecordIcon ? (
                <menu.Icon sx={{ fontSize: "12px" }} color="primary" />
              ) : (
                <menu.Icon color="primary" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={menu.label}
              primaryTypographyProps={{
                color: "#637381",
                fontWeight: 600,
                fontSize: "14px",
                fontFamily: "Public Sans, sans-serif",
                variant: "body2",
                // boxShadow: "none",
              }}
            />
            {Object.prototype.hasOwnProperty.call(menu, "children") && (
              <>
                {open ? (
                  <ExpandMore sx={{ color: "#637381" }} />
                ) : (
                  <ExpandMore sx={{ color: "#637381" }} />
                )}
              </>
            )}
          </ListItemButton>
        ) : (
          <ListItemButton
            dense
            sx={{ height: 55, borderRadius: "16px" }}
            onClick={handleClick}
            selected={false}
          >
            <ListItemIcon>
              {menu.Icon == FiberManualRecordIcon ? (
                <menu.Icon sx={{ fontSize: "12px" }} />
              ) : (
                <menu.Icon />
              )}
            </ListItemIcon>
            <ListItemText
              primary={menu.label}
              primaryTypographyProps={{
                color: "#637381",
                fontWeight: 400,
                fontSize: "14px",
                fontFamily: "Public Sans, sans-serif",
                variant: "body2",
              }}
            />
            {Object.prototype.hasOwnProperty.call(menu, "children") && (
              <>
                {open ? (
                  <ExpandMore sx={{ color: "#637381" }} />
                ) : (
                  <KeyboardArrowRightIcon
                    sx={{
                      color: "#637381",
                    }}
                  />
                )}
              </>
            )}
          </ListItemButton>
        )}
        {Object.prototype.hasOwnProperty.call(menu, "children") && (
          <Collapse in={open} timeout="auto" unmountOnExit>
            {menu.children?.map((childMenu, i) => (
              <List component="div" disablePadding key={i}>
                <SidebarMenu menu={childMenu}/>
              </List>
            ))}
          </Collapse>
        )}
      </List> */}
    </ListItemButton>
  );
};

export default SidebarMenu;
