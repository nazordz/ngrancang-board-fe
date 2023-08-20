import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import ListAltIcon from '@mui/icons-material/ListAlt';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import SettingsIcon from '@mui/icons-material/Settings';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { IMenu } from "@/models";
import GroupIcon from '@mui/icons-material/Group';
import SummarizeIcon from '@mui/icons-material/Summarize';

export interface IMenuList {
  to: string;
  label: string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  activeIcon?: string;
  children?: IMenuList[];
}

export const menuList: IMenu[] = [
  // {
  //   icon: MapIcon,
  //   link: '/backoffice',
  //   title: 'Roadmap'
  // },
  {
    icon: FormatListNumberedIcon,
    link: '/backlog',
    title: 'Backlog',
    roles: ['ROLE_USER', 'ROLE_ADMIN']
  },
  {
    icon: DirectionsRunIcon,
    link: '/active-sprint',
    title: 'Active Sprint',
    roles: ['ROLE_USER', 'ROLE_ADMIN']
  },
  {
    icon: SummarizeIcon,
    link: '/report',
    title: 'Sprint Report',
    roles: ['ROLE_USER', 'ROLE_ADMIN']
  },
  // {
  //   icon: ChecklistIcon,
  //   link: '/issues',
  //   title: 'Issues',
  // },
  {
    icon: GroupIcon,
    link: '/users',
    title: 'User Management',
    roles: ['ROLE_ADMIN']
  },
  {
    icon: SettingsIcon,
    link: '/settings',
    title: 'Pengaturan Project',
    roles: ['ROLE_USER', 'ROLE_ADMIN']
  },

];
