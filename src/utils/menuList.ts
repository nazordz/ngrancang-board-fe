import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import ListAltIcon from '@mui/icons-material/ListAlt';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined';

export interface IMenuList {
  to: string;
  label: string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  activeIcon?: string;
  children?: IMenuList[];
}

export const menuList: IMenuList[] = [
  {
    label: "Roadmap",
    Icon: ListAltIcon,
    to: "/",
  },
  {
    label: "Backlog",
    Icon: ClearAllIcon,
    to: "/",
  },
  {
    label: "Active Sprint",
    Icon: ViewColumnOutlinedIcon,
    to: "/",
  },
];
