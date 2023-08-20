import { InputSubTask, User } from "@/models";
import { getAcronym } from "@/utils/helper";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Popover,
} from "@mui/material";

function PopoverUsers(
  item: InputSubTask,
  closePopoverAvatar: (subTaskId: string) => void,
  listUsers: User[],
  onSubTaskUpdateAssignee: (
    subTaskId: string,
    assigneeId: string
  ) => Promise<void>
) {
  return (
    <Popover
      id={`popover-user-${item.id}`}
      open={item.avatarAnchorEl != null}
      anchorEl={item.avatarAnchorEl}
      onClose={() => closePopoverAvatar(item.id)}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        horizontal: "right",
        vertical: "top",
      }}
    >
      <List
        dense
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
        }}
      >
        {listUsers.map((usr, i) => (
          <ListItem key={i} disablePadding>
            <ListItemButton
              selected={item.assignee_id == usr.id}
              onClick={() => onSubTaskUpdateAssignee(item.id, usr.id)}
            >
              <ListItemAvatar>
                <Avatar>{getAcronym(usr.name).substring(0, 2)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={usr.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Popover>
  );
}

export default PopoverUsers;
