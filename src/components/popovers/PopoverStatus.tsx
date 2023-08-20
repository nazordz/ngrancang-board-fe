import { InputSubTask, IssueStatusEnum } from "@/models";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
} from "@mui/material";

function PopoverStatus(
  item: InputSubTask,
  closePopoverStatus: (subTaskId: string) => void,
  onSubTaskUpdateStatus: (
    subTaskId: string,
    status: IssueStatusEnum
  ) => Promise<void>
) {
  return (
    <Popover
      id={`popover-status-subtask-${item.id}`}
      anchorEl={item.statusAnchorEl}
      open={item.statusAnchorEl != null}
      onClose={() => closePopoverStatus(item.id)}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        horizontal: "right",
        vertical: "top",
      }}
    >
      <List>
        {Object.values(IssueStatusEnum).map((v, k) => (
          <ListItem key={k}>
            <ListItemButton
              selected={v == item.status}
              onClick={() => {
                onSubTaskUpdateStatus(item.id, v);
              }}
            >
              <ListItemText>{v.replace("_", " ")}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Popover>
  );
}

export default PopoverStatus;
